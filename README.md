# Notebook (diary)

A private diary and expense tracker that runs entirely in the browser and installs on a phone like an app (PWA). There is no server and no build step: it is plain HTML, CSS and JavaScript.

## How it works

- **Storage:** your entries are saved as encrypted files in this GitHub repository, through the GitHub API, using a personal access token you type at login. Entries are encrypted with a key made from your password (AES-GCM), so the repository holds only ciphertext. **If you forget the password the data cannot be recovered.**
- **Offline:** an encrypted copy is kept on the device, so the app opens and saves without internet and syncs when it is back online.
- **Login:** username (the token) and password. After the first login the device can reopen quickly, and the app locks itself after 30 minutes of inactivity.
- **Sync:** runs in the background after login. A small "Not synced" pill appears only if syncing has failed twice in a row while online. Tap it to retry.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page structure |
| `style.css` | All styles, including the `@font-face` rules for the bundled font |
| `app.js` | All app logic: encryption, GitHub sync, diary, expenses, dashboard, settings |
| `sw.js` | Service worker: lets the app open offline |
| `manifest.webmanifest`, `icon-*.png` | Install-to-home-screen metadata and icons |
| `fonts/` | Montserrat (latin, 400/600/700), served from this repo instead of Google Fonts. SIL Open Font License, see `fonts/LICENSE.txt` |

## Updating the app

Edit the files and push to `main`. There is no version number to bump: the service worker fetches the newest copy of every file each time the app opens online, and only uses its saved copy when offline or the network is slow. If you add a new file the app needs offline, add its path to the `SHELL` list in `sw.js`.

## Running locally

Service workers need `http://`, not `file://`:

```
python3 -m http.server 8000
```

Then open http://localhost:8000.
