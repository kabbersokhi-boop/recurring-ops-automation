# Setup and activation

## 1. Prepare a private Sheet

The prepared private prototype, linked in the review package, contains all six tabs and four dummy cycles. Keep its sharing restricted. For a new Sheet, create a blank native Google Spreadsheet, open **Extensions → Apps Script**, paste the four files from `apps-script/` into a bound project, and run `setupPrototype()` once. **Do not run `setupPrototype()` on the prepared workbook** because it intentionally resets the tabs.

The prepared workbook already has the bound Apps Script project attached and authorized. Save and reload the Sheet; the **Ops Tasks** menu should appear. Check that `Task_Master` and `Settings` contain only test data. Replace the four `.invalid` employee emails with controlled Google accounts. Update the corresponding Employee_Queue email values or reset the queue in a new test workbook. Set a verified test manager account in Settings. Leave `dryRun=true` and the leadership address as `.invalid` until email tests are authorized.

## 2. Verify identity

As each test employee, open **Ops Tasks → My tasks**. The sidebar must show only that employee's cycles. A blank `Session.getActiveUser().getEmail()` fails closed. As the test manager, open **Ops Tasks → Manager review**. Test that other accounts cannot call manager acknowledgement. If Google does not expose identity in this account/deployment model, use a controlled Google Workspace domain and verify again. Do not substitute a typed email address for authentication.

## 3. Deploy Apps Script web app for n8n

The prepared project already has private Script Property `N8N_SHARED_TOKEN` and a deployed web app. For a new installation, generate a long random secret, set that property, and deploy the bound project as a web app **executing as the owner**. The web app accepts POST JSON `{ "action": "recurrence|manager|leadership", "token": "..." }`. The current installation allows HTTP access to Anyone so n8n can call it server to server; the shared token is required for every POST. Keep the token in Script Properties and n8n private configuration, never in the Sheet or repository.

Run `recurrenceNow()` manually and confirm four cycle rows remain four on a repeat run. Open the manager dashboard and confirm it refreshes. Verify that an unauthorized POST fails. Keep `dryRun=true` throughout testing.

## 4. Configure n8n

The three JSON files in `n8n-workflows/` are importable templates and inactive by default. A fresh deployment can set `OPS_WEB_APP_URL` and `OPS_SHARED_TOKEN` in n8n's private runtime environment, using `.env.example` as a field guide. The live instance instead uses the deployed URL in its private workflow copies and an encrypted n8n **Custom Auth** credential with JSON `{"body":{"token":"<private token>"}}`; the public exports contain neither. Restart n8n after CLI import/publish. Test each HTTP node manually and inspect the Sheet before activating schedules. The current three schedules are active in dry-run mode. A production deployment should monitor failed executions.

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

Run both `node --test tests/automated/engine.test.cjs` and `node --test tests/automated/apps-script.test.cjs` for the deterministic engine and mocked Apps Script service. For a live demonstration, use a separate disposable private workbook. The test clock exists in the local harness; production Apps Script always uses actual time. The [demonstration script](../tests/demo-script.md) maps the eight assignment tests to inputs and expected evidence.
