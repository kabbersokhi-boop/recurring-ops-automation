# Setup and activation

## 1. Prepare a private Sheet

The prepared private prototype, linked in the review package, contains all six tabs and four dummy cycles. Keep its sharing restricted. For a new Sheet, create a blank native Google Spreadsheet, open **Extensions → Apps Script**, paste the four files from `apps-script/` into a bound project, and run `setupPrototype()` once. **Do not run `setupPrototype()` on the prepared workbook** because it intentionally resets the tabs.

In the prepared workbook, attach the Apps Script files without running setup. Save and reload the Sheet; the **Ops Tasks** menu should appear. Check that `Task_Master` and `Settings` contain only test data. Replace the four `.invalid` employee emails with controlled Google accounts. Update the corresponding Employee_Queue email values or reset the queue in a new test workbook. Set a verified test manager account in Settings. Leave `dryRun=true` and the leadership address as `.invalid` until email tests are authorized.

## 2. Verify identity

As each test employee, open **Ops Tasks → My tasks**. The sidebar must show only that employee's cycles. A blank `Session.getActiveUser().getEmail()` fails closed. As the test manager, open **Ops Tasks → Manager review**. Test that other accounts cannot call manager acknowledgement. If Google does not expose identity in this account/deployment model, use a controlled Google Workspace domain and verify again. Do not substitute a typed email address for authentication.

## 3. Deploy Apps Script web app for n8n

In Apps Script, set Script Property `N8N_SHARED_TOKEN` to a long random secret. Deploy the bound project as a web app **executing as the owner**. The web app accepts POST JSON `{ "action": "recurrence|manager|leadership", "token": "..." }`. Restrict web app access as tightly as your Google and n8n connection permits. The token is kept in Script Properties and the private n8n environment; never put it in the Sheet or repository.

Run `recurrenceNow()` manually and confirm four cycle rows remain four on a repeat run. Open the manager dashboard and confirm it refreshes. Verify that an unauthorized POST fails. Keep `dryRun=true` throughout testing.

## 4. Configure n8n

Import the three JSON files from `n8n-workflows/`. They are inactive by default. Set `OPS_WEB_APP_URL` and `OPS_SHARED_TOKEN` in n8n's private runtime environment, using `.env.example` as a field guide. The workflows contain expressions only; no real values. Restart n8n if needed to load the variables. Test each HTTP node manually and inspect the Sheet. Activate schedules only after all three return expected JSON. A production deployment should monitor failed executions.

Inventory:

| Workflow | Schedule | Apps Script action |
| --- | --- | --- |
| Task recurrence | Hourly, 09:00–23:00 on weekdays | `recurrence` |
| Manager overdue alerts | Every 15 minutes on weekdays | `manager` |
| Leadership escalation | Every 15 minutes, 14:00–23:00 on weekdays | `leadership` |

Completion is handled by `submitCompletion()` in the Sheet sidebar under a document lock. No n8n completion processor is needed.

## 5. Controlled mail check

Use only an inbox you control. First run the manager and leadership actions in dry-run mode and inspect Alert_Log. For a real delivery check, use a fresh test cycle, set one verified test inbox, set `dryRun=false`, run the appropriate action, and confirm a single email and one alert key. Do not use company addresses. If an alert is `UNKNOWN`, check the inbox and provider records before any manual retry.

## 6. Test and reset

Run `node --test tests/automated/engine.test.cjs` for the deterministic suite. For a live demonstration, use a separate disposable private workbook. The test clock exists in the pure engine; production Apps Script always uses actual time. The [demonstration script](../tests/demo-script.md) maps the eight assignment tests to inputs and expected evidence.
