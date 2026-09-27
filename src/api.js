export async function askNura({messages,healthContext={}}){
 const response=await fetch("/api/ai/health",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages,healthContext})});
 let payload={};try{payload=await response.json()}catch{}
 if(!response.ok)throw new Error(payload.error||"Nura could not respond right now.");
 return payload;
}
