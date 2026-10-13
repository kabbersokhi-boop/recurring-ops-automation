# Executed acceptance results

**Integrated assignment cases: 8 PASS / 0 FAIL / 0 BLOCKED.**
**Local regression: 22 PASS / 0 FAIL** (the original 19 plus three QA role checks).
Executed on 2026-10-12/13 UTC against the private QA system. Business time is
simulated; Google authentication, Apps Script calls, n8n runs, SMTP captures and
receiving Gmail Inbox observations are real. The original prototype is preserved.

| ID | Scenario | Expected | Actual result | Evidence |
| --- | --- | --- | --- | --- |
| 1 | Recurring cycle | Completed cycle, one history event, correct next due, repeat adds nothing | PASS: authenticated portal run created Oct 20 next cycle. Final distinct-role run created B Oct 22, C Oct 30 and D Nov 16, using completion + 7/15/30 days and weekend roll-forward | [Authenticated ticket](../docs/evidence/qa/ticket-completed.json), [role final records](../docs/evidence/qa/role-final-state.json) |
| 2 | Single-point completion | One Ticket ID submission updates all records | PASS: actual employee Sheet sidebar saved proof, verified actor, business/actual times, one event and linked next cycle automatically | [Next-cycle UI](../docs/screenshots/qa/next-seven-day-cycle.png), [ticket replay](../docs/evidence/qa/replay-portal.json) |
| 3 | Daily task without ticket | Meaningful structured report closes daily cycle | PASS: owner as Employee A submitted completed work, pending work/count and blockers through My tasks. Repeat added no event | [Authenticated daily UI](../docs/screenshots/qa/authenticated-daily-completion.png), [records](../docs/evidence/qa/role-employee-a-confirmed.json), [repeat](../docs/evidence/qa/role-employee-a-repeat.json) |
| 4 | Same-day manager alert | Real workflow, correct Mailpit messages, separate real Gmail arrival | PASS: Oct 15 business 17:15 manager workflow captured C/D messages. Prior limited Gmail run sent two Oct 13 notifications; both independently observed in the receiving Inbox | [Actual workflow runs](../docs/evidence/qa/role-workflow-results.json), [actual captures/timestamps](../docs/evidence/qa/role-mailpit-captures.json), [Gmail Inbox verification](../docs/evidence/qa/gmail-inbox-verification.json) |
| 5 | Manager acknowledgement | Manager's own identity/time; employee Pending until separate resolution | PASS: separate signed-in manager acknowledged C; exactly one Acknowledged event. C remained Pending, then administrator explicitly simulated C completion; dashboard shows proof, next cycle and preserved acknowledgement | [Pending after acknowledgement](../docs/evidence/qa/role-manager-ack-confirmed.json), [signed acknowledgement UI](../docs/screenshots/qa/manager-signed-ack.png), [later resolution UI](../docs/screenshots/qa/manager-later-resolution.png) |
| 6 | Leadership escalation | Unresolved case escalates at threshold | PASS: Oct 16 business 14:00 workflow captured one D message; acknowledged and completed C was excluded | [State](../docs/evidence/qa/role-leadership-alerted.json), [actual capture](../docs/evidence/qa/role-mailpit-captures.json) |
| 7 | SLA timing | No early alert; correct manager/review/leadership thresholds and calendar rules | PASS: manager 17:10→0, 17:15→2; acknowledgement target next working day 10:00; leadership 10:00→0, 14:00→1. Earlier live Friday + Monday holiday scenario rolled targets to Tuesday and skipped nonworking-day recurrence | [Role runs](../docs/evidence/qa/role-workflow-results.json), [calendar dashboard](../docs/evidence/qa/calendar-manager-concurrent.json), [calendar results](../docs/evidence/qa/workflow-results.json) |
| 8 | No duplicates | Repeated/overlapping calls create no extra state or notifications | PASS: daily and dummy B repeats unchanged; manager repeat→0, leadership repeat→0, next-day recurrence→1 then repeat→0. Two overlapping real dummy-D simulation executions created exactly one completion and one next cycle. Earlier overlapping n8n manager/recurrence runs also passed | [B replay](../docs/evidence/qa/role-dummy-b-repeat.json), [workflow results](../docs/evidence/qa/role-workflow-results.json), [overlap counts](../docs/evidence/qa/overlapping-dummy-completion.json), [Apps Script executions](../docs/screenshots/qa/overlapping-dummy-completion-executions.png) |

## Preconditions and executed role scenario

Private protected QA Sheet, four distinct employee IDs and task assignments,
owner-only backend version 11, shared least-privileged Sheet client, independent
manual QA n8n workflows and existing private Mailpit. Final assignments are
EMP-A: real owner / Daily; EMP-B: dummy / 7-day; EMP-C: dummy / 15-day;
EMP-D: dummy / 30-day. Manager uses a separate verified Google account.

1. Reset only QA to business Oct 15 16:00, MAILPIT: **4 cycles / 0 completed /
   0 history / 0 alerts**. Start dates and identities were verified.
2. Employee A completed a meaningful daily report from My tasks. Backend
   verified the Google ID token. Counts **4 / 1 / 1 / 0**; replay unchanged.
3. Administrator's blank dummy-B Ticket ID was rejected without mutation.
   Valid `QA-EMP-B-001` closed B and created Oct 22: **5 / 2 / 2 / 0**.
   Replay unchanged. Actor is `SIMULATED:EMP-B`, mode `SIMULATED`, with actual
   administrator initiator and execution time. It is not a dummy Google login.
