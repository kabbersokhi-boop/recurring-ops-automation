# Deployment record — 2026-10-13

The full assignment was read before this continuation. The preserved acknowledgement-deadline change was retained; all three local test files passed, with **19 passed and 0 failed**. Existing adapter and sidebar assertions were extended to verify dashboard headers, deadline values and the Late label.

## Source and deployment

The verified private Sheet was opened in a dedicated Chrome window. **Extensions → Apps Script** opened its bound project successfully. The prepared project combines TaskManager.gs and Code.gs in one Code.gs file; their concatenated repository source was saved there. ManagerSidebar.html was also updated and saved. No setup/reset function was run.

The existing web app was updated through **Manage deployments → Edit → New version → Deploy**. Google confirmed **version 4 at 03:43 Asia/Kolkata**. The existing endpoint and private token were retained. [Sanitized confirmation](screenshots/deployment-version-4.png) excludes the deployment ID and URL.

## Fresh checks

| Check | Actual result |
| --- | --- |
| Direct deployed recurrence POST | `{"created":0}` |
| Repeat recurrence POST | `{"created":0}` |
| Direct deployed manager POST | `{"alerts":0}` before the deadline |
| Direct deployed leadership POST | `{"alerts":0}` before the escalation threshold |
| n8n active workflow inventory | All three Recurring Ops schedules listed as active |
| Manager_Dashboard | Four pending task cycles; column I shows `2026-10-14T10:00:00+05:30` acknowledgement deadline |
| Escalation deadline | `2026-10-14T14:00:00+05:30` for the same four cycles |

[Dashboard readback](screenshots/manager-dashboard-acknowledgement.png) excludes the private Sheet URL. Only the new deadline column and a neighbouring shifted header were fitted to content. Task_Master and Settings were not changed. The temporary clipboard helper was stopped after deployment.

Earlier n8n workflow executions succeeded against the endpoint; this continuation checked their active status and directly checked the updated endpoint. It did not rerun manual n8n workflow executions.

## Acceptance limits

The user chose to keep dummy `.invalid` identities and `dryRun=true`. No real email was sent. Zero-alert calls before the deadline verify connectivity, not overdue alert creation or delivery. Live employee completion, live manager acknowledgement, completion-driven next-cycle/history persistence, actual manager/leadership delivery and live concurrent submissions remain unverified. The project is not fully verified end to end.

The original browser window was not inspected. Private connection files and the original assignment are excluded from the public repository. See the [requirement audit](requirements-checklist.md) for the status of every requirement and demonstration.
