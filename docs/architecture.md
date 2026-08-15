# Solstice architecture

## Current surface

The dial is the only rendered planning surface. Plans can be created and persisted, but event visuals are intentionally not mounted on the dial yet.

## State

`SolsticeState` is versioned and stored under `solstice.state.v1` in local storage. It contains saved timezone/location records, the active timezone ID, and plans.

Timezone records include an IANA timezone plus latitude and longitude because sunrise and sunset are geographic values, not timezone-only values.

## Event readiness

`src/lib/events.ts` converts persisted plans into date-filtered `EventSegment` records. It handles:

- recurring-date expansion;
- overnight plans split at midnight;
- plan type color semantics;
- hard-stop metadata;
- overlap column assignment.

The module is intentionally not imported by the dial UI until event rendering is enabled in a later phase.

## Recurrence rules

- Monthly dates use the last available day when a month is shorter.
- Annual February 29 plans use February 28 in non-leap years.
- One-time dates are normalized to the selected timezone.
