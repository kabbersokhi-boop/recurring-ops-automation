# Assignment audit

The entire authoritative DOCX was read again. It has not been edited or
published. All five deliverables and all eight cases are mapped below.
The original prototype is preserved; the new private QA environment is separate.

**Current outcome: all eight integrated assignment cases PASS; 22 local tests PASS.**
Actual second-account acknowledgement and receiving Gmail Inbox inspection are
verified. Dummy B/C/D completions are explicitly simulated through the real engine;
Employee A and manager use their own verified Google identities.

## Requirements

| Requirement | Implementation and actual evidence |
| --- | --- |
| Google Sheets primary interface | Seven private QA tabs, employee and manager sidebars; task state stays in Sheets |
| Four dummy employees/tasks | Employees A/B/C/D and daily/7/15/30-day tasks retained; controlled test account mappings are private |
| Recurring cycles | Live 7-day completion created correct linked next cycle; daily weekend/holiday recurrence verified through actual n8n |
| Employee pending report | Actual signed-in employee saw assigned task, due date/cycle, status and required proof in My tasks |
| Single update | One sidebar ticket submission automatically updated cycle, history, actor/time and next cycle |
| Ticket proof | Valid Ticket ID persisted; external portal authenticity remains employee attestation |
| Daily proof | Actual structured report completed daily cycle without a ticket; pending count and blockers saved |
| Who/when/history | Verified Google ID-token actor, business time and real execution time persisted; exactly one completion event |
| Manager visibility | Consolidated protected dashboard has status, overdue age, acknowledgement target, review/resolution and escalation state |
| Manager acknowledgement | Role-checked backend and existing sidebar deployed; employee access rejected live; second-account identity/time recorded; Pending retained until independent completion |
| Same-day alert | Actual n8n business-threshold run captured two Mailpit manager messages; two limited Gmail messages independently observed in receiving Inbox |
| Leadership escalation | Actual n8n threshold run captured two leadership messages for unresolved work; correct reason and cycle |
| SLA/weekends/holidays | Real backend clock and actual workflow calls verify before/at thresholds and Friday→Tuesday holiday rollover |
| No duplicates | Actual completion replays, repeated notifications and overlapping recurrence/manager workflows produced no extra records |
| Simple protected workflow | Whole-sheet owner-only protections on all QA state tabs; authoritative updates through sidebars |

## Five deliverables

| Deliverable | Material | Demonstrable status |
| --- | --- | --- |
| Working Google Sheet prototype | Private QA link supplied privately; [interface evidence](evidence.md) | Both authenticated roles verified; distinct dummy simulations labelled |
| Apps Script / automation | Existing shared engine, private backend, bound client, sanitized n8n workflows; [setup](qa-setup.md) | Deployed and integrated |
| Daily Task Completion Tracking | [Daily method](daily-completion.md), actual report/history evidence | Live PASS |
| Manager Alerts & Leadership Escalation (SLA) | [Rules](sla-logic.md), Mailpit captures, execution records | Capture, timing and separate receiving Gmail Inbox verification PASS |
| Working Demonstration / Test Cases | [Actual report](../tests/test-results.md), [recording walkthrough](../tests/demo-script.md) | 8/8 integrated PASS; genuine evidence and reproducible recording walkthrough |

The eight required demonstrations, preconditions, executed steps, expected/actual
outcomes and evidence references are in the [acceptance report](../tests/test-results.md).
All five deliverables now have demonstrable QA evidence. Real clock waiting over
several days and two distinct authenticated employee submissions overlapping are
not claimed. Overlapping dummy simulation calls and actual SMTP failure injection
are verified additional checks. The separate optional employee login remains unverified.

## Identity, isolation and delivery

Consumer Google identity uses a verified Google ID token rather than relying on
an empty owner-executed Session email. The privileged backend is private and
separate from the Sheet's shared bound code. Tokens cannot change admin clock,
reset or recipients. Manager authentication and notification transport are separate.
The original workbook is explicitly forbidden to QA reset/write routing.

Mailpit sends use n8n SMTP; Apps Script MailApp cannot use custom SMTP. Gmail
sends are restricted to the pinned controlled inbox and explicit allowlist.
Dry-run keys cannot suppress real-mode tests. Unknown delivery outcomes are held
for reconciliation. See [limits](limitations.md) and [deployment](deployment-record.md).

No employer/leadership/company address was contacted. Public evidence replaces
private account addresses and excludes private resource links, tokens and infrastructure.

## Product-first finalization

A separately deployed presentation workbook now shows the product before the
private QA acceptance proof. Its [new live checks](evidence/presentation/verification.json)
cover genuine authenticated daily completion, history, real next-day recurrence,
replays and denied unauthenticated/employee-manager actions. The accepted QA
records were compared before/after and match exactly for tasks, cycles, history
and alerts; all seven QA tabs remain intact.

The new [primary walkthrough](demo/assignment-walkthrough.mp4) shows both
workbooks and labels business simulation, authenticated/dummy actions, retained
executions, Mailpit capture and previous receiving Gmail Inbox verification.
The earlier technical video remains supplementary. The presentation workbook is
an administrative/reviewer demo; production employee read-access separation and
company-owned accounts/credentials/recipients are explained in the
[access and deployment plan](presentation-environment.md).
