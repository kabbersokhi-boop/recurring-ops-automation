# Reproducible 5–10 minute demonstration

[Watch the 5 minute 10 second screen review](../docs/demo/qa-screen-review.mp4).
[Recording provenance](../docs/demo/provenance.json).

All eight cases have genuine integrated evidence. Use this presenter script for a
fresh run. The screen review video is an edited tour of actual QA UI and recorded
outcomes; it is not presented as uninterrupted footage of every earlier action.

## Prepare

Open only dedicated QA windows: owner Sheet, separate manager Sheet, owner-only
admin panel, scoped n8n workflows, recipient-filtered Mailpit and QA-only receiving
Gmail search. Authorize the bound client with each real account. Preserve current
QA records before reset. Keep original prototype and active dry-run schedules separate.

Configure A as real owner, B/C/D as distinct dummy assignments and the separate
manager identity. Reset only QA to a fresh business start date; holidays `[]`;
MAILPIT. Confirm four Pending cycles, zero history/alerts and TEST MODE. Use a
fresh start date or baseline capture timestamps: reset retains Mailpit messages.

## Presenter script

| Time | Action | Narration / expected result |
| --- | --- | --- |
| 0:00–0:45 | Show Task_Master, Employee_Queue and Demo_Control | Four IDs; daily/7/15/30-day assignments. Business time is simulated; execution/capture time is real. Protected cells use sidebar updates. |
| 0:45–1:45 | Owner as Employee A: Ops Tasks → My tasks; submit meaningful daily report, no ticket | Work completed, pending work/count and blockers; one completion/history event with verified Google actor. Repeat recorded submission: duplicate prevented. |
| 1:45–2:45 | Owner-only admin: select dummy B, enter valid ticket, Simulate | Explicit SIMULATED actor and administrator initiator. Same engine creates correct next 7-day cycle; repeat adds nothing. Show earlier authenticated portal sidebar evidence separately: it temporarily assigned a portal task to the owner, not a dummy Google login. |
| 2:45–3:45 | Before manager threshold: execute QA manager workflow; then threshold and execute again | Before: 0. At threshold: 2 reservations and real C/D SMTP captures. Show recipient, task/cycle, due date, reason and actual capture time. |
| 3:45–4:45 | Separate authenticated manager: Ops Tasks → Manager review; acknowledge C | Show actual manager identity/time and one acknowledgement history event. C remains Pending. Owner then explicitly simulates C completion; manager sees proof, next cycle and preserved acknowledgement. |
| 4:45–5:45 | Owner sets acknowledgement deadline, runs leadership (0); sets leadership threshold and runs again | Only unresolved D gets one actual Mailpit leadership message. Resolved C is excluded. Show cycle and unresolved-work reason. |
| 5:45–6:45 | Repeat workflows; repeat completion; inspect counts and scoped capture list | No extra alert keys/messages, completion events or next cycles. Show real n8n execution records and the actual overlapping dummy-D execution/count evidence. |
| 6:45–7:30 | Show receiving test Gmail Inbox using exact QA subject/cycle search | The two approved messages arrived. This is actual receiving evidence; Mailpit and sender API acceptance are separate. Reuse the existing messages—do not resend Gmail on each rehearsal. |
| 7:30–8:30 | Show calendar evidence and eight-case acceptance report | Friday + Monday holiday → Tuesday review/escalation, no early alerts, unique daily cycles. State simulation and exactly-once limits plainly. |

For an additional authenticated portal action in a fresh rehearsal, privately map
only B's current assignment to an approved real employee, reset QA, complete it
through My tasks, then restore B's dummy configuration and reset before the final
four-role scenario. Real mapped tasks are excluded from the simulation selector.
This optional preparation must not rewrite prior history or pretend dummy identities
are Google logins. No extra employee account is required for the core demonstration.

## Evidence checklist

- Initial four definitions, assignments, TEST MODE, clock and notification mode.
- Employee daily form, receipt, actual actor/time and one history event.
- Ticket proof, linked recurrence and SIMULATED vs authenticated source label.
- Manager threshold execution and actual Mailpit manager capture timestamps.
- Separate manager acknowledgement; task still Pending; later independent resolution.
- Leadership D capture; C excluded; correct level, cycle, due date and reason.
- Replays and overlapping calls: actual before/after record and message counts.
- Receiving Gmail subject, Inbox label, body and arrival time; redact identities.

## Safe reset and restore

**Preserve current QA records** saves a bounded private snapshot. **Reset QA records**
clears only the pinned QA cycles/history/alerts, updates start date/holidays,
regenerates four cycles and selects MAILPIT. It preserves task identities, original
workbook, other workflows and captured mail. Never run setupPrototype on the original.

**Weekend and holiday timing scenario** preserves current records, selects Friday
Oct 16 and Monday Oct 19 holiday, and uses DRY_RUN. Run actual workflows at Saturday,
Monday, Tuesday 13:59/14:00 and inspect results. **Restore preserved QA records**
returns exact history, proof, alerts and original actual timestamps. Never restore
an older snapshot that omits a Gmail send then blindly rerun external delivery.

## Recording provenance

The public screen review uses window-only captures from dedicated task windows.
It shows genuine current QA controls, manager resolution, an additional live
Employee A daily action, Mailpit, receiving Gmail and Apps Script execution records.
Cuts and explanatory captions are explicit. Private URLs and account identities
are cropped or visibly redacted; UI results are not recreated. Earlier first-time
portal/acknowledgement/notification actions are supported by the linked genuine
screenshots and state readbacks, rather than claimed as actions recorded in this video.
