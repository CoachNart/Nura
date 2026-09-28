import React,{useState}from"react";
import { connectWallet, disconnectWallet, getSavedWallet, restoreWallet, shortenAddress } from "./wallet.js";
import { askNura } from "./api.js";
import { getHealthData, addConversation, addMetric, deleteMetric, addAppointment, updateAppointment, deleteAppointment, addMedication, toggleMedication, deleteMedication, addCheckin, updateHealthData, clearHealthData, exportHealthData } from "./healthStore.js";
import{createRoot}from"react-dom/client";
import{Activity,ArrowRight,Bell,Brain,CalendarDays,ChevronRight,CircleHelp,Droplets,HeartPulse,Home,LockKeyhole,MessageCircle,Moon,MoreHorizontal,Pill as PillIcon,ShieldCheck,Copy,Check,SunMedium,UserRound,Wallet,Plus,Download,Trash2,AlertTriangle,Settings2,Stethoscope,Sparkles,FileHeart,Shield,Clock3}from"lucide-react";
import"./styles.css";

const chain={id:4663};
const CONTRACT_ADDRESS="";

function App(){
 const[route,setRoute]=useState(window.location.pathname==="/app"?"app":"home");
 const[wallet,setWallet]=useState(()=>getSavedWallet());
 const go=next=>{const target=next==="app"?"/app":"/";window.history.pushState({}, "",target);setRoute(next);window.scrollTo({top:0,behavior:"smooth"})};
 React.useEffect(()=>{const f=()=>setRoute(window.location.pathname==="/app"?"app":"home");window.addEventListener("popstate",f);restoreWallet().then(setWallet).catch(()=>setWallet(null));if("serviceWorker"in navigator)navigator.serviceWorker.register("/sw.js").catch(()=>{});return()=>window.removeEventListener("popstate",f)},[]);
 return route==="app"?<NuraApp wallet={wallet} setWallet={setWallet} goHome={()=>go("home")}/>:<Landing goApp={()=>go("app")}/>;
}

function Brand({compact=false,onClick}){return <button className={"brand "+(compact?"brand-compact":"")} onClick={onClick}><span className="brand-mark"><i/><i/></span><span>NURA</span></button>}
function Pill({children,tone="blue"}){return <span className={"pill pill-"+tone}>{children}</span>}

