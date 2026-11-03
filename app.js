const $ = (id) => document.getElementById(id);
const todayISO = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
const key = "yourlife_v1";
const defaultRoutines = ["Get ready for school","Complete workout","Training session","Study","Prepare for tomorrow"];
let state = JSON.parse(localStorage.getItem(key) || "null") || {events:[], routines:defaultRoutines.map((name,i)=>({id:i+1,name,done:false,day:todayISO()}))};
let selectedDate = todayISO();
let viewMonth = new Date();
let reminderTimers = [];
function save(){ localStorage.setItem(key,JSON.stringify(state)); renderAll(); }
function toast(message){const t=$("toast");t.textContent=message;t.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove("show"),2300);}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function showTab(tab){document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.id===`page-${tab}`));document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("selected",b.dataset.tab===tab));if(tab==="calendar")renderCalendar();}
document.querySelectorAll(".nav-item").forEach(b=>b.addEventListener("click",()=>showTab(b.dataset.tab)));
document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>showTab(b.dataset.go)));
$("settingsShortcut").addEventListener("click",()=>showTab("settings"));
function eventsFor(date){return state.events.filter(e=>e.date===date).sort((a,b)=>a.time.localeCompare(b.time));}
function eventHTML(e,del=false){return `<article class="event-card"><span class="event-time">${escapeHTML(e.time)}</span><div class="event-main"><strong>${escapeHTML(e.title)}</strong><small>${escapeHTML(e.type)} · ${escapeHTML(e.date)}</small></div><span class="event-tag">${escapeHTML(e.type)}</span>${del?`<button class="delete-event" data-delete="${e.id}" aria-label="Delete ${escapeHTML(e.title)}">×</button>`:""}</article>`;}
function bindDeletes(){document.querySelectorAll("[data-delete]").forEach(b=>b.addEventListener("click",()=>{state.events=state.events.filter(e=>e.id!==Number(b.dataset.delete));save();toast("Event deleted");}));}
function renderHome(){
 const list=eventsFor(todayISO());$("todayLabel").textContent=new Date().toLocaleDateString(undefined,{weekday:"long",day:"numeric",month:"long"}).toUpperCase();
 $("todayCount").textContent=list.length;$("todayEvents").innerHTML=list.length?list.map(e=>eventHTML(e)).join(""):'<div class="empty-state muted small">Nothing scheduled yet. Add your first event in Calendar.</div>';
 const routines=state.routines.filter(r=>r.day===todayISO());const done=routines.filter(r=>r.done).length;const pct=routines.length?Math.round(done/routines.length*100):0;
 $("taskCount").textContent=`${done}/${routines.length}`;$("progressLabel").textContent=`${pct}%`;$("homeProgress").style.width=`${pct}%`;
}
function renderCalendar(){
 const y=viewMonth.getFullYear(),m=viewMonth.getMonth();$("monthTitle").textContent=viewMonth.toLocaleDateString(undefined,{month:"long",year:"numeric"});
 const first=new Date(y,m,1),start=(first.getDay()+6)%7,days=new Date(y,m+1,0).getDate(),prevDays=new Date(y,m,0).getDate();
 const cells=['M','T','W','T','F','S','S'].map(x=>`<div class="day-label">${x}</div>`);
 for(let i=0;i<42;i++){let dayNum,dt,muted=false;if(i<start){dayNum=prevDays-start+i+1;dt=new Date(y,m-1,dayNum);muted=true;}else if(i>=start+days){dayNum=i-start-days+1;dt=new Date(y,m+1,dayNum);muted=true;}else{dayNum=i-start+1;dt=new Date(y,m,dayNum);}
 const iso=`${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`;
 const classes=["day-cell",muted?"muted-day":"",iso===todayISO()?"today":"",iso===selectedDate?"chosen":""].filter(Boolean).join(" ");
 cells.push(`<button class="${classes}" data-date="${iso}">${dayNum}</button>`);}
 $("calendarGrid").innerHTML=cells.join("");
 document.querySelectorAll("[data-date]").forEach(b=>b.addEventListener("click",()=>{selectedDate=b.dataset.date;renderCalendar();}));
 const list=eventsFor(selectedDate);$("selectedDateTitle").textContent=new Date(`${selectedDate}T12:00:00`).toLocaleDateString(undefined,{weekday:"long",day:"numeric",month:"short"});$("selectedCount").textContent=`${list.length} events`;
 $("selectedEvents").innerHTML=list.length?list.map(e=>eventHTML(e,true)).join(""):'<div class="muted small">No events on this day.</div>';bindDeletes();$("eventDate").value=selectedDate;
}
$("prevMonth").addEventListener("click",()=>{viewMonth.setMonth(viewMonth.getMonth()-1);renderCalendar();});
$("nextMonth").addEventListener("click",()=>{viewMonth.setMonth(viewMonth.getMonth()+1);renderCalendar();});
$("eventForm").addEventListener("submit",e=>{e.preventDefault();const title=$("eventName").value.trim(),date=$("eventDate").value,time=$("eventTime").value,type=$("eventType").value;if(!title||!date||!time)return;
 const item={id:Date.now(),title,date,time,type,reminder:$("eventReminder").checked};state.events.push(item);selectedDate=date;viewMonth=new Date(`${date}T12:00:00`);$("eventName").value="";$("eventReminder").checked=false;save();renderCalendar();toast("Event added to your calendar");});
