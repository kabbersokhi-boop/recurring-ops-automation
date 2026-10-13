/* Shared bound project: no automation token, MailApp, state writes or admin RPC.
 * Install with Sidebar.html, ManagerSidebar.html and appsscript.qa-client.json. */
function onOpen(){SpreadsheetApp.getUi().createMenu('Ops Tasks').addItem('My tasks','showSidebar').addItem('Manager review','showManagerSidebar').addItem('Verify my identity','showIdentity').addToUi();}
function showSidebar(){const token=ScriptApp.getIdentityToken();qaCall_('identity',{},token);SpreadsheetApp.getUi().showSidebar(qaSidebarOutput_('Sidebar','My tasks',token));}
function showManagerSidebar(){const token=ScriptApp.getIdentityToken();qaCall_('issues',{},token);SpreadsheetApp.getUi().showSidebar(qaSidebarOutput_('ManagerSidebar','Manager review',token));}
function qaSidebarOutput_(file,title,token){
  // Google multi-login can change the account selected by google.script.run.
  // Preserve the Google-signed identity obtained by the actual Sheet menu.
  // This token stays in this private sidebar's memory: never a URL, property,
  // log, Sheet cell or public artifact. The backend validates it on every call.
  const html=HtmlService.createHtmlOutputFromFile(file).getContent();
  return HtmlService.createHtmlOutput(html.replace('</head>','<script>const qaSidebarIdentityToken='+JSON.stringify(token)+';</script></head>')).setTitle(title);
}
function showIdentity(){const r=qaCall_('identity');SpreadsheetApp.getUi().alert('Verified Google identity: '+r.actor+'\nBusiness time: '+r.businessNow+'\nActual execution time: '+r.actualNow);}
function myTasks(token){return qaCall_('tasks',{},token);}
function myRecentCompletions(token){return qaCall_('recent',{},token);}
function submitCompletion(cycleId,proof,token){return qaCall_('complete',{cycleId,proof},token);}
function managerIssues(token){return qaCall_('issues',{},token);}
function managerAcknowledge(cycleId,token){return qaCall_('acknowledge',{cycleId},token);}
function qaCall_(operation,args,identityToken){
  const url=PropertiesService.getScriptProperties().getProperty('QA_BACKEND_URL');
  if(!/^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec$/.test(String(url)))throw Error('QA backend endpoint is not configured');
  const token=identityToken||ScriptApp.getIdentityToken();if(!token)throw Error('Authorize this Sheet script with your own Google account first');
  const r=UrlFetchApp.fetch(url,{method:'post',contentType:'application/json',payload:JSON.stringify(Object.assign({action:'user',operation,idToken:token},args||{})),muteHttpExceptions:true});
  let data;try{data=JSON.parse(r.getContentText());}catch(e){throw Error('QA backend unavailable: expected JSON (HTTP '+r.getResponseCode()+')');}
  if(!data.ok)throw Error(data.error||'QA action rejected');return data.result;
}
