import React,{useState}from"react";
import { connectWallet, disconnectWallet, getSavedWallet, restoreWallet, shortenAddress } from "./wallet.js";
import { askNura } from "./api.js";
import { getHealthData, addConversation, addMetric, deleteMetric, addAppointment, updateAppointment, deleteAppointment, addMedication, toggleMedication, deleteMedication, addCheckin, updateHealthData, clearHealthData, exportHealthData } from "./healthStore.js";
import{createRoot}from"react-dom/client";
import{Activity,ArrowRight,Bell,Brain,CalendarDays,ChevronRight,CircleHelp,ClipboardCheck,Droplets,HeartPulse,Home,LockKeyhole,MessageCircle,Moon,MoreHorizontal,Pill as PillIcon,ShieldCheck,SunMedium,UserRound,Wallet,Plus,Download,Trash2,AlertTriangle,Settings2,Check}from"lucide-react";
import"./styles.css";

const chain={id:4663};
const CONTRACT_ADDRESS="";

function App(){
 const[route,setRoute]=useState(window.location.pathname==="/app"?"app":"home");
 const[menuOpen,setMenuOpen]=useState(false),[wallet,setWallet]=useState(()=>getSavedWallet());
 const walletConnected=!!wallet?.address;
 const go=next=>{window.history.pushState({}, "",next==="app"?"/app":"/");setRoute(next);setMenuOpen(false);window.scrollTo({top:0,behavior:"smooth"})};
 React.useEffect(()=>{const f=()=>setRoute(window.location.pathname==="/app"?"app":"home");window.addEventListener("popstate",f);restoreWallet().then(setWallet).catch(()=>setWallet(null));if("serviceWorker"in navigator)navigator.serviceWorker.register("/sw.js").catch(()=>{});return()=>window.removeEventListener("popstate",f)},[]);
 return route==="app"?<NuraApp wallet={wallet} setWallet={setWallet} goHome={()=>go("home")}/>:<Landing goApp={()=>go("app")}/>;
}

function Brand({compact=false,onClick}){return <button className={"brand "+(compact?"brand-compact":"")} onClick={onClick}><span className="brand-mark"><i/><i/></span><span>NURA</span></button>}
function Pill({children,tone="blue"}){return <span className={"pill pill-"+tone}>{children}</span>}