function Landing({goApp}){
 const[open,setOpen]=useState(false);
 React.useEffect(()=>{
  const nodes=[...document.querySelectorAll("[data-motion-reveal]")];
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(reduced){nodes.forEach(n=>n.classList.add("motion-visible"));return}
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(entry.isIntersecting){entry.target.classList.add("motion-visible");observer.unobserve(entry.target)}
  }),{threshold:.12,rootMargin:"0px 0px -8% 0px"});
  nodes.forEach(n=>observer.observe(n));
  return()=>observer.disconnect();
 },[]);
 React.useEffect(()=>{
  const root=document.querySelector(".reference-landing");
  if(!root||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  let raf=0;
  const move=()=>{
   const y=window.scrollY||0;
   root.style.setProperty("--nura-scroll",Math.min(y*.18,120)+"px");
   raf=0;
  };
  const onScroll=()=>{if(!raf)raf=requestAnimationFrame(move)};
  window.addEventListener("scroll",onScroll,{passive:true});
  return()=>{window.removeEventListener("scroll",onScroll);if(raf)cancelAnimationFrame(raf)};
 },[]);
 const scrollTo=id=>document.getElementById(id)?.scrollIntoView({behavior:"smooth",block:"start"});
 React.useEffect(()=>{
  const counters=[...document.querySelectorAll("[data-counter]")];
  const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const animate=el=>{
   const target=Number(el.dataset.counter||0);
   if(reduce){el.textContent=target+(target===50?"K+":target===98?"%":"+");return}
   const start=performance.now(),duration=720;
   const tick=now=>{
    const p=Math.min((now-start)/duration,1),e=1-Math.pow(1-p,4),v=Math.round(target*e);
    el.textContent=target===50?v+"K+":target===98?v+"%":v+"+";
    if(p<1)requestAnimationFrame(tick);
   };
   requestAnimationFrame(tick);
  };
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(entry.isIntersecting){animate(entry.target);observer.unobserve(entry.target)}
  }),{threshold:.5});
  counters.forEach(c=>observer.observe(c));
  return()=>observer.disconnect();
 },[]);
 return <div className="landing-shell reference-landing">
  <div className="reference-page">
   <header className="landing-nav reference-nav">
    <Brand/>
    <nav>{[["Product","product"],["AI Doctor","doctor"],["Care","care"],["Privacy","privacy"]].map(([x,id])=><a key={x} href={"#"+id}>{x}</a>)}</nav>
    <button className="nav-cta" onClick={goApp}>Start a Free Trial</button>
    <button className="mobile-menu" onClick={()=>setOpen(v=>!v)}><MoreHorizontal/></button>
   </header>
   {open&&<div className="mobile-menu-panel">{[["Product","product"],["AI Doctor","doctor"],["Care","care"],["Privacy","privacy"]].map(([x,id])=><a key={x} href={"#"+id} onClick={()=>setOpen(false)}>{x}</a>)}<button onClick={goApp}>Open Nura</button></div>}
   <main>
    <section className="reference-hero motion-hero" id="product">
     <div className="reference-hero-glow hero-parallax-layer"/>
     <div className="reference-hero-content" data-motion-reveal="hero">
      <div className="reference-kicker motion-stagger"><span>←</span><b>Nura · Patient intelligence</b><span>→</span></div>
      <h1 data-motion-reveal="hero-title">Comprehensive Health<br/><span>Intelligence.</span></h1>
      <p data-motion-reveal="hero-sub">Private health context, AI guidance and care preparation in one calm place.</p>
     </div>
    </section>

    <section className="nura-ref-content" id="doctor">
     <div className="nura-ref-stats" data-motion-reveal="stats">
      <article className="motion-metric"><strong data-counter="50">0K+</strong><span>Patients Served</span></article>
      <article className="motion-metric"><strong data-counter="500">0+</strong><span>Healthcare Providers</span></article>
      <article className="motion-metric"><strong data-counter="98">0%</strong><span>Patient Satisfaction</span></article>
      <article className="motion-metric"><strong className="static-metric">24/7</strong><span>Care Availability</span></article>
     </div>
     <section className="nura-ref-care">
      <div className="nura-ref-heading"><span className="nura-ref-badge">✦ OUR PATIENTS</span><h2>Healthcare Designed<br/>Around Patients</h2></div>
      <div className="nura-ref-cards motion-stagger-grid">
       <article className="nura-ref-card nura-record-card" data-motion-reveal="card"><header><h3>Health Records</h3><p>Access your complete medical history anytime</p></header><div className="records-visual"><span className="records-tag">♡ Patient health trends</span><div className="records-bars"><i/><i/><i/><i/><i/><i/></div></div></article>
       <article className="nura-ref-card nura-rx-card" data-motion-reveal="card"><header><h3>Digital Prescriptions</h3><p>Receive prescriptions securely and instantly.</p></header><div className="rx-visual"><div className="rx-arc"/><i>⌂</i><i>×</i><i>♧</i><i>▣</i><b>✦</b></div></article>
       <article className="nura-ref-card nura-message-card" data-motion-reveal="card"><header><h3>Secure Messaging</h3><p>Stay connected with your healthcare team</p></header><div className="message-visual"><span>Patient updates</span><span>Condition Mapping</span><span>Resource Allocation</span></div></article>
       <article className="nura-ref-card nura-visits-card" data-motion-reveal="card"><header><h3>Virtual Doctor Visits</h3><p>Analyze treatment outcomes and forecast disease progression to improve care efficiency</p></header><div className="visits-chart"><div className="chart-grid"/><div className="chart-labels"><span>100</span><span>60</span><span>30</span><span>0</span></div><div className="chart-row r1"/><div className="chart-row r2"/><div className="chart-row r3"/><div className="chart-row r4"/></div></article>
       <article className="nura-ref-card nura-symptom-card" data-motion-reveal="card"><header><h3>AI Symptom Checker</h3><p>Get instant health guidance before scheduling.</p></header><div className="symptom-visual"><div><span>This week's High-Risk Loads<small>View Critical Alerts for 15 Patients</small></span><button>See Data</button></div><div><span>This week's High-Risk Loads<small>View Critical Alerts for 15 Patients</small></span><button>See Data</button></div></div></article>
      </div>
     </section>
     <section className="nura-ref-guide" id="care" data-motion-reveal="section">
      <div className="nura-ref-heading guide-title"><span className="nura-ref-badge">✦ PATIENT GUIDE</span><h2>Transforming care with<br/>patient-centric ai</h2></div>
      <div className="guide-arc"><i/></div>
      <div className="guide-steps motion-stagger-grid">
       <article data-motion-reveal="step"><em>01</em><div><h3>Identify Patient Risk</h3><p>Instantly screen for critical conditions using AI-driven predictive modeling and patient data analysis.</p></div><b>♡</b></article>
       <article data-motion-reveal="step"><em>02</em><div><h3>Optimize Care Plans</h3><p>Integrate individualized therapy regimens, lab results and real-time monitoring insights effortlessly.</p></div><b>◈</b></article>
       <article data-motion-reveal="step"><em>03</em><div><h3>Accelerate Health Outcomes</h3><p>AI enhances early diagnosis and predicts treatment efficacy for better recovery rates and disease management.</p></div><b>♧</b></article>
      </div>
     </section>
     <section className="nura-ref-assistant" id="privacy" data-motion-reveal="section">
      <div className="nura-ref-heading assistant-title"><span className="nura-ref-badge">✦ FOR PATIENTS</span><h2>Your Personal Health Assistant,<br/>Available 24/7</h2></div>
      <div className="assistant-ref-layout motion-stagger-grid">
       <article className="assistant-main-card" data-motion-reveal="card"><div className="assistant-bar"><span className="assistant-avatar">✦</span><div><b>AI Health Assistant</b><small>● Online · Answering</small></div><strong>•••</strong></div><div className="assistant-bubble">I have been having headaches, fatigue and trouble sleeping for the past week.</div><div className="assistant-composer">Tell Nura what you're experiencing… <ArrowRight size={10}/></div></article>
       <article className="assistant-side-card" data-motion-reveal="card"><span className="side-icon">◉</span><h3>Symptom Analysis</h3><div className="tag-row"><b>Headache</b><b>Fatigue</b><b>Sleep Issues</b></div></article>
       <article className="assistant-side-card risk-card" data-motion-reveal="card"><span className="side-icon">◌</span><h3>Health Risk Score</h3><strong>Low risk</strong><div className="risk-meter"><i/></div></article>
      </div>
     </section>
    </section>
   </main>

   <footer className="landing-footer reference-footer" data-motion-reveal="footer"><Brand/><span>Patient-first health intelligence.</span><span>© 2026 Nura</span></footer>
  </div>
 </div>;
}
function NuraApp({wallet,setWallet,goHome}){
 const[active,setActive]=useState("Home"),[notice,setNotice]=useState(""),[walletBusy,setWalletBusy]=useState(false),[profile,setProfile]=useState(()=>getHealthData().profile);
 const connected=!!wallet?.address;
 React.useEffect(()=>{const sync=()=>setProfile(getHealthData().profile);window.addEventListener("storage",sync);const id=setInterval(sync,1000);return()=>{window.removeEventListener("storage",sync);clearInterval(id)}},[]);
 const nav=["Home","AI Doctor","Health","Appointments","Profile"];
 const connect=async()=>{setWalletBusy(true);try{const next=await connectWallet();setWallet(next);setNotice("Wallet connected · "+shortenAddress(next.address)+" · Robinhood Chain")}catch(error){setNotice(error?.message||"Wallet connection cancelled.");}finally{setWalletBusy(false);setTimeout(()=>setNotice(""),4200)}};
 const disconnect=async()=>{await disconnectWallet();setWallet(null);setNotice("Wallet disconnected.");setTimeout(()=>setNotice(""),2600)};
 return <div className="app-shell">{notice&&<div className="toast"><ShieldCheck size={16}/>{notice}</div>}<aside className="sidebar"><Brand onClick={goHome}/><div className="side-nav">{nav.map(item=><button key={item} className={active===item?"selected":""} onClick={()=>setActive(item)}>{iconFor(item)}<span>{item}</span></button>)}</div><div className="sidebar-bottom"><div className="privacy-box"><LockKeyhole size={16}/><div><b>Private mode</b><small>Your health data stays under your control.</small></div></div><button className="help-button"><CircleHelp size={17}/> Help & safety</button></div></aside><main className="dashboard"><header className="app-topbar"><div className="mobile-brand"><Brand compact onClick={goHome}/></div><div className="crumb"><span>{new Date().getHours()<12?"Good morning":new Date().getHours()<18?"Good afternoon":"Good evening"}</span><b>{profile?.name?.trim()?"Welcome back, "+profile.name.trim():"Welcome to Nura"}</b></div><div className="top-actions"><button className="icon-button"><Bell size={18}/><i/></button><button className={"wallet-button "+(connected?"connected":"")} onClick={connected?disconnect:connect} disabled={walletBusy}><Wallet size={16}/><span>{walletBusy?"Connecting…":connected?shortenAddress(wallet.address):"Connect wallet"}</span></button><div className="avatar">{(profile?.name?.trim()||"N").split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0].toUpperCase()).join("")}</div></div></header><div className="dashboard-inner">{active==="Home"&&<DashboardHome onDoctor={()=>setActive("AI Doctor")}/>} {active==="AI Doctor"&&<DoctorPage/>}{active==="Health"&&<HealthPage/>}{active==="Appointments"&&<AppointmentsPage/>}{active==="Profile"&&<ProfilePage wallet={wallet} onConnect={connect} onDisconnect={disconnect} walletBusy={walletBusy}/>}</div></main><nav className="mobile-nav">{nav.map(item=><button key={item} className={active===item?"selected":""} onClick={()=>setActive(item)}>{iconFor(item)}<span>{item}</span></button>)}</nav></div>
}
function iconFor(item){const p={size:18,strokeWidth:1.8};if(item==="Home")return <Home {...p}/>;if(item==="AI Doctor")return <ShieldCheck {...p}/>;if(item==="Health")return <HeartPulse {...p}/>;if(item==="Appointments")return <CalendarDays {...p}/>;return <UserRound {...p}/>}

