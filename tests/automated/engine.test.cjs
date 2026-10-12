const {test} = require('node:test');
const assert = require('node:assert/strict');
const E = require('../../apps-script/TaskManager.gs');
const at = (d,t='09:00') => d+'T'+t+':00+05:30';
function fixture() {return {tasks:[
  {id:'DAILY',name:'Daily Operations Update',employee:'Employee A',email:'a@example.invalid',frequency:'daily',startDay:'2026-10-09',proofType:'report',active:true},
  {id:'P7',name:'Portal Task A',employee:'Employee B',email:'b@example.invalid',frequency:7,startDay:'2026-10-09',proofType:'ticket',active:true},
  {id:'P15',name:'Portal Task B',employee:'Employee C',email:'c@example.invalid',frequency:15,startDay:'2026-10-09',proofType:'ticket',active:true},
  {id:'P30',name:'Portal Task C',employee:'Employee D',email:'d@example.invalid',frequency:30,startDay:'2026-10-09',proofType:'ticket',active:true}
],cycles:[],history:[],alerts:[],settings:{timezone:'+05:30',holidays:['2026-10-12'],managerEmail:'manager@example.invalid',leadershipEmail:'leader@example.invalid',dryRun:true}};}
const generated = () => E.recurrence(fixture(),at('2026-10-09')).state;
test('1 recurrence: completion creates next linked 7-day cycle, weekend rolls forward',()=>{
  const s=generated(),r=E.complete(s,'P7:2026-10-09',{ticketId:'OPS-123'},'b@example.invalid',at('2026-10-09','16:00'));
  assert.equal(r.nextCycle,'P7:2026-10-16');assert.equal(r.state.cycles.find(c=>c.id===r.nextCycle).previousCycle,'P7:2026-10-09');
  const p=E.complete(s,'P15:2026-10-09',{ticketId:'OPS-124'},'c@example.invalid',at('2026-10-09','16:00'));
  assert.equal(p.nextCycle,'P15:2026-10-26');
  const q=E.complete(s,'P30:2026-10-09',{ticketId:'OPS-125'},'d@example.invalid',at('2026-10-09','16:00'));
  assert.equal(q.nextCycle,'P30:2026-11-09');
});
test('2 one point ticket completion records proof, identity, time, history',()=>{
 const r=E.complete(generated(),'P7:2026-10-09',{ticketId:'OPS-123'},'b@example.invalid',at('2026-10-09','15:00'));
 const c=r.state.cycles.find(x=>x.id==='P7:2026-10-09');assert.equal(c.status,'Completed');assert.equal(c.ticketId,'OPS-123');assert.equal(c.completedBy,'b@example.invalid');assert.equal(r.state.history.length,1);
});
test('3 daily report is required, creates completion without ticket',()=>{
 const report={completed:'Completed the morning reconciliations',pending:'Two vendor replies',pendingCount:2,blockers:'None'};
 const r=E.complete(generated(),'DAILY:2026-10-09',{report},'a@example.invalid',at('2026-10-09','16:00'));
 assert.equal(r.state.history[0].report.pendingCount,2);assert.equal(r.state.cycles[0].ticketId,'');
});
test('4 manager alert at 17:15 same day',()=>{const s=generated();assert.equal(E.alertCandidates(s,at('2026-10-09','17:14'),'manager').length,0);assert.equal(E.alertCandidates(s,at('2026-10-09','17:15'),'manager').length,4);});
test('5 acknowledgement is separate from employee resolution',()=>{
 let s=generated();const a=E.alertCandidates(s,at('2026-10-09','17:15'),'manager')[0];s=E.reserveAlert(s,a,at('2026-10-09','17:15')).state;
 s=E.acknowledge(s,a.cycleId,'manager@example.invalid',at('2026-10-09','18:00')).state;
 const c=s.cycles.find(x=>x.id===a.cycleId);assert.equal(c.status,'Pending');assert.ok(c.acknowledgedAt);
});
test('6 leadership escalation for unresolved acknowledged or unacknowledged task',()=>{
 let s=generated();let a=E.alertCandidates(s,at('2026-10-09','17:15'),'manager')[0];s=E.reserveAlert(s,a,at('2026-10-09','17:15')).state;
 s=E.acknowledge(s,a.cycleId,'manager@example.invalid',at('2026-10-09','18:00')).state;
 const out=E.alertCandidates(s,at('2026-10-13','14:00'),'leadership');assert.equal(out.length,4);assert.equal(out.find(x=>x.cycleId===a.cycleId).acknowledged,true);
});
test('7 holiday and weekend defer next-workday escalation',()=>{const s=generated();assert.equal(E.afterWorking('2026-10-09',s.settings.holidays),'2026-10-13');assert.equal(E.alertCandidates(s,at('2026-10-13','13:59'),'leadership').length,0);assert.equal(E.alertCandidates(s,at('2026-10-13','14:00'),'leadership').length,4);});
test('manager acknowledgement target uses configured next working-day time',()=>{
 let s=generated();s.settings.acknowledgementTime='10:30';const a=E.alertCandidates(s,at('2026-10-09','17:15'),'manager')[0];s=E.reserveAlert(s,a,at('2026-10-09','17:15')).state;
 const before=E.dashboard(s,at('2026-10-13','10:29')).find(c=>c.id===a.cycleId);
 assert.equal(before.acknowledgementDueAt,at('2026-10-13','10:30'));assert.equal(before.acknowledgementLate,false);
 const atDeadline=E.dashboard(s,at('2026-10-13','10:30')).find(c=>c.id===a.cycleId);assert.equal(atDeadline.acknowledgementLate,true);
 s=E.acknowledge(s,a.cycleId,'manager@example.invalid',at('2026-10-13','10:31')).state;
 assert.equal(E.dashboard(s,at('2026-10-13','10:32')).find(c=>c.id===a.cycleId).acknowledgementLate,false);
});
test('8 duplicate cycles, completions and alerts are prevented',()=>{
 let s=generated();assert.equal(E.recurrence(s,at('2026-10-09')).created,0);
 let r=E.complete(s,'P7:2026-10-09',{ticketId:'OPS-123'},'b@example.invalid',at('2026-10-09','16:00'));s=r.state;
 r=E.complete(s,'P7:2026-10-09',{ticketId:'OPS-123'},'b@example.invalid',at('2026-10-09','16:01'));assert.equal(r.duplicate,true);assert.equal(r.state.history.length,1);
 const a=E.alertCandidates(s,at('2026-10-09','17:15'),'manager')[0];s=E.reserveAlert(s,a,at('2026-10-09','17:15')).state;
 assert.equal(E.reserveAlert(s,a,at('2026-10-09','17:16')).duplicate,true);assert.equal(E.alertCandidates(s,at('2026-10-09','17:16'),'manager').length,2);
 const l=E.alertCandidates(s,at('2026-10-13','14:00'),'leadership')[0];s=E.reserveAlert(s,l,at('2026-10-13','14:00')).state;assert.equal(E.reserveAlert(s,l,at('2026-10-13','14:01')).duplicate,true);
});
test('invalid proofs and wrong identity rejected',()=>{
 const s=generated();assert.throws(()=>E.complete(s,'P7:2026-10-09',{ticketId:''},'b@example.invalid',at('2026-10-09')),/Ticket ID/);
 assert.throws(()=>E.complete(s,'DAILY:2026-10-09',{report:{}},'a@example.invalid',at('2026-10-09')),/work completed/);
 assert.throws(()=>E.complete(s,'P7:2026-10-09',{ticketId:'OPS-123'},'a@example.invalid',at('2026-10-09')),/does not own/);
});
test('late completion, simultaneous tasks and daily independence',()=>{
 let s=generated();assert.equal(s.cycles.length,4);s=E.recurrence(s,at('2026-10-13')).state;assert.ok(s.cycles.some(c=>c.id==='DAILY:2026-10-13'));assert.ok(s.cycles.some(c=>c.id==='DAILY:2026-10-09'));
 const a=E.alertCandidates(s,at('2026-10-09','17:15'),'manager')[0];s=E.reserveAlert(s,a,at('2026-10-09','17:15')).state;
 const c=s.cycles.find(x=>x.id===a.cycleId);const proof=c.proofType==='ticket'?{ticketId:'OPS-999'}:{report:{completed:'Completed daily review',pending:'None',pendingCount:0,blockers:'None'}};
 s=E.complete(s,c.id,proof,c.employeeEmail,at('2026-10-13','11:00')).state;assert.equal(s.cycles.find(x=>x.id===c.id).status,'Completed');assert.equal(E.alertCandidates(s,at('2026-10-13','14:00'),'leadership').some(x=>x.cycleId===c.id),true);
 s=E.acknowledge(s,c.id,'manager@example.invalid',at('2026-10-13','12:00')).state;assert.equal(E.alertCandidates(s,at('2026-10-13','14:00'),'leadership').some(x=>x.cycleId===c.id),false);
});
test('reserved uncertain delivery is never blindly sent again',()=>{let s=generated();const a=E.alertCandidates(s,at('2026-10-09','17:15'),'manager')[0];s=E.reserveAlert(s,a,at('2026-10-09','17:15')).state;s.alerts[0].state='UNKNOWN';assert.equal(E.alertCandidates(s,at('2026-10-09','17:16'),'manager').some(x=>x.key===a.key),false);});
