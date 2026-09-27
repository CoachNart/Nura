const KEY="nura.health.v1";
const uid=()=>globalThis.crypto?.randomUUID?.()||Date.now().toString(36)+Math.random().toString(36).slice(2);
const defaults={profile:{name:"",dateOfBirth:"",sex:"",emergencyContact:""},metrics:[{id:"hr",label:"Heart rate",value:"72",unit:"BPM",note:"Resting",updatedAt:""},{id:"sleep",label:"Sleep",value:"7h 45m",unit:"",note:"Last night",updatedAt:""},{id:"hydration",label:"Hydration",value:"1.4",unit:"L",note:"Today",updatedAt:""},{id:"steps",label:"Steps",value:"6842",unit:"steps",note:"Today",updatedAt:""}],medications:[{id:"vitamin-d",name:"Vitamin D",dose:"1 tablet",schedule:"8:00 PM",instructions:"With food",active:true},{id:"magnesium",name:"Magnesium",dose:"1 capsule",schedule:"9:00 PM",instructions:"Evening",active:true}],appointments:[],checkins:[],conversations:[],consents:{aiMemory:true,healthStorage:true,anonymousInsights:false}};
const clone=v=>JSON.parse(JSON.stringify(v));
export function getHealthData(){try{const raw=localStorage.getItem(KEY);if(!raw){const data=clone(defaults);saveHealthData(data);return data;}const p=JSON.parse(raw);return {...clone(defaults),...p,consents:{...defaults.consents,...(p.consents||{})}}}catch{return clone(defaults)}}
export function saveHealthData(data){try{localStorage.setItem(KEY,JSON.stringify(data))}catch{}}
export function updateHealthData(patch){const next={...getHealthData(),...patch};saveHealthData(next);return next}
export function addMetric(metric){const c=getHealthData();const next={...c,metrics:[...c.metrics.filter(x=>x.id!==metric.id),{...metric,id:metric.id||uid(),updatedAt:new Date().toISOString()}]};saveHealthData(next);return next}
export function addMedication(med){const c=getHealthData();const next={...c,medications:[...c.medications,{...med,id:uid(),active:true}]};saveHealthData(next);return next}
export function toggleMedication(id){const c=getHealthData();const next={...c,medications:c.medications.map(m=>m.id===id?{...m,active:!m.active}:m)};saveHealthData(next);return next}
export function addAppointment(appt){const c=getHealthData();const next={...c,appointments:[...c.appointments,{...appt,id:uid()}]};saveHealthData(next);return next}
export function addCheckin(mood){const c=getHealthData();const next={...c,checkins:[...c.checkins,{id:uid(),mood,createdAt:new Date().toISOString()}].slice(-90)};saveHealthData(next);return next}
export function addConversation(messages){const c=getHealthData();const next={...c,conversations:[...c.conversations,{id:uid(),createdAt:new Date().toISOString(),messages}].slice(-50)};saveHealthData(next);return next}
export function clearHealthData(){try{localStorage.removeItem(KEY)}catch{}return clone(defaults)}
export function exportHealthData(){return getHealthData()}
