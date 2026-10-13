# Reproducible 5–10 minute demonstration

This is the exact live recording walkthrough, not a claim that every step has
already been recorded. Genuine executed evidence is in [results](test-results.md).
Manager acknowledgement and receiving Gmail inbox steps require the approved
second account's authenticated session. Do not narrate those as passed until run.

## Prepare before recording

Use only the private QA Sheet, owner-only administrator panel, three QA n8n
workflows and recipient-filtered Mailpit views. Open the employee and manager
accounts in separate dedicated browser sessions. Authorize only the task client.
Keep original prototype/schedules separate. Leave QA schedules inactive during
time simulation. Have the protected dashboard, history and alert log ready.

Preserve current QA records, export current evidence, then reset QA with start
2026-10-13 and holidays `[]`. Confirm four Pending cycles, zero history/alerts,
TEST MODE and MAILPIT. Reset never deletes captured messages; identify this run
by actual capture time/cycle and compare counts from its pre-run baseline.

## Presenter script

| Time | Visible action | Short narration and evidence to show |
| --- | --- | --- |
| 0:00–0:45 | Open QA Sheet, Task_Master, Demo_Control and Employee_Queue | “Four dummy employees, daily/7/15/30-day recurrence. Business time is simulated; executions and mail captures are real. Protected state updates use the sidebars.” |
| 0:45–2:00 | Employee: Ops Tasks → My tasks; enter `QA-PORTAL7-001`, Submit completion | “One update closes this cycle, records authenticated identity/time and history, and creates next due Oct 20.” Show Completed row, one history event and linked next cycle. |
| 2:00–3:00 | Submit daily report in same sidebar without ticket | Describe meaningful completed work, pending work/count and blockers. Show daily Completed and second history event. |
| 3:00–4:00 | Admin: five minutes before manager alert; run QA manager workflow; then Manager threshold and run again | First run reserves 0; threshold run reserves 2. Show actual n8n execution status and actual Mailpit manager messages with cycle, due date, reason and capture time. |
| 4:00–5:00 | Switch to authenticated manager session, open Manager review and acknowledge PORTAL15 | Show verified manager identity and timestamp in history/dashboard. Employee task remains Pending. Employee later completes it from My tasks; show independent resolution and correct next cycle. **This step remains unverified until receiving-account authorization is available.** |
| 5:00–6:00 | Owner: Leadership threshold; execute QA leadership workflow for separate unresolved PORTAL30 | Show actual leadership capture, unresolved reason and correct cycle. Acknowledgement is not employee completion. |
| 6:00–7:00 | Repeat recurrence, manager and leadership workflows; repeat a recorded completion | Compare actual counts: no extra cycles/events or matching-mode messages. Show Duplicate prevented and zero new reservations. |
| 7:00–8:00 | Select approved Gmail mode and manager threshold; run manager workflow | Show controlled recipient allowlist and SENT/API acceptance. Then inspect the actual receiving Gmail message using a subject/cycle-specific search. **An API response is not inbox arrival; this step remains blocked until inbox access.** |
| 8:00–9:00 | Show calendar evidence and final acceptance table | Friday + Monday holiday → Tuesday 10:00 review/14:00 escalation; no alerts before threshold; genuine overlapping workflow records. State remaining verified limitations. |

The shorter version shows calendar evidence as prepared screenshots/record
readbacks rather than rerunning its additional executions during the recording.
Never use a personal/company/employer inbox as an unapproved test recipient.

## Evidence checklist

- Before: four dummy definitions, initial queue, TEST MODE and notification mode.
- Portal: Ticket ID entry, actual completion receipt, history actor/time, next cycle.
- Daily: completed work/pending count/blocker fields, one completion event.
- Manager: threshold run, Mailpit capture with actual time, alert log SENT receipt.
- Acknowledgement: actual second-account sidebar, actor/time, task still Pending,
  later employee resolution. Keep BLOCKED if no authenticated session.
- Leadership: separate unresolved cycle, actual run/capture and escalation reason.
- Duplicates: before/after record counts, repeated workflow execution IDs, unchanged
  filtered capture counts and duplicate completion receipt.
- Gmail: actual receiving message, recipient, subject, body and arrival time;
  redact private identities in public evidence. Keep BLOCKED if inbox not inspected.

## Safe reset and calendar scenario

The owner-only panel's **Reset QA records** regenerates the four tasks through
the real engine and clears only QA cycles/history/alerts. It selects MAILPIT.
The original workbook, unrelated workflows and captured emails are preserved.
For calendar tests, **Weekend and holiday timing scenario** first preserves
current records, then resets to Friday Oct 16 with Monday Oct 19 holiday and
selects DRY_RUN. Set Saturday/Monday/Tues 13:59/Tues 14:00 using custom business
time, execute the actual QA workflows and inspect dashboard targets/counts.
**Restore preserved QA records** returns to the main scenario; confirm exact
history/proof/alert keys and real timestamps, including any accepted Gmail sends.
Never restore an older snapshot that omits a send and then blindly rerun Gmail.

## Recording and sanitization

A complete video has not been created. Use a window-only screen recorder focused
on the dedicated QA sessions, with unrelated windows excluded. Capture actual
interactions in the order above. Private URLs/account identities must be cropped
or visibly redacted in any public video/screenshots; do not reconstruct or invent
UI results. Existing public QA screenshots are genuine crops; their provenance
and evidence limits are listed in [evidence](../docs/evidence.md).
