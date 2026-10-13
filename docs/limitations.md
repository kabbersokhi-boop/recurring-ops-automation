# Verified limits and outstanding checks

The private QA workbook has genuine employee sidebar completion, linked
recurrence, structured daily proof, Mailpit manager and leadership capture,
normal retry deduplication and overlapping n8n execution evidence.
All eight assignment cases have integrated QA evidence, including a separate
manager's authenticated acknowledgement and receiving Gmail Inbox inspection.
This is a controlled demonstration, not a production rollout.

## Scope and unverified checks

- Employee A and manager identities are verified. B/C/D actions are secure
  administrator-initiated SIMULATED actions through the same engine, explicitly
  labelled with dummy actor and actual administrator initiator. Earlier portal
  UI testing temporarily assigned tasks to the owner.
- Two distinct authenticated employees submitting at the same instant remain
  unverified. Two real overlapping dummy-simulation executions and overlapping
  n8n runs are verified. The optional additional employee account reached a
  sign-in challenge; no password was requested or inspected.
- Actual refused SMTP is verified. A crash after SMTP success before its receipt
  remains untested; uncertain outcomes require reconciliation.
- QA manual workflows have inactive schedules. Original active dry-run schedules
  were verified previously and remain separate. No multi-day real-time scheduler
  waiting is claimed.

SMTP capture and actual receiving Gmail Inbox evidence are reported separately.
Only the two approved external messages were sent; repeated tests use Mailpit.

## Operational limits

- Google ID-token validation was exercised with the authenticated employee and separate manager.
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
