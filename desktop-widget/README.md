# Desktop widget

The first desktop surface is an Electron shell around the canonical web dial.

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
