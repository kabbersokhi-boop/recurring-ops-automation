# Deployment record — 2026-10-13

## Preserved original

The original private six-tab dummy prototype remains on its earlier version 4
bound web app. Its three n8n dry-run schedules remain active. QA work did not run
`setupPrototype()` or reset the original workbook. Earlier original screenshots
are historical connectivity evidence, not the new QA acceptance proof.

## Private QA deployment

| Component | Actual status |
| --- | --- |
| QA Google Sheet | Separate private seven-tab workbook, four dummy tasks; approved manager sharing only; whole-sheet owner-only protections |
| Shared bound script | Minimal Sheet client, existing sidebars, verified Google ID-token RPC; current-Sheet scope, UI, identity and backend fetch only |
| Owner-only standalone backend | Shared engine and selected adapter compiled; private Sheet pin, original exclusion, role checks, locking, transport and admin controls |
| Automation / user-RPC deployment | Execute as owner; Google-layer Anyone access; every POST requires QA automation token or verified role-scoped Google identity |
| Administrator deployment | Execute as owner, Only myself; all admin entry points check active administrator identity |
| Latest backend | Version 7, created 2026-10-13 at 10:20 Asia/Kolkata; gzip restore and Sheet time-cell normalization fixes |
| QA n8n | Three existing-installation workflows imported with independent IDs/credentials; schedules inactive, actual manual execution records saved |
| Mailpit | Existing service reused on private Docker network; actual SMTP capture, no external relay configured |
| Gmail transport | MailApp accepted two allowlisted test sends; receiving inbox remains independently unverified |
| Old shared privileged endpoint | Retired; actual HTTP 404; old shared properties cleared and QA token rotated |

Both backend deployments are updated to version 7. The deployed automation
endpoint's source digest is checked against the generated repository source.
The backend manifest explicitly declares Sheets, verified identity, external
fetch and mail scopes; the shared Sheet client does not have mail or broad
unrelated Sheet access.

The Sheet was opened in a dedicated browser window. The user's original browser
window and unrelated Google resources were not inspected. OAuth authorization
was performed only for the task's projects. Private endpoints and connection
configuration are stored separately, never in public exports.

## Genuine post-deployment behavior

- Actual employee ticket and daily sidebar submissions persisted proof, identity,
  business/actual timestamps and exactly one event each.
- Actual n8n manager/leadership SMTP sends yielded 2+2 Mailpit captures; normal
  retries reserved zero and added no captures.
- Real calendar clock + workflows skipped weekend/holiday and observed threshold
  boundaries. Overlapping manager runs reserved 4/0; recurrence created 1/0.
- The first live restore failed before modifying preserved state because gzip
  input lacked content type. Version 6 restored cycles/history/alerts exactly; a subsequent visible dashboard check found time-cell coercion, fixed in version 7,
  including original real timestamps. Private compressed backup is retained.
- All 19 existing local regressions passed after source changes.

Read [acceptance results](../tests/test-results.md) for exact counts and remaining
authenticated manager / receiving-inbox checks. No full end-to-end success is claimed.