function Landing({goApp}){
 return <div className="nura-site">
  <header className="nura-nav">
   <Brand onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}/>
   <nav className="nura-nav-links">
    <a href="#doctor">AI Doctor</a><a href="#health">Health</a><a href="#care">Care</a><a href="#privacy">Privacy</a><a href="#about">About</a>
   </nav>
   <button className="nura-nav-cta" onClick={goApp}>Open Nura <ArrowRight size={14}/></button>
  </header>

  <main>
   <section className="nura-hero">
    <div className="nura-hero-copy">
     <div className="nura-kicker"><span>✦</span> AI-powered health companion</div>
     <h1><span>Understand</span><br/>your health.<br/><em>Live better.</em></h1>
     <p>Nura brings intelligent health guidance, personal health information, and everyday care into one calm, private experience.</p>
     <div className="nura-hero-actions"><button className="nura-primary" onClick={goApp}>Start with Nura <ArrowRight size={15}/></button><a href="#doctor" className="nura-quiet">See how it works <ArrowRight size={14}/></a></div>
    </div>
    <div className="nura-hero-scene" aria-hidden="true">
      <div className="nura-blue-haze"/>
      <div className="nura-photo-card"><img src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=1200&q=85" alt="Doctor using a phone for digital health"/></div>
      <div className="nura-phone-shadow"/>
      <div className="nura-device">
       <div className="nura-device-notch"/>
       <div className="nura-device-status">9:41 <span>••• ▰</span></div>
       <div className="nura-device-head"><b>Nura</b><span>AI Doctor</span></div>
       <div className="nura-device-title">How are you<br/><b>feeling today?</b></div>
       <div className="nura-device-prompt">Tell Nura what you're experiencing <span>→</span></div>
       <div className="nura-device-chips"><i>Symptoms</i><i>Medications</i><i>Health</i><i>Appointments</i></div>
       <div className="nura-device-orb"><span/></div>
      </div>
      <div className="nura-float nura-heart"><b>72</b><small>HEART RATE</small><i>Normal</i></div>
      <div className="nura-float nura-sleep"><b>7h 45m</b><small>SLEEP</small><i>Good</i></div>
      <div className="nura-float nura-call"><span><PhoneCall size={15}/></span><div><b>Care when you need it</b><small>Connected health support</small></div></div>
     </div>
   </section>

   <section className="nura-intro" id="about">
    <div className="nura-overline">HEALTH SHOULD FEEL HUMAN</div>
    <div><h2>Less noise.<br/><em>More understanding.</em></h2><p>From a question you can't quite answer to the information you wish you had before an appointment, Nura helps turn scattered health moments into something you can actually understand.</p></div>
   </section>

   <section className="nura-feature" id="doctor">
    <div className="nura-feature-image"><img src="https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=1400&q=85" alt="Healthcare professional holding a smartphone"/></div>
    <div className="nura-feature-copy"><span>01 / AI DOCTOR</span><h2>A conversation<br/><em>that listens.</em></h2><p>Ask questions in plain language. Describe symptoms, medications, or concerns and get structured guidance without having to translate yourself into medical jargon.</p><button onClick={goApp}>Meet AI Doctor <ArrowRight size={14}/></button></div>
   </section>

   <section className="nura-health" id="health">
    <div className="nura-health-copy"><span>02 / YOUR HEALTH</span><h2>See the whole<br/><em>picture.</em></h2><p>Keep the details that matter close — vital signs, activity, sleep, medications, appointments, and your own health notes — in one focused place.</p>
      <div className="nura-stat-row"><div><b>72</b><small>BPM</small><i>Heart rate</i></div><div><b>7h 45m</b><small>SLEEP</small><i>Last night</i></div><div><b>8,420</b><small>STEPS</small><i>Today</i></div></div>
    </div>
    <div className="nura-health-image"><img src="https://images.unsplash.com/photo-1511174511562-5f7f18b874f8?auto=format&fit=crop&w=1400&q=85" alt="Person checking health information on a phone"/></div>
   </section>

   <section className="nura-care" id="care">
    <div className="nura-care-image"><img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1400&q=85" alt="Healthcare professional in a bright clinic"/></div>
    <div className="nura-care-copy"><span>03 / EVERYDAY CARE</span><h2>Small details<br/><em>matter.</em></h2><div className="nura-care-list"><article><b>Medication</b><p>Keep your medication schedule clear and easy to follow.</p></article><article><b>Appointments</b><p>Keep upcoming care and important notes together.</p></article><article><b>Health history</b><p>Build a useful picture of your health over time.</p></article></div></div>
   </section>

   <section className="nura-privacy" id="privacy">
    <div><span>04 / PRIVATE BY DESIGN</span><h2>Your health is<br/><em>your story.</em></h2><p>Nura is designed around a simple principle: your health information should feel personal, understandable, and under your control.</p><button className="nura-dark-button" onClick={goApp}>Enter your private space <ArrowRight size={14}/></button></div>
    <div className="nura-privacy-art"><div className="nura-lock"><LockKeyhole size={28}/></div><div className="nura-ring ring-a"/><div className="nura-ring ring-b"/><div className="nura-ring ring-c"/></div>
   </section>

   <section className="nura-final">
    <div className="nura-final-photo"><img src="https://images.unsplash.com/photo-1542884748-2b87b36c6b90?auto=format&fit=crop&w=1800&q=85" alt="Woman enjoying a healthy outdoor moment"/></div>
    <div className="nura-final-overlay"><span>YOUR HEALTH. ONE PLACE.</span><h2>Feel more<br/><em>in control.</em></h2><button className="nura-primary" onClick={goApp}>Start with Nura <ArrowRight size={15}/></button></div>
   </section>
  </main>

  <footer className="nura-footer"><Brand/><div><a href="#doctor">AI Doctor</a><a href="#health">Health</a><a href="#care">Care</a><a href="#privacy">Privacy</a></div><span>© {new Date().getFullYear()} Nura</span></footer>
 </div>
}
function FeatureCard({icon,title,text}){return <article className="feature-card"><div className="feature-card-icon">{icon}</div><h3>{title}</h3><p>{text}</p><ChevronRight size={17}/></article>}

