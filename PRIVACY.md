# Anaquel Privacy Policy

**Effective date:** September 26, 2026

Anaquel is a local, open-source bookmark manager for Chrome-compatible browsers. This policy explains the data Anaquel handles and why.

## What Anaquel accesses

Anaquel accesses the following data from the browser:

- Bookmark titles, URLs, folder structure, and bookmark metadata. This lets you view, create, edit, move, organize, pin, and delete your bookmarks.
- The URL and favicon information of the active tab when you open Anaquel’s toolbar popup. This lets the popup show bookmarks saved for the current website.
- The URL and favicon information of completed, non-incognito page visits. Anaquel checks this only to refresh a favicon already cached for a bookmarked website. It does not create a cache entry or retain visit information for an uncached website.

Anaquel does not read website page content, form entries, passwords, cookies, communications, or downloads. It does not access the browser history database or retain a history of the pages you visit.

## Local storage

Anaquel stores its preferences, pin order, folder-color settings, and favicon-cache signals in `chrome.storage.local`. It stores cached favicon images in IndexedDB. These data stay on your device and are used only to provide Anaquel’s features. Your actual bookmarks remain in your browser’s bookmark store and follow your browser’s own sync settings.

## Network requests

Anaquel has no developer-operated server, account system, analytics, advertising, telemetry, or tracking SDK.

To display an icon for a bookmark, Anaquel first asks the browser for a favicon. When needed, it may request the bookmarked website’s favicon directly from that website or from the icon URL reported by the browser. These requests omit cookies and referrer data. As with any request to a website, the receiving website may receive network information such as your IP address under its own privacy policy. Anaquel does not send bookmark or browsing data to the Anaquel developer or to an analytics provider.

## How data is used and shared

Anaquel uses the data above solely to provide its visible bookmark-management and favicon-display features. Anaquel does not sell, rent, share, or use your data for advertising, profiling, creditworthiness, or any purpose unrelated to those features.

The use of information received from Google APIs will adhere to the Chrome Web Store User Data Policy, including the Limited Use requirements.

## Data retention and control

You control your bookmarks through your browser. You can delete bookmarks and Anaquel preferences at any time. Uninstalling Anaquel removes its extension-local storage and favicon cache under the browser’s normal extension-data handling; it does not delete your browser bookmarks.

## Changes to this policy

If Anaquel’s data practices materially change, this policy will be updated before the change takes effect and the Chrome Web Store listing will be updated as required.

## Contact

For privacy questions or requests, open an issue in the [Anaquel GitHub repository](https://github.com/isaul-garcia/anaquel/issues).
