# Eight-case demonstration script

The fast demonstration is reproducible with `node --test tests/automated/engine.test.cjs`; each named subtest prints `ok` or `not ok`. The local engine accepts a supplied ISO timestamp, so no waiting across days is required. The live Sheet demonstration needs the Apps Script setup described in `docs/setup.md`.

1. **Recurrence:** complete `P7:2026-10-09` with `OPS-123`; inspect the linked `P7:2026-10-16` cycle.
2. **Single point:** inspect `P7` in the employee queue; submit one Ticket ID; inspect one completed cycle and one history event.
3. **Daily report:** submit work completed, pending work/count and blockers for `DAILY:2026-10-09`; inspect proof without a Ticket ID.
4. **Manager alert:** advance clock to 17:14, then 17:15 on the due day; compare alert candidate counts.
5. **Acknowledgement:** reserve a manager alert and acknowledge it; confirm task remains Pending.
6. **Leadership:** leave the task unresolved and advance to the next working day at 14:00; inspect leadership candidate.
7. **Timing:** use Friday 2026-10-09, weekend and Monday holiday; show escalation occurs Tuesday 2026-10-13 at 14:00, not 13:59.
8. **Duplicates:** rerun recurrence, completion and alert reservation; inspect zero new cycles and duplicate flags.

The three extra tests cover invalid proofs, wrong identity, late completion, simultaneous tasks, daily independence and uncertain email delivery.
