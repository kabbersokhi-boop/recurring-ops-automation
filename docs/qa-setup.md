# Private QA installation and notification transport

The original prototype remains separate, with dummy identities and dry-run
schedules. QA uses a private copy, an owner-only standalone backend, the existing
n8n installation, and the existing Mailpit service. Private URLs and account
addresses are supplied separately; never add them to this repository.

## Apps Script projects

| Project | Files | Authority |
| --- | --- | --- |
| Shared QA Sheet client | `QASheetClient.gs`, `Sidebar.html`, `ManagerSidebar.html`, `appsscript.qa-client.json` as the manifest | Current Sheet, signed-in user's identity, sidebar UI and backend requests |
| Owner-only standalone backend | Generated backend source, `Admin.html`, backend manifest | Protected QA state, locks, clock, recipient allowlist and mail transport |

Do not install the backend or its secrets in a bound project shared with Sheet
editors. Editors can also edit that project's code and Script Properties.
Build the backend from the existing engine and selected Sheet adapter functions:

```bash
node scripts-build-qa-backend.cjs /tmp/qa-backend.gs
```

Install that generated source as `Code.gs` in a new private standalone Apps
Script project. Install `Admin.html` and use `appsscript.qa.json` as its manifest.
Do not run `setupPrototype()` on an existing workbook. The generated backend
does not include that reset function or the original fallback mail endpoint.

Configure these **owner-only backend** Script Properties privately:

| Property | Value |
| --- | --- |
| `QA_SHEET_ID` | Independent QA workbook ID |
| `ORIGINAL_SHEET_ID` | Original workbook ID, explicitly forbidden |
| `QA_ADMIN` | Approved administrator identity |
| `QA_MANAGER` | Approved manager authentication identity |
| `QA_OAUTH_AUDIENCE` | Bound client's Google ID-token audience |
| `QA_GMAIL_RECIPIENT` | Approved controlled test inbox |
| `QA_EXTERNAL_ALLOWLIST` | JSON array containing that approved inbox |
| `N8N_SHARED_TOKEN` | Fresh random secret, unique to QA |
| `QA_BUSINESS_NOW` | ISO business timestamp with timezone; optional |

The recipient must equal the pinned manager inbox and appear in the allowlist.
Requests cannot supply a recipient. Mailpit recipients are fixed test labels:
`manager@ops-demo.test` and `leadership@ops-demo.test`.

Create two web app deployments in the private backend project:

1. **Administrator panel:** execute as owner, access **Only myself**. Every
   server entry point checks the active administrator email; blank fails closed.
2. **Automation and Sheet RPC:** execute as owner, access **Anyone**. Each POST
   must carry either the private automation token or a verified Google ID token.
   User tokens expose only actor-scoped tasks/completions and authorized manager
   review/acknowledgement. They cannot set time, reset data or change transport.

The bound client holds only `QA_BACKEND_URL`, the copied production `/exec` URL.
It sends `ScriptApp.getIdentityToken()`. The backend verifies Google signature
validation through tokeninfo, audience, issuer, verified email and actual expiry.
Simulated business time never controls token expiry.

Protect all QA state/configuration tabs for the administrator. Share the Sheet
only with approved controlled test participants as needed to run the bound sidebar.
Archive obsolete bound owner-executed deployments, clear their properties,
rotate the QA token and update the QA n8n credential together. Verify the old
endpoint no longer executes.

## Existing n8n and Mailpit

Import the three normal recurrence / manager / leadership files under
`n8n-workflows/qa/`. The separate failure probe is optional and manual only. The exports are inactive
and contain URL/credential placeholders. Configure the private backend URL in
the QA workflows and a dedicated Custom Auth credential:

```json
{"body":{"token":"<PRIVATE_QA_AUTOMATION_TOKEN>"}}
```

The existing Mailpit SMTP credential uses the existing service's private host
and port, TLS settings and authentication as actually configured. Find these
from the existing Docker/Compose deployment. Reuse its n8n network; do not expose
Mailpit or create another deployment. Leave unrelated workflows and credentials
unchanged. Run QA workflows manually while demonstrating simulated time.

