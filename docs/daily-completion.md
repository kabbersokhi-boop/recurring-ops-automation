# Daily task completion tracking

The employee completes the operational action, then records it once in **Employee_Queue → Ops Tasks → My tasks**. Daily tasks use the same sidebar as portal tasks and do not require a Ticket ID.

For a WhatsApp update, the employee shares the update in the required group and uses **Work completed today** to describe that action, for example: “Shared the operations update in the team group at 16:40.” They enter pending work, a nonnegative pending count, and blockers; “None” is valid when there are none. Remarks are optional. The employee selects **Submit completion** once. No second Sheet update is required.

The script obtains the signed-in Google identity, checks that it owns the cycle, validates the report, and saves the report, completion time and actor in Employee_Queue and one Task_History event. A repeated submission returns a duplicate result. Each working day has its own cycle, so an unresolved previous day remains visible.

This is an employee attestation supported by a structured report. The prototype does not read WhatsApp, confirm group-message delivery, validate a portal ticket against its source system, or prove the underlying action occurred. The manager can inspect the report and sample the source group or portal during review. Automatic external proof verification would require a separately authorized integration.

The private QA Sheet was tested through the live employee sidebar with a verified Google identity. The structured report completed its daily cycle without a ticket, recorded one history event and both business and actual timestamps. Repeating the recorded submission created no second event. See [acceptance evidence](../tests/test-results.md). The original prototype remains dummy-only.
