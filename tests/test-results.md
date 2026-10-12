# Executed test results

Command: `node --test tests/automated/engine.test.cjs`

Executed on 2026-10-13 in the local workspace with Node.js 22. Result: **11 passed, 0 failed**. The injected clock uses Asia/Kolkata timestamps. No email was sent.

| Assignment case | Result | Evidence from assertions |
| --- | --- | --- |
| 1. Recurring cycle | PASS locally | 7-day completion creates linked `P7:2026-10-16`; 15-day Saturday due rolls to Monday 2026-10-26 |
| 2. Single-point completion | PASS locally | One ticket submission updates cycle status, proof, actor, time and one history event |
| 3. Daily task | PASS locally | Structured report with pending count completes without Ticket ID |
| 4. Same-day manager alert | PASS locally | No candidate at 17:14; four candidates at 17:15 |
| 5. Manager acknowledgement | PASS locally | Acknowledged timestamp set while employee task remains Pending |
| 6. Leadership escalation | PASS locally | Four unresolved tasks escalate at next working-day threshold, including acknowledged task |
| 7. Escalation timing | PASS locally | Friday 2026-10-09 plus weekend and 2026-10-12 holiday leads to Tuesday 2026-10-13 at 14:00 |
| 8. Duplicate prevention | PASS locally | Repeat recurrence creates zero cycles; repeated completion and alert reservation return duplicate |

Additional passing cases: invalid/empty proof and wrong identity rejected; late completion and independent daily cycles; uncertain delivery reservation suppresses automatic resend.

**Integration evidence:** native Google Sheet creation, tab metadata and sample rows were read back. Three n8n workflow imports succeeded and each was exported back as `active:false`. Apps Script, n8n HTTP calls and email delivery were not executed live; those tests remain unverified.
