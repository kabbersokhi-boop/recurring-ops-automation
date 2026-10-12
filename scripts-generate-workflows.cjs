const fs=require('node:fs');
const path=require('node:path');
const specs=[
 ['recurrence','Task recurrence','0 9-23 * * 1-5','recurrence'],
 ['manager-alerts','Manager overdue alerts','*/15 * * * 1-5','manager'],
 ['leadership-escalation','Leadership escalation','*/15 14-23 * * 1-5','leadership']
];
for(const [file,name,cron,action] of specs){
 const workflow={id:{recurrence:'b5f37b8e-3f98-4201-9000-a73c571c6131','manager-alerts':'c7a48932-71a0-463a-8e51-b52d7f573ac7','leadership-escalation':'5dde62e4-09a6-4e72-b38d-69b791809a04'}[file],name:'Recurring Ops | '+name,active:false,settings:{timezone:'Asia/Kolkata',executionOrder:'v1'},nodes:[
  {parameters:{rule:{interval:[{field:'cronExpression',expression:cron}]}},id:'schedule-'+action,name:'Schedule',type:'n8n-nodes-base.scheduleTrigger',typeVersion:1.2,position:[240,300]},
  {parameters:{method:'POST',url:'={{ $env.OPS_WEB_APP_URL }}',sendBody:true,specifyBody:'json',jsonBody:'={{ JSON.stringify({ action: "'+action+'", token: $env.OPS_SHARED_TOKEN }) }}',options:{timeout:30000}},id:'http-'+action,name:'Call Apps Script state engine',type:'n8n-nodes-base.httpRequest',typeVersion:4.2,position:[480,300]}
 ],connections:{Schedule:{main:[[{node:'Call Apps Script state engine',type:'main',index:0}]]}},pinData:{},tags:[]};
 fs.writeFileSync(path.join(__dirname,'n8n-workflows',file+'.json'),JSON.stringify(workflow,null,2)+'\n');
}
