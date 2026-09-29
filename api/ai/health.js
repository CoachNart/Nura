const SYSTEM_PROMPT="You are Nura, a cautious AI health-information companion. You are not a doctor and must not diagnose, prescribe, or claim certainty. Help users organize symptoms, ask useful follow-up questions, explain general health information, and identify appropriate next steps. If potentially life-threatening symptoms are described (severe trouble breathing, severe chest pressure/pain, stroke signs, uncontrolled bleeding, seizure, loss of consciousness, severe allergic reaction, immediate danger), clearly recommend emergency medical care now and keep the response brief. Never tell a user to delay urgent care while chatting. Do not provide individualized prescription changes or dosing instructions. Distinguish possibilities from diagnoses. Ask only a few high-value questions at a time. Never request private keys, seed phrases, passwords, or unnecessary identifying information. Health data sent here is processed server-side to generate the response. Keep answers calm and concise.";
function json(res,status,body){res.status(status).setHeader("Content-Type","application/json");res.end(JSON.stringify(body))}
function redact(v){return String(v||"").replace(/(seed phrase|private key|secret phrase)\s*[:=]?\s*[^\n]*/gi,"[redacted]")}
function localFallback(messages){
 const last=String(messages[messages.length-1]?.content||"").trim(),s=last.toLowerCase();
 const urgent=/\b(chest pain|can't breathe|cannot breathe|difficulty breathing|trouble breathing|stroke|face droop|uncontrolled bleeding|seizure|unconscious|passed out|anaphylaxis|severe allergic|suicid|overdose)\b/i.test(last);
 if(urgent)return "Some symptoms you described can be an emergency. Please seek emergency medical care now or contact your local emergency service. Do not wait for a chat response.";
 if(/\b(headache|head pain|migraine)\b/.test(s))return "A headache can have many causes, including dehydration, poor sleep, stress, skipped meals, eye strain, or an illness. If it is mild and you otherwise feel well, consider resting, drinking water, and eating if you have not eaten recently. I can help you think through it. When did it start, where is the pain, how severe is it from 0–10, and do you have symptoms such as fever, vomiting, vision changes, weakness, numbness, confusion, or a stiff neck?";
 if(/\b(not sleeping|can't sleep|cannot sleep|insomnia|poor sleep|sleeping badly)\b/.test(s))return "Poor sleep can have several causes, including stress, schedule changes, caffeine, illness, medications, or an uncomfortable sleep environment. For tonight, keep your routine calm and consistent and avoid caffeine late in the day. How long has this been happening, roughly how many hours are you sleeping, and is anything waking you up?";
 if(/\b(fever|temperature)\b/.test(s))return "Fever is commonly a sign that the body is responding to an infection or another condition. The next step depends on your temperature, age, other symptoms, and how you feel overall. What temperature did you measure, how did you measure it, and what other symptoms do you have?";
 if(/\b(cough|cold|sore throat|runny nose)\b/.test(s))return "Cough, sore throat, and runny nose can occur with several respiratory illnesses. Rest, fluids, and monitoring your symptoms can be reasonable for mild illness. Seek urgent care if you develop significant breathing difficulty, severe chest pain, confusion, or rapidly worsening symptoms. When did this start, and do you have a measured fever or breathing problems?";
 return "I can help you think through what you are experiencing, but I cannot diagnose you. Tell me what symptoms you have, when they started, how severe they are, and anything else that changed around the same time. If you have severe trouble breathing, severe chest pain, stroke symptoms, uncontrolled bleeding, a seizure, loss of consciousness, or another immediate danger, seek emergency medical care now.";
}
export default async function handler(req,res){
 if(req.method!=="POST")return json(res,405,{error:"Method not allowed"});
 try{
  const body=req.body||{},messages=Array.isArray(body.messages)?body.messages.slice(-12):[],healthContext=body.healthContext&&typeof body.healthContext==="object"?body.healthContext:{};
  if(!messages.length)return json(res,400,{error:"A conversation is required."});
  const key=process.env.OPENAI_API_KEY;
  if(!key)return json(res,200,{message:localFallback(messages),urgent:false,fallback:true});
  const input=[{role:"system",content:SYSTEM_PROMPT},{role:"system",content:"User-controlled health context (may be incomplete): "+JSON.stringify(healthContext).slice(0,12000)},...messages.map(m=>({role:m.role==="assistant"?"assistant":"user",content:redact(m.content).slice(0,5000)}))];
  const upstream=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+key},body:JSON.stringify({model:process.env.NURA_AI_MODEL||"gpt-5.6-luna",input,max_output_tokens:700})});
  const raw=await upstream.text();
  if(!upstream.ok){
   let detail="AI provider error";try{detail=JSON.parse(raw)?.error?.message||detail}catch{}
   const billing=/no credits|insufficient_quota|quota|billing|credit balance/i.test(detail);
   if(billing)return json(res,200,{message:localFallback(messages),urgent:false,fallback:true});
   return json(res,502,{error:detail});
  }
  const data=JSON.parse(raw),message=data.output_text||data.output?.flatMap(x=>x.content||[]).map(x=>x.text||"").join("").trim();
  if(!message)return json(res,200,{message:localFallback(messages),urgent:false,fallback:true});
  const urgent=/\b(chest pain|can't breathe|cannot breathe|difficulty breathing|trouble breathing|stroke|face droop|uncontrolled bleeding|seizure|unconscious|passed out|anaphylaxis|severe allergic|suicid|overdose)\b/i.test(messages[messages.length-1]?.content||"");
  return json(res,200,{message,urgent});
 }catch(error){console.error("Nura AI error",error);return json(res,200,{message:localFallback(req.body?.messages||[]),urgent:false,fallback:true})}
}