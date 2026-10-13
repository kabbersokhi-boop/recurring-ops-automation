/* Pure state engine. Also loaded by Node for the executable demonstration. */
var OpsEngine = (function () {
  const DAY = 86400000;
  const iso = d => new Date(d).toISOString().slice(0, 10);
  const addDays = (day, n) => iso(Date.parse(day + 'T12:00:00Z') + n * DAY);
  const weekday = day => new Date(day + 'T12:00:00Z').getUTCDay();
  const working = (day, holidays) => weekday(day) !== 0 && weekday(day) !== 6 && !(holidays || []).includes(day);
  const nextWorking = (day, holidays) => { let d = day; while (!working(d, holidays)) d = addDays(d, 1); return d; };
  const afterWorking = (day, holidays) => nextWorking(addDays(day, 1), holidays);
  const cycleId = (taskId, day) => taskId + ':' + day;
  const dueAt = (day, time, tz) => day + 'T' + (time || '17:00') + ':00' + (tz || '+05:30');
  const timeMs = value => Date.parse(value);
  const clone = value => JSON.parse(JSON.stringify(value));
  const defaults = { timezone: '+05:30', holidays: [], dueTime: '17:00', managerDelayMinutes: 15, acknowledgementTime: '10:00', escalationTime: '14:00', dryRun: true };
  function config(state) { return Object.assign({}, defaults, state.settings || {}); }
  function localDay(now, tz) {
    const shift = Number(tz.slice(1, 3)) * 60 + Number(tz.slice(4, 6));
    return iso(timeMs(now) + (tz[0] === '-' ? -shift : shift) * 60000);
  }
  function ensureCycle(state, task, day) {
    const id = cycleId(task.id, day);
    if (state.cycles.some(c => c.id === id)) return false;
    state.cycles.push({ id, taskId: task.id, task: task.name, employee: task.employee, employeeEmail: task.email,
      proofType: task.proofType, dueDay: day, dueAt: dueAt(day, task.dueTime || config(state).dueTime, config(state).timezone),
      status: 'Pending', ticketId: '', report: null, completedAt: '', completedBy: '', acknowledgedAt: '', acknowledgedBy: '',
      previousCycle: '', nextCycle: '' });
    return true;
  }
  function recurrence(input, now) {
    const state = clone(input), cfg = config(state), today = localDay(now, cfg.timezone);
    let created = 0;
    for (const task of state.tasks.filter(t => t.active !== false)) {
      if (task.frequency === 'daily') {
        for (let day = task.startDay; day <= today; day = addDays(day, 1)) if (working(day, cfg.holidays)) created += ensureCycle(state, task, day) ? 1 : 0;
      } else if ([7, 15, 30].includes(Number(task.frequency))) {
        if (task.startDay <= today && !state.cycles.some(c => c.taskId === task.id)) created += ensureCycle(state, task, nextWorking(task.startDay, cfg.holidays)) ? 1 : 0;
      }
    }
    return { state, created };
  }
  function complete(input, cycle, proof, actor, now) {
    const state = clone(input), cfg = config(state), c = state.cycles.find(x => x.id === cycle);
    if (!c) throw Error('Cycle not found');
    if (!actor || actor.toLowerCase() !== c.employeeEmail.toLowerCase()) throw Error('Authenticated employee does not own this task');
    if (c.status === 'Completed') return { state, duplicate: true };
    if (c.proofType === 'ticket') {
      const ticket = String(proof.ticketId || '').trim();
      if (!/^[A-Za-z0-9][A-Za-z0-9._-]{2,79}$/.test(ticket)) throw Error('Enter a valid Ticket ID (3–80 letters, numbers, dots, underscores or hyphens)');
      c.ticketId = ticket;
    } else {
      const report = proof.report || {};
      if (String(report.completed || '').trim().length < 10) throw Error('Describe work completed (at least 10 characters)');
      if (!Number.isInteger(Number(report.pendingCount)) || Number(report.pendingCount) < 0) throw Error('Enter a nonnegative pending count');
      if (!String(report.pending || '').trim()) throw Error('Describe pending work or enter None');
      if (!String(report.blockers || '').trim()) throw Error('Describe blockers or enter None');
      c.report = { completed: String(report.completed).trim(), pending: String(report.pending).trim(), pendingCount: Number(report.pendingCount), blockers: String(report.blockers).trim(), remarks: String(report.remarks || '').trim() };
    }
    c.status = 'Completed'; c.completedAt = now; c.completedBy = actor;
    const task = state.tasks.find(t => t.id === c.taskId);
    if (task.frequency !== 'daily') {
      const day = nextWorking(addDays(localDay(now, cfg.timezone), Number(task.frequency)), cfg.holidays);
      ensureCycle(state, task, day);
      c.nextCycle = cycleId(task.id, day);
      state.cycles.find(x => x.id === c.nextCycle).previousCycle = c.id;
    }
    state.history.push({ cycleId: c.id, event: 'Completed', at: now, actor, ticketId: c.ticketId, report: c.report, nextCycle: c.nextCycle });
    return { state, duplicate: false, nextCycle: c.nextCycle };
  }
  function acknowledge(input, cycle, actor, now) {
    const state = clone(input), c = state.cycles.find(x => x.id === cycle);
    if (!c) throw Error('Cycle not found');
    if (!actor || actor.toLowerCase() !== String(config(state).managerIdentity || config(state).managerEmail || '').toLowerCase()) throw Error('Authenticated manager required');
    if (c.acknowledgedAt) return { state, duplicate: true };
    if (!state.alerts.some(a => a.cycleId === cycle && a.level === 'manager')) throw Error('Manager alert required before acknowledgement');
    c.acknowledgedAt = now; c.acknowledgedBy = actor;
    state.history.push({ cycleId: cycle, event: 'Acknowledged', at: now, actor });
    return { state, duplicate: false };
  }
  function alertCandidates(state, now, level) {
    const cfg = config(state), current = timeMs(now), result = [];
    for (const c of state.cycles) {
      const managerAlertExists = state.alerts.some(a => a.cycleId === c.id && a.level === 'manager');
      if (c.status === 'Completed' && (level === 'manager' || c.acknowledgedAt || !managerAlertExists)) continue;
      if (level === 'manager' && current >= timeMs(c.dueAt) + cfg.managerDelayMinutes * 60000) {
        const key = 'manager:' + c.id;
        if (!state.alerts.some(a => a.key === key)) result.push({ key, cycleId: c.id, level, recipient: cfg.managerEmail, employee: c.employee, task: c.task, dueAt: c.dueAt });
      }
      if (level === 'leadership') {
        const day = afterWorking(c.dueDay, cfg.holidays);
        const threshold = dueAt(day, cfg.escalationTime, cfg.timezone);
        if (current >= timeMs(threshold)) {
          const key = 'leadership:' + c.id;
          if (!state.alerts.some(a => a.key === key)) result.push({ key, cycleId: c.id, level, recipient: cfg.leadershipEmail, employee: c.employee, task: c.task, dueAt: c.dueAt, acknowledged: !!c.acknowledgedAt, resolved: c.status === 'Completed', reason: c.status === 'Completed' ? 'Manager acknowledgement missing' : 'Employee task unresolved' });
        }
      }
    }
    return result;
  }
  function reserveAlert(input, alert, now) {
    const state = clone(input);
    if (state.alerts.some(a => a.key === alert.key)) return { state, duplicate: true };
    state.alerts.push(Object.assign({}, alert, { at: now, state: config(state).dryRun ? 'DRY_RUN' : 'UNKNOWN', messageId: '' }));
    return { state, duplicate: false };
  }
  function dashboard(state, now) {
    const cfg = config(state);
    return state.cycles.map(c => {
      const nextDay = afterWorking(c.dueDay, cfg.holidays);
      const acknowledgementDueAt = dueAt(nextDay, cfg.acknowledgementTime, cfg.timezone);
      const managerAlertExists = state.alerts.some(a => a.cycleId === c.id && a.level === 'manager');
      return Object.assign({}, c, {
        overdueMinutes: c.status === 'Completed' ? 0 : Math.max(0, Math.floor((timeMs(now) - timeMs(c.dueAt)) / 60000)),
        acknowledgementDueAt,
        acknowledgementLate: managerAlertExists && !c.acknowledgedAt && timeMs(now) >= timeMs(acknowledgementDueAt),
        escalationAt: dueAt(nextDay, cfg.escalationTime, cfg.timezone)
      });
    });
  }
  function reconcile(input) {
    const state = clone(input);
    for (const c of state.cycles) {
      if (c.completedAt && !state.history.some(h => h.cycleId === c.id && h.event === 'Completed'))
        state.history.push({ cycleId:c.id, event:'Completed', at:c.completedAt, actor:c.completedBy, ticketId:c.ticketId, report:c.report, nextCycle:c.nextCycle });
      if (c.acknowledgedAt && !state.history.some(h => h.cycleId === c.id && h.event === 'Acknowledged'))
        state.history.push({ cycleId:c.id, event:'Acknowledged', at:c.acknowledgedAt, actor:c.acknowledgedBy });
    }
    return state;
  }
  return { recurrence, complete, acknowledge, alertCandidates, reserveAlert, dashboard, reconcile, nextWorking, afterWorking, localDay, config };
})();
if (typeof module !== 'undefined') module.exports = OpsEngine;
