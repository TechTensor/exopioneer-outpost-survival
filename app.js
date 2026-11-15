const $ = (id) => document.getElementById(id);
const resources = {
  oxygen:{name:"Oxygen",icon:"◉",value:100,color:"#62dfe5",unit:"%",desc:"Crew breathing supply"},
  water:{name:"Water",icon:"♒",value:100,color:"#78a4ff",unit:"%",desc:"Drinking and hygiene reserve"},
  food:{name:"Food",icon:"✣",value:100,color:"#72e0b0",unit:"%",desc:"Stored food and greenhouse yield"},
  energy:{name:"Power",icon:"ϟ",value:100,color:"#ffca75",unit:"%",desc:"Battery and electrical systems"},
  shield:{name:"Radiation safety",icon:"⬡",value:35,color:"#bd9bff",unit:"%",desc:"Effective shelter protection"},
  integrity:{name:"Habitat integrity",icon:"⌂",value:100,color:"#ff9aa4",unit:"%",desc:"Overall equipment condition"}
};
const actionInfo = {
  solar:{label:"Solar arrays deployed",detail:"Array deployment improved energy generation.",cost:{energy:8},effect:{energy:28}},
  farm:{label:"Greenhouse expanded",detail:"The crew expanded controlled-environment food production.",cost:{energy:12,water:8},effect:{food:22}},
  shield:{label:"Radiation shelter upgraded",detail:"Additional shielding material was installed around the refuge area.",cost:{energy:14,integrity:4},effect:{shield:25}},
  recycle:{label:"Life-support recycling serviced",detail:"Water recovery and oxygen-loop efficiency improved.",cost:{energy:10},effect:{water:17,oxygen:14}},
  repair:{label:"Habitat maintenance completed",detail:"The crew repaired worn equipment and reinforced the habitat.",cost:{energy:9},effect:{integrity:24}},
  research:{label:"Science experiment completed",detail:"The crew collected useful environmental and biology data.",cost:{energy:7,food:3},effect:{science:15}}
};
let state = null, selectedAction = null, chosenPlanet = "moon", soundOn = false;
const clamp = n => Math.max(0,Math.min(100,Math.round(n)));
function toast(msg){$("toast").textContent=msg;$("toast").classList.add("show");setTimeout(()=>$("toast").classList.remove("show"),2300)}
function log(msg){const row=document.createElement("div");row.className="log-entry";const t=document.createElement("time");t.textContent="DAY "+String(state.day).padStart(2,"0");const d=document.createElement("span");d.textContent=msg;row.append(t,d);$("logEntries").prepend(row)}
function setBanner(title,detail){$("eventBanner").querySelector("b").textContent=title;$("eventBanner").querySelector("small").textContent=detail}
function renderResources(){
  $("resourceList").innerHTML="";
  Object.entries(resources).forEach(([key,r])=>{
    const val=state[key];const item=document.createElement("div");item.className="resource-item";
    item.innerHTML=`<div class="res-icon" style="color:${r.color}">${r.icon}</div><div class="res-main"><div class="res-top"><span class="res-name">${r.name}</span><span class="res-value">${val}%</span></div><div class="bar"><i style="width:${val}%;background:${r.color}"></i></div><div class="res-sub">${r.desc}</div></div><span class="res-value">${val<20?"LOW":val<40?"WATCH":"OK"}</span>`;
    $("resourceList").append(item);
  });
  $("scienceScore").textContent=state.science;
  $("dayNumber").textContent=String(state.day).padStart(2,"0");
  $("dayProgress").style.width=(state.day/30*100)+"%";
  $("actionDay").textContent="DAY "+String(state.day).padStart(2,"0");
  $("objective-state"); 
  document.querySelectorAll(".objective-state")[2].textContent=(state.day-1)+" / 30";
  const critical=["oxygen","water","food","energy","integrity"].some(k=>state[k]<20);
  $("statusText").textContent=critical?"CRITICAL":"STABLE";
  $("statusText").style.color=critical?"#ff7d88":"#72e0b0";
}
function startMission(){
  const name=$("commanderName").value.trim()||"Commander";
  state={name,planet:chosenPlanet,day:1,oxygen:100,water:100,food:100,energy:100,shield:chosenPlanet==="mars"?25:35,integrity:100,science:0,solar:0,farm:0,recycling:0,ended:false};
  $("startScreen").classList.add("hidden");$("gameScreen").classList.remove("hidden");
  $("planetLabel").textContent=chosenPlanet==="moon"?"LUNAR OUTPOST":"MARS HABITAT";
  $("welcomeTitle").textContent="Welcome, "+name+".";
  $("missionSub").textContent=chosenPlanet==="moon"?"Lunar night cycles make reliable power a priority.":"Dust storms can reduce solar generation on Mars.";
  $("logEntries").innerHTML="";selectedAction=null;
  renderResources();clearSelection();
  setBanner("Mission started","Your four-person crew is inside the habitat. Systems are nominal.");
  log("Crew arrived. Habitat systems online. Mission objective: survive 30 days.");
  log(chosenPlanet==="moon"?"Lunar operations: plan carefully for extended periods of darkness.":"Mars operations: monitor dust and protect power generation.");
}
function clearSelection(){document.querySelectorAll(".action-card").forEach(b=>b.classList.remove("chosen"));$("nextDayBtn").disabled=true;$("nextDayBtn").innerHTML="SELECT AN ACTION TO CONTINUE <span>→</span>";$("selectedHint").textContent="One major action is available each mission day.";selectedAction=null}
function selectAction(btn){
  if(state.ended)return;
  document.querySelectorAll(".action-card").forEach(b=>b.classList.remove("chosen"));
  btn.classList.add("chosen");selectedAction=btn.dataset.action;
  $("nextDayBtn").disabled=false;$("nextDayBtn").innerHTML="EXECUTE ACTION & ADVANCE DAY <span>→</span>";
  $("selectedHint").textContent=actionInfo[selectedAction].detail;
}
function change(key,amount){state[key]=clamp(state[key]+amount)}
function actionCanRun(action){
  const costs=actionInfo[action].cost;
  return Object.entries(costs).every(([k,v])=>state[k]>=v);
}
function executeAction(){
  if(!selectedAction||state.ended)return;
  const action=actionInfo[selectedAction];
  if(!actionCanRun(selectedAction)){toast("Insufficient resources for that operation.");return}
  Object.entries(action.cost).forEach(([k,v])=>change(k,-v));
  Object.entries(action.effect).forEach(([k,v])=>{if(k==="science")state.science+=v;else change(k,v)});
  if(selectedAction==="solar")state.solar++;
  if(selectedAction==="farm")state.farm++;
  if(selectedAction==="recycle")state.recycling++;
  log(action.label+". "+action.detail);
  advanceDay();
}
function advanceDay(){
  // Simplified daily consumption for a four-person educational simulation.
  change("oxygen",-7);change("water",-8);change("food",-7);change("energy",-9);
  change("integrity",-1);
  // Installed systems improve daily sustainability.
  change("energy",state.solar>0?4:0);
  change("food",state.farm>0?Math.min(5,state.farm*2):0);
  change("water",state.recycling>0?Math.min(5,state.recycling*2):0);
  change("oxygen",state.recycling>0?Math.min(4,state.recycling):0);
  state.day++;
  let event=null;
  const roll=Math.random();
  if(state.day%6===0 && roll<0.72){
    if(state.planet==="moon"){
      if(state.shield<55){change("integrity",-13);change("energy",-8);event=["Micrometeorite alert","A small impact damaged external equipment. Habitat integrity and power fell."]}
      else{change("integrity",-4);event=["Surface alert contained","The reinforced shelter limited damage from a small surface incident."]}
    }else{
      if(state.solar>0){change("energy",-18);event=["Martian dust storm","Dust reduced solar array output. Stored energy was lost."]}
      else{change("energy",-24);change("integrity",-5);event=["Severe dust storm","Dust covered equipment and reduced power. The habitat took minor damage."]}
    }
  }else if(roll<0.15){
    change("water",-8);event=["Water leak detected","A pipe leak reduced the water reserve. Schedule maintenance soon."]
  }else if(roll<0.30){
    change("energy",-7);event=["Power fluctuation","An unexpected electrical load drained the battery."]
  }else if(roll<0.43){
    change("food",-6);event=["Crop stress","Greenhouse conditions reduced the available food reserve."]
  }else{
    event=["Routine operations","The crew completed daily checks. All systems continue operating."]
  }
  if(event){setBanner(event[0],event[1]);log(event[0]+": "+event[1])}
  if(state.day>30){finish(true);return}
  renderResources();clearSelection();
  const failed=["oxygen","water","food","energy","integrity"].find(k=>state[k]<=0);
  if(failed){finish(false,failed);return}
  if([state.oxygen,state.water,state.food,state.energy].some(v=>v<20))toast("Warning: a critical resource is running low.");
}
function finish(success,failed){
  state.ended=true;
  $("modalIcon").textContent=success?"✦":"⚠";
  $("modalTitle").textContent=success?"Mission accomplished!":"Mission lost";
  $("modalText").textContent=success?"Your crew survived all 30 days. The outpost remained operational long enough to complete its mission.":"The "+failed+" system reached zero. The crew could not safely continue the mission. Review your resource strategy and try again.";
  $("reportStats").innerHTML=`<div><b>${Math.min(state.day-1,30)}</b><small>DAYS SURVIVED</small></div><div><b>${state.science}</b><small>SCIENCE POINTS</small></div><div><b>${state.integrity}%</b><small>HABITAT INTEGRITY</small></div>`;
  $("modalButton").textContent="RETURN TO MISSION CONTROL →";
  $("modal").classList.remove("hidden");
  setBanner(success?"Mission complete":"Mission terminated",success?"Crew survival objective achieved.":"Mission ended after a critical system failure.");
}
function showRules(){
  $("modalIcon").textContent="ⓘ";$("modalTitle").textContent="How to play";
  $("modalText").textContent="Each turn represents one day. Choose one operation, pay its resource cost, then advance the day. The crew consumes oxygen, water, food and power every day. Deploy solar arrays, expand the greenhouse and service recycling early. Radiation shielding and habitat repairs reduce the impact of hazards. Survive through day 30 to complete the mission. This is a simplified learning model, not an engineering design tool.";
  $("reportStats").innerHTML="<div><b>1</b><small>CHOOSE ACTION</small></div><div><b>2</b><small>PAY COST</small></div><div><b>3</b><small>SURVIVE DAY</small></div>";
  $("modalButton").textContent="BACK TO MISSION →";$("modal").classList.remove("hidden");
}
document.querySelectorAll(".planet-choice").forEach(btn=>btn.addEventListener("click",()=>{
  document.querySelectorAll(".planet-choice").forEach(b=>b.classList.remove("selected"));btn.classList.add("selected");chosenPlanet=btn.dataset.planet;
}));
$("launchBtn").addEventListener("click",startMission);
document.querySelectorAll(".action-card").forEach(btn=>btn.addEventListener("click",()=>selectAction(btn)));
$("nextDayBtn").addEventListener("click",executeAction);
$("restartBtn").addEventListener("click",()=>{if(confirm("Restart this mission from day one?")){$("gameScreen").classList.add("hidden");$("startScreen").classList.remove("hidden");$("modal").classList.add("hidden")}});
$("rulesBtn").addEventListener("click",showRules);
$("modalButton").addEventListener("click",()=>{$("modal").classList.add("hidden");if(state&&state.ended){$("gameScreen").classList.add("hidden");$("startScreen").classList.remove("hidden")}});
$("soundToggle").addEventListener("click",()=>{soundOn=!soundOn;$("soundToggle").style.color=soundOn?"#62e3e8":"#b8c8e2";toast("Sound effects are "+(soundOn?"enabled (visual prototype only)":"off"))});
