# Solstime tickets

Status values: `planned`, `in progress`, `blocked`, `done`.

## Phase 7 — Brand and reach

### ST-201 — Better logo and brand mark

- **Status:** done
- **Tier:** Free and Pro
- **Goal:** Create a durable Solstime identity that works at dial scale, app-icon scale, browser-extension scale, and watch/widget scale.
- **Scope:** Wordmark, symbol, monochrome mark, small-size variant, favicon/app icon, dark/light treatments, safe-area guidance, and exportable SVG assets.
- **Dependencies:** None.
- **Acceptance criteria:** The mark remains legible at 16px, 24px, 32px, and app-icon sizes; has accessible contrast on both product themes; is used consistently in the web app, landing page, metadata, and future surfaces; includes usage notes in `DESIGN.md`.

### ST-202 — Support 10 languages

- **Status:** in progress
- **Implemented:** ten-locale registry, persisted language preference, language selector, document direction, translated theme controls, modal labels, timezone/date controls, event/solar/UV/current-time tooltip labels, and locale-aware clock/date formatting.
- **Tier:** Free and Pro
- **Goal:** Make the product usable in ten launch languages without duplicating UI logic.
- **Scope:** Locale registry, translation keys, language selector, fallback behavior, pluralization, date/time formatting, timezone names, long-label layout, RTL readiness, translated metadata, and translation QA workflow.
- **Dependencies:** ST-201; initial language list approval.
- **Acceptance criteria:** All user-facing strings are externalized; ten locales can render the dial, modal, timezone selector, tooltips, empty/error states, and notifications; no clipped or overflowing controls at 320px width; locale persists per account/device; missing translations fall back safely to English.

## Phase 8 — Themes and product tiers

### ST-203 — Theme system foundation

- **Status:** done
- **Tier:** Free and Pro
- **Goal:** Replace one-off color rules with a tokenized theme system that every surface can consume.
- **Scope:** Semantic tokens for canvas, dial, day/night, solar, event types, weather, text, borders, focus, tooltip, and modal states; theme metadata; previews; persistence; system contrast/reduced-motion handling.
- **Dependencies:** ST-201.
- **Acceptance criteria:** A theme can be added from data without rewriting components; all interactive states remain readable; theme selection persists; theme transitions respect reduced motion; no component relies on hard-coded tier-specific colors.

### ST-204 — Three Free-tier themes

- **Status:** done
- **Tier:** Free
- **Goal:** Give Free users three complete, polished theme choices.
- **Scope:** Three distinct themes applied to the dial, landing/app shell, event arcs, weather rings, tooltips, modal, favicon, and browser/widget surfaces.
- **Dependencies:** ST-203, ST-206.
- **Acceptance criteria:** Exactly three Free themes are available without an upgrade; each has light/dark behavior or an explicit supported mode; solar, event, UV, temperature, rain, snow, and moon states remain distinguishable; previews match the selected result.

### ST-205 — Ten Pro-tier themes

- **Status:** in progress
- **Implemented:** ten named Pro theme definitions plus the special Touch Grass theme are registered and selectable in preview mode; entitlement unlock remains intentionally deferred to ST-206, the final release gate.
- **Tier:** Pro
- **Goal:** Give Pro users ten additional themes with a meaningful but coherent visual range.
- **Scope:** Ten Pro themes, theme preview gallery, locked-state treatment for Free users, and cross-surface theme propagation.
- **Dependencies:** ST-203, ST-204, ST-206.
- **Acceptance criteria:** Ten Pro themes are available to Pro users; Free users can preview but not activate locked themes; entitlement changes update immediately; each theme passes contrast and color-blind distinguishability checks.

### ST-206 — Entitlements and tier-aware feature gating

- **Status:** in progress
- **Implemented:** shared tier feature matrix helpers, entitlement status model, and normalization rules; server-authoritative enforcement remains a release gate.
- **Tier:** Platform foundation
- **Goal:** Define and enforce Free/Pro capabilities consistently across web, desktop, browser, mobile, and watch surfaces.
- **Scope:** Account entitlement model, subscription state, grace period, restore/purchase state, feature flags, offline cache rules, upgrade prompts, and server-authoritative checks.
- **Dependencies:** None.
- **Acceptance criteria:** A user's tier is consistent across surfaces; Pro content cannot be unlocked by client-only state; expired, pending, restored, offline, and signed-out states are handled; the feature matrix is documented and testable.

