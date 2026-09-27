const SYSTEM_PROMPT="You are Nura, a cautious AI health-information companion. You are not a doctor and must not diagnose, prescribe, or claim certainty. Help users organize symptoms, ask useful follow-up questions, explain general health information, and identify appropriate next steps. If potentially life-threatening symptoms are described (severe trouble breathing, severe chest pressure/pain, stroke signs, uncontrolled bleeding, seizure, loss of consciousness, severe allergic reaction, immediate danger), clearly recommend emergency medical care now and keep the response brief. Never tell a user to delay urgent care while chatting. Do not provide individualized prescription changes or dosing instructions. Distinguish possibilities from diagnoses. Ask only a few high-value questions at a time. Never request private keys, seed phrases, passwords, or unnecessary identifying information. Health data sent here is processed server-side to generate the response. Keep answers calm and concise.";
function json(res,status,body){res.status(status).setHeader("Content-Type","application/json");res.end(JSON.stringify(body))}
function redact(v){return String(v||"").replace(/(seed phrase|private key|secret phrase)\s*[:=]?\s*[^\n]*/gi,"[redacted]")}
export default async function handler(req,res){
 if(req.method!=="POST")return json(res,405,{error:"Method not allowed"});
 if(!process.env.OPENAI_API_KEY)return json(res,503,{error:"Nura AI is not configured yet. Add OPENAI_API_KEY to the server environment."});
 try{
  const body=req.body||{},messages=Array.isArray(body.messages)?body.messages.slice(-12):[],healthContext=body.healthContext&&typeof body.healthContext==="object"?body.healthContext:{};
  if(!messages.length)return json(res,400,{error:"A conversation is required."});
  const input=[{role:"system",content:SYSTEM_PROMPT},{role:"system",content:"User-controlled health context (may be incomplete): "+JSON.stringify(healthContext).slice(0,12000)},...messages.map(m=>({role:m.role==="assistant"?"assistant":"user",content:redact(m.content).slice(0,5000)}))];
  const upstream=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{"Content-Type":"application/json","Authorization:"Bearer "+process.env.OPENAI_API_KEY},body:JSON.stringify({model:process.env.NURA_AI_MODEL||"gpt-5.6-luna",input,max_output_tokens:700})});
  const raw=await upstream.text();if(!upstream.ok){let detail="AI provider error";try{detail=JSON.parse(raw)?.error?.message||detail}catch{}return json(res,502,{error:detail})}
  const data=JSON.parse(raw),message=data.output_text||data.output?.flatMap(x=>x.content||[]).map(x=>x.text||"").join("").trim();
  if(!message)return json(res,502,{error:"Nura returned an empty response."});
  const urgent=/\b(chest pain|can't breathe|cannot breathe|difficulty breathing|trouble breathing|stroke|face droop|uncontrolled bleeding|seizure|unconscious|passed out|anaphylaxis|severe allergic|suicid|overdose)\b/i.test(messages[messages.length-1]?.content||"");
  return json(res,200,{message,urgent});
 }catch(error){console.error("Nura AI error",error);return json(res,500,{error:"Nura could not process that message right now."})}
}
