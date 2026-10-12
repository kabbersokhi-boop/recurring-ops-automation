# Executed test results

Commands: `node tests/automated/engine.test.cjs`, `node tests/automated/apps-script.test.cjs`, and `node tests/automated/sidebar.test.cjs`

Executed on 2026-10-13 in the local workspace with Node.js 22.22.1. Result: **19 passed, 0 failed** (12 engine tests, 4 mocked Apps Script service tests, and 3 mocked Sheet sidebar tests). The injected clock uses Asia/Kolkata timestamps. No real email was sent.

| Assignment case | Result | Evidence from assertions |
| --- | --- | --- |
| 1. Recurring cycle | PASS locally | 7-day completion creates linked `P7:2026-10-16`; 15-day and 30-day weekend due dates roll to the next Monday |
| 2. Single-point completion | PASS locally | One ticket submission updates cycle status, proof, actor, time and one history event |
| 3. Daily task | PASS locally | Structured report with pending count completes without Ticket ID |
| 4. Same-day manager alert | PASS locally | No candidate at 17:14; four candidates at 17:15 |
| 5. Manager acknowledgement | PASS locally | Acknowledged timestamp set while employee task remains Pending |
| 6. Leadership escalation | PASS locally | Four unresolved tasks escalate at next working-day threshold, including acknowledged task |
| 7. Escalation timing | PASS locally | Friday 2026-10-09 plus weekend and 2026-10-12 holiday leads to Tuesday 2026-10-13 at 14:00 |
| 8. Duplicate prevention | PASS locally | Repeat recurrence creates zero cycles; repeated completion and alert reservation return duplicate |

Additional passing cases: invalid/empty proof and wrong identity rejected; late completion and independent daily cycles; mocked Apps Script email calls and log keys; uncertain delivery reservation suppresses automatic resend; overlapping state transitions are rejected by the document lock mock.

The three sidebar tests verify that the Sheet employee view sends a ticket or structured daily report once to `submitCompletion`, and the manager view calls `managerAcknowledge`. The underlying state transitions are covered by the engine and adapter tests.

**Live integration evidence:** the bound Apps Script executed `recurrenceNow` successfully and its deployed POST endpoint returned `{"created":0}` on repeat. The n8n recurrence workflow executed successfully against that endpoint and returned the same value. Manager and leadership workflows also executed successfully with `{"alerts":0}` at the current pre-deadline time. All three schedules were published and verified active after an n8n restart. The private Sheet queue displayed four Pending cycles with correct local due days. A fresh Sheet tab showed the **Ops Tasks** menu, and **My tasks** opened its authenticated sidebar. The manager dashboard showed all four employees. No email was sent. Authenticated end-user completion, manager acknowledgement, and actual delivery remain unverified.

## Version 4 continuation — 2026-10-13

All three commands above were rerun successfully after extending the existing adapter and manager sidebar assertions. The configurable acknowledgement deadline test passes across a weekend and holiday, before and at the target, and after acknowledgement. The adapter test confirms an existing 14-column dashboard is rewritten with 15 headers and the deadline/Late fields. The manager sidebar test confirms the deadline and Late label render and acknowledgement calls the shared service.

The bound project saved the combined TaskManager.gs + Code.gs source as Code.gs and saved ManagerSidebar.html. The existing web app was updated to **version 4 at 03:43 Asia/Kolkata**. Direct deployed POST calls returned recurrence `{"created":0}`, manager `{"alerts":0}`, leadership `{"alerts":0}`, and repeated recurrence `{"created":0}`. These pre-deadline zero-alert results establish endpoint connectivity, not alert creation or delivery. The current three n8n schedules were listed as active; they were not re-executed manually in this continuation.

Live Manager_Dashboard column I shows `2026-10-14T10:00:00+05:30` for all four pending 2026-10-13 task cycles. Its acknowledgement status remains Pending, and escalation is `2026-10-14T14:00:00+05:30`. [Sanitized dashboard readback](../docs/screenshots/manager-dashboard-acknowledgement.png) and [deployment confirmation](../docs/screenshots/deployment-version-4.png).

The user chose to retain dummy identities and `dryRun=true`. Live employee completion, live manager acknowledgement, real manager/leadership email delivery, persisted history after those actions and live concurrent submissions remain unverified. No real email was sent and no personal email was placed in the prepared Sheet during this continuation. This report does not claim full end-to-end verification.


Publication checks: `git diff --check` passed. A scan of all 35 tracked/unignored candidate files passed against the known private endpoint/token/credential/Sheet-link literals, live Apps Script URL and credential patterns, the prohibited employer recipient, and non-dummy email addresses. The two new screenshots were visually checked to exclude private URLs and deployment IDs. This is a bounded repository scan, not a third-party security audit.
