const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function sidebar(file, method, rows) {
  const html = fs.readFileSync(path.join(__dirname, '../../apps-script', file), 'utf8');
  const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  const elements = new Map();
  for (const id of ['status', file === 'Sidebar.html' ? 'tasks' : 'issues'])
    elements.set(id, { textContent: '', innerHTML: '', className: '' });
  const calls = [];
  let success;
  const run = {
    withSuccessHandler(fn) { success = fn; return this; },
    withFailureHandler() { return this; },
    myTasks() { assert.equal(method, 'myTasks'); success(rows); },
    managerIssues() { assert.equal(method, 'managerIssues'); success(rows); },
    submitCompletion(id, proof) { calls.push({ method: 'submitCompletion', id, proof }); success({ duplicate: false }); },
    managerAcknowledge(id) { calls.push({ method: 'managerAcknowledge', id }); success(); }
  };
  const context = vm.createContext({
    document: { getElementById: id => elements.get(id) || null },
    google: { script: { run } },
    setTimeout() {},
    alert(message) { throw Error(message); },
    Date
  });
  vm.runInContext(script, context);
  return { context, elements, calls };
}

test('Sheet employee sidebar submits a portal ticket once through the shared completion service', () => {
  const id = 'PORTAL7:2026-10-13';
  const h = sidebar('Sidebar.html', 'myTasks', [{ id, task: 'Portal Task A', dueAt: '2026-10-13T17:00:00+05:30', proofType: 'ticket' }]);
  assert.match(h.elements.get('tasks').innerHTML, /Ticket ID/);
  h.elements.set('ticket-' + id, { value: 'OPS-1234' });
  h.elements.set('msg-' + id, { textContent: '', className: '' });
  h.context.submit(id, { disabled: false });
  assert.equal(h.calls.length, 1);
  assert.equal(h.calls[0].method, 'submitCompletion');
  assert.equal(h.calls[0].id, id);
  assert.equal(h.calls[0].proof.ticketId, 'OPS-1234');
  assert.equal(h.elements.get('msg-' + id).textContent, 'Completed and recorded');
});

test('Sheet employee sidebar submits a daily report without a ticket', () => {
  const id = 'DAILY:2026-10-13';
  const h = sidebar('Sidebar.html', 'myTasks', [{ id, task: 'Daily Operations Update', dueAt: '2026-10-13T17:00:00+05:30', proofType: 'report' }]);
  assert.match(h.elements.get('tasks').innerHTML, /Work completed today/);
  for (const [field, value] of Object.entries({ completed: 'Finished operations review', pending: 'None', count: '0', blockers: 'None', remarks: '' }))
    h.elements.set(field + '-' + id, { value });
  h.elements.set('msg-' + id, { textContent: '', className: '' });
  h.context.submit(id, { disabled: false });
  assert.equal(h.calls.length, 1);
  assert.equal(h.calls[0].proof.report.completed, 'Finished operations review');
  assert.equal(h.calls[0].proof.report.pendingCount, '0');
  assert.equal(h.calls[0].proof.ticketId, undefined);
});

test('Sheet manager sidebar acknowledges an alert through the shared manager service', () => {
  const id = 'PORTAL7:2026-10-13';
  const h = sidebar('ManagerSidebar.html', 'managerIssues', [{ id, task: 'Portal Task A', employee: 'Employee B', dueAt: '2026-10-13T17:00:00+05:30', escalationAt: '2026-10-14T14:00:00+05:30', status: 'Pending', overdueMinutes: 30, ticketId: '', report: null, alerted: true, acknowledgedAt: '' }]);
  assert.match(h.elements.get('issues').innerHTML, /Acknowledge alert/);
  h.context.ack(id);
  assert.equal(h.calls.length, 1);
  assert.deepEqual(h.calls[0], { method: 'managerAcknowledge', id });
});
