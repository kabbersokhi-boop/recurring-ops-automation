// Public exports contain placeholders. Configure the private URL and credentials
// only in the QA workflows inside your existing n8n installation.
const fs=require('node:fs');
const specs=[['qa-recurrence','recurrence','0 9-23 * * 1-5'],['qa-manager-alerts','manager','*/15 * * * 1-5'],['qa-leadership-escalation','leadership','*/15 14-23 * * 1-5']];
fs.mkdirSync('n8n-workflows/qa',{recursive:true});
for(const [file,action,cron] of specs){
 const endpoint='={{ $env.OPS_QA_WEB_APP_URL }}';
 const auth={httpCustomAuth:{id:'REPLACE_QA_HTTP_CREDENTIAL_ID',name:'Recurring Ops QA | isolated script token'}};
 const nodes=[],connections={};
 const add=(name,type,parameters,x,y,extra={})=>nodes.push({id:name.toLowerCase().replace(/ /g,'-'),name,type,typeVersion:type.endsWith('httpRequest')?4.2:type.endsWith('code')?2:type.endsWith('if')?2.2:type.endsWith('emailSend')?2.1:type.endsWith('scheduleTrigger')?1.2:1,position:[x,y],parameters,...extra});
 const connect=(from,to,index=0)=>{const c=connections[from]||(connections[from]={main:[]});c.main[index]=[{node:to,type:'main',index:0}];};
 const http=(name,body,x)=>add(name,'n8n-nodes-base.httpRequest',{method:'POST',url:endpoint,authentication:'genericCredentialType',genericAuthType:'httpCustomAuth',sendBody:true,specifyBody:'json',jsonBody:body,options:{timeout:60000}},x,300,{credentials:auth,retryOnFail:false});
 add('Run QA scenario','n8n-nodes-base.manualTrigger',{},0,180);
 add('QA schedule','n8n-nodes-base.scheduleTrigger',{rule:{interval:[{field:'cronExpression',expression:cron}]}},0,420);
 http('Evaluate business state',JSON.stringify({action}),220);
 connect('Run QA scenario','Evaluate business state');connect('QA schedule','Evaluate business state');
 if(action==='recurrence'){
  add('Verify recurrence result','n8n-nodes-base.code',{jsCode:"if ($json.ok !== true) throw new Error($json.error||'QA recurrence rejected'); return $input.all();"},440,300);
  connect('Evaluate business state','Verify recurrence result');
 }
 if(action!=='recurrence'){
  add('Pending notifications','n8n-nodes-base.code',{jsCode:"if ($json.ok !== true) throw new Error($json.error||'QA evaluation rejected'); return ($json.notifications||[]).map(n=>({json:n}));"},440,300);
  http('Claim once',"={{ JSON.stringify({action:'claim',key:$json.key}) }}",660);
  add('Verify claim result','n8n-nodes-base.code',{jsCode:"for (const item of $input.all()) if (item.json.ok !== true) throw new Error(item.json.error||'QA claim rejected'); return $input.all();"},770,300);
  add('Mailpit claim accepted','n8n-nodes-base.if',{conditions:{options:{caseSensitive:true,typeValidation:'strict',version:2},conditions:[{id:'claimed',leftValue:'={{ $json.claimed }}',rightValue:true,operator:{type:'boolean',operation:'true',singleValue:true}}],combinator:'and'},options:{}},880,300);
  add('Capture through existing Mailpit','n8n-nodes-base.emailSend',{fromEmail:'ops-qa@ops-demo.test',toEmail:'={{ $json.recipient }}',subject:'={{ $json.subject }}',emailFormat:'text',text:'={{ $json.body }}',options:{appendAttribution:false}},1100,300,{credentials:{smtp:{id:'REPLACE_QA_MAILPIT_CREDENTIAL_ID',name:'Recurring Ops QA | existing Mailpit SMTP'}},retryOnFail:false,onError:'continueRegularOutput'});
  http('Record transport outcome',"={{ JSON.stringify({action:'receipt',key:$('Claim once').item.json.key,success:!$json.error,messageId:$json.messageId||'',executionId:$execution.id}) }}",1320);
  add('Verify recorded outcome','n8n-nodes-base.code',{jsCode:"for (const item of $input.all()) { if (item.json.ok !== true) throw new Error(item.json.error||'QA receipt rejected'); if (item.json.state === 'UNKNOWN') throw new Error('Delivery outcome uncertain; reconcile captured messages before any resend'); } return $input.all();"},1540,300);
  connect('Evaluate business state','Pending notifications');connect('Pending notifications','Claim once');connect('Claim once','Verify claim result');connect('Verify claim result','Mailpit claim accepted');connect('Mailpit claim accepted','Capture through existing Mailpit');connect('Capture through existing Mailpit','Record transport outcome');connect('Record transport outcome','Verify recorded outcome');
 }
 fs.writeFileSync('n8n-workflows/qa/'+file+'.json',JSON.stringify({id:'ops-qa-'+action,name:'Recurring Ops QA | '+action,active:false,nodes,connections,settings:{timezone:'Asia/Kolkata',executionOrder:'v1',saveDataSuccessExecution:'all',saveDataErrorExecution:'all',saveManualExecutions:true},pinData:{},tags:[]},null,2)+'\n');
}
