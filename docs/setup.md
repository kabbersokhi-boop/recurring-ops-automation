# Setup and activation

These instructions describe the original bound prototype. For the deployed
integrated QA demonstration, use [QA setup](qa-setup.md), which separates the
shared client from the private backend and uses verified Google ID tokens.
Preserve prepared workbooks; never run initialization on the original Sheet.

## 1. Prepare a private Sheet

The prepared private prototype, linked in the review package, contains all six tabs and four dummy cycles. Keep its sharing restricted. For a new Sheet, create a blank native Google Spreadsheet, open **Extensions → Apps Script**, add TaskManager.gs, Code.gs, Sidebar.html and ManagerSidebar.html from `apps-script/` to a bound project, using the supplied appsscript.json manifest, and run `setupPrototype()` once. **Do not run `setupPrototype()` on the prepared workbook** because it intentionally resets the tabs.

The prepared workbook already has the bound Apps Script project attached and authorized. Open the Sheet in a fresh tab; the **Ops Tasks** menu should appear. From **Employee_Queue**, employees choose **Ops Tasks → My tasks** to submit once. From **Manager_Dashboard**, managers choose **Ops Tasks → Manager review** to acknowledge an alert without resolving the employee task. Check that `Task_Master` and `Settings` contain only test data. Replace the four `.invalid` employee emails with controlled Google accounts. Update the corresponding Employee_Queue email values or reset the queue in a new test workbook. Set a verified test manager account in Settings. Leave `dryRun=true` and the leadership address as `.invalid` until email tests are authorized.

The prepared workbook has administrator-only protected ranges covering the current grids of `Task_Master` and `Settings`. For a new workbook, protect both entire tabs through **Data → Protect sheets and ranges** after `setupPrototype()`; allow only the workbook administrator to edit them. This is a one-time setup step. Protecting `Employee_Queue` the same way would prevent employee-run sidebar submissions from writing their cycles, so share edit access only with trusted test participants and keep the workbook private.

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

Run `node --test tests/automated/engine.test.cjs`, `node --test tests/automated/apps-script.test.cjs` and `node --test tests/automated/sidebar.test.cjs` for the deterministic engine, mocked Apps Script service and Sheet sidebar call paths. For a live demonstration, use a separate disposable private workbook. The test clock exists in the local harness; production Apps Script always uses actual time. The [demonstration script](../tests/demo-script.md) maps the eight assignment tests to inputs and expected evidence.


## 7. Update the prepared bound project

Use the verified private Sheet, then **Extensions → Apps Script**. The prepared live project stores TaskManager.gs and Code.gs together in one Code.gs file. Replace that file with their concatenated source and update the corresponding HTML file; do not add a second copy of the engine or adapter. Save, then use **Deploy → Manage deployments → Edit → New version → Deploy** for the existing web app so n8n keeps its endpoint. Saving source alone does not update a versioned web app.

Run a dry-run recurrence call to refresh the dashboard and read back its headers and deadline values. Never run setupPrototype on the prepared Sheet. Verify `dryRun=true` and dummy-only recipient cells before any alert call. The current verified outcome is recorded in [deployment record](deployment-record.md).
