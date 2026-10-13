# Executed acceptance results

Executed against the private integrated QA system on 2026-10-12/13 UTC.
Business dates are simulated; execution and SMTP capture timestamps are real.
The original prototype remains separate and unchanged.

**Assignment acceptance: 6 PASS, 2 BLOCKED, 0 FAIL.** Test 4 is blocked only on
independent Gmail inbox verification; its Mailpit subcase passed. Test 5 needs
an authenticated session for the approved second Google account. These results
are not a claim of complete end-to-end acceptance.

**Local regression: 19/19 PASS, 0 FAIL**, using the existing three test files.
No additional local test count is used as evidence for live acceptance.

| Test | Integrated result | Actual outcome | Evidence |
| --- | --- | --- | --- |
| 1 — Recurring cycle | PASS | Authenticated Sheet submission completed `PORTAL7:2026-10-13`; next cycle `PORTAL7:2026-10-20` created with correct link and due date; repeated submission added nothing | [Ticket state](../docs/evidence/qa/ticket-completed.json), [next cycle screenshot](../docs/screenshots/qa/next-seven-day-cycle.png) |
| 2 — Single-point completion | PASS | One Ticket ID entered once in My tasks; cycle, proof, business/actual timestamps, actor and exactly one history event persisted automatically | Same ticket readback; [retry state](../docs/evidence/qa/replay-portal.json) |
| 3 — Daily without ticket | PASS | Structured report with completed work, pending description/count 2 and blocker closed daily cycle with no ticket; repeat created no second event | [Report form](../docs/screenshots/qa/structured-daily-report.png), [completed state](../docs/evidence/qa/resumed-state.json), [daily replay](../docs/evidence/qa/replay-daily.json) |
| 4 — Same-day manager alert | BLOCKED | Real n8n run at business 17:15 captured two manager SMTP messages. Repeat added none. Separate GMAIL_TEST run recorded two successful MailApp sends; receiving inbox not yet independently inspected | [Manager state](../docs/evidence/qa/manager-captured.json), [Mailpit capture](../docs/screenshots/qa/manager-mailpit-capture.png), [captured messages](../docs/evidence/qa/mailpit-captures.json), [workflow results](../docs/evidence/qa/workflow-results.json) |
| 5 — Manager acknowledgement | BLOCKED | Employee attempting Manager review was rejected live. Actual manager login, acknowledgement identity/time and later employee resolution remain unexecuted | [Role rejection](../docs/screenshots/qa/employee-manager-rejected.png); second-account authorization required |
| 6 — Leadership escalation | PASS | Real leadership workflow captured two messages for unresolved PORTAL15/PORTAL30 cycles at next-working-day 14:00; correct unresolved-work reason; repeat added none | [Leadership state](../docs/evidence/qa/leadership-captured.json), [capture screenshot](../docs/screenshots/qa/leadership-mailpit-capture.png), [captured messages](../docs/evidence/qa/mailpit-captures.json) |
| 7 — SLA timing | PASS | No manager reservation at 17:10; at 17:15 reserved alerts. Review target 10:00; leadership none at 10:00 / 13:59 and present at 14:00. Friday deadline + Monday holiday rolled both targets to Tuesday; weekend/holiday recurrence produced none | [Workflow results](../docs/evidence/qa/workflow-results.json), [calendar dashboard](../docs/evidence/qa/calendar-manager-concurrent.json), [calendar final state](../docs/evidence/qa/calendar-final.json) |
| 8 — No duplicates | PASS | Ticket/daily replays left one event each. Manager and leadership repeats left exactly two captures each. Overlapping manager runs reserved 4 then 0; overlapping recurrence runs created 1 then 0 | [Replay screenshot](../docs/screenshots/qa/duplicate-completion-prevented.png), [workflow results](../docs/evidence/qa/workflow-results.json), [execution records](../docs/evidence/qa/n8n-executions.json) |

## Preconditions and executed steps

Private QA Sheet with four dummy employees and daily / 7 / 15 / 30-day tasks;
owner-only protected tabs; least-privileged Sheet client; owner-only standalone
backend; three isolated manual n8n workflows; existing private Mailpit SMTP.
Three tasks were mapped privately to the authenticated test employee. Manager
identity and the single approved external inbox were configured privately.

### Tests 1–3: employee