4. Real n8n manager run at 17:10 reserved 0. At 17:15 reserved 2 and sent actual
   SMTP messages for C/D: **5 / 2 / 2 / 2**. Capture times:
   `2026-10-13T11:01:06.591Z` and `2026-10-13T11:01:06.657Z`.
5. Separate manager opened Manager review and clicked C's Acknowledge.
   Actual acknowledgement event time `2026-10-13T11:03:26.042Z`; business time
   Oct 15 17:15. Counts **5 / 2 / 3 / 2**; C still Pending. Google-signed
   identity was verified, not supplied as a request actor.
6. Administrator completed dummy C with `QA-EMP-C-001`: **6 / 3 / 4 / 2**.
   Manager inspected C Completed, explicit SIMULATED actor, proof, Oct 30 next
   cycle and the original manager acknowledgement. Manager repeat reserved 0.
7. At acknowledgement deadline Oct 16 10:00, leadership reserved 0. At 14:00
   reserved D only: **6 / 3 / 4 / 3**. Real SMTP capture timestamp
   `2026-10-13T11:31:03.871Z`. Leadership repeat reserved 0.
8. Double-clicked dummy D completion: two actual Apps Script executions started
   Oct 13 17:06:08 Asia/Kolkata, lasting 7.79 / 5.72 seconds. Both completed;
   second response `duplicate:true`. State **7 / 4 / 5 / 3**, one D completion
   event, one next cycle Nov 16 (Nov 15 is Sunday). This proves overlapping
   simulation calls through the shared engine/lock, not two employee logins.
9. Actual next-day recurrence created Daily Oct 16 once; repeat created 0.
   Readback **8 / 4 / 5 / 3**, unique cycle IDs and alert keys.
10. During the genuine screen review, Employee A completed Daily Oct 16 through
    the normal authenticated sidebar. Final counts **8 / 5 / 6 / 3**; one new
    Completed event, valid work/pending/count/blockers, actual time
    `2026-10-13T11:54:39.211Z`. Optional remarks were not submitted.
    [Actual review action](../docs/evidence/qa/review-daily-completed.json).

Public actors are placeholders; original private audit records retain actual
Google identities. Earlier authenticated portal evidence temporarily mapped
portal tasks to the owner. That temporary test is distinguished from final
B/C/D simulations. No final assignment maps all employees to one account.

## Gmail receiving verification

Only two approved external messages were sent, to the separate test manager.
The receiving account's dedicated Firefox window was inspected with a QA-only
subject search; both matching messages carried the Inbox label and displayed
10:09 AM. Portal15 body was independently inspected; Portal30 body comes from
its genuine user-provided Inbox screenshot and its live search result was
independently confirmed. [Sanitized screenshots and scope](../docs/evidence/qa/gmail-inbox-verification.json).
Mailpit capture is reported separately and is never called Gmail delivery.

## Calendar, failure and authorization checks

- Actual overlapping manager runs reserved 4 / 0; overlapping recurrence runs
  created 1 / 0 in the Friday/Monday-holiday scenario. Tuesday 13:59 leadership
  0; 14:00 leadership 4; repeat 0. [Actual earlier runs](../docs/evidence/qa/workflow-results.json).
- DRY_RUN then MAILPIT on identical Oct 16 cycles reserved 4 in each mode;
  dry-run rows did not suppress four genuine captures. SMTP failure probe
  produced one expected n8n error, four UNKNOWN rows, blank sent timestamps
  and no leadership captures. Repeat did not attempt SMTP. Exact prior state
  and accepted Gmail keys were restored. [Transport checks](../docs/evidence/qa/transport-reliability-runs.json).
- Authenticated employee Manager review was rejected live. Invalid automation
  token and unauthenticated completion were rejected without mutation. Automation
  token cannot simulate completions or change the clock. The actual manager
  My tasks view contained no employee completion controls. [Negative calls](../docs/evidence/qa/role-denied-actions.json), [earlier authorization](../docs/evidence/qa/authorization-negative-checks.json).
- Future cycle submission was rejected live without self-link or state change;
  the client labels Upcoming and disables its button. [Actual guard](../docs/evidence/qa/future-cycle-rejection.json).

Known QA defects were fixed and rerun: snapshot gzip type, Sheet time-cell
normalization, future-cycle guard, multi-account sidebar identity selection and
clock shortcut selecting a future instead of unresolved cycle. A GUI form
attempt landed in the QA grid during an interrupted run; only QA was reset and
all final role checks rerun from clean state. No original records or unrelated
services were modified. No workflows ran at the accidentally selected future
clock before it was corrected.

## Local command and limits

```bash
node --test tests/automated/*.test.cjs
```

22/22 passed. These do not substitute for the integrated evidence above.
Two distinct authenticated employees submitting simultaneously remain unverified;
additional employee-account access is optional. SMTP success followed by a crash
before receipt is not exactly-once guaranteed. See [verified limits](../docs/limitations.md).

## Executed evidence totals

Eight assignment cases PASS. Scoped n8n execution history contains **39 successful
executions and one expected refused-SMTP error**. That deliberate error is an
additional passed failure-handling check, not a successful delivery. Current
project Mailpit captures: **8 manager + 3 leadership** across preserved distinct
scenarios; final Oct 15 role scenario contributes **2 manager + 1 leadership**.
Actual external Gmail messages: **2**, both observed in the receiving Inbox.
No further external send was performed during the screen review.

Final review readback: **8 cycles / 5 completed / 6 history events / 3 alerts**.
The additional daily replay and actual n8n manager repeat changed none of them.
[Replay comparison](../docs/evidence/qa/review-daily-replay.json),
[actual manager repeat](../docs/evidence/qa/review-manager-repeat.json).
