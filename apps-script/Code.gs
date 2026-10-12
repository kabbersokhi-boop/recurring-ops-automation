const TAB = {
  tasks: ['Task ID','Task name','Description','Employee','Employee email','Frequency','Start day','Due time','Proof type','Active'],
  cycles: ['Cycle ID','Task ID','Task','Employee','Employee email','Proof type','Due day','Due at','Status','Ticket ID','Daily report JSON','Completed at','Completed by','Acknowledged at','Acknowledged by','Previous cycle','Next cycle'],
  history: ['Cycle ID','Event','At','Actor','Ticket ID','Daily report JSON','Next cycle'],
  alerts: ['Deduplication key','Cycle ID','Level','Recipient','Employee','Task','Due at','Alert at','State','Provider message ID','Acknowledged at'],
  settings: ['Key','Value']
};
const NAMES = { tasks:'Task_Master', cycles:'Employee_Queue', history:'Task_History', alerts:'Alert_Log', settings:'Settings' };
const DASH_HEADERS = ['Cycle ID','Task','Employee','Due at','Status','Overdue hours','Manager alert','Acknowledgement','Acknowledged at','Acknowledged by','Escalation at','Escalation level','Resolution','Completion proof'];
function setupPrototype() {
  const ss = SpreadsheetApp.getActive();
  Object.keys(TAB).forEach(k => {
    const sh = ss.getSheetByName(NAMES[k]) || ss.insertSheet(NAMES[k]);
    if(sh.getFilter())sh.getFilter().remove(); sh.clear(); sh.getRange(1,1,1,TAB[k].length).setValues([TAB[k]]);
    sh.setFrozenRows(1); sh.getRange(1,1,1,TAB[k].length).setBackground('#e8edf3').setFontWeight('bold');
    sh.getRange(1,1,Math.max(2,sh.getMaxRows()),TAB[k].length).createFilter();
    sh.autoResizeColumns(1,TAB[k].length);
  });
  const tasks = [
    ['DAILY','Daily Operations Update','Submit work, pending items and blockers','Employee A','employee.a@example.invalid','daily','2026-10-13','17:00','report',true],
    ['PORTAL7','Portal Task A','Complete portal task and enter ticket','Employee B','employee.b@example.invalid',7,'2026-10-13','17:00','ticket',true],
    ['PORTAL15','Portal Task B','Complete portal task and enter ticket','Employee C','employee.c@example.invalid',15,'2026-10-13','17:00','ticket',true],
    ['PORTAL30','Portal Task C','Complete portal task and enter ticket','Employee D','employee.d@example.invalid',30,'2026-10-13','17:00','ticket',true]
  ];
  ss.getSheetByName(NAMES.tasks).getRange(2,1,tasks.length,tasks[0].length).setValues(tasks);
  const settings = [['timezone','+05:30'],['managerEmail','manager@example.invalid'],['leadershipEmail','leadership@example.invalid'],['dueTime','17:00'],['managerDelayMinutes','15'],['acknowledgementTime','10:00'],['escalationTime','14:00'],['holidays','[]'],['dryRun','true']];
  ss.getSheetByName(NAMES.settings).getRange(2,1,settings.length,2).setValues(settings);
  const queue = ss.getSheetByName(NAMES.cycles);
  queue.getRange('I2:I1000').setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(['Pending','Completed'],true).build());
  queue.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Completed').setBackground('#e2f0d9').setRanges([queue.getRange('I2:I1000')]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Pending').setBackground('#fff2cc').setRanges([queue.getRange('I2:I1000')]).build()
  ]);
  const dash = ss.getSheetByName('Manager_Dashboard') || ss.insertSheet('Manager_Dashboard');
  dash.clear();dash.getRange(1,1,1,DASH_HEADERS.length).setValues([DASH_HEADERS]).setBackground('#e8edf3').setFontWeight('bold');
  dash.setFrozenRows(1);dash.autoResizeColumns(1,DASH_HEADERS.length);
  SpreadsheetApp.getUi().alert('Prototype initialized. Replace dummy identities in Task_Master and Settings, then run recurrenceNow. Open Ops Tasks → My tasks.');
}
function onOpen() { SpreadsheetApp.getUi().createMenu('Ops Tasks').addItem('My tasks','showSidebar').addItem('Manager review','showManagerSidebar').addSeparator().addItem('Run recurrence','recurrenceNow').addItem('Run manager alerts','managerAlertsNow').addItem('Run leadership escalation','leadershipNow').addToUi(); }
function showSidebar() { SpreadsheetApp.getUi().showSidebar(HtmlService.createHtmlOutputFromFile('Sidebar').setTitle('My tasks')); }
function showManagerSidebar() { currentManager(); SpreadsheetApp.getUi().showSidebar(HtmlService.createHtmlOutputFromFile('ManagerSidebar').setTitle('Manager review')); }
function currentManager(){const actor=currentActor();if(actor.toLowerCase()!==String(readState().settings.managerEmail).toLowerCase())throw Error('Authenticated manager required');return actor;}
function managerIssues(){currentManager();const s=readState();return OpsEngine.dashboard(s,nowIso()).map(c=>Object.assign(c,{alerted:s.alerts.some(a=>a.cycleId===c.id&&a.level==='manager')})).filter(c=>c.status==='Pending'||c.alerted);}
function sheetRows(k) { const sh=SpreadsheetApp.getActive().getSheetByName(NAMES[k]); const n=sh.getLastRow(); return n<2?[]:sh.getRange(2,1,n-1,TAB[k].length).getValues(); }
function readState() {
  const tasks=sheetRows('tasks').filter(r=>r[0]).map(r=>({id:String(r[0]),name:r[1],description:r[2],employee:r[3],email:r[4],frequency:r[5],startDay:String(r[6]).slice(0,10),dueTime:r[7],proofType:r[8],active:r[9]===true||String(r[9]).toLowerCase()==='true'}));
  const cycles=sheetRows('cycles').map(r=>({id:r[0],taskId:r[1],task:r[2],employee:r[3],employeeEmail:r[4],proofType:r[5],dueDay:r[6],dueAt:r[7],status:r[8],ticketId:r[9],report:r[10]?JSON.parse(r[10]):null,completedAt:r[11],completedBy:r[12],acknowledgedAt:r[13],acknowledgedBy:r[14],previousCycle:r[15],nextCycle:r[16]}));
  const history=sheetRows('history').map(r=>({cycleId:r[0],event:r[1],at:r[2],actor:r[3],ticketId:r[4],report:r[5]?JSON.parse(r[5]):null,nextCycle:r[6]}));
  const alerts=sheetRows('alerts').map(r=>({key:r[0],cycleId:r[1],level:r[2],recipient:r[3],employee:r[4],task:r[5],dueAt:r[6],at:r[7],state:r[8],messageId:r[9]}));
  const settings=Object.fromEntries(sheetRows('settings').map(r=>[r[0],r[1]]));
  settings.holidays=JSON.parse(settings.holidays||'[]'); settings.managerDelayMinutes=Number(settings.managerDelayMinutes||15); settings.dryRun=String(settings.dryRun).toLowerCase()==='true';
  return OpsEngine.reconcile({tasks,cycles,history,alerts,settings});
}
function writeState(s) {
  const rows={
    cycles:s.cycles.map(c=>[c.id,c.taskId,c.task,c.employee,c.employeeEmail,c.proofType,c.dueDay,c.dueAt,c.status,c.ticketId,JSON.stringify(c.report||''),c.completedAt,c.completedBy,c.acknowledgedAt,c.acknowledgedBy,c.previousCycle,c.nextCycle]),
    history:s.history.map(h=>[h.cycleId,h.event,h.at,h.actor,h.ticketId||'',JSON.stringify(h.report||''),h.nextCycle||'']),
    alerts:s.alerts.map(a=>[a.key,a.cycleId,a.level,a.recipient,a.employee,a.task,a.dueAt,a.at,a.state,a.messageId||'',''])
  };
  Object.keys(rows).forEach(k=>{const sh=SpreadsheetApp.getActive().getSheetByName(NAMES[k]);const old=Math.max(0,sh.getLastRow()-1);const count=Math.max(old,rows[k].length);if(count){const blank=Array(TAB[k].length).fill('');const padded=rows[k].concat(Array.from({length:count-rows[k].length},()=>blank.slice()));sh.getRange(2,1,count,TAB[k].length).setValues(padded);}});
  const dash=SpreadsheetApp.getActive().getSheetByName('Manager_Dashboard');if(dash){const alertsByCycle=id=>s.alerts.filter(a=>a.cycleId===id);const visible=OpsEngine.dashboard(s,nowIso()).filter(c=>c.status==='Pending'||alertsByCycle(c.id).length);const view=visible.map(c=>{const alerts=alertsByCycle(c.id),manager=alerts.some(a=>a.level==='manager'),leader=alerts.some(a=>a.level==='leadership');return[c.id,c.task,c.employee,c.dueAt,c.status,Math.round(c.overdueMinutes/60*10)/10,manager?'Sent or reserved':'No alert',c.acknowledgedAt?'Acknowledged':'Pending',c.acknowledgedAt,c.acknowledgedBy,c.escalationAt,leader?'Leadership':manager?'Manager':'None',c.status==='Completed'?'Resolved':'Unresolved',c.ticketId||JSON.stringify(c.report||'')];});const count=Math.max(Math.max(0,dash.getLastRow()-1),view.length);if(count)dash.getRange(2,1,count,DASH_HEADERS.length).setValues(view.concat(Array.from({length:count-view.length},()=>Array(DASH_HEADERS.length).fill(''))));}
  SpreadsheetApp.flush();
}
function locked(fn) { const l=LockService.getDocumentLock(); if(!l.tryLock(30000))throw Error('System busy; retry shortly'); try {return fn();} finally {l.releaseLock();} }
function nowIso() {return new Date().toISOString();}
function recurrenceNow(){return locked(()=>{const r=OpsEngine.recurrence(readState(),nowIso());writeState(r.state);return r.created;});}
function currentActor(){const email=Session.getActiveUser().getEmail();if(!email)throw Error('Google did not provide a verified signed-in identity. Ask the administrator to deploy in your Workspace domain.');return email;}
function myTasks(){const actor=currentActor();return readState().cycles.filter(c=>c.employeeEmail.toLowerCase()===actor.toLowerCase()&&c.status!=='Completed');}
function submitCompletion(cycleId,proof){const actor=currentActor();return locked(()=>{const r=OpsEngine.complete(readState(),cycleId,proof,actor,nowIso());if(!r.duplicate)writeState(r.state);return {duplicate:r.duplicate,nextCycle:r.nextCycle||''};});}
function managerAcknowledge(cycleId){const actor=currentManager();return locked(()=>{const r=OpsEngine.acknowledge(readState(),cycleId,actor,nowIso());if(!r.duplicate)writeState(r.state);return {duplicate:r.duplicate};});}
function processAlerts(level){return locked(()=>{let state=readState();const candidates=OpsEngine.alertCandidates(state,nowIso(),level);const groups={};for(const a of candidates){if(!a.recipient||a.recipient.endsWith('.invalid'))continue;state=OpsEngine.reserveAlert(state,a,nowIso()).state;(groups[a.recipient]||=[]).push(a);}if(!Object.keys(groups).length)return 0;writeState(state);for(const recipient of Object.keys(groups)){if(state.settings.dryRun)continue;const items=groups[recipient];const body=items.map(a=>a.employee+' — '+a.task+'\nDue: '+a.dueAt+'\nCycle: '+a.cycleId+(a.reason?'\nReason: '+a.reason:'')).join('\n\n')+'\n\nOpen the private operations Sheet to review.';try{MailApp.sendEmail({to:recipient,subject:'Ops '+(level==='manager'?'overdue tasks':'leadership escalation')+' ('+items.length+')',body});items.forEach(a=>state.alerts.find(x=>x.key===a.key).state='SENT');writeState(state);}catch(e){items.forEach(a=>state.alerts.find(x=>x.key===a.key).state='UNKNOWN');writeState(state);throw e;}}return candidates.length;});}
function managerAlertsNow(){return processAlerts('manager');}
function leadershipNow(){return processAlerts('leadership');}
function doPost(e){const token=PropertiesService.getScriptProperties().getProperty('N8N_SHARED_TOKEN');if(!token||!e||!e.postData)throw Error('Unauthorized');const p=JSON.parse(e.postData.contents);if(p.token!==token)throw Error('Unauthorized');const action=p.action;if(action==='recurrence')return ContentService.createTextOutput(JSON.stringify({created:recurrenceNow()}));if(action==='manager')return ContentService.createTextOutput(JSON.stringify({alerts:managerAlertsNow()}));if(action==='leadership')return ContentService.createTextOutput(JSON.stringify({alerts:leadershipNow()}));throw Error('Unknown action');}