document.querySelectorAll("[data-add-type]").forEach(b=>b.addEventListener("click",()=>{$("eventType").value=b.dataset.addType;$("eventDate").value=todayISO();showTab("calendar");$("eventName").focus();}));
function renderFitness(){const list=state.events.filter(e=>["Workout","Training"].includes(e.type)&&e.date>=todayISO()).sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));$("fitnessEvents").innerHTML=list.length?list.map(e=>eventHTML(e,true)).join(""):'<div class="muted small">No upcoming workouts or training sessions yet.</div>';bindDeletes();}
function renderRoutines(){let today=state.routines.filter(r=>r.day===todayISO());const done=today.filter(r=>r.done).length,pct=today.length?Math.round(done/today.length*100):0;$("routinePercent").textContent=`${pct}%`;$("routineProgress").style.width=`${pct}%`;$("routineList").innerHTML=today.map(r=>`<label class="routine-item ${r.done?'done':''}"><input type="checkbox" data-routine="${r.id}" ${r.done?'checked':''}><span>${escapeHTML(r.name)}</span></label>`).join("")||'<p class="muted small">No routines yet. Add one below.</p>';document.querySelectorAll("[data-routine]").forEach(c=>c.addEventListener("change",()=>{const r=state.routines.find(x=>x.id===Number(c.dataset.routine));if(r)r.done=c.checked;save();}));}
$("routineForm").addEventListener("submit",e=>{e.preventDefault();const name=$("newRoutine").value.trim();if(!name)return;state.routines.push({id:Date.now(),name,done:false,day:todayISO()});$("newRoutine").value="";save();toast("Routine added");});
$("resetRoutines").addEventListener("click",()=>{state.routines.forEach(r=>{if(r.day===todayISO())r.done=false;});save();toast("Today's checklist reset");});
$("enableNotifications").addEventListener("click",async()=>{if(!("Notification"in window)){toast("Notifications aren't supported in this browser");return;}const p=await Notification.requestPermission();toast(p==="granted"?"Notifications enabled":"Notification permission not enabled");});
$("exportData").addEventListener("click",()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="yourlife-backup.json";a.click();URL.revokeObjectURL(a.href);});
$("clearData").addEventListener("click",()=>{if(confirm("Delete all your events and routines from this device? This cannot be undone.")){localStorage.removeItem(key);state={events:[],routines:defaultRoutines.map((name,i)=>({id:i+1,name,done:false,day:todayISO()}))};save();toast("App data cleared");}});
function renderAll(){renderHome();renderCalendar();renderFitness();renderRoutines();}
if("serviceWorker"in navigator && location.protocol.startsWith("http")){window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));}
$("eventDate").value=todayISO();renderAll();
