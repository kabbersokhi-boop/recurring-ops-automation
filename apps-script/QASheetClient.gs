/* Shared bound project: no automation token, MailApp, state writes or admin RPC.
 * Install with Sidebar.html, ManagerSidebar.html and appsscript.qa-client.json. */
function onOpen(){SpreadsheetApp.getUi().createMenu('Ops Tasks').addItem('My tasks','showSidebar').addItem('Manager review','showManagerSidebar').addItem('Verify my identity','showIdentity').addToUi();}
function showSidebar(){SpreadsheetApp.getUi().showSidebar(HtmlService.createHtmlOutputFromFile('Sidebar').setTitle('My tasks'));}
function showManagerSidebar(){qaCall_('issues');SpreadsheetApp.getUi().showSidebar(HtmlService.createHtmlOutputFromFile('ManagerSidebar').setTitle('Manager review'));}
function showIdentity(){const r=qaCall_('identity');SpreadsheetApp.getUi().alert('Verified Google identity: '+r.actor+'\nBusiness time: '+r.businessNow+'\nActual execution time: '+r.actualNow);}
function myTasks(){return qaCall_('tasks');}
function myRecentCompletions(){return qaCall_('recent');}
function submitCompletion(cycleId,proof){return qaCall_('complete',{cycleId,proof});}
function managerIssues(){return qaCall_('issues');}
function managerAcknowledge(cycleId){return qaCall_('acknowledge',{cycleId});}
function qaCall_(operation,args){
  const url=PropertiesService.getScriptProperties().getProperty('QA_BACKEND_URL');
  if(!/^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec$/.test(String(url)))throw Error('QA backend endpoint is not configured');
  const token=ScriptApp.getIdentityToken();if(!token)throw Error('Authorize this Sheet script with your own Google account first');
  const r=UrlFetchApp.fetch(url,{method:'post',contentType:'application/json',payload:JSON.stringify(Object.assign({action:'user',operation,idToken:token},args||{})),muteHttpExceptions:true});
  let data;try{data=JSON.parse(r.getContentText());}catch(e){throw Error('QA backend unavailable: expected JSON (HTTP '+r.getResponseCode()+')');}
  if(!data.ok)throw Error(data.error||'QA action rejected');return data.result;
}