function NuraApp({wallet,setWallet,goHome}){
 const[active,setActive]=useState("Home"),[notice,setNotice]=useState(""),[walletBusy,setWalletBusy]=useState(false),[profile,setProfile]=useState(()=>getHealthData().profile);
 const connected=!!wallet?.address;
 React.useEffect(()=>{const sync=()=>setProfile(getHealthData().profile);window.addEventListener("storage",sync);const id=setInterval(sync,1000);return()=>{window.removeEventListener("storage",sync);clearInterval(id)}},[]);
 const nav=["Home","AI Doctor","Health","Appointments","Profile"];
 const connect=async()=>{setWalletBusy(true);try{const next=await connectWallet();setWallet(next);setNotice(`Wallet connected · ${shortenAddress(next.address)} · Robinhood Chain`)}catch(error){setNotice(error?.message||"Wallet connection cancelled.");}finally{setWalletBusy(false);setTimeout(()=>setNotice(""),4200)}};
 const disconnect=async()=>{await disconnectWallet();setWallet(null);setNotice("Wallet disconnected.");setTimeout(()=>setNotice(""),2600)};
 return <div className="app-shell">{notice&&<div className="toast"><ShieldCheck size={16}/>{notice}</div>}<aside className="sidebar"><Brand onClick={goHome}/><div className="side-nav">{nav.map(item=><button key={item} className={active===item?"selected":""} onClick={()=>setActive(item)}>{iconFor(item)}<span>{item}</span></button>)}</div><div className="sidebar-bottom"><div className="privacy-box"><LockKeyhole size={16}/><div><b>Private mode</b><small>Your health data stays under your control.</small></div></div><button className="help-button"><CircleHelp size={17}/> Help & safety</button></div></aside>
  <main className="dashboard"><header className="app-topbar"><div className="mobile-brand"><Brand compact onClick={goHome}/></div><div className="crumb"><span>{new Date().getHours()<12?"Good morning":new Date().getHours()<18?"Good afternoon":"Good evening"}</span><b>{profile?.name?.trim()?`Welcome back, ${profile.name.trim()}`:"Welcome to Nura"}</b></div><div className="top-actions"><button className="icon-button"><Bell size={18}/><i/></button><button className={"wallet-button "+(connected?"connected":"")} onClick={connected?disconnect:connect} disabled={walletBusy}><Wallet size={16}/><span>{walletBusy?"Connecting…":connected?shortenAddress(wallet.address):"Connect wallet"}</span></button><div className="avatar">{(profile?.name?.trim()||"N").split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0].toUpperCase()).join("")}</div></div></header><div className="dashboard-inner">
   {active==="Home"&&<DashboardHome onDoctor={()=>setActive("AI Doctor")}/>}
   {active==="AI Doctor"&&<DoctorPage/>}{active==="Health"&&<HealthPage/>}{active==="Appointments"&&<AppointmentsPage/>}{active==="Profile"&&<ProfilePage wallet={wallet} onConnect={connect} onDisconnect={disconnect} walletBusy={walletBusy}/>}
  </div></main><nav className="mobile-nav">{nav.map(item=><button key={item} className={active===item?"selected":""} onClick={()=>setActive(item)}>{iconFor(item)}<span>{item}</span></button>)}</nav></div>
}
function iconFor(item){const p={size:18,strokeWidth:1.8};if(item==="Home")return <Home {...p}/>;if(item==="AI Doctor")return <ShieldCheck {...p}/>;if(item==="Health")return <HeartPulse {...p}/>;if(item==="Appointments")return <CalendarDays {...p}/>;return <UserRound {...p}/>}

