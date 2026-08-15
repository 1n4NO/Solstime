# Chrome new-page extension

This Manifest V3 shell replaces the Chrome new page without requesting host, tabs, storage, or browsing permissions. It redirects to the canonical dial with `surface=extension` so the extension does not fork product rendering.

## Load locally

1. Open `chrome://extensions`.
2. Enable Developer mode.
3. Choose **Load unpacked**.
4. Select this directory.

Before distribution, update `APP_URL` in `newtab.js` to the production app URL and add the final extension icon sizes.