| Mode | Business evaluation | Transport | Evidence meaning |
| --- | --- | --- | --- |
| `DRY_RUN` | Real engine, QA clock | None | State/SLA evaluation only |
| `MAILPIT` | Same engine and outbox | n8n SMTP to existing Mailpit | Captured message, not external inbox delivery |
| `GMAIL_TEST` | Same engine and outbox | Backend MailApp to approved inbox | API acceptance until the receiving inbox is independently checked |

Apps Script MailApp cannot select a custom SMTP host. Mailpit-mode notifications
therefore never use MailApp: n8n claims the reserved notification, sends SMTP,
then records the outcome. Evaluation, claim and receipt responses must all have
`ok:true`; error JSON is treated as workflow failure.

## Clock, preservation and reset

The owner-only panel shows business time, real execution time, mode and record
counts. Its controls set due time, five minutes before manager alert, manager
threshold, acknowledgement deadline, leadership threshold or an explicit ISO
time. They update the same time source consumed by the state engine and n8n.

Before changing scenarios, use **Preserve current QA records** and confirm a
successful snapshot receipt. This stores a compressed snapshot in private
backend properties, including tasks, settings, history, alerts and business time.
The bounded snapshot fails safely if too large. **Reset QA records** clears only
the pinned QA cycles/history/alerts, updates the four start dates and holiday
configuration, regenerates cycles through the engine, and selects safe Mailpit
mode. Select `DRY_RUN` for calendar-only scenarios before executing workflows.

**Restore preserved QA records** validates the snapshot and grid, saves a
separate recovery snapshot, then restores the tasks, all settings and original
recorded events. Captured mail is retained. Restored historical execution times
retain their original meaning; restoration itself returns a fresh actual time.
Sheets does not provide an atomic transaction across tabs. On failure, the
snapshot remains available for retry; the guarded `qaAdminRecoverRestore`
function restores the state saved immediately before restoration.

The adapter normalizes Google Sheets time cells to `HH:mm` before the engine
clones state. Backup/restore normalizes those settings too, avoiding historic
1899 date serialization in SLA timestamps. Compressed restore blobs explicitly
use `application/x-gzip`, as required by the live Utilities operation.

The original workbook is explicitly forbidden throughout. A reset deliberately
starts a new demonstration: previously captured emails remain, so inspect the
relevant run's record/timestamp range when comparing message counts.

## Trust limit

Sheet writers can change the shared sidebar code. A compromised client could
harvest short-lived employee/manager identity tokens. Keep these participants
trusted; the private backend restricts such tokens to their assigned roles and
keeps administrator actions, external recipients and automation secrets outside
the shared project. This is not a hardened public multi-tenant application.

## Optional real failure probe

The sanitized `qa-smtp-failure-probe.json` is an independent inactive copy of
leadership orchestration. Give it a separate QA SMTP credential using the existing
private Mailpit service and a port verified to refuse connections. Keep its URL
and automation credential identical to QA; never modify normal SMTP credentials.
Preserve the main QA records, start the Friday/holiday scenario, reserve manager
alerts in DRY_RUN, select MAILPIT, then run normal manager orchestration. Four real
captures prove mode isolation. Advance to leadership threshold and execute the
failure probe: expect a visible execution error and UNKNOWN rows without sent
timestamps. Repeat: no new reservations or SMTP call. Save evidence and verify
capture counts before restoring the main scenario. This resettable diagnostic
is not permission to clear uncertain production sends and retry blindly.

## Role-labelled repeatable scenario

Configure `QA_ADMIN_EMAIL` as Employee A (daily) and `QA_MANAGER_EMAIL` as the
separate manager. Use **Configure four roles** once when adopting older QA records;
it preserves a private backup and maps B/C/D to distinct dummy assignments. Then
reset only QA to a fresh start date. Reset preserves task identities.

Use the normal Sheet My tasks sidebar for real accounts. Only the owner panel
can simulate B/C/D. Select the exact dummy cycle and enter its valid Ticket ID;
inspect SIMULATED actor, administrator initiator, proof and next cycle in history
and dashboard. Employee A and any task mapped to a real account are excluded
from simulation. Never present dummy simulation as Google authentication.

If Google multi-login selects a different callback account, the client retains
the Sheet menu's verified identity token only in sidebar memory. Reopen the
sidebar after expiry. Do not put identity tokens in URLs, logs or Sheet cells.
The final QA scenario uses one real employee, one real manager and three distinct
dummy employees. A second real employee is an optional ownership check.
