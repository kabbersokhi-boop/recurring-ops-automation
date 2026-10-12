const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const E=require('../../apps-script/TaskManager.gs');
const source=fs.readFileSync(require('node:path').join(__dirname,'../../apps-script/Code.gs'),'utf8');

function harness(failSend=false){
  const initial=E.recurrence({tasks:[{id:'P7',name:'Portal Task A',employee:'Employee B',email:'b@example.invalid',frequency:7,startDay:'2026-10-09',proofType:'ticket',active:true}],cycles:[],history:[],alerts:[],settings:{timezone:'+05:30',managerEmail:'manager@test.example',leadershipEmail:'leader@test.example',holidays:[],dryRun:false,managerDelayMinutes:15}},'2026-10-09T09:00:00+05:30').state;
  const tables={
    Task_Master:[['Task ID','Task name','Description','Employee','Employee email','Frequency','Start day','Due time','Proof type','Active'],['P7','Portal Task A','','Employee B','b@example.invalid',7,'2026-10-09','17:00','ticket',true]],
    Employee_Queue:[Array(17).fill(''),...initial.cycles.map(c=>[c.id,c.taskId,c.task,c.employee,c.employeeEmail,c.proofType,c.dueDay,c.dueAt,c.status,'','','','','','','',''])],
    Task_History:[Array(7).fill('')],Alert_Log:[Array(11).fill('')],Manager_Dashboard:[Array(14).fill('')],
    Settings:[['Key','Value'],['timezone','+05:30'],['managerEmail','manager@test.example'],['leadershipEmail','leader@test.example'],['holidays','[]'],['dryRun','false'],['managerDelayMinutes','15']]
  };
  const clock={now:'2026-10-09T11:45:00Z'},sent=[];
  class FakeDate extends Date {constructor(...args){super(...(args.length?args:[clock.now]));}static now(){return Date.parse(clock.now);}}
  const sheets=Object.fromEntries(Object.entries(tables).map(([name,rows])=>[name,{
    getLastRow(){for(let i=rows.length-1;i>=0;i--)if(rows[i].some(v=>v!==''&&v!==null))return i+1;return 0;},
    getRange(r,c,n,m){return {getValues(){return Array.from({length:n},(_,i)=>Array.from({length:m},(_,j)=>rows[r-1+i]?.[c-1+j]??''));},setValues(values){for(let i=0;i<n;i++){rows[r-1+i]??=[];for(let j=0;j<m;j++)rows[r-1+i][c-1+j]=values[i][j];}}};}
  }]));
  let locked=false;
  const context=vm.createContext({OpsEngine:E,Date:FakeDate,Utilities:{formatDate(value){return new Date(value.getTime()+330*60000).toISOString().slice(0,10);}},SpreadsheetApp:{getActive:()=>({getSheetByName:n=>sheets[n]}),flush(){}},LockService:{getDocumentLock:()=>({tryLock(){if(locked)return false;locked=true;return true;},releaseLock(){locked=false;}})},MailApp:{sendEmail(msg){if(failSend)throw Error('Simulated transport uncertainty');sent.push(msg);}}});
  vm.runInContext(source,context);
  return {context,clock,sent,tables};
}
test('Apps Script manager and leadership actions send one grouped email each and log stable keys',()=>{
  const h=harness();assert.equal(h.context.managerAlertsNow(),1);assert.equal(h.sent.length,1);assert.equal(h.context.managerAlertsNow(),0);assert.equal(h.sent.length,1);
  h.clock.now='2026-10-12T08:30:00Z';assert.equal(h.context.leadershipNow(),1);assert.equal(h.sent.length,2);assert.equal(h.context.leadershipNow(),0);assert.equal(h.tables.Alert_Log.length,3);
});
test('Apps Script uncertain delivery stays reserved and is not resent',()=>{
  const h=harness(true);assert.throws(()=>h.context.managerAlertsNow(),/Simulated transport uncertainty/);assert.equal(h.tables.Alert_Log[1][8],'UNKNOWN');assert.equal(h.context.managerAlertsNow(),0);
});
test('Apps Script document lock rejects overlapping state transitions',()=>{
  const h=harness();assert.throws(()=>h.context.locked(()=>h.context.locked(()=>true)),/System busy/);assert.equal(h.context.locked(()=>42),42);
});
test('Apps Script normalizes date-formatted Sheet cells to Kolkata task days',()=>{
  const h=harness();const date=new h.context.Date('2026-10-08T18:30:00.000Z');
  h.tables.Task_Master[1][6]=date;h.tables.Employee_Queue[1][6]=date;
  const state=h.context.readState();assert.equal(state.tasks[0].startDay,'2026-10-09');assert.equal(state.cycles[0].dueDay,'2026-10-09');
  assert.equal(h.context.recurrenceNow(),0);
});
