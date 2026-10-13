/* Owner-only standalone QA backend. Never install this module in the shared
 * Sheet project: editors of a Sheet can also edit its bound script. */
let QA_PROPS_CACHE_,QA_SHEET_CACHE_;
function qaProps_(){return QA_PROPS_CACHE_||(QA_PROPS_CACHE_=PropertiesService.getScriptProperties());}
function qaEnabled_(){return true;}
function qaSpreadsheet_(){
  if(QA_SHEET_CACHE_)return QA_SHEET_CACHE_;
  const p=qaProps_(),id=p.getProperty('QA_SHEET_ID');
  if(!id||id===p.getProperty('ORIGINAL_SHEET_ID'))throw Error('Independent QA workbook required');
  const active=SpreadsheetApp.getActive();
  if(active&&active.getId()!==id)throw Error('QA workbook identity mismatch');
  return QA_SHEET_CACHE_=active||SpreadsheetApp.openById(id);
}
function qaBusinessNow_(){qaSpreadsheet_();return qaProps_().getProperty('QA_BUSINESS_NOW')||new Date().toISOString();}
function qaAdmin_(){const actor=Session.getActiveUser().getEmail();if(!actor||actor.toLowerCase()!==String(qaProps_().getProperty('QA_ADMIN')).toLowerCase())throw Error('QA administrator required');return actor;}
function qaVerifyIdentity_(idToken){
  if(!idToken)throw Error('Google authorization required; no identity token available');
  const response=UrlFetchApp.fetch('https://oauth2.googleapis.com/tokeninfo?id_token='+encodeURIComponent(idToken),{muteHttpExceptions:true});
  if(response.getResponseCode()!==200)throw Error('Google identity token rejected');
  const c=JSON.parse(response.getContentText());
  if(c.aud!==qaProps_().getProperty('QA_OAUTH_AUDIENCE')||!['accounts.google.com','https://accounts.google.com'].includes(c.iss)||String(c.email_verified)!=='true'||Number(c.exp)*1000<=Date.now()||!c.email)throw Error('Verified Google identity required');
  return c.email.toLowerCase();
}
function qaJson_(value){return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);}
function qaDoPost_(e){
  try{
    qaSpreadsheet_();
    if(!e||!e.postData)throw Error('Unauthorized');
    const p=JSON.parse(e.postData.contents);
    if(p.action==='user')return qaJson_({ok:true,result:qaUserOperation_(p,qaVerifyIdentity_(p.idToken))});
    const token=qaProps_().getProperty('N8N_SHARED_TOKEN');
    if(!token||p.token!==token)throw Error('Unauthorized');
    if(p.action==='recurrence')return qaJson_({ok:true,created:qaRecurrence_(),businessNow:nowIso(),executedAt:new Date().toISOString()});
    if(['manager','leadership'].includes(p.action))return qaJson_(qaReserveNotifications_(p.action));
    if(p.action==='claim')return qaJson_(qaClaimNotification_(p.key));
    if(p.action==='receipt')return qaJson_(qaReceipt_(p));
    if(p.action==='evidence')return qaJson_(qaEvidence_());
    throw Error('Unknown automation action');
  }catch(e){return qaJson_({ok:false,error:e.message});}
}
function qaUserOperation_(p,actor){
  const s=readState(),now=nowIso(),manager=String(qaProps_().getProperty('QA_MANAGER')).toLowerCase();s.settings.managerIdentity=manager;
  if(p.operation==='tasks')return s.cycles.filter(c=>String(c.employeeEmail).toLowerCase()===actor&&c.status!=='Completed').map(c=>Object.assign(c,{businessNow:now,testMode:true}));
  if(p.operation==='identity')return {actor,businessNow:now,actualNow:new Date().toISOString(),sessionIdentity:Session.getActiveUser().getEmail()||'Not exposed in backend'};
  if(p.operation==='issues'){
    if(actor!==manager)throw Error('Authenticated manager required');
    return OpsEngine.dashboard(s,now).filter(c=>c.status==='Pending'||s.alerts.some(a=>a.cycleId===c.id)).map(c=>Object.assign(c,{alerted:s.alerts.some(a=>a.cycleId===c.id&&a.level==='manager'&&a.mode!=='DRY_RUN'&&a.state==='SENT'),testMode:true}));
  }
  if(['complete','acknowledge'].includes(p.operation))return locked(()=>{
    const current=readState(),businessNow=nowIso();current.settings.managerIdentity=manager;if(p.operation==='acknowledge'&&!current.alerts.some(a=>a.cycleId===p.cycleId&&a.level==='manager'&&a.mode!=='DRY_RUN'&&a.state==='SENT'))throw Error('Real QA manager alert required');
    const r=p.operation==='complete'?OpsEngine.complete(current,p.cycleId,p.proof,actor,businessNow):OpsEngine.acknowledge(current,p.cycleId,actor,businessNow);
    if(!r.duplicate){r.state.history[r.state.history.length-1].actualAt=new Date().toISOString();writeState(r.state);qaWriteHistoryMetadata_(r.state);}
    return {duplicate:r.duplicate,nextCycle:r.nextCycle||'',businessNow,actualAt:new Date().toISOString()};
  });
  if(p.operation==='recent')return s.cycles.filter(c=>String(c.employeeEmail).toLowerCase()===actor&&c.status==='Completed').slice(-4).map(c=>({id:c.id,proof:c.proofType==='ticket'?{ticketId:c.ticketId}:{report:c.report},completedAt:c.completedAt}));
  throw Error('Unknown user action');
}
function qaWriteHistoryMetadata_(s){
  const sh=qaSpreadsheet_().getSheetByName(NAMES.history);sh.getRange(1,8).setValue('Actual execution at');
  if(s.history.length)sh.getRange(2,8,s.history.length,1).setValues(s.history.map(h=>[h.actualAt||'']));
}
const QA_ALERT_EXTRA=['Transport','Reason','Actual reserved at','Actual claimed at','Actual sent at','Execution ID'];
function qaReadAlertMetadata_(s){
  const sh=qaSpreadsheet_().getSheetByName(NAMES.alerts);
  if(!s.alerts.length)return s;
  const rows=sh.getRange(2,12,s.alerts.length,QA_ALERT_EXTRA.length).getValues();
  s.alerts.forEach((a,i)=>Object.assign(a,{mode:rows[i][0],reason:rows[i][1],actualReservedAt:rows[i][2],actualClaimedAt:rows[i][3],actualSentAt:rows[i][4],executionId:rows[i][5]}));return s;
}
function qaReadStateMetadata_(s){qaReadAlertMetadata_(s);if(s.history.length){const rows=qaSpreadsheet_().getSheetByName(NAMES.history).getRange(2,8,s.history.length,1).getValues();s.history.forEach((h,i)=>h.actualAt=rows[i][0]);}return s;}
function qaWriteAlertMetadata_(s){const sh=qaSpreadsheet_().getSheetByName(NAMES.alerts);sh.getRange(1,12,1,QA_ALERT_EXTRA.length).setValues([QA_ALERT_EXTRA]);if(s.alerts.length)sh.getRange(2,12,s.alerts.length,QA_ALERT_EXTRA.length).setValues(s.alerts.map(a=>[a.mode||'',a.reason||'',a.actualReservedAt||'',a.actualClaimedAt||'',a.actualSentAt||'',a.executionId||'']));}
function qaPersist_(s){writeState(s);qaUpdateDemoStatus_(s);}
function qaMode_(s){const mode=String(s.settings.notificationMode||'DRY_RUN');if(!['DRY_RUN','MAILPIT','GMAIL_TEST'].includes(mode))throw Error('Invalid notification mode');return mode;}
function qaRecipient_(level,mode){
  if(mode==='MAILPIT')return level==='manager'?'manager@ops-demo.test':'leadership@ops-demo.test';
  if(mode==='GMAIL_TEST'){
    const p=qaProps_(),recipient=p.getProperty('QA_GMAIL_RECIPIENT');
    const allow=JSON.parse(p.getProperty('QA_EXTERNAL_ALLOWLIST')||'[]');
    if(!recipient||!allow.includes(recipient)||recipient!==p.getProperty('QA_MANAGER'))throw Error('Approved QA recipient required');
    return recipient;
  }
  return level==='manager'?'manager@ops-demo.test':'leadership@ops-demo.test';
}
function qaReserveNotifications_(level){return locked(()=>{
  let s=qaReadAlertMetadata_(readState());const mode=qaMode_(s),now=nowIso();
  // A dry-run row is never a delivery reservation for a real transport.
  const eligible=Object.assign({},s,{alerts:s.alerts.filter(a=>a.mode===mode)});
  const candidates=OpsEngine.alertCandidates(eligible,now,level);let reserved=0;
  for(const a of candidates){
    const key=mode+':'+a.key;if(s.alerts.some(x=>x.key===key))continue;
    s.alerts.push(Object.assign({},a,{key,recipient:qaRecipient_(level,mode),mode,at:now,state:mode==='DRY_RUN'?'DRY_RUN':'QUEUED',messageId:'',actualReservedAt:new Date().toISOString()}));reserved++;
  }
  qaPersist_(s);
  return {ok:true,reserved,mode,businessNow:now,executedAt:new Date().toISOString(),notifications:s.alerts.filter(a=>a.level===level&&a.mode===mode&&a.state==='QUEUED').map(qaMessage_)};
});}
function qaMessage_(a){return {key:a.key,cycleId:a.cycleId,level:a.level,mode:a.mode,recipient:a.recipient,subject:'[OPS QA] '+(a.level==='manager'?'Overdue task':'Leadership escalation')+' | '+a.cycleId,
  body:'TEST MODE — isolated QA environment\nEscalation level: '+a.level+'\nEmployee: '+a.employee+'\nTask: '+a.task+'\nCycle: '+a.cycleId+'\nDue (business time): '+a.dueAt+'\nEvaluation (business time): '+a.at+'\nReason: '+(a.reason||'Employee task pending after deadline')+'\nActual reservation time: '+a.actualReservedAt+'\n\nOpen the private QA Sheet → Ops Tasks → Manager review. Acknowledge the issue; employee completion remains independent.'};}
