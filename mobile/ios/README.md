# iPhone surface

This directory contains the first native iPhone shell for the Pro surface. Open `SolstimeApp.swift` in Xcode and add it to an iOS SwiftUI target when the native project is created.

The shell intentionally renders a compact, readable dial summary first. The shared snapshot contract keeps the native surface independent from the web DOM and leaves room for the full dial renderer, events, timezone navigation, and offline sync.

## Native integration contract

`DialSnapshot` is the boundary between the account/sync layer and the view. Production code should populate it from the canonical synchronized model, never from a client-only Pro flag.

Required states:

- fresh snapshot
- stale/offline snapshot
- signed-out state
- locked/private placeholder
- unavailable Pro entitlement

The app should use Dynamic Type, VoiceOver labels, reduced-motion preferences, and a deep link containing the selected date and timezone.
