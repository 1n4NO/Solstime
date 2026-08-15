# Mac desktop widget spike

## Decision

Use Electron for the first desktop surface. The web app already owns the dial, theme system, locale system, and entitlement model, so Electron can host a compact read-only shell around the canonical web view while the product matures. Hammerspoon remains a possible lightweight follow-up for users who want a native scripting workflow.

## First release shape

- A frameless, resizable desktop window with a compact dial view.
- A click-through action that opens the canonical web app.
- The active timezone and selected theme carried from the shared account state.
- Cached last-known solar, weather, temperature, UV, and event data.
- An explicit stale/offline indicator when refresh is unavailable.
- No calendar write access and no background microphone, location, or contacts access.

## Data and refresh contract

The widget should request only the read model needed to draw the dial. Refresh on launch, when the window becomes visible, and on a bounded timer. Weather and UV data should use the same cache and failure semantics as the web app. A stale timestamp must remain visible when the network is unavailable.

## Packaging and privacy

The first packaging spike should cover macOS signing, notarization, auto-update strategy, uninstall behavior, and whether the widget runs as a normal window or a menu-bar companion. Account tokens must stay in the platform-protected store; the renderer must not receive broad filesystem access.

## Acceptance checks for the spike

- Electron can render the existing dial route without duplicating dial logic.
- A compact window remains usable at the smallest supported size.
- Offline and stale states are visible and recover on reconnect.
- The process stays idle when hidden and does not poll aggressively.
- The install and removal path is documented before a public beta.
