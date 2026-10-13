# Genuine integrated evidence

The QA evidence below comes from actual Sheet interactions, deployed Apps Script
POST/readbacks, real n8n executions and recipient-filtered Mailpit capture.
Business time is simulated; actual execution/capture timestamps are retained.
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
| [Mailpit API readback](evidence/qa/mailpit-captures.json) | Two captures per level, real capture timestamps, subject/body; not Gmail delivery |
| [Actual workflow results](evidence/qa/workflow-results.json) and [n8n execution records](evidence/qa/n8n-executions.json) | Real threshold/retry/calendar/concurrent workflow runs |
| [Calendar dashboard readback](evidence/qa/calendar-manager-concurrent.json), [final counts](evidence/qa/calendar-final.json), [visible panel](screenshots/qa/calendar-live-counts.png) | Friday + Monday holiday timing, 5 unique cycles and 8 dry-run alert keys |
| [Final dashboard](screenshots/qa/consolidated-dashboard.png), [preserved state](evidence/qa/final-preserved-state.json), [deployment/restore verification](evidence/qa/deployment-verification.json) | Version 7 source matches deployed digest; full state restoration and valid SLA targets |
| [Gmail sender state](evidence/qa/gmail-api-accepted.json) | MailApp accepted two sends; receiving inbox still unverified |

The [eight-case acceptance report](../tests/test-results.md) contains executed
steps and exact scope for each PASS/BLOCKED. Local regression remains 19/19,
separate from integrated acceptance. The [recording walkthrough](../tests/demo-script.md)
is reproducible; no complete video is claimed.

Existing screenshots directly under `screenshots/` are historical evidence from
the original dummy-only prototype. New integrated evidence is under
`screenshots/qa/` and `evidence/qa/`. Do not treat older zero-alert connectivity
checks as actual notification delivery.