### ST-219 — Super Pro tier and premium capability model

- **Status:** in progress
- **Implemented:** shared Free, Pro, and Super Pro tier definitions with prices, descriptions, and capability matrix; enforcement remains with ST-206.
- **Tier:** Super Pro
- **Price:** $24.99
- **Goal:** Define the highest-value tier for shared planning, personal routines, and deeper reflection.
- **Scope:** Sharing with three family/friends, customizable watch face, alarms and notifications, dashboard access, habit tracker, Professional Insights, Journal Prompts, entitlement rules, upgrade messaging, privacy controls, and cross-surface capability mapping.
- **Dependencies:** ST-206, ST-218.
- **Acceptance criteria:** Super Pro capabilities are represented in the feature matrix and landing page; sharing is limited to three invited people; watch-face customization, alarms, dashboard, habits, insights, and prompts have clear ownership and privacy states; Super Pro cannot be activated through client-only state; pricing and upgrade copy are consistent across surfaces.

## Phase 9 — Desktop and browser surfaces

### ST-207 — Mac desktop widget for Free

- **Status:** in progress
- **Implemented:** Electron feasibility decision, desktop shell scaffold, and widget data, refresh, privacy, packaging, and acceptance contract documented in `desktop-widget-spike.md`.
- **Tier:** Free
- **Goal:** Show the Solstime dial at a glance on macOS.
- **Scope:** Evaluate Electron versus Hammerspoon, package/install flow, widget sizing, theme selection, current timezone, solar/weather refresh, click-through to the web app, and offline fallback.
- **Dependencies:** ST-201, ST-203, ST-204, ST-206, ST-218.
- **Acceptance criteria:** A user can install, configure, resize, and remove the widget; it refreshes without excessive CPU/network use; it shows a useful stale/offline state; it respects the Free theme set and opens the canonical Solstime view.

### ST-208 — Chrome new page extension for Free

- **Status:** in progress
- **Implemented:** permission-free Manifest V3 new-page shell, canonical extension surface parameter, local load instructions, and isolated deployment URL configuration.
- **Tier:** Free
- **Goal:** Replace the browser's new tab with a calm, useful Solstime view.
- **Scope:** Manifest V3 new-tab override, permissions review, dial rendering, timezone/theme settings, onboarding, restore state, and link to the full app.
- **Dependencies:** ST-201, ST-203, ST-204, ST-206, ST-218.
- **Acceptance criteria:** New-tab override works in supported Chrome versions; extension requests only necessary permissions; the dial loads quickly with cached data; users can disable/restore the default new tab; no Pro-only feature is exposed.

### ST-209 — Regular Chrome extension for Free

- **Status:** planned
- **Tier:** Free
- **Goal:** Let users open Solstime from any page without replacing their new tab.
- **Scope:** Manifest V3 action/popup, toolbar icon, current-time summary, quick-open flow, settings, permissions, and shared authentication/session handling.
- **Dependencies:** ST-201, ST-203, ST-204, ST-206, ST-208, ST-218.
- **Acceptance criteria:** Toolbar action opens a useful view within one interaction; popup works at narrow extension widths; permissions are minimal and documented; settings and theme remain consistent with other surfaces.

## Phase 10 — Mobile and watch surfaces

### ST-210 — iPhone app for Pro

- **Status:** planned
- **Tier:** Pro
- **Goal:** Deliver the Solstime dial as a native iPhone experience.
- **Scope:** Native app shell, dial rendering, timezone/date navigation, events, themes, account/auth, offline cache, sync, accessibility, deep links, and App Store packaging.
- **Dependencies:** ST-201, ST-203, ST-205, ST-206, ST-218.
- **Acceptance criteria:** Core dial and account state work without the web app open; touch interactions meet platform conventions; app resumes safely offline; Pro entitlement is enforced; accessibility and Dynamic Type behavior are tested.

### ST-211 — iPhone widget for Pro

- **Status:** planned
- **Tier:** Pro
- **Goal:** Put a compact Solstime glance on the iPhone Home Screen and Lock Screen where supported.
- **Scope:** Widget families, timeline refresh, configurable timezone/theme, deep links, stale-data state, and widget privacy settings.
- **Dependencies:** ST-210, ST-205, ST-206, ST-218.
- **Acceptance criteria:** Supported widget sizes render without clipping; timeline updates are efficient; tapping the widget opens the relevant dial state; locked/signed-out/offline states are legible.