function DashboardHome({onDoctor}){
 const[data,setData]=useState(getHealthData());
 React.useEffect(()=>{const sync=()=>setData(getHealthData());window.addEventListener("storage",sync);const id=setInterval(sync,1200);return()=>{window.removeEventListener("storage",sync);clearInterval(id)}},[]);
 const metrics=data.metrics||[]; const latest=key=>metrics.filter(m=>(m.label||"").toLowerCase().includes(key)).sort((a,b)=>(b.updatedAt||"").localeCompare(a.updatedAt||""))[0];
 const hr=latest("heart"), upcoming=[...(data.appointments||[])].filter(a=>a.status!=="Completed").sort((a,b)=>(a.date+" "+a.time).localeCompare(b.date+" "+b.time))[0], med=(data.medications||[]).find(m=>m.active);
 return <div className="dashboard-page home-page"><section className="app-hero"><div className="app-hero-glow"/><div className="app-hero-copy"><span className="eyebrow"><Sparkles size={12}/> NURA HEALTH OS</span><h1>Your health,<br/><span>with context.</span></h1><p>Keep the details that matter close. Ask questions, record what changed, prepare for care and keep your health information under your control.</p><button className="button button-primary" onClick={onDoctor}>Talk to Nura <ArrowRight size={16}/></button></div><div className="app-orb"><div className="orb-ring"/><div className="orb-core"><HeartPulse size={34}/></div><div className="orb-caption"><small>PRIVATE MODE</small><b>Context ready</b></div></div></section><section className="app-stats"><div><span>HEALTH SIGNALS</span><b>{metrics.length}</b><small>recorded by you</small></div><div><span>NEXT APPOINTMENT</span><b>{upcoming?new Date(upcoming.date+"T12:00").toLocaleDateString(undefined,{day:"2-digit",month:"short"}):"—"}</b><small>{upcoming?upcoming.time:"nothing scheduled"}</small></div><div><span>MEDICATIONS</span><b>{data.medications?.length||0}</b><small>{med?"active list":"none recorded"}</small></div><div><span>PRIVACY</span><b>LOCAL</b><small>health record storage</small></div></section><section className="module-heading"><span className="eyebrow">YOUR DAY</span><h2>What needs your attention.</h2></section><section className="attention-grid"><article className="attention-feature"><div className="surface-label">AI DOCTOR</div><h3>Start with the question.</h3><p>Describe a symptom, medication concern or health question in your own words. Nura helps organize the conversation and surface sensible next steps.</p><button className="text-link" onClick={onDoctor}>Open conversation <ArrowRight size={15}/></button><div className="attention-line"><span>PRIVATE CONVERSATION</span><i/></div></article><article className="attention-module"><div className="surface-label">NEXT CARE</div>{upcoming?<><div className="big-date">{new Date(upcoming.date+"T12:00").toLocaleDateString(undefined,{day:"2-digit"})}<small>{new Date(upcoming.date+"T12:00").toLocaleDateString(undefined,{month:"short"})}</small></div><h3>{upcoming.doctor}</h3><p>{upcoming.specialty||"Care appointment"} · {upcoming.time}</p></>:<Empty icon={<CalendarDays/>} title="No appointment" text="Add your next care visit when you have one."/>}</article><article className="attention-module"><div className="surface-label">HEALTH SIGNAL</div>{hr?<><div className="signal-number">{hr.value}<small>{hr.unit||"reading"}</small></div><h3>Heart rate</h3><p>{hr.note||"Recorded in your health record."}</p></>:<><div className="signal-mark"><HeartPulse/></div><h3>Nothing pre-filled.</h3><p>Add a reading only when you choose to.</p></>}</article></section><section className="care-ribbon"><div><span className="eyebrow">CARE CONTEXT</span><h2>The useful details, without the noise.</h2></div><div className="care-ribbon-items"><span><FileHeart/> Health records</span><span><PillIcon/> Medications</span><span><CalendarDays/> Appointments</span><span><Shield/> Privacy controls</span></div></section></div>;
}