function qaClaimNotification_(key){return locked(()=>{
  const s=qaReadAlertMetadata_(readState()),a=s.alerts.find(x=>x.key===key);
  if(!a||a.state!=='QUEUED')return {ok:true,claimed:false};
  const c=s.cycles.find(x=>x.id===a.cycleId);
  if(qaMode_(s)!==a.mode||a.recipient!==qaRecipient_(a.level,a.mode))throw Error('Notification configuration changed');
  if(!c||(a.level==='manager'&&c.status==='Completed')||(a.level==='leadership'&&c.status==='Completed'&&c.acknowledgedAt)){
    a.state='CANCELLED';qaPersist_(s);return {ok:true,claimed:false};
  }
  a.state='SENDING';a.actualClaimedAt=new Date().toISOString();qaPersist_(s);
  // SMTP and MailApp cannot transact with Sheets. Persist before sending, and
  // never automatically retry a SENDING/UNKNOWN outcome.
  if(a.mode==='GMAIL_TEST'){
    try{const m=qaMessage_(a);MailApp.sendEmail({to:m.recipient,subject:m.subject,body:m.body});a.state='SENT';a.actualSentAt=new Date().toISOString();qaPersist_(s);}
    catch(e){a.state='UNKNOWN';qaPersist_(s);throw Error('Gmail send outcome uncertain; inspect inbox before any manual resend');}
    return {ok:true,claimed:false,gmailApiAccepted:true,key:a.key};
  }
  return Object.assign({ok:true,claimed:true},qaMessage_(a));
});}
function qaReceipt_(p){return locked(()=>{
  const s=qaReadAlertMetadata_(readState()),a=s.alerts.find(x=>x.key===p.key);
  if(!a)throw Error('Reservation not found');
  if(a.state==='SENT')return {ok:true,duplicate:true};
  if(a.state!=='SENDING')throw Error('Notification was not claimed');
  a.state=p.success===true?'SENT':'UNKNOWN';a.messageId=String(p.messageId||'');a.executionId=String(p.executionId||'');a.actualSentAt=p.success===true?new Date().toISOString():'';qaPersist_(s);return {ok:true,state:a.state};
});}
function qaEvidence_(){
  const s=qaReadAlertMetadata_(readState());return {ok:true,sourceDigest:typeof QA_SOURCE_DIGEST_==='undefined'?'unversioned':QA_SOURCE_DIGEST_,businessNow:nowIso(),executedAt:new Date().toISOString(),mode:qaMode_(s),cycles:s.cycles,history:s.history,alerts:s.alerts,dashboard:OpsEngine.dashboard(s,nowIso()),counts:{cycles:s.cycles.length,completed:s.cycles.filter(c=>c.status==='Completed').length,history:s.history.length,alerts:s.alerts.length}};
}
function qaSetSetting_(key,value){
  const sh=qaSpreadsheet_().getSheetByName(NAMES.settings),rows=sh.getDataRange().getValues(),i=rows.findIndex(r=>r[0]===key);
  sh.getRange(i<0?rows.length+1:i+1,1,1,2).setValues([[key,String(value)]]);
}
function qaSetClock_(when){return locked(()=>{
  if(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(Z|[+-]\d{2}:\d{2})$/.test(String(when))||!Number.isFinite(Date.parse(when)))throw Error('Enter an ISO business timestamp with timezone');
  qaProps_().setProperty('QA_BUSINESS_NOW',when);writeState(readState());qaUpdateDemoStatus_();return {businessNow:when,actualNow:new Date().toISOString()};
});}
function qaSetMode_(mode){return locked(()=>{if(!['DRY_RUN','MAILPIT','GMAIL_TEST'].includes(mode))throw Error('Invalid mode');qaRecipient_('manager',mode);qaSetSetting_('notificationMode',mode);qaUpdateDemoStatus_();return {mode};});}
function qaReset_(startDay,holidays){return locked(()=>{
  if(!/^\d{4}-\d{2}-\d{2}$/.test(String(startDay)))throw Error('Valid start day required');
  const ss=qaSpreadsheet_();
  const tasks=ss.getSheetByName(NAMES.tasks);tasks.getRange(2,7,4,1).setNumberFormat('@').setValues(Array.from({length:4},()=>[startDay]));
  ['cycles','history','alerts'].forEach(k=>{const sh=ss.getSheetByName(NAMES[k]);if(sh.getLastRow()>1)sh.getRange(2,1,sh.getLastRow()-1,Math.max(TAB[k].length,sh.getLastColumn())).clearContent();});
  qaSetSetting_('holidays',JSON.stringify(holidays||[]));qaSetSetting_('notificationMode','MAILPIT');qaProps_().setProperty('QA_BUSINESS_NOW',startDay+'T16:00:00+05:30');
  const r=OpsEngine.recurrence(readState(),nowIso());qaPersist_(r.state);return {created:r.created,counts:qaEvidence_().counts};
});}
function qaUpdateDemoStatus_(state){
  const ss=qaSpreadsheet_(),sh=ss.getSheetByName('Demo_Control')||ss.insertSheet('Demo_Control');
  const rows=[['PRIVATE QA — TEST MODE','Business time is simulated; execution and capture times are real.'],['Business clock',nowIso()],['Actual execution time',new Date().toISOString()],['Notification mode',(state||readState()).settings.notificationMode||'DRY_RUN'],['Employee interface','Ops Tasks → My tasks → Submit completion'],['Manager interface','Ops Tasks → Manager review → Acknowledge alert'],['Authoritative updates','Use the sidebars. System-maintained tabs are protected.'],['Clock controls','Private administrator control panel; employee and manager sidebars remain in this Sheet.'],['Reset','Private administrator control panel → Reset QA; preserves other mail and the original workbook.']];
  sh.getRange(1,1,rows.length,2).setValues(rows);sh.getRange(1,1,1,2).setBackground('#fff2cc').setFontWeight('bold');sh.setColumnWidth(1,190);sh.setColumnWidth(2,700);sh.getRange(1,1,rows.length,2).setWrap(true);
}
