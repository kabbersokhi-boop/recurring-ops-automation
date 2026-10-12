# Genuine evidence recorded during build

- The private Google Sheet has six tabs: Task_Master, Employee_Queue, Task_History, Manager_Dashboard, Alert_Log and Settings. The workbook is restricted and has four dummy Pending cycles. [Employee queue screenshot](screenshots/employee-queue.png).
- Bound Apps Script `recurrenceNow` completed in the editor. [Execution log screenshot](screenshots/apps-script-execution.png). The deployed web app POST returned `{"created":0}` on an idempotent recurrence call.
- n8n 2.39.8 ran each imported workflow through a temporary manual trigger, then the schedule trigger was restored. Recurrence returned `{"created":0}`; manager and leadership returned `{"alerts":0}` because their SLA thresholds had not yet passed. The three schedules were published, n8n restarted, and `list:workflow --active=true` listed all three. The separate Google Sheets OAuth credential also read Task_Master successfully during a connection probe.
- Node reported `tests 11`, `pass 11`, `fail 0` for the engine and `tests 4`, `pass 4`, `fail 0` for the mocked Apps Script adapter.
- No live email was sent. Tests with injected dates simulate alerts and escalation; they do not establish live notification delivery.
