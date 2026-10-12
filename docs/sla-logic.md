# Recurrence and escalation SLA

All example times use Asia/Kolkata. Change the `Settings` values and matching n8n schedules together.

| Event | Rule |
| --- | --- |
| Daily cycle | One cycle per working day at 09:00; earlier unresolved days remain visible |
| Periodic recurrence | Completion date + 7, 15 or 30 calendar days, then roll forward to next working day |
| Employee due time | 17:00 on the due day |
| Manager alert | At or after 17:15 on the due day; n8n checks every 15 minutes |
| Manager acknowledgement target | 10:00 on the next working day; acknowledgement is independent of task completion |
| Leadership escalation | At or after 14:00 on the next working day if the task remains unresolved, or a manager alert remains unacknowledged |

Weekends and the JSON holiday array in Settings are non-working days. Due dates roll forward; leadership timing uses the next working day after the original due date. A completed task with an unacknowledged manager alert still escalates for missing review. A task completed before the manager alert is never alerted. One email groups all new issues for a recipient in a single run. Stable alert keys suppress repeats. `UNKNOWN` delivery state is intentionally held for human inspection because MailApp cannot prove whether a failed call delivered an email.

The schedule runs in n8n's Asia/Kolkata time zone. If n8n is down at the threshold, the next run catches up, subject to availability; same-day delivery cannot be guaranteed during an outage. The local test clock is passed into the pure engine only and does not override production `new Date()`.