### ST-212 — Apple Watch surface for Pro

- **Status:** planned
- **Tier:** Pro
- **Goal:** Make Solstime available during a glance at the wrist.
- **Scope:** First perform a watchOS capability spike for custom watch faces, complications, Smart Stack, and app surfaces; then implement the most viable supported surface with the dial's key solar/time data.
- **Dependencies:** ST-201, ST-203, ST-205, ST-206, ST-218.
- **Acceptance criteria:** Feasibility decision is documented; the shipped implementation uses Apple's supported distribution model; data is readable at a glance; refresh and battery behavior are acceptable; unsupported custom-face assumptions are not shipped as promises.

## Phase 11 — Calendar and body-aware planning

### ST-213 — Sync one Google or Outlook calendar for Free

- **Status:** planned
- **Tier:** Free
- **Goal:** Bring one external calendar into the Solstime day view.
- **Scope:** OAuth for Google and Microsoft, one connected provider/calendar, read-only event import, timezone conversion, refresh, disconnect, conflict/error states, and privacy copy.
- **Dependencies:** ST-206, ST-218.
- **Acceptance criteria:** A user can connect one Google or Outlook calendar, see events translated into the active timezone, refresh/revoke access, and recover from expired credentials; imported events are clearly distinguished from Solstime plans.

### ST-214 — Sync multiple Google and Outlook calendars for Pro

- **Status:** planned
- **Tier:** Pro
- **Goal:** Give Pro users one coherent view across multiple work and personal calendars.
- **Scope:** Multiple accounts/calendars, provider color mapping, visibility controls, conflict handling, sync scheduling, rate-limit handling, and per-calendar disconnect.
- **Dependencies:** ST-213, ST-206, ST-218.
- **Acceptance criteria:** Users can connect multiple Google and Outlook calendars; each calendar can be shown/hidden; events retain source identity and timezone; partial provider failures do not hide healthy calendars; Pro gating is enforced.

### ST-215 — Period and ovulation tracker for Pro

- **Status:** planned
- **Tier:** Pro
- **Goal:** Let users record period dates and optional ovulation context privately, as a gentle planning layer rather than a medical promise.
- **Scope:** Cycle start/end logging, editable history, optional ovulation-window estimates, calendar/dial context, privacy controls, reminders opt-in, export/delete, uncertainty handling, and Pro gating.
- **Dependencies:** ST-206, ST-218.
- **Acceptance criteria:** Users can add, edit, and delete period and ovulation entries; estimates are clearly labeled as estimates; the product never presents them as medical certainty; sensitive data is private by default; users can export or permanently delete it; no data is shared externally without explicit consent; Pro access is enforced across surfaces.

## Phase 12 — Connected Solstime

### ST-217 — Sync circadian cycle with supported smart watches for Pro

- **Status:** planned
- **Tier:** Pro
- **Goal:** Use supported wearable signals to help users compare their planned day with their observed rhythm.
- **Scope:** Device capability matrix, permission flow, supported signal ingestion, normalization, missing-data handling, consent, retention, visualization, and disconnect.
- **Dependencies:** ST-210, ST-212, ST-206, ST-218.
- **Acceptance criteria:** The product only reads explicitly permitted signals; users see what is collected and why; no unsupported device is presented as compatible; missing/noisy data is labeled; users can disconnect, delete, and revoke access; no medical claims are made.

### ST-218 — Sync data across surfaces for Pro

- **Status:** planned
- **Tier:** Pro
- **Goal:** Keep plans, timezones, themes, preferences, calendar connections, and supported personal data consistent across Solstime surfaces.
- **Scope:** Account identity, canonical data model, sync protocol, conflict resolution, offline queue, encryption in transit/at rest, deletion/export, device management, and migration from local-only web storage.
- **Dependencies:** ST-206; informs ST-207 through ST-217.
- **Acceptance criteria:** A change made on one surface appears on another within the documented sync target; conflicts have deterministic, user-understandable resolution; offline edits reconcile safely; sign-out clears local sensitive data; export and deletion cover all synchronized records.
