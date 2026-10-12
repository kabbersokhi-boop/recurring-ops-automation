# Current deployment status and limitations

- The native Google Sheet was created and read back. The Apps Script project has **not** been attached or authorized because the connected Google Drive/Sheets tools do not expose Apps Script project creation or deployment, and this machine has no `clasp` OAuth session.
- Three workflows were imported into the local n8n instance and verified by export. They remain **inactive** because the Apps Script endpoint and private environment variables are not configured. No n8n end-to-end run is claimed.
- The 14 automated tests execute the engine and mocked Apps Script service locally with an injected clock. They do not prove live Google identity, Sheet permissions, n8n execution, or email delivery.
- No real email was sent. MailApp's API does not provide a provider message ID; Alert_Log leaves that field blank. `UNKNOWN` status requires operator reconciliation.
- A bound script running as an editor can write the shared queue, and a trusted Sheet editor could also alter queue cells directly. For production, separate employee forms from an owner-only state workbook or enforce a more restrictive Workspace deployment.
- Apps Script writes multiple tabs under one document lock, but Sheets does not provide a multi-tab database transaction. The engine repairs missing completion/acknowledgement history on the next write; operators should inspect inconsistent state after a Sheet API failure.
- The current live manager dashboard is a seeded snapshot until the Apps Script adapter is deployed. Subsequent state writes refresh it.
- The n8n workflow HTTP nodes use environment expressions. Confirm that the target n8n instance permits expression access to those variables before activation.