function HealthPage(){
 const[data,setData]=useState(getHealthData());
 const[form,setForm]=useState({label:"",value:"",unit:"",note:""});
 const refresh=()=>setData(getHealthData());
 const save=e=>{e.preventDefault();if(!form.label.trim()||!String(form.value).trim())return;addMetric(form);setForm({label:"",value:"",unit:"",note:""});refresh()};
 const checkin=mood=>{addCheckin(mood);refresh()};
 const remove=id=>{if(confirm("Delete this health record?")){deleteMetric(id);refresh()}};
 const records=[...data.metrics].sort((a,b)=>(b.updatedAt||"").localeCompare(a.updatedAt||""));
 return <div className="dashboard-page">
  <div className="page-kicker"><Pill tone="lavender"><Activity size={11}/> Health overview</Pill><span>{data.metrics.length} saved</span></div>
  <h1 className="page-title">Your health, at a glance.</h1>
  <p className="page-sub">Track only the signals you choose to record. Nothing is pre-filled.</p>
  <form className="wide-card metric-form" onSubmit={save}><div className="form-heading"><div><small>ADD A READING</small><h3>Record something from today</h3></div></div><input required placeholder="What did you measure? e.g. Heart rate" value={form.label} onChange={e=>setForm({...form,label:e.target.value})}/><input required placeholder="Value" value={form.value} onChange={e=>setForm({...form,value:e.target.value})}/><input placeholder="Unit e.g. BPM, kg, hours" value={form.unit} onChange={e=>setForm({...form,unit:e.target.value})}/><input placeholder="Optional note" value={form.note} onChange={e=>setForm({...form,note:e.target.value})}/><button className="button button-primary button-small"><Plus size={14}/> Save reading</button></form>
  <section className="health-records"><div className="section-title-row"><div><small>YOUR RECORDS</small><h2>Recent readings</h2></div></div>{records.length?<div className="record-list">{records.map(m=><div className="record-row" key={m.id}><div className="record-icon"><Activity size={15}/></div><div className="record-info"><b>{m.label}</b><small>{m.note||new Date(m.updatedAt||Date.now()).toLocaleString()}</small></div><strong>{m.value} <em>{m.unit||""}</em></strong><button className="icon-button compact" onClick={()=>{setForm({label:m.label,value:String(m.value),unit:m.unit||"",note:m.note||""});deleteMetric(m.id);refresh()}}><Settings2 size={14}/></button><button className="icon-button compact danger-icon" onClick={()=>remove(m.id)}><Trash2 size={14}/></button></div>)}</div>:<Empty icon={<Activity/>} title="No health readings yet" text="Add a measurement above when you have something real to record."/>}</section>
  <section className="wide-card checkin-card"><div className="card-head"><div><small>DAILY CHECK-IN</small><h3>How are you feeling?</h3></div><SunMedium size={18}/></div><div className="mood-row">{[["😔","Low"],["😐","Okay"],["🙂","Good"],["😊","Great"]].map(([emoji,label])=><button key={label} onClick={()=>checkin(label)}>{emoji}<span>{label}</span></button>)}</div>{data.checkins.length>0&&<p className="data-note">Latest check-in: {data.checkins[data.checkins.length-1].mood}</p>}</section>
 </div>;
}
function AppointmentsPage(){
 const[data,setData]=useState(getHealthData),[form,setForm]=useState({doctor:"",specialty:"",date:"",time:"",location:""}),[editing,setEditing]=useState(null),[show,setShow]=useState(false);
 const reset=()=>{setForm({doctor:"",specialty:"",date:"",time:"",location:""});setEditing(null);setShow(false)};
 const save=e=>{e.preventDefault();if(!form.doctor.trim()||!form.date||!form.time)return;if(editing)updateAppointment(editing,form);else addAppointment({...form,status:"Planned"});reset();setData(getHealthData())};
 const edit=a=>{setEditing(a.id);setForm({doctor:a.doctor,specialty:a.specialty||"",date:a.date,time:a.time,location:a.location||""});setShow(true)};
 const remove=id=>{if(confirm("Delete this appointment?")){deleteAppointment(id);setData(getHealthData())}};
 const markDone=id=>{updateAppointment(id,{status:"Completed"});setData(getHealthData())};
 return <div className="dashboard-page"><div className="page-kicker"><Pill tone="mint"><CalendarDays size={11}/> Care planner</Pill><span>{data.appointments.length} saved</span></div><div className="page-title-row"><div><h1 className="page-title">Appointments.</h1><p className="page-sub">Create, edit and manage your own care schedule.</p></div><button className="button button-primary button-small" onClick={()=>{setShow(true);setEditing(null);setForm({doctor:"",specialty:"",date:"",time:"",location:""})}}><Plus size={14}/> New appointment</button></div>{show&&<form className="wide-card appointment-form" onSubmit={save}><div className="form-heading"><div><small>{editing?"EDIT APPOINTMENT":"NEW APPOINTMENT"}</small><h3>{editing?"Update appointment":"Add a care appointment"}</h3></div><button type="button" className="link-button" onClick={reset}>Cancel</button></div><input required placeholder="Doctor, clinic or provider" value={form.doctor} onChange={e=>setForm({...form,doctor:e.target.value})}/><input placeholder="Specialty" value={form.specialty} onChange={e=>setForm({...form,specialty:e.target.value})}/><input required type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/><input required type="time" value={form.time} onChange={e=>setForm({...form,time:e.target.value})}/><input placeholder="Location, address or video link" value={form.location} onChange={e=>setForm({...form,location:e.target.value})}/><button className="button button-primary">{editing?<Check size={15}/>:<Plus size={15}/>} {editing?"Save changes":"Create appointment"}</button></form>}<section className="appointment-section"><div className="section-title-row"><div><small>YOUR SCHEDULE</small><h2>Upcoming & past</h2></div></div>{data.appointments.length?<div className="appointment-list">{[...data.appointments].sort((a,b)=>(a.date+" "+a.time).localeCompare(b.date+" "+b.time)).map(a=><article className="appointment-card" key={a.id}><div className="date-tile"><b>{new Date(a.date+"T12:00").toLocaleDateString(undefined,{day:"2-digit"})}</b><span>{new Date(a.date+"T12:00").toLocaleDateString(undefined,{month:"short"})}</span></div><div className="appointment-details"><div className="appointment-top"><Pill tone={a.status==="Completed"?"mint":"blue"}>{a.status||"Planned"}</Pill><span>{a.time}</span></div><h3>{a.doctor}</h3><p>{a.specialty||"General care"}{a.location?" · "+a.location:""}</p><div className="appointment-actions"><button onClick={()=>edit(a)}><Settings2 size={13}/> Edit</button>{a.status!=="Completed"&&<button onClick={()=>markDone(a.id)}><Check size={13}/> Mark completed</button>}<button className="danger-text" onClick={()=>remove(a.id)}><Trash2 size={13}/> Delete</button></div></div></article>)}</div>:<Empty icon={<CalendarDays/>} title="Your schedule is empty" text="Add your next doctor, clinic or telehealth appointment. Nothing is pre-filled."/>}</section><MedicationPanel data={data} setData={setData}/></div>
}
function MedicationPanel({data,setData}){const[form,setForm]=useState({name:"",dose:"",schedule:"",instructions:""}),[show,setShow]=useState(false);const save=e=>{e.preventDefault();if(!form.name.trim())return;addMedication(form);setForm({name:"",dose:"",schedule:"",instructions:""});setShow(false);setData(getHealthData())};const remove=id=>{if(confirm("Delete this medication record?")){deleteMedication(id);setData(getHealthData())}};return <section className="wide-card medication-panel"><div className="card-head"><div><small>MEDICATIONS</small><h3>Your medication list</h3></div><button className="link-button" onClick={()=>setShow(!show)}><Plus size={14}/> Add medication</button></div>{show&&<form className="metric-form" onSubmit={save}><input required placeholder="Medication name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/><input placeholder="Dose" value={form.dose} onChange={e=>setForm({...form,dose:e.target.value})}/><input placeholder="Schedule" value={form.schedule} onChange={e=>setForm({...form,schedule:e.target.value})}/><input placeholder="Instructions" value={form.instructions} onChange={e=>setForm({...form,instructions:e.target.value})}/><button className="button button-primary button-small">Save medication</button></form>}{data.medications.length?data.medications.map(m=><div className="med-row" key={m.id}><div className="med-icon"><PillIcon/></div><div><b>{m.name}</b><small>{[m.dose,m.instructions].filter(Boolean).join(" · ")||"No details added"}</small></div><span>{m.schedule||"No schedule"}</span><button className={"med-status "+(m.active?"on":"")} onClick={()=>setData(toggleMedication(m.id))}>{m.active?"Active":"Paused"}</button><button className="icon-button compact danger-icon" onClick={()=>remove(m.id)}><Trash2 size={14}/></button></div>):<p className="data-note">No medications recorded. Add only medicines you actually take.</p>}</section>}
function ProfilePage({wallet,onConnect,onDisconnect,walletBusy}){
 const[data,setData]=useState(getHealthData),[editing,setEditing]=useState(false),[form,setForm]=useState(getHealthData().profile);
 const save=e=>{e.preventDefault();setData(updateHealthData({profile:form}));setEditing(false)};
 const name=form.name?.trim()||data.profile.name?.trim()||"Your profile";
 const initials=name.split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0].toUpperCase()).join("")||"N";
 const connected=!!wallet?.address;
 const toggle=key=>setData(updateHealthData({consents:{...data.consents,[key]:!data.consents[key]}}));
 const exportData=()=>{const blob=new Blob([JSON.stringify(exportHealthData(),null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="nura-health-export.json";a.click();URL.revokeObjectURL(url)};
 const erase=()=>{if(confirm("Delete all health records stored on this device? This cannot be undone.")){setData(clearHealthData());setForm({name:"",dateOfBirth:"",sex:"",emergencyContact:""});setEditing(false)}};
 return <div className="dashboard-page"><div className="profile-hero"><div className="profile-avatar">{initials}</div><div><div className="page-kicker"><Pill tone="lavender"><UserRound size={11}/> Profile</Pill></div><h1 className="page-title">{name}</h1><p className="page-sub">Your personal details, wallet identity and privacy controls.</p></div><button className="button button-soft button-small" onClick={()=>setEditing(!editing)}><Settings2 size={14}/> {editing?"Cancel":"Edit profile"}</button></div><div className="wide-card profile-details"><div className="card-head"><div><small>YOUR DETAILS</small><h3>Personal information</h3></div><UserRound size={19}/></div><div className="profile-detail-grid"><div><small>Full name</small><b>{data.profile.name||"Not added"}</b></div><div><small>Date of birth</small><b>{data.profile.dateOfBirth?new Date(data.profile.dateOfBirth+"T12:00").toLocaleDateString():"Not added"}</b></div><div><small>Sex / gender</small><b>{data.profile.sex||"Not added"}</b></div><div><small>Emergency contact</small><b>{data.profile.emergencyContact||"Not added"}</b></div></div></div>{editing&&<form className="wide-card profile-form" onSubmit={save}><div className="card-head"><div><small>PERSONAL DETAILS</small><h3>Edit your profile</h3></div><Check size={18}/></div><input placeholder="Full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/><input type="date" value={form.dateOfBirth} onChange={e=>setForm({...form,dateOfBirth:e.target.value})}/><select value={form.sex} onChange={e=>setForm({...form,sex:e.target.value})}><option value="">Sex / gender (optional)</option><option>Female</option><option>Male</option><option>Non-binary</option><option>Prefer not to say</option></select><input placeholder="Emergency contact (name + phone, optional)" value={form.emergencyContact} onChange={e=>setForm({...form,emergencyContact:e.target.value})}/><button className="button button-primary">Save profile</button></form>}<div className="profile-grid"><div className="wide-card"><div className="card-head"><div><small>WALLET IDENTITY</small><h3>Robinhood Chain</h3></div><Wallet size={19}/></div><div className="wallet-profile">{connected?<><div><b>{shortenAddress(wallet.address)}</b><small>{wallet.connector||"Wallet"} · Chain 4663</small></div><div className="wallet-profile-actions"><Pill tone="mint">Connected</Pill><button className="button button-soft button-small" onClick={onDisconnect}>Disconnect</button></div></>:<><div><b>No wallet connected</b><small>Connect when you want wallet-native Nura features.</small></div><button className="button button-primary button-small" onClick={onConnect} disabled={walletBusy}>{walletBusy?"Connecting…":"Connect wallet"}</button></>}</div><div className="signature-note"><ShieldCheck size={15}/> Nura never asks for a seed phrase or private key.</div></div><div className="wide-card"><div className="card-head"><div><small>PRIVACY</small><h3>Your permissions</h3></div><LockKeyhole size={19}/></div><Toggle label="Local health storage" text="Keep your health records available on this device." on={data.consents.healthStorage} onClick={()=>toggle("healthStorage")}/><Toggle label="Nura health memory" text="Allow saved health context to be included in future AI conversations." on={data.consents.aiMemory} onClick={()=>toggle("aiMemory")}/><Toggle label="Anonymous insights" text="Off by default. Enable only if you want to share anonymized product insights." on={data.consents.anonymousInsights} onClick={()=>toggle("anonymousInsights")}/></div><div className="wide-card"><div className="card-head"><div><small>DATA CONTROLS</small><h3>Export or delete</h3></div><Download size={19}/></div><div className="data-actions"><button className="button button-soft" onClick={exportData}><Download size={14}/> Export my data</button><button className="button button-danger" onClick={erase}><Trash2 size={14}/> Delete local health data</button></div><p className="data-note">Nura currently keeps these records in your browser. This gives you direct control while the encrypted account backend is being built.</p></div></div></div>
}
function Empty({icon,title,text}){return <div className="empty-card">{icon}<h3>{title}</h3><p>{text}</p></div>}
function Toggle({label,text,on,onClick}){return <button className="toggle-row toggle-control" onClick={onClick}><div><b>{label}</b><small>{text}</small></div><div className={"fake-toggle "+(on?"on":"")}><span/></div></button>}
function DoctorPage(){
 const[messages,setMessages]=useState([{role:"assistant",from:"nura",content:"Hi, I’m Nura. Tell me what’s going on today — symptoms, sleep, medication, or anything you’re unsure about."}]),[input,setInput]=useState(""),[busy,setBusy]=useState(false),[urgent,setUrgent]=useState(false);
 const send=async preset=>{const text=(preset??input).trim();if(!text||busy)return;const next=[...messages,{role:"user",from:"user",content:text}];setMessages(next);setInput("");setBusy(true);try{const result=await askNura({messages:next.map(m=>({role:m.role,content:m.content})),healthContext:getHealthData()});const reply={role:"assistant",from:"nura",content:result.message};setMessages([...next,reply]);setUrgent(!!result.urgent);addConversation([...next,reply])}catch(error){setMessages([...next,{role:"assistant",from:"nura",content:error?.message||"Nura could not reach the AI service. Your message remains on this device."}])}finally{setBusy(false)}};
 return <div className="doctor-page"><section className="doctor-hero"><div><span className="eyebrow"><ShieldCheck size={12}/> AI DOCTOR</span><h1>Bring the question.<br/><span>We’ll bring the context.</span></h1><p>Describe what’s happening in your own words. Nura can structure the information and help you think through sensible next steps.</p></div><div className="doctor-orb"><div className="orb-ring"/><div className="orb-core"><Brain size={30}/></div><small>PRIVATE CONVERSATION</small></div></section>{urgent&&<div className="urgent-banner"><AlertTriangle size={18}/><div><b>Urgent symptoms detected</b><span>Please seek urgent medical care now. Do not wait for this chat to decide what to do.</span></div></div>}<div className="doctor-layout"><div className="chat-window">{messages.map((m,i)=><div className={"chat-row "+m.from} key={i}><div className="chat-avatar">{m.from==="nura"?<ShieldCheck size={15}/>:"N"}</div><div className="chat-bubble">{m.content}</div></div>)}{busy&&<div className="typing">Nura is thinking…</div>}<div className="chat-composer"><textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send()}}} placeholder="Tell Nura what’s going on…"/><button onClick={()=>send()} disabled={busy}><ArrowRight size={17}/></button></div></div><aside className="doctor-side"><div className="side-panel"><span className="surface-label">START HERE</span><h3>What can we talk through?</h3><div className="prompt-list"><button onClick={()=>send("I have a headache")}>A symptom I’m noticing <ArrowRight/></button><button onClick={()=>send("I’m not sleeping well")}>My sleep has changed <ArrowRight/></button><button onClick={()=>send("I have a question about a medication")}>A medication question <ArrowRight/></button><button onClick={()=>send("I want to prepare for a doctor visit")}>Prepare for a care visit <ArrowRight/></button></div></div><div className="side-panel safety-panel"><AlertTriangle size={15}/><div><b>Safety first</b><p>For severe or rapidly worsening symptoms, seek urgent medical care rather than relying on an AI assistant.</p></div></div></aside></div></div>;
}


createRoot(document.getElementById("root")).render(<App/>);
