# iPhone widget integration notes

`SolstimeWidget.swift` is the WidgetKit extension scaffold for ST-211. Add it to a Widget Extension target in Xcode and share `DialSnapshot` through a small app-group snapshot store once the account/sync layer exists.

The production provider should:

- read the latest authorized snapshot from the shared store;
- schedule refreshes around solar transitions, subject to system limits;
- expose timezone/theme configuration through App Intents;
- use privacy-safe content while the device is locked;
- distinguish stale data from current data;
- deep-link to the selected date and timezone;
- hide or explain unavailable Pro state without trusting a local entitlement flag.
