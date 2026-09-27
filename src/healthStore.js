const KEY="nura.health.v1";
const uid=()=>globalThis.crypto?.randomUUID?.()||Date.now().toString(36)+Math.random().toString(36).slice(2);
const defaults={profile:{name:"",dateOfBirth:"",sex:"",emergencyContact:""},metrics:[],medications:[],appointments:[],checkins:[],conversations:[],consents:{aiMemory:true,healthStorage:true,anonymousInsights:false}};
const clone=v=>JSON.parse(JSON.stringify(v));
export function getHealthData(){try{const raw=localStorage.getItem(KEY);if(!raw){const data=clone(defaults);saveHealthData(data);return data}const p=JSON.parse(raw);const cleanedMetrics=(Array.isArray(p.metrics)?p.metrics:[]).filter(m=>!["hr","sleep","hydration","steps"].includes(m.id));return {...clone(defaults),...p,metrics:cleanedMetrics,profile:{...defaults.profile,...(p.profile||{})},medications:Array.isArray(p.medications)?p.medications:[],appointments:Array.isArray(p.appointments)?p.appointments:[],checkins:Array.isArray(p.checkins)?p.checkins:[],conversations:Array.isArray(p.conversations)?p.conversations:[],consents:{...defaults.consents,...(p.consents||{})}}}catch{return clone(defaults)}}
export function saveHealthData(data){try{localStorage.setItem(KEY,JSON.stringify(data))}catch{}}
export function updateHealthData(patch){const next={...getHealthData(),...patch};saveHealthData(next);return next}
export function addMetric(metric){const c=getHealthData(),id=metric.id||uid();const next={...c,metrics:[...c.metrics.filter(x=>x.id!==id),{...metric,id,updatedAt:new Date().toISOString()}]};saveHealthData(next);return next}
export function deleteMetric(id){const c=getHealthData();const next={...c,metrics:c.metrics.filter(x=>x.id!==id)};saveHealthData(next);return next}
export function addMedication(med){const c=getHealthData();const next={...c,medications:[...c.medications,{...med,id:uid(),active:true}]};saveHealthData(next);return next}
export function updateMedication(id,patch){const c=getHealthData();const next={...c,medications:c.medications.map(m=>m.id===id?{...m,...patch}:m)};saveHealthData(next);return next}
export function toggleMedication(id){return updateMedication(id,{active:!getHealthData().medications.find(m=>m.id===id)?.active})}
export function deleteMedication(id){const c=getHealthData();const next={...c,medications:c.medications.filter(x=>x.id!==id)};saveHealthData(next);return next}
export function addAppointment(appt){const c=getHealthData();const next={...c,appointments:[...c.appointments,{...appt,id:uid(),createdAt:new Date().toISOString()}]};saveHealthData(next);return next}
export function updateAppointment(id,patch){const c=getHealthData();const next={...c,appointments:c.appointments.map(a=>a.id===id?{...a,...patch}:a)};saveHealthData(next);return next}
export function deleteAppointment(id){const c=getHealthData();const next={...c,appointments:c.appointments.filter(a=>a.id!==id)};saveHealthData(next);return next}
export function addCheckin(mood){const c=getHealthData();const next={...c,checkins:[...c.checkins,{id:uid(),mood,createdAt:new Date().toISOString()}].slice(-90)};saveHealthData(next);return next}
export function addConversation(messages){const c=getHealthData();const next={...c,conversations:[...c.conversations,{id:uid(),createdAt:new Date().toISOString(),messages}].slice(-50)};saveHealthData(next);return next}
export function clearHealthData(){try{localStorage.removeItem(KEY)}catch{}return clone(defaults)}
export function exportHealthData(){return getHealthData()}
