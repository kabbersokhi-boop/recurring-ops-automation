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

## What the manager does

After the overdue email, the manager opens **Manager_Dashboard → Ops Tasks → Manager review**, checks the employee/task, contacts the employee to resolve blockers, and selects **Acknowledge alert** by the configured next-working-day target. The dashboard records review time and actor separately from employee completion. It marks an unacknowledged manager alert Late at the target; leadership escalation waits until 14:00, giving four hours after the default 10:00 review target for follow-up. The employee still submits the completion proof from My tasks.

The 15-minute grace period allows a delayed completion update after the 17:00 due time while retaining a same-day manager alert. Next-working-day review avoids a weekend demand, and the later escalation window gives the manager time to act. Acknowledging an issue does not suppress escalation of an unresolved task. If the task is completed after the alert but review is still missing, leadership receives the missing-review escalation.

Version 4 exposes the `acknowledgementTime` setting in the engine dashboard, Manager_Dashboard column I and manager sidebar. It does not send an additional 10:00 reminder: there is at most one manager and one leadership alert key per cycle. The sidebar call path is locally tested; its authenticated live manager path remains unverified.
