# yourlife.

A mobile-friendly personal planner PWA for school, workouts, training, routines and everyday events.

## Publish free with GitHub Pages

1. Download and unzip `yourlife-website.zip`.
2. Create a new public GitHub repository named `yourlife`.
3. Upload all files from this folder to the repository root (not the containing folder).
4. In the repository, open **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then Save.
6. Wait for GitHub Pages to publish the site. Your address will look like `https://YOUR-USERNAME.github.io/yourlife/`.

## Add it to an iPhone Home Screen

1. Open the published website in **Safari**.
2. Tap the Share button.
3. Choose **Add to Home Screen**.
4. Keep the name `yourlife` and tap **Add**.

## Included

- Five-tab navigation: Home, Calendar, Fitness, Routines and Settings.
- Add and delete events.
- Month calendar with day selection.
- Daily routines and completion progress.
- Local device storage using `localStorage`.
- Export a JSON backup.
- Basic offline caching after the first successful visit.

## Important notes

- Data is stored in the browser on that device. It does not automatically sync between devices.
- Browser notifications require permission. This starter version does not provide dependable scheduled notifications when the website is closed; reliable background reminders need a push-notification service and server-side scheduling.
- The app is a starter PWA, not a native iOS app. For best Home Screen behaviour, publish it over HTTPS and open it in Safari.
- The Google Fonts import is optional; the app falls back to the system font if unavailable.