function DashboardHome({onDoctor}){
 const[data,setData]=useState(getHealthData());
 React.useEffect(()=>{
  const sync=()=>setData(getHealthData());
  window.addEventListener("storage",sync);
  return()=>window.removeEventListener("storage",sync);
 },[]);
 const metrics=data.metrics||[];
 const latest=key=>metrics.filter(m=>(m.label||"").toLowerCase().includes(key)).sort((a,b)=>(b.updatedAt||"").localeCompare(a.updatedAt||""))[0];
 const hr=latest("heart");
 const sleep=latest("sleep");
 const hydration=latest("hydrat");
 const activity=latest("step")||latest("activ");
 const seriesFor=key=>metrics.filter(m=>(m.label||"").toLowerCase().includes(key)).sort((a,b)=>(a.updatedAt||"").localeCompare(b.updatedAt||"")).slice(-7);
 const upcoming=[...(data.appointments||[])].filter(a=>a.status!=="Completed").sort((a,b)=>(a.date+" "+a.time).localeCompare(b.date+" "+b.time))[0];
 const med=(data.medications||[]).find(m=>m.active);
 const hasData=metrics.length>0||(data.appointments||[]).length>0||(data.medications||[]).length>0;
 return <div className="dashboard-page">
  <section className="welcome-grid">
   <div className="welcome-card"><div className="welcome-copy"><Pill><HeartPulse size={12}/> Your health companion</Pill><h1>Understand your health.<br/><span>One conversation at a time.</span></h1><p>Ask Nura about symptoms, medications, sleep, hydration and everyday health questions.</p><button className="button button-primary" onClick={onDoctor}>Talk to Nura <ArrowRight size={16}/></button></div><div className="welcome-art"><div className="art-glow"/><div className="mini-orb"><HeartPulse size={34}/></div><div className="art-panel"><span>LIVE HEALTH SIGNAL</span><b>Personal overview</b><small>Private · user controlled</small></div></div></div>
   <div className="today-card"><div className="card-head"><span>Today</span><MoreHorizontal size={17}/></div><Today label="Heart rate" value={hr?hr.value+" "+(hr.unit||""):"—"} icon={<HeartPulse/>} tone="blue" status={hr?"Recorded":"Not added"}/><Today label="Sleep" value={sleep?sleep.value+" "+(sleep.unit||""):"—"} icon={<Moon/>} tone="purple" status={sleep?"Recorded":"Not added"}/><Today label="Hydration" value={hydration?hydration.value+" "+(hydration.unit||""):"—"} icon={<Droplets/>} tone="mint" status={hydration?"Recorded":"Not added"}/></div>
  </section>
  <TitleRow small="YOUR HEALTH" title="Overview"/>
  <section className="overview-grid">
   <MetricCard icon={<HeartPulse/>} label="Heart rate" value={hr?.value||"—"} unit={hr?.unit||""} note={hr?.note||"No reading recorded"} tone="blue" series={seriesFor("heart")}/>
   <MetricCard icon={<Moon/>} label="Sleep" value={sleep?.value||"—"} unit={sleep?.unit||""} note={sleep?.note||"No reading recorded"} tone="purple" series={seriesFor("sleep")}/>
   <MetricCard icon={<Activity/>} label="Activity" value={activity?.value||"—"} unit={activity?.unit||""} note={activity?.note||"No reading recorded"} tone="mint" series={seriesFor("step").length?seriesFor("step"):seriesFor("activ")}/>
   <MetricCard icon={<Droplets/>} label="Hydration" value={hydration?.value||"—"} unit={hydration?.unit||""} note={hydration?.note||"No reading recorded"} tone="orange" series={seriesFor("hydrat")}/>
  </section>
  <TitleRow small="NEXT UP" title="Care timeline"/>
  <div className="timeline-card">
   {upcoming?<TimelineItem icon={<CalendarDays/>} title={upcoming.doctor} meta={upcoming.date+" · "+upcoming.time} tag={upcoming.status||"Planned"}/>:med?<TimelineItem icon={<PillIcon/>} title={med.name} meta={med.schedule||"Medication"} tag="Medication"/>:<Empty icon={<CalendarDays/>} title={hasData?"No upcoming care items":"Your dashboard is ready"} text="Add health readings, medications or appointments to see them here."/>}
  </div>
 </div>;
}
function Today({icon,label,value,tone,status}){return <div className="today-metric"><div className={"metric-icon "+tone}>{icon}</div><div><small>{label}</small><strong>{value}</strong></div><span className="metric-status">{status}</span></div>}
function TitleRow({small,title}){return <section className="section-title-row"><div><small>{small}</small><h2>{title}</h2></div><button className="link-button">View all <ArrowRight size={15}/></button></section>}
function MetricCard({icon,label,value,unit,note,tone,series=[]}){const nums=series.map(x=>Number.parseFloat(String(x.value).replace(/[^0-9.+-]/g,""))).filter(Number.isFinite);const max=Math.max(...nums,1),min=Math.min(...nums,0);return <article className="metric-card"><div className={"metric-icon "+tone}>{icon}</div><div className="metric-card-label">{label}<MoreHorizontal size={15}/></div><div className="metric-value">{value} <small>{unit}</small></div><div className="metric-note">{note}</div><div className={"sparkline "+(!nums.length?"empty":"")}>{nums.length?nums.map((n,i)=><span key={i} style={{height:`${Math.max(18,((n-min)/Math.max(max-min,1))*70+18)}%`}}/>):<small>No trend data yet</small>}</div></article>}
function TimelineItem({icon,title,meta,tag}){return <div className="timeline-item"><div className="timeline-icon">{icon}</div><div><b>{title}</b><small>{meta}</small></div><Pill tone="mint">{tag}</Pill><ChevronRight size={16}/></div>}

