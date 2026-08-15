# Apple Watch surface spike

## Decision

The first watch surface should be a WidgetKit complication and Smart Stack widget, paired with a focused watchOS app. A third-party replacement watch face is not part of the implementation promise: the supported model is a complication that users place on an Apple watch face, plus the app and Smart Stack surface.

## Product slice

- Show the active timezone's current time and a compact solar-state cue.
- Offer configurable complications where the system supports configuration.
- Tap-through opens the relevant day in the watch app or paired iPhone app.
- Use timeline entries for solar transitions and a clearly labeled stale state when refresh is unavailable.
- Keep the watch surface glanceable; the full dial remains on iPhone and web.

## Technical direction

- Use SwiftUI and WidgetKit for watch complications and Smart Stack.
- Share a small, versioned snapshot model with the iPhone app through an app group or the app's sync layer.
- Keep the complication payload small and avoid treating background refresh as real-time delivery.
- Provide placeholders and privacy-safe content for locked, signed-out, offline, and missing-location states.

## Constraints and risks

- Complications are hosted inside Apple's supported watch-face templates; the product cannot assume control of the complete face layout.
- Timeline refresh is system scheduled, so solar transitions need graceful approximation and stale-data handling.
- Pro entitlement must be checked by the shared account/sync layer, not by a local watch flag.
- Weather, UV, and precipitation should be optional and omitted when the snapshot is stale or unavailable.

## Acceptance test matrix

| State | Expected result |
| --- | --- |
| Active and fresh | Current time and solar cue are readable at a glance |
| Offline or stale | Last update is identifiable; no fabricated weather value is shown |
| Locked | Privacy-safe placeholder is shown |
| Signed out | Sign-in/deep-link action is available without exposing private data |
| Complication tapped | Correct timezone/date opens in the watch or iPhone app |
| Pro unavailable | Surface is hidden or shows an upgrade path; no client-only unlock |

## References

- [Apple: Creating complications for your watchOS app](https://developer.apple.com/documentation/clockkit/creating-complications-for-your-watchos-app)
- [Apple: Widgets and watch complications](https://developer.apple.com/documentation/widgetkit/widgets-and-complications-collection)
- [Apple: Creating accessory widgets and watch complications](https://developer.apple.com/documentation/widgetkit/creating-accessory-widgets-and-watch-complications)
