# Demonstration walkthrough and safe reproduction

## Primary walkthrough — both workbooks, 8:31

[Watch the primary 1080p walkthrough](../docs/demo/assignment-walkthrough.mp4).
[Complete captions and proof matrix](../docs/demo/assignment-walkthrough.md) ·
[Source provenance](../docs/demo/assignment-walkthrough-provenance.json).

The presentation workbook shows how people use the product. Private QA retains
the eight integrated acceptance scenarios. This edited video combines a genuine
new presentation submission with explicitly labelled historical QA evidence.
It has synchronized captions and no audio.

| Time | Show | Presenter explanation |
| --- | --- | --- |
| 0:00–0:20 | Presentation Operations Overview | Four fictional employees, recurring assignments and dynamic counts. Sheets is the operating interface. |
| 0:20–1:25 | Authenticated Employee A daily form and actual Submit | Meaningful completed work, pending work/count and blockers; no Ticket ID or second tracker. Business time is simulated; Google authentication is real. |
| 1:25–1:52 | Resulting completion and Activity History | One genuine event, actual timestamp and authenticated role; other employees remain distinct. |
| 1:52–2:22 | Actual presentation n8n result and next cycle | Run #143898 created one daily cycle; #143908 created zero on repeat. These retained execution results are inspected, not run again during this scene. |
| 2:22–3:13 | Actual completion replay, Manager Review and Notification Evidence | Duplicate prevented; 5 cycles / 1 Completed / 1 history / 0 alerts. No presentation alerts have been generated; their proof comes from QA. |
| 3:13–4:43 | Private QA controls, cycles, earlier portal proof and history | Corrected TEST MODE banner; 8 cycles / 5 Completed / 6 history / 3 alerts. A and manager actions are authenticated; B/C/D completions are labelled administrator simulations. |
| 4:43–5:44 | Real n8n manager execution/retry and Mailpit message | Two actual SMTP captures at the threshold; repeat reserved zero. Captured mail includes employee, task, cycle, due date and reason. |
| 5:44–6:09 | Retained manager acknowledgement and later resolution | Separate Google-authenticated manager acknowledged C while its task remained Pending. Later simulated completion is independent. This is earlier recorded evidence. |
| 6:09–7:12 | Real leadership execution, Mailpit and Alert_Log | Unresolved D escalated; completed and acknowledged C excluded. Capture time is real; business time is simulated. |
| 7:12–7:45 | Read-only timing/retry evidence | Actual recorded workflow outputs establish thresholds, holiday behavior and no duplicate sends/cycles. The evidence reader invokes no business actions. |
| 7:45–8:07 | Previously verified receiving Gmail Inbox | Two approved historical messages carry the Inbox label. SMTP capture and external Inbox delivery are different evidence. No new email is sent. |
| 8:07–8:31 | Eight-case matrix and return to presentation | Eight integrated QA cases passed. Presentation has separate narrower checks; company deployment requires its own identities, credentials and access-separated interfaces. |

### Review without changing the accepted environments

Play the saved video and inspect the linked evidence. Open the presentation
workbook only with owner-granted access. Do not reset either existing workbook,
resend Gmail messages or activate schedules for a viewing or rehearsal. The
presentation remains an administrative/reviewer workbook; Viewer access cannot
perform sidebar writes. Its current empty notification log is explained in the
video rather than populated with copied QA records.

The earlier technical screen review and fresh-run instructions below are
supplementary. Use a separate disposable QA installation for any destructive
reproduction; the accepted private QA records must remain available.

## Supplementary technical walkthrough

[Watch the 5 minute 10 second screen review](../docs/demo/qa-screen-review.mp4).
[Recording provenance](../docs/demo/provenance.json).

All eight cases have genuine integrated evidence. Use this presenter script for a
fresh run in a separate disposable QA environment. The screen review video is an edited tour of actual QA UI and recorded
outcomes; it is not presented as uninterrupted footage of every earlier action.

## Prepare

Open only dedicated QA windows: owner Sheet, separate manager Sheet, owner-only
admin panel, scoped n8n workflows, recipient-filtered Mailpit and QA-only receiving
Gmail search. Authorize the bound client with each real account. Preserve current
disposable QA records before reset. Keep the original prototype, accepted QA and active dry-run schedules separate.

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
