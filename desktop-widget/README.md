# Desktop widget

The first desktop surface is a transparent, frameless Electron shell around the canonical web dial. It loads the web app with `surface=widget`, which removes the app header, page padding, outer background, and floating add control while preserving the dial.

## Local run

Start the web app in one terminal:

```bash
npm run dev
```

Then start the desktop shell in another:

```bash
npm run desktop:dev
```

Set `SOLSTIME_WIDGET_URL` when the dial is hosted elsewhere. The shell deliberately keeps Node integration disabled and exposes only a small read-only surface marker to the renderer.

Packaging, signing, notarization, auto-update, and a true menu-bar/window choice remain release work for ST-207.
