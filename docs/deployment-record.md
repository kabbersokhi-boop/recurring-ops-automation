# Deployment record — 2026-10-13

## Preserved original

The original private six-tab dummy prototype remains on its earlier version 4
bound web app. Its three n8n dry-run schedules remain active. QA work did not run
`setupPrototype()` or reset the original workbook. Earlier original screenshots
are historical connectivity evidence, not the new QA acceptance proof.

## Private QA deployment

| Component | Actual status |
| --- | --- |
| QA Google Sheet | Separate private seven-tab workbook, four dummy tasks; approved manager and optional additional employee sharing only; whole-sheet owner-only protections |
| Shared bound script | Minimal Sheet client, existing sidebars, verified Google ID-token RPC; current-Sheet scope, UI, identity and backend fetch only |
| Owner-only standalone backend | Shared engine and selected adapter compiled; private Sheet pin, original exclusion, role checks, locking, transport and admin controls |
| Automation / user-RPC deployment | Execute as owner; Google-layer Anyone access; every POST requires QA automation token or verified role-scoped Google identity |
| Administrator deployment | Execute as owner, Only myself; all admin entry points check active administrator identity |
| Latest backend | Version 11, created 2026-10-13 at 16:53 Asia/Kolkata; role-labelled simulation, menu-pinned Google identity and corrected clock targeting |
| QA n8n | Three normal QA workflows plus one isolated inactive SMTP failure probe; independent credentials and actual manual execution records saved |
| Mailpit | Existing service reused on private Docker network; actual SMTP capture, no external relay configured |
| Gmail transport | Two allowlisted test sends; both independently observed in receiving Gmail Inbox |
| Old shared privileged endpoint | Retired; actual HTTP 404; old shared properties cleared and QA token rotated |

Both backend deployments are updated to version 11. The deployed automation
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
- All 19 existing regressions plus three QA role checks passed (22/22).

Read [acceptance results](../tests/test-results.md) for the eight integrated PASS
results, exact counts and test scope. Production rollout and two distinct
authenticated employee submissions overlapping are not claimed.

The additional refused-SMTP test produced one expected n8n error and a successful zero-send repeat. All four UNKNOWN records had blank sent timestamps. The main scenario was restored exactly, including both Gmail acceptance keys. The separate mode-isolation run added four genuine manager captures for Oct 16 cycles; current project Mailpit totals are 8 manager and 3 leadership messages. The final distinct-role Oct 15 run added C/D manager captures and D leadership capture; resolved C was excluded.

A locally reproduced early-completion self-link defect was fixed by allowing
completion from the cycle due day onward. An actual authenticated sidebar
attempt on the future Oct 20 cycle was rejected without changing any records.
The shared client labels future work Upcoming and disables its submit button.

## Final role and identity verification

Employee A uses the owner identity; B/C/D retain unique IDs and dummy assignments.
Admin simulation invokes the same engine/lock and writes SIMULATED actor, initiator
and actual time. A separate manager acknowledged C with its own Google identity;
C remained Pending, then its simulated resolution and next cycle appeared in the
manager view. Two overlapping D simulation executions created one event/cycle.

Google multi-login selected the wrong account for sidebar callbacks even though
the Sheet menu verified the manager. The client now keeps the menu's Google-signed
token only in that sidebar's memory; the backend validates it on every request.
It is never logged or written to the Sheet. Expired sessions require reopening
the sidebar. [Official Google multi-login limitation](https://developers.google.com/apps-script/guides/support/troubleshooting).

[Version 11 digest/readback](evidence/qa/role-deployment-verification.json) matches
the generated repository backend. QA schedules remain inactive; original dry-run
schedules remain active. Private role mappings and connection files stay outside Git.
