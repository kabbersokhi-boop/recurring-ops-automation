# Publication privacy review — 2026-10-13

Before publication, repository text was scanned for the exact private Sheet,
project/deployment IDs, QA and original automation secrets, credential IDs,
client audience and controlled Google account addresses. Credential patterns,
unapproved email domains and private endpoint patterns were also checked.
No private matches remain. The original `.env.example` contains an explicit
`REPLACE_WITH_DEPLOYMENT_ID` placeholder, which was reviewed as a placeholder.
Reserved `.invalid`, `.example` test addresses and Mailpit `.test` labels are intentional.

All 17 public PNGs were visually reviewed: seven historical original images and
ten new QA images. Browser URLs, private account columns, credentials and unrelated
resources are excluded by genuine crops. PNG metadata was checked for private
values; no reconstructed business result or fabricated video was used.

Public QA workflow exports contain endpoint and credential placeholders; private
imports and execution logs remain outside the repository. Public readbacks replace
actual account addresses while retaining genuine cycle IDs, counts, proof and
business/actual timestamps. Commit author uses the repository account's GitHub
noreply address. The DOCX, private connection files and browser profiles are excluded.

This is an executed publication review, not proof of complete acceptance. See
[remaining checks](../tests/test-results.md).