1. Opened the actual QA Sheet and **Ops Tasks → My tasks** as the test employee.
2. Submitted ticket `QA-PORTAL7-001` against the current 7-day cycle at business
   2026-10-13 16:00. Expected: Completed, one history event, next due Oct 20.
   Actual: exactly those records; actual history time `2026-10-12T23:14:05.250Z`.
3. Submitted the daily form: operations summary, reconciled 12 orders, three
   portal follow-ups; two pending supplier confirmations; delayed supplier
   response and follow-up time. Expected: valid report without ticket.
   Actual: Completed, one event; actual time `2026-10-12T23:16:19.585Z`.
4. Repeated both recorded submissions through the actual sidebar. Expected:
   duplicate response without mutation. Actual: counts remained 5 cycles,
   2 completed and 2 history events.

Personal actor addresses are replaced in public JSON. The backend used actual
verified Google ID tokens; no identity was fabricated or bypassed.

### Tests 4 and 6: notification transport

1. Set business time to 17:10 and executed the actual manager n8n workflow.
   Expected/actual: zero reservations and no mail.
2. Set 17:15, executed manager workflow. Expected/actual: two unresolved cycles,
   two locked claims, two SMTP captures and two SENT receipts.
3. Repeated manager workflow. Expected/actual: zero new reservations/captures.
4. Set next-working-day 10:00. Actual dashboard marked acknowledgement late;
   actual leadership workflow still reserved zero.
5. Set next-working-day 14:00 and executed leadership workflow. Expected/actual:
   two SMTP captures with correct cycle, due time and unresolved-work reason.
6. Repeated leadership workflow: zero additions. Filtered Mailpit counts are
   **2 manager + 2 leadership**; Mailpit's global `total` was not used as a
   recipient count. Actual capture timestamps are in the saved API readback.
7. Separately selected GMAIL_TEST and business manager threshold, ran manager
   workflow and repeated it. MailApp accepted two sends to the private allowlisted
   inbox; repeat reserved zero. **Inbox arrival is BLOCKED pending receiving-account
   access**, irrespective of SENT/API acceptance in the audit log.

### Tests 7–8: calendar and overlapping automation

1. Preserved the main scenario's exact state, then used the owner-only calendar
   control: Friday Oct 16 deadline, Monday Oct 19 holiday, DRY_RUN.
2. At Friday 17:10: manager workflow reserved 0. At 17:15, launched two actual
   n8n runs concurrently: reservations 4 and 0, exactly 4 dry-run log records.
3. Dashboard review/escalation targets were Tuesday Oct 20 at 10:00 / 14:00.
4. Saturday Oct 17 and Monday Oct 19: real leadership and recurrence workflows
   returned 0; no extra daily cycle.
5. Tuesday 13:59: leadership 0. At 14:00: leadership 4, repeat 0.
6. Launched overlapping recurrence runs: one created 1, the other 0. Daily cycles
   were Oct 16 and Oct 20 only; total cycles 5, dry-run alerts 8, unique IDs/keys.
7. Initial live restore exposed a missing gzip blob content type. Fixed and
   deployed backend version 6. Repeated restore successfully: cycles, history,
   alerts and business clock matched the preserved main scenario exactly.
   Historical actual times were preserved; existing Mailpit captures stayed 2+2.
   A subsequent visible dashboard check caught Google time-cell date coercion
   after restore. Version 7 normalizes time cells before the engine and during
   snapshot restoration; live readback again shows valid Oct 14 10:00/14:00 targets.
   Repeated preserve/change-clock/restore on version 7: all cycles, history,
   alerts, dashboard and business time matched exactly, including both Gmail
   acceptance records. [Actual verification](../docs/evidence/qa/deployment-verification.json).

Latest deployed endpoint negative checks also rejected invalid automation tokens
and unauthenticated completion, with cycles/history/alerts unchanged.
[Actual authorization evidence](../docs/evidence/qa/authorization-negative-checks.json).

The overlap evidence concerns workflow runs. Overlapping first-time employee
submissions and induced SMTP failures remain unverified. SMTP/Sheet exactly-once
limits are documented in [limitations](../docs/limitations.md).

## Local regression command

```bash
node --test tests/automated/engine.test.cjs tests/automated/apps-script.test.cjs tests/automated/sidebar.test.cjs
```

The final run passed all 19 existing tests. These tests cover the shared engine,
original Sheet adapter and sidebar behavior. They do not prove receiving-inbox
delivery or second-account Google authorization.