function DoctorPage(){
 const[messages,setMessages]=useState([{role:"assistant",from:"nura",content:"Hi, I’m Nura. Tell me what’s going on today — symptoms, sleep, medication, or anything you’re unsure about."}]),[input,setInput]=useState(""),[busy,setBusy]=useState(false),[urgent,setUrgent]=useState(false);
 const send=async preset=>{const text=(preset??input).trim();if(!text||busy)return;const next=[...messages,{role:"user",from:"user",content:text}];setMessages(next);setInput("");setBusy(true);try{const result=await askNura({messages:next.map(m=>({role:m.role,content:m.content})),healthContext:getHealthData()});const reply={role:"assistant",from:"nura",content:result.message};setMessages([...next,reply]);setUrgent(!!result.urgent);addConversation([...next,reply])}catch(error){setMessages([...next,{role:"assistant",from:"nura",content:error?.message||"Nura could not reach the AI service. Your message remains on this device."}])}finally{setBusy(false)}};
 return <div className="doctor-page"><div className="doctor-main"><div className="page-kicker"><Pill><ShieldCheck size={11}/> Nura AI Doctor</Pill><span>Educational support · not a diagnosis</span></div><h1>How are you feeling?</h1><p className="page-sub">Describe what’s happening in your own words. Nura can structure the information and help you think through sensible next steps.</p>{urgent&&<div className="urgent-banner"><AlertTriangle size={18}/><div><b>Urgent symptoms detected</b><span>Please seek urgent medical care now. Do not wait for this chat to decide what to do.</span></div></div>}<div className="chat-window">{messages.map((m,i)=><div className={"chat-row "+m.from} key={i}><div className="chat-avatar">{m.from==="nura"?<ShieldCheck size={15}/>:"N"}</div><div className="chat-bubble">{m.content}</div></div>)}{busy&&<div className="typing">Nura is thinking…</div>}</div><div className="quick-prompts"><button onClick={()=>send("I have a headache")}>Headache</button><button onClick={()=>send("I’m not sleeping well")}>Sleep</button><button onClick={()=>send("I have a question about a medication")}>Medication</button><button onClick={()=>send("I want to understand my symptoms")}>Symptoms</button></div><div className="chat-composer"><textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send()}}} placeholder="Tell Nura what’s going on…"/><button onClick={()=>send()} disabled={busy}><ArrowRight size={17}/></button></div></div><aside className="doctor-side"><div className="side-panel"><h3>Safety first</h3><p>For severe or rapidly worsening symptoms, seek urgent medical care rather than relying on an AI assistant.</p><button onClick={()=>setUrgent(true)}><AlertTriangle size={15}/> Emergency guidance <ChevronRight/></button></div><div className="side-panel"><h3>What Nura can do</h3><div className="capability"><ShieldCheck size={14}/> Structure symptoms</div><div className="capability"><ShieldCheck size={14}/> Explain general health information</div><div className="capability"><ShieldCheck size={14}/> Help prepare for a clinician visit</div></div></aside></div>
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

createRoot(document.getElementById("root")).render(<App/>);