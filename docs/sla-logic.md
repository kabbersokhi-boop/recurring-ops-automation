# Recurrence and escalation SLA

All example business times use Asia/Kolkata.

| Event | Rule |
| --- | --- |
| Daily cycle | One per working day; unresolved earlier cycles remain visible |
| Periodic recurrence | Completion date + 7 / 15 / 30 calendar days, rolled forward over non-working days |
| Employee deadline | 17:00 on the due day |
| Manager alert | At or after 17:15; normal schedule checks every 15 minutes |
| Manager acknowledgement target | 10:00 next working day, configurable |
| Leadership escalation | 14:00 next working day if employee work or required manager review is unresolved |

The 15-minute grace period permits a delayed update while retaining same-day
notification. Next-working-day review avoids weekend demands. The four hours
between the default review target and escalation allow follow-up. Acknowledging
an alert does not complete the employee task or suppress escalation for unresolved
work. Completed work can still escalate for missing manager review.

Weekends and configured holidays are skipped. A Friday deadline with Monday a
holiday moves review and escalation to Tuesday. QA uses a single simulated
business clock for completion, recurrence, review and SLA evaluation. Token
expiry, n8n execution times and mail capture times always use real time.
The original deployment continues using actual time.

## Manager action

Open **Manager_Dashboard → Ops Tasks → Manager review**. Inspect the captured
alert, employee, task, due date and cycle; follow up on the blocker; choose
**Acknowledge alert**. Identity and time are recorded independently of employee
completion. QA acknowledgement requires an actual `SENT` manager notification;
dry-run reservations cannot stand in for received alerts.

## Delivery and retries

QA sends one notification per cycle and escalation level. Transport-qualified
keys keep dry-run, Mailpit and approved Gmail tests independent. Repeated runs
reserve no additional notification for the same key. Mailpit-mode sends use n8n
SMTP; Gmail-mode sends use backend MailApp to the pinned allowlisted test inbox.
API success, SMTP capture and verified receiving-inbox delivery are distinct
claims. Uncertain sends require manual reconciliation.

Schedules catch up after downtime, but cannot guarantee same-day delivery during
an outage. See the [actual timing and retry evidence](../tests/test-results.md).

Future cycles are tracked as Pending but cannot be completed before their due
day. The employee sidebar labels them Upcoming and disables submission until
that day. This prevents early resubmission from linking a recurring cycle to
itself. Completion earlier on the due day remains allowed.
