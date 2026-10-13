const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const E=require('../../apps-script/TaskManager.gs');

function harness(){
  const admin='owner@controlled.example',manager='manager@controlled.example';
  let actor=admin,now='2026-10-15T16:00:00+05:30',writes=0;
  let state=E.recurrence({tasks:[['DAILY','EMP-A','Employee A',admin,'daily','report'],['PORTAL7','EMP-B','Employee B','employee.b@example.invalid',7,'ticket'],['PORTAL15','EMP-C','Employee C','employee.c@example.invalid',15,'ticket'],['PORTAL30','EMP-D','Employee D','employee.d@example.invalid',30,'ticket']].map(([id,employeeId,employee,email,frequency,proofType])=>({id,employeeId,name:id,employee,email,frequency,proofType,startDay:'2026-10-15',active:true})),cycles:[],history:[],alerts:[],settings:{timezone:'+05:30'}},now).state;
  state.cycles.forEach(c=>c.employeeId=state.tasks.find(t=>t.id===c.taskId).employeeId);
  const context=vm.createContext({OpsEngine:E,Session:{getActiveUser:()=>({getEmail:()=>actor})}});
  for(const file of ['QA.gs','QABackend.gs'])vm.runInContext(fs.readFileSync(require('node:path').join(__dirname,'../../apps-script',file),'utf8'),context);
  Object.assign(context,{qaProps_:()=>({getProperty:k=>({QA_ADMIN:admin,QA_MANAGER:manager})[k]}),readState:()=>JSON.parse(JSON.stringify(state)),nowIso:()=>now,locked:fn=>fn(),qaPersist_:s=>{state=JSON.parse(JSON.stringify(s));writes++;}});
  return {context,admin,manager,get state(){return state;},get writes(){return writes;},actor:v=>actor=v,clock:v=>now=v};
}
test('QA B/C/D simulation uses shared recurrence and proof validation, records explicit simulated actors, and deduplicates',()=>{
  const h=harness();
  for(const [task,id,next] of [['PORTAL7','EMP-B','2026-10-22'],['PORTAL15','EMP-C','2026-10-30'],['PORTAL30','EMP-D','2026-11-16']]){
    const cycle=task+':2026-10-15';
    assert.throws(()=>h.context.qaAdminSimulateCompletion(cycle,{ticketId:''}),/valid Ticket ID/);
    const result=h.context.qaAdminSimulateCompletion(cycle,{ticketId:'QA-'+id+'-001'});
    assert.equal(result.nextCycle,task+':'+next);
    const c=h.state.cycles.find(c=>c.id===cycle),record=h.state.history.find(r=>r.cycleId===cycle);
    assert.equal(c.completedBy,'SIMULATED:'+id);assert.equal(record.actor,'SIMULATED:'+id);
    assert.equal(record.simulatedBy,h.admin);assert.equal(record.actionMode,'SIMULATED');assert.ok(record.actualAt);
    const writes=h.writes;assert.equal(h.context.qaAdminSimulateCompletion(cycle,{ticketId:'QA-'+id+'-001'}).duplicate,true);assert.equal(h.writes,writes);
  }
  assert.equal(h.state.cycles.length,7);assert.equal(h.state.history.length,3);
  assert.equal(h.state.cycles.find(c=>c.taskId==='DAILY').status,'Pending');
});
test('QA simulation rejects the manager, blank identity, Employee A and forged assignments; authenticated ownership still applies',()=>{
  const h=harness(),cycle='PORTAL7:2026-10-15';
  for(const actor of [h.manager,'']){h.actor(actor);assert.throws(()=>h.context.qaAdminSimulateCompletion(cycle,{ticketId:'QA-001'}),/administrator required/);}
  h.actor(h.admin);assert.throws(()=>h.context.qaAdminSimulateCompletion('DAILY:2026-10-15',{}),/Only configured dummy/);
  assert.throws(()=>E.complete(h.state,cycle,{ticketId:'QA-001'},h.admin,'2026-10-15T16:00:00+05:30'),/does not own/);
  assert.throws(()=>E.complete(h.state,cycle,{ticketId:'QA-001'},h.manager,'2026-10-15T16:00:00+05:30'),/does not own/);
  const mutated=h.state;mutated.cycles.find(c=>c.id===cycle).employeeEmail=h.admin;h.context.readState=()=>mutated;
  assert.throws(()=>h.context.qaAdminSimulateCompletion(cycle,{ticketId:'QA-001'}),/Only configured dummy/);assert.equal(h.writes,0);
});
test('QA clock follows the unresolved alerted cycle after another task recurs, and real test accounts cannot be simulated',()=>{
  const h=harness();h.context.qaAdminSimulateCompletion('PORTAL15:2026-10-15',{ticketId:'QA-C-001'});
  h.state.alerts.push({cycleId:'PORTAL30:2026-10-15',level:'manager',mode:'MAILPIT',state:'SENT'});
  h.context.qaSetClock_=when=>({businessNow:when});
  assert.equal(h.context.qaAdminClock('acknowledgement').businessNow,'2026-10-16T10:00:00+05:30');
  assert.equal(h.context.qaAdminClock('leadership').businessNow,'2026-10-16T14:00:00+05:30');
  h.state.tasks.find(t=>t.id==='PORTAL7').email='second.employee@controlled.example';
  assert.throws(()=>h.context.qaAdminSimulateCompletion('PORTAL7:2026-10-15',{ticketId:'QA-B-001'}),/Only configured dummy/);
});
