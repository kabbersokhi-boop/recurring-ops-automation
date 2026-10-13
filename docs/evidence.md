# Genuine integrated evidence

The QA evidence below comes from actual Sheet interactions, deployed Apps Script
POST/readbacks, real n8n executions and recipient-filtered Mailpit capture.
Business time is simulated; actual execution/capture timestamps are retained.
Screenshots record successive build phases; version 8 adds the Upcoming guard.
The duplicate receipt screenshot was refreshed after the live version 8 replay.
Private actor addresses are replaced in public JSON. Screenshots are genuine
crops excluding account columns, private browser URLs and unrelated UI; no
business result has been reconstructed.

| Evidence | What it establishes |
| --- | --- |
| [Ticket state](evidence/qa/ticket-completed.json) and [next-cycle sidebar](screenshots/qa/next-seven-day-cycle.png) | Actual portal completion, one history event and next 7-day cycle |
| [Daily form](screenshots/qa/structured-daily-report.png), [completed records](evidence/qa/resumed-state.json) | Meaningful report without ticket, authenticated completion and timestamps |
| [Portal replay](evidence/qa/replay-portal.json), [daily replay](evidence/qa/replay-daily.json), [receipt screenshot](screenshots/qa/duplicate-completion-prevented.png) | Actual repeated submissions produced no duplicate history/completion |
| [Authorization checks](evidence/qa/authorization-negative-checks.json) | Actual invalid-token / unauthenticated completion calls rejected; all protected records unchanged |
| [Employee manager-role rejection](screenshots/qa/employee-manager-rejected.png) | Employee could not open authenticated Manager review |
| [Manager capture](screenshots/qa/manager-mailpit-capture.png) and [leadership capture](screenshots/qa/leadership-mailpit-capture.png) | Actual SMTP messages with correct recipient, task/cycle, due date and reason |
| [Mailpit API readback](evidence/qa/mailpit-captures.json) | Original Oct 13 scenario: two captures per level, real timestamps, subject/body; not Gmail delivery |
| [Actual workflow results](evidence/qa/workflow-results.json) and [n8n execution records](evidence/qa/n8n-executions.json) | Real threshold/retry/calendar/concurrent workflow runs |
| [Calendar dashboard readback](evidence/qa/calendar-manager-concurrent.json), [final counts](evidence/qa/calendar-final.json), [visible panel](screenshots/qa/calendar-live-counts.png) | Friday + Monday holiday timing, 5 unique cycles and 8 dry-run alert keys |
| [Final dashboard](screenshots/qa/consolidated-dashboard.png), [preserved state](evidence/qa/final-preserved-state.json), [deployment/restore verification](evidence/qa/deployment-verification.json) | Version 7 source matches deployed digest; full state restoration and valid SLA targets |
| [Mode isolation and failed delivery](evidence/qa/transport-reliability-runs.json), [additional captures](evidence/qa/mode-isolation-captures.json), [UNKNOWN alert log](screenshots/qa/uncertain-delivery-alert-log.png) | Actual dry-run-to-SMTP capture, refused connection, honest UNKNOWN state and zero blind retries |
| [Future-cycle rejection](evidence/qa/future-cycle-rejection.json), [actual rejection](screenshots/qa/future-cycle-rejected.png), [Upcoming UI](screenshots/qa/upcoming-cycle-disabled.png) | Future completion prevented by deployed backend; no self-link or state mutation; client button disabled |
| [Latest deployed source verification](evidence/qa/latest-deployment-verification.json) | Version 8 compiled digest matches; live replay leaves main protected records unchanged |
| [Gmail sender state](evidence/qa/gmail-api-accepted.json) | MailApp accepted two sends; sender acceptance only; paired with receiving evidence below |

The [eight-case acceptance report](../tests/test-results.md) contains executed
steps and exact scope for each PASS/BLOCKED. Local regression is 22/22,
separate from integrated acceptance. The [recording walkthrough](../tests/demo-script.md)
is reproducible. A [genuine 5:10 screen review](demo/qa-screen-review.mp4) is
provided, with explicit cuts and scope; it is not uninterrupted footage of every
earlier first-time action.

Existing screenshots directly under `screenshots/` are historical evidence from
the original dummy-only prototype. New integrated evidence is under
`screenshots/qa/` and `evidence/qa/`. Do not treat older zero-alert connectivity
checks as actual notification delivery.

## Final distinct-role evidence, backend version 11

| Actual evidence | What it establishes |
| --- | --- |
| [Employee A completion](evidence/qa/role-employee-a-confirmed.json), [repeat](evidence/qa/role-employee-a-repeat.json) | Normal Google-authenticated daily action and idempotent replay |
| [Dummy B replay](screenshots/qa/dummy-completion-replay.png), [records](evidence/qa/role-dummy-b-repeat.json) | Explicit SIMULATED actor, proof and Oct 22 recurrence; no invented dummy login |
| [Manager Pending + acknowledgement](screenshots/qa/manager-signed-ack.png), [history](evidence/qa/role-manager-ack-confirmed.json) | Separate Google-authenticated manager identity/time; employee still Pending |
| [Later C resolution](screenshots/qa/manager-later-resolution.png), [records](evidence/qa/role-c-resolved-confirmed.json) | Independent labelled simulation, next cycle and preserved manager acknowledgement |
| [Role workflow runs](evidence/qa/role-workflow-results.json), [real Mailpit captures](evidence/qa/role-mailpit-captures.json) | Two manager captures, one unresolved-D escalation, real capture timestamps, repeat zero |
| [Receiving Gmail verification](evidence/qa/gmail-inbox-verification.json), [Portal15](screenshots/qa/gmail-inbox-portal15.png), [Portal30](screenshots/qa/gmail-inbox-portal30.png) | Two actual Inbox messages; distinct from MailApp sender acceptance |
| [Overlapping Apps Script executions](screenshots/qa/overlapping-dummy-completion-executions.png), [counts/scope](evidence/qa/overlapping-dummy-completion.json) | Actual concurrent dummy-D calls, one history event and one next cycle |
| [Final role state](evidence/qa/role-final-state.json), [version 11 verification](evidence/qa/role-deployment-verification.json) | Four distinct employee IDs/assignments; actual compiled/deployed digest agreement |

Public redactions obscure private account identities while private live records
retain them. The Gmail message screenshots were supplied by the user and cropped;
the corresponding receiving Inbox search was independently inspected live.
Manager acknowledgement and later resolution screenshots are actual separate-account
Sheet UI, cropped and redacted. There is no reconstructed UI or fabricated email.

[Manager My tasks](screenshots/qa/manager-no-employee-tasks.png) shows no assigned
employee task controls in the actual manager session. It does not prove a second
real employee identity; that optional ownership test remains unverified.
