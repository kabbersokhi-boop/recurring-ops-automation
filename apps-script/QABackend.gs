/* Install only in an owner-only standalone project. The public automation
 * deployment uses doPost exclusively; the admin UI deployment is Only myself. */
function doPost(e){return qaDoPost_(e);}
function doGet(){qaAdmin_();return HtmlService.createHtmlOutputFromFile('Admin').setTitle('Recurring Ops QA — administrator');}
function qaRecurrence_(){return locked(()=>{const r=OpsEngine.recurrence(readState(),nowIso());qaPersist_(r.state);return r.created;});}
function qaAdminState(){qaAdmin_();return locked(()=>{const s=readState(),dummy=e=>e.dummy&&s.tasks.some(t=>t.id===e.taskId&&t.email===e.email);return {businessNow:nowIso(),actualNow:new Date().toISOString(),mode:qaMode_(s),counts:qaEvidence_().counts,dummyCycles:s.cycles.filter(c=>QA_EMPLOYEES_.some(e=>dummy(e)&&e.taskId===c.taskId&&c.employeeEmail===e.email)).map(c=>({id:c.id,employeeId:c.employeeId,employee:c.employee,status:c.status,dueDay:c.dueDay,completedBy:c.completedBy,completionMode:c.completionMode})),roles:QA_EMPLOYEES_.map(e=>({employeeId:e.id,employee:e.name,taskId:e.taskId,actionMode:dummy(e)?'SIMULATED by QA administrator':'AUTHENTICATED employee'}))};});}
function qaAdminConfigureRoles(){
  const actor=qaAdmin_();qaAdminBackup();return locked(()=>{
    const s=readState();if(s.tasks.length!==4||QA_EMPLOYEES_.some(e=>!s.tasks.some(t=>t.id===e.taskId&&t.employee===e.name)))throw Error('Expected four-task QA scenario required');
    const sh=qaSpreadsheet_().getSheetByName(NAMES.tasks);
    s.tasks.forEach((t,i)=>{const e=QA_EMPLOYEES_.find(e=>e.taskId===t.id);sh.getRange(i+2,5).setValue(e.dummy?e.email:actor);sh.getRange(i+2,11).setValue(e.id);});
    // Earlier authenticated evidence is preserved in the private backup. Clear
    // records separately using Reset QA before demonstrating the new roles.
    qaUpdateDemoStatus_();return {configured:QA_EMPLOYEES_.map(e=>e.id),previousRecordsPreserved:true,resetRequired:true};
  });
}
function qaAdminSimulateCompletion(cycleId,proof){
  const administrator=qaAdmin_();return locked(()=>{
    const s=readState(),c=s.cycles.find(x=>x.id===cycleId),e=c&&QA_EMPLOYEES_.find(e=>e.dummy&&e.taskId===c.taskId);
    if(!c||!e||c.employeeId!==e.id||c.employee!==e.name||c.employeeEmail!==e.email||!s.tasks.some(t=>t.id===c.taskId&&t.email===e.email))throw Error('Only configured dummy employees B, C and D can be simulated');
    if(c.status==='Completed'&&c.completionMode!=='SIMULATED')throw Error('This cycle belongs to an earlier authenticated test; reset QA before simulation');
    const r=OpsEngine.complete(s,cycleId,proof,e.email,nowIso());
    if(!r.duplicate){const completed=r.state.cycles.find(x=>x.id===cycleId),h=r.state.history[r.state.history.length-1],actualAt=new Date().toISOString();completed.completedBy='SIMULATED:'+e.id;completed.completionMode='SIMULATED';completed.simulatedBy=administrator;completed.completedActualAt=actualAt;Object.assign(h,{actor:'SIMULATED:'+e.id,employeeId:e.id,actionMode:'SIMULATED',simulatedBy:administrator,actualAt});qaPersist_(r.state);}
    return {simulated:true,employeeId:e.id,cycleId,duplicate:r.duplicate,nextCycle:r.nextCycle||c.nextCycle||'',businessNow:nowIso(),actualAt:new Date().toISOString()};
  });
}
function qaAdminClock(point){
  qaAdmin_();const s=readState(),pending=s.cycles.filter(x=>['PORTAL15','PORTAL30'].includes(x.taskId)&&x.status==='Pending').sort((a,b)=>Date.parse(a.dueAt)-Date.parse(b.dueAt));
  const c=pending.find(x=>s.alerts.some(a=>a.cycleId===x.id&&a.level==='manager'&&a.mode!=='DRY_RUN'&&a.state==='SENT'))||pending[0];if(!c)throw Error('A pending PORTAL15 or PORTAL30 scenario is required');
  const d=OpsEngine.dashboard(s,nowIso()).find(x=>x.id===c.id),delay=OpsEngine.config(s).managerDelayMinutes;
  const times={due:c.dueAt,before:new Date(Date.parse(c.dueAt)+(delay-5)*60000).toISOString(),manager:new Date(Date.parse(c.dueAt)+delay*60000).toISOString(),acknowledgement:d.acknowledgementDueAt,leadership:d.escalationAt};
  if(!times[point])throw Error('Unknown clock point');return qaSetClock_(times[point]);
}
function qaAdminMode(mode){qaAdmin_();return qaSetMode_(mode);}
function qaAdminTime(when){qaAdmin_();return qaSetClock_(when);}
function qaAdminReset(startDay,holidays){qaAdmin_();return qaReset_(startDay,holidays);}
function qaAdminCalendarScenario(){qaAdmin_();const backup=qaAdminBackup();qaAdminReset('2026-10-16',['2026-10-19']);qaAdminMode('DRY_RUN');return {preserved:backup,scenario:'Friday deadline; Monday holiday',state:qaAdminState()};}
function qaAdminAdopt(){qaAdmin_();qaUpdateDemoStatus_();console.log('Existing QA records preserved; private backend attached');}
function qaAdminBackup(){
  qaAdmin_();return locked(()=>{
    const snapshot=qaSnapshot_(),encoded=qaEncodeSnapshot_(snapshot);
    qaProps_().setProperty('QA_RECORD_BACKUP',encoded);return {savedAt:snapshot.savedAt,counts:qaEvidence_().counts};
  });
}
function qaAdminRestore(){
  qaAdmin_();return locked(()=>qaRestoreSnapshot_(qaProps_().getProperty('QA_RECORD_BACKUP'),true));
}
function qaAdminRecoverRestore(){qaAdmin_();return locked(()=>qaRestoreSnapshot_(qaProps_().getProperty('QA_RESTORE_RECOVERY'),false));}
function qaSnapshot_(){return {version:1,sheetId:qaSpreadsheet_().getId(),businessNow:nowIso(),state:readState(),settingRows:sheetRows('settings').map(r=>[r[0],['dueTime','acknowledgementTime','escalationTime'].includes(r[0])?cellTime(r[1]):r[1]]),savedAt:new Date().toISOString()};}
function qaEncodeSnapshot_(snapshot){const encoded=Utilities.base64Encode(Utilities.gzip(Utilities.newBlob(JSON.stringify(snapshot),'application/json','qa-snapshot.json')).getBytes());if(encoded.length>8500)throw Error('QA snapshot exceeds private property limit; export evidence before resetting');return encoded;}
function qaRestoreSnapshot_(encoded,saveRecovery){
    if(!encoded)throw Error('No private QA snapshot');
    const snapshot=JSON.parse(Utilities.ungzip(Utilities.newBlob(Utilities.base64Decode(encoded),'application/x-gzip','qa-snapshot.json.gz')).getDataAsString());
    const ss=qaSpreadsheet_();if(snapshot.version!==1||snapshot.sheetId!==ss.getId()||!Number.isFinite(Date.parse(snapshot.businessNow)))throw Error('Invalid or incompatible QA snapshot');
    const s=snapshot.state;
    if(!s||!['tasks','cycles','history','alerts'].every(k=>Array.isArray(s[k]))||!s.tasks.length||!s.settings||!Array.isArray(snapshot.settingRows))throw Error('Invalid QA snapshot schema');
    if(s.tasks.some(t=>!t.id||!t.name||typeof t.email!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(t.startDay))||s.cycles.some(c=>!c.id||!c.taskId||!Number.isFinite(Date.parse(c.dueAt))||!['Pending','Completed'].includes(c.status))||s.history.some(h=>!h.cycleId||!h.event||!h.at)||s.alerts.some(a=>!a.key||!a.cycleId||!a.state)||snapshot.settingRows.some(r=>r.length!==2||!r[0]))throw Error('Invalid QA snapshot records');
    s.tasks.forEach(t=>{if(t.dueTime)t.dueTime=cellTime(t.dueTime);});
    ['dueTime','acknowledgementTime','escalationTime'].forEach(k=>{if(s.settings[k])s.settings[k]=cellTime(s.settings[k]);});
    snapshot.settingRows=snapshot.settingRows.map(r=>[r[0],['dueTime','acknowledgementTime','escalationTime'].includes(r[0])?cellTime(r[1]):r[1]]);
    for(const k of ['tasks','cycles','history','alerts','settings']){const sh=ss.getSheetByName(NAMES[k]),length=k==='settings'?snapshot.settingRows.length:s[k].length;const cols=k==='history'?11:k==='alerts'?17:k==='cycles'?21:k==='tasks'?11:TAB[k].length;if(!sh||sh.getMaxRows()<length+1||sh.getMaxColumns()<cols)throw Error('QA target grid incompatible with snapshot');}
    // Retain the state before restoration in a separate owner-only recovery slot.
    // The original snapshot remains available if a multi-tab write fails.
    if(saveRecovery)qaProps_().setProperty('QA_RESTORE_RECOVERY',qaEncodeSnapshot_(qaSnapshot_()));
    const tasks=ss.getSheetByName(NAMES.tasks);if(tasks.getLastRow()>1)tasks.getRange(2,1,tasks.getLastRow()-1,TAB.tasks.length).clearContent();
    ss.getSheetByName(NAMES.tasks).getRange(2,1,s.tasks.length,TAB.tasks.length).setValues(s.tasks.map(t=>[t.id,t.name,t.description,t.employee,t.email,t.frequency,t.startDay,t.dueTime,t.proofType,t.active]));
    ['cycles','history','alerts'].forEach(k=>{const sh=ss.getSheetByName(NAMES[k]);if(sh.getLastRow()>1)sh.getRange(2,1,sh.getLastRow()-1,sh.getLastColumn()).clearContent();});
    const settings=ss.getSheetByName(NAMES.settings);if(settings.getLastRow()>1)settings.getRange(2,1,settings.getLastRow()-1,2).clearContent();settings.getRange(2,1,snapshot.settingRows.length,2).setValues(snapshot.settingRows);
    qaProps_().setProperty('QA_BUSINESS_NOW',snapshot.businessNow);qaPersist_(s);
    return {restoredSnapshotSavedAt:snapshot.savedAt,actualRestoreAt:new Date().toISOString(),counts:qaEvidence_().counts};
}
