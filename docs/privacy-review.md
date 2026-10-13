# Publication privacy review — 2026-10-13

Executed scan of all repository files (including untracked publication material)
against 21 privately loaded values: original/QA endpoints, project/deployment and
Sheet IDs, automation tokens, credential identifiers, OAuth audience and four
controlled account addresses. Additional patterns cover Google API/OAuth keys,
Google ID tokens, GitHub tokens, private keys, real Sheet links and non-placeholder
Apps Script URLs. No findings. Private values themselves are never printed.

All 31 PNGs had metadata checked and public images were visually reviewed using contact sheets
and individual inspections of newly redacted images. Browser tabs/URLs, private
account identities and unrelated resources are excluded by actual crops and opaque
redactions. Existing dummy `.invalid` and Mailpit `.test` addresses are intentional.
The screen review records only dedicated task-owned windows; every segment is
cropped/redacted before publication and reviewed at beginning/middle/end.

Public workflow exports contain endpoint/credential placeholders. Real imports,
connection files, execution payloads and Google identities stay outside Git.
Public readbacks replace real actors with QA role placeholders and retain genuine
cycle IDs, proof, counts and business/actual timestamps. Git author uses the public
GitHub noreply identity. The assignment DOCX, private files and browser profiles
are excluded. No UI result, email receipt or video action was fabricated.

[Actual acceptance scope](../tests/test-results.md) distinguishes real authenticated
roles, labelled dummy simulation, SMTP capture and independently verified Gmail Inbox.

[Publication verification](evidence/qa/publication-verification.json) records the
executed scan, visual checks, 5:10 video duration and acceptance scope.
