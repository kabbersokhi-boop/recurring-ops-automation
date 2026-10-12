# Test case inventory

The eight required assignment cases are the engine subtests whose names begin with 1 through 8 in `automated/engine.test.cjs`; the additional acknowledgement-deadline test sits between cases 7 and 8. There are **12 engine tests**, including proof/identity rejection, late completion, simultaneous tasks, independent daily cycles and uncertain-delivery deduplication.

Four `automated/apps-script.test.cjs` tests cover grouped alert sending with mocked MailApp, uncertain delivery, mocked document-lock contention and date normalization. The grouped-alert test also verifies the dashboard header migration and acknowledgement deadline/Late state. Three `automated/sidebar.test.cjs` tests cover one portal submission, one daily submission and manager deadline rendering/acknowledgement through the shared service.

All 19 tests use dummy-only local state or mocks. They do not establish real Google permissions, delivery or concurrent live writes. See [results](test-results.md) for executed evidence and [demo script](demo-script.md) for the walkthrough.
