# Test case inventory

The eight required tests are implemented as the first eight named subtests in `automated/engine.test.cjs`. Each uses an injected clock and a fresh in-memory state. Three further tests cover proof validation, wrong identity, late completion, simultaneous cycles, daily independence and uncertain delivery. See [results](test-results.md) for actual execution status and [demo script](demo-script.md) for a concise walkthrough.
