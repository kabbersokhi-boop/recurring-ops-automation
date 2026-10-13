# Architecture and design decisions

```mermaid
flowchart TB
  E[Employee Sheet sidebar] -->|Google ID token| B[Private Apps Script backend]
  M[Manager Sheet sidebar] -->|Google ID token| B
  A[Owner-only QA clock, reset and labelled dummy simulation] --> B
  N[n8n recurrence / manager / leadership] -->|QA automation token| B
  B <--> S[(Private QA Google Sheet)]
  B -->|MAILPIT outbox reservation| N
  N -->|locked claim then SMTP| P[Existing private Mailpit]
  N -->|delivery receipt| B
  B -->|allowlisted GMAIL_TEST only| G[Controlled Gmail inbox]
```

Google Sheets remains the primary employee and manager interface. The shared
bound project contains only the sidebar client and a nonsecret backend URL.
The existing engine and selected Sheet adapter functions run in an owner-only
standalone project. This separation prevents Sheet editors from acquiring the
backend's automation secret, clock controls or recipient configuration.

Consumer Google accounts are authenticated using `ScriptApp.getIdentityToken()`
in the bound client. The backend validates the Google token through tokeninfo,
its audience, issuer, verified email and expiry against real time. Client-supplied
actor names are never trusted. Blank identity is rejected. Manager identity is
configured separately from notification recipients. The Sheet menu obtains the
Google-signed identity once and keeps it only in that sidebar memory, avoiding
multi-login callback account switching. Every backend request verifies the token. The original deployment
continues separately with dummy identities and dry-run schedules.

## State and concurrency

The private backend uses a script lock to serialize state changes. Cycle IDs
combine task ID and due date. Completion records proof, authenticated actor,
business timestamp, actual execution timestamp and one history event, then
creates the linked periodic cycle. Repeated completion returns `duplicate:true`.
Daily recurrence generates one cycle per working day independently of older
unresolved daily work.

Notification keys contain transport, level and cycle ID. A dry-run record cannot
suppress a later Mailpit or Gmail test. Apps Script alone evaluates SLA rules;
n8n schedules and transports messages without reimplementing those rules.
Mailpit uses `QUEUED → SENDING → SENT` with a locked claim before SMTP. Uncertain
outcomes remain `UNKNOWN` or `SENDING` for reconciliation rather than blind retry.
SMTP and Sheets cannot commit atomically; this is retry deduplication, not a
promise of exactly-once delivery after every possible crash.

## QA tabs

| Tab | Purpose | Writer |
| --- | --- | --- |
| Task_Master | Four definitions, identities and recurrence | Administrator |
| Demo_Control | Visible TEST MODE, clock, interface instructions | Backend |
| Employee_Queue | Cycle state, proof, completion and next cycle | Backend |
| Task_History | Completion and acknowledgement audit events | Backend |
| Manager_Dashboard | All employee IDs/cycles, completed/pending/overdue, proof, review and resolution | Backend |
| Alert_Log | Reservations, delivery state and actual timestamps | Backend |
| Settings | Holidays, SLA and QA configuration | Administrator |

All seven QA tabs have whole-sheet owner-only protections. Employees and the
manager use sidebars to update state; the owner can still edit protected cells.
The administrator panel is a separate owner-only web deployment. The automation
endpoint allows public access at Google's deployment layer, but every POST is
validated using either the private automation token or a role-scoped Google token.

See [QA setup](qa-setup.md), [SLA](sla-logic.md), [acceptance results](../tests/test-results.md)
and [limitations](limitations.md). Local tests exercise the shared engine and
original adapter; they do not substitute for live identity or delivery evidence.

Dummy B/C/D simulation is QA-only and owner-guarded. It uses the shared completion
engine and lock, then records `SIMULATED:EMP-X`, action mode, administrator initiator
and actual execution time. Real assigned accounts cannot use this simulation path.
The normal employee RPC accepts only Google-verified ownership.

## Independent presentation deployment

The presentation workbook provides five derived product views and retains the
same seven underlying state/configuration tabs. A separate client, backend,
Google token audience, automation token and n8n workflows pin all writes to this
workbook. Its backend explicitly rejects the original and accepted QA workbook
IDs. No accepted QA history or alert is copied into the presentation environment.

```mermaid
flowchart LR
  P[Presentation Sheet: product interface] <--> PB[Independent presentation backend]
  PN[Inactive presentation n8n workflows] --> PB
  Q[Private QA: retained acceptance records] <--> QB[Existing private QA backend v11]
  QN[Inactive QA workflows: existing real executions] --> QB
  O[Original prototype and dry-run schedules]
```

Presentation cells use stable role aliases; Google-verified identities remain
private. `GMAIL_TEST` is rejected by this deployment. New checks proved daily
submission, independent next-day recurrence, replay prevention and unauthenticated
request rejection. Manager and delivery acceptance proof remains scoped to QA.

The shared presentation workbook is an administrative/reviewer demo. Sheet
protection and hidden tabs do not isolate read access between editors. A company
needs its own accounts, credentials, recipient configuration and access-separated
employee clients. [Deployment/access plan](presentation-environment.md).
