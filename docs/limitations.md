# Verified limits and outstanding checks

The private QA workbook has genuine employee sidebar completion, linked
recurrence, structured daily proof, Mailpit manager and leadership capture,
normal retry deduplication and overlapping n8n execution evidence.
This does **not** establish every end-to-end acceptance case.

## Outstanding acceptance

- Authenticated second-account manager acknowledgement and later resolution.
- Independent inspection of the receiving controlled Gmail inbox.
- Overlapping first-time employee submissions and injected transport failures.
- A complete screen recording with both authenticated roles, if safe capture
  and second-account authorization are available.

The acceptance report distinguishes these gaps from local logic tests and actual
SMTP capture. Sending API success is not independently verified inbox delivery.
Mailpit is a private SMTP sink; logical `.test` recipients are not real mailboxes.

## Operational limits

- Google ID-token validation was exercised with the authenticated employee.
  The shared Sheet client is editable by trusted Sheet writers; a malicious
  client editor could harvest short-lived tokens. The private backend still
  restricts roles and keeps admin actions/secrets outside that shared project.
- A notification already claimed for sending can be in flight when an employee
  completes or a manager acknowledges. The claim checks current state, but an
  in-flight SMTP message cannot be retracted.
- SMTP and Sheet updates are not an atomic transaction. `SENDING` / `UNKNOWN`
  require reconciliation. Do not clear their keys and blindly resend.
- QA backup/restore uses a bounded compressed private property and multiple
  tab writes. Validation and a recovery snapshot reduce risk; Sheets does not
  provide a cross-tab transaction.
- Business time is deliberately simulated in QA. Actual execution and mail
  capture timestamps remain real. This does not show that a scheduler waited
  through several real days.
- Ticket IDs and daily reports are employee attestations. External portals,
  WhatsApp messages and the underlying operational work are not independently
  validated.
- Same-day delivery depends on service availability. Scheduling retries catch
  up after downtime; they cannot deliver during an outage.
- The original prototype's deployment and active dry-run schedules remain
  separate. QA manual workflows are inactive as schedules to avoid uncontrolled
  sends while changing business time.

No assignment was submitted and no employer or company mailbox was contacted.
Private resource links, controlled Google account addresses and infrastructure
credentials are supplied privately, never in repository configuration or evidence.
