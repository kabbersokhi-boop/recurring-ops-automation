# Independent presentation workflows

These sanitized exports use `OPS_PRESENTATION_WEB_APP_URL` and a NEW private
HTTP Custom Auth credential (`{"body":{"token":"PRIVATE_TOKEN"}}`). Never point
these workflows at the accepted private QA or original workbook deployments.
Bind the SMTP placeholder to the existing private Mailpit credential. Actual
local imports used independent presentation URLs and credentials; all three
workflows remain inactive.

Only recurrence was executed for presentation verification: created 1 next daily
cycle, then 0 on repeat. Manager/leadership proof remains in retained private QA.
Do not run them or activate schedules simply to reproduce the final recording.
The presentation backend rejects external Gmail mode. See
[private installation and access](../../docs/presentation-environment.md).
