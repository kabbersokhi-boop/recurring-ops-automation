# Presentation workbook and private acceptance environment

## Two workbooks, two purposes

**Recurring Operations — Demonstration** shows the product: Operations Overview,
Employee Work, Manager Review, Activity History and Notification Evidence.
These views read the existing protected engine tables; sidebar submissions use an
independent Apps Script backend pinned to this workbook. The original prototype
and private QA IDs are explicitly excluded from its backend configuration.

**PRIVATE QA — TEST MODE** retains the eight integrated acceptance scenarios,
separate employee/manager identities, administrator-labelled dummy completions,
actual n8n execution records, SMTP captures and verified Gmail Inbox evidence.
Its current records were preserved during presentation finalization.

An empty presentation Notification Evidence view means no alerts have been
recorded in that workbook. It does not invalidate the separate QA captures and
is not itself proof of delivery. QA records are never copied into presentation
history or notification logs.

## Checks performed on the presentation deployment

See [actual presentation readbacks](evidence/presentation/verification.json).

| Check | Actual result |
| --- | --- |
| Authenticated structured daily completion | One completion and one history event; meaningful report, pending count and blockers |
| Real execution timestamp | Retained independently of simulated business time |
| Next daily cycle | Real n8n recurrence created `DAILY:2026-10-22` once |
| Repeated recurrence | Created zero additional cycles |
| Repeated authenticated completion | Sidebar reported duplicate prevented; counts unchanged |
| Overview/employee/history/manager views | Read the resulting actual state; all four distinct employees remain visible |
| Private QA preservation | 8 cycles, 5 Completed, 6 history events, 3 alerts retained |
| Local regressions | 22/22 passed again on 2026-10-13 |
| New presentation alerts/manager acknowledgement | Not run; separately verified QA evidence is retained |

The final presentation state has 5 cycles, 1 Completed, 1 history event and
0 alerts. Its business clock is Thursday 22 October, 09:00 India time; the real
completion occurred on 13 October. All three presentation n8n workflows are
inactive. No additional external email was required for these checks.

## Access and deployment

The presentation workbook is an **administrative/reviewer demonstration**, not a
production-secure employee-by-employee portal. It consolidates all four fictional
employees for review. Hidden tabs and protected ranges do not prevent an editor
from reading workbook data. Viewers cannot perform authenticated sidebar writes.
The owner provides controlled viewer access privately; public link sharing has
not been authorized or enabled. Google may reveal the file owner's identity in
its own metadata even though cells and public recordings use role aliases.

All twelve tabs, including hidden data tables, were scanned across their complete
current grids. The unused inherited `qaWebAppUrl` value in Settings B13 was
removed; the bound client reads its separate private Script Property. No private
email addresses, resource URLs or credential patterns remain in these cells.
[Executed cell review](evidence/presentation/cell-privacy-review.json). The
backend readback after this cleanup retains exactly the same four task definitions,
five cycles, one history event and zero alerts.

A company must deploy with its own Google identities, backend and OAuth audience,
automation tokens, notification recipients and credentials. Keep backend code,
secrets and writable state outside shared employee files. Give each employee an
access-separated Sheet client or another approved restricted Google interface,
and verify the permitted task owner on every backend mutation. Managers use their
own authenticated interface and cannot impersonate employees.

## Reproduce the independent presentation installation

1. Follow [private backend setup](qa-setup.md) using a NEW private workbook and
   separate backend/client projects; never reuse the accepted QA workbook ID.
2. Compile `node scripts-build-presentation-backend.cjs /PRIVATE_PATH/Code.gs`.
   The compiler preserves the same engine and adds presentation isolation and
   role-alias storage. Use `appsscript.presentation.json` for the backend.
3. Configure private `QA_SHEET_ID`, `QA_ADMIN`, `QA_MANAGER`, OAuth audience,
   token, QA-only settings and `PRESENTATION_FORBIDDEN_SHEETS` containing the
   original and accepted QA workbook IDs. Never commit these values.
4. Install `PresentationClient.gs` as bound `Code.gs`,
   `PresentationSidebar.html` as `Sidebar.html`, and
   `PresentationManagerSidebar.html` as `ManagerSidebar.html`, with the existing
   client manifest. Pin `PRESENTATION_SHEET_ID` and `PRESENTATION_BACKEND_URL`.
5. Deploy the owner-only administrator UI and separately token/Google-ID-token
   protected RPC. The presentation wrapper rejects `GMAIL_TEST`; its external
   recipient allowlist is empty. Use Mailpit or dry-run only.
6. Set up derived views against the unchanged backend column schema. Preserve
   the actual user's native workbook design; formatting scripts are optional
   initial-build material and must not be rerun over a prepared workbook.
7. Import independent n8n workflows with a new private credential. Leave them
   inactive; run only explicitly selected demonstration executions.
8. Verify the deployed source digest, authenticated submission, readback and
   isolation before giving controlled viewer access.

Do not reset either existing workbook to replay the primary video. The recording
combines newly recorded presentation actions with clearly labelled retained QA
evidence. Use a separate disposable environment for future destructive tests.
