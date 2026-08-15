# Solstime implementation plan

This is the next-stage roadmap for taking Solstime from the web dial into a multi-surface product. Tickets are tracked in [`tickets.md`](./tickets.md).

## Phase 7 — Brand and reach

Make Solstime recognizable and usable beyond English before expanding the product surface area.

- ST-201 Better logo and brand mark
- ST-202 Localization foundation and support for 10 languages

## Phase 8 — Themes and product tiers

Establish the free/Pro capability model and make the tier boundary visible in the product without disrupting the core dial.

- ST-203 Theme system foundation and theme preview
- ST-204 Three free-tier themes
- ST-205 Ten Pro-tier themes plus Touch Grass
- ST-206 Entitlements, upgrade state, and tier-aware feature gating
- ST-219 Super Pro tier and premium capability model ($24.99)

## Phase 9 — Desktop and browser surfaces

Bring the Solstime view into the places where people already see time during the day.

- ST-207 Mac desktop widget for Free
- ST-208 Chrome new page extension for Free
- ST-209 Regular Chrome extension for Free

## Phase 10 — Mobile and watch surfaces

Extend the dial into the user's personal devices while preserving one visual language and one source of truth.

- ST-210 iPhone app for Pro
- ST-211 iPhone widget for Pro
- ST-212 Apple Watch surface for Pro

ST-212 begins with a watchOS feasibility spike. If Apple does not permit a third-party custom watch face, the supported delivery becomes a watchOS complication/Smart Stack surface with the same product intent.

## Phase 11 — Calendar and body-aware planning

Connect the external commitments and personal cycles that make the dial more useful.

- ST-213 One Google or Outlook calendar sync for Free
- ST-214 Multiple Google and Outlook calendar sync for Pro
- ST-215 Period and ovulation tracker for Pro

## Phase 12 — Connected Solstime

Make the product continuous across devices and aware of physiological context without making health claims it cannot support.

- ST-217 Manual circadian-cycle overlay for Pro
- ST-218 Cross-surface data sync for Pro

## Recommended delivery order

1. ST-201, ST-203, ST-206, ST-218 — brand, design tokens, entitlements, and data foundations.
2. ST-202 — localization infrastructure before new surfaces duplicate copy.
3. ST-204, ST-205 — theme inventory and tier validation.
4. ST-219 — Super Pro capability model and premium surface planning.
5. ST-213, ST-214 — calendar model and external authorization.
6. ST-207, ST-208, ST-209 — desktop and browser delivery.
7. ST-210, ST-211, ST-212 — mobile and watch surfaces.
8. ST-215, ST-217 — body-aware and circadian integrations, with privacy review.

## Cross-phase release gates

- One account and one canonical data model across every surface.
- Tier enforcement is server-authoritative; clients never unlock Pro through local state alone.
- Every external integration has explicit permission, disconnect, retry, and stale-data states.
- Localization supports longer strings, plural rules, dates, times, time zones, and right-to-left layout where applicable.
- Health and cycle data is private by default, exportable, deletable, and clearly separated from medical advice.
- Every surface meets keyboard, touch, screen-reader, reduced-motion, and offline/poor-network expectations appropriate to that surface.
