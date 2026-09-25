# Anaquel

A visual bookmark manager for Brave and Chrome, based on the supplied two-column design. Native Manifest V3 extension; no build step, accounts, backend, or runtime dependencies.

## Load in Brave

1. Open `brave://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked** and select this `anaquel` directory (the folder containing `manifest.json`).
4. Click Anaquel in the browser’s extensions menu. Pin its toolbar icon for easy access.

Anaquel also declares a bookmark-manager override, but Brave may keep its built-in manager. Click its toolbar icon on any website to see bookmarks saved for that domain across every folder, then select **Go to Bookmarks Manager** at the bottom of the popup to open the full Anaquel workspace. It does not replace your new-tab page. To use the ZIP, extract it first and load the extracted folder. Chrome users can follow the same steps at `chrome://extensions`.

After updating the extension, reload it at `brave://extensions`, then refresh or reopen the Anaquel tab so it runs the updated code.

## Your folders

- **Left column:** Pinned first, then All Bookmarks, your main folders, and the browser’s bookmark roots. Anaquel opens to Pinned by default. The first preview square shows the folder’s own initial in its saved color; the other three show bookmarks inside. Existing folders receive a random color once. Browser roots remain accessible for loose bookmarks and additional nesting.
- **Right column:** Pinned shows your saved bookmarks from every folder. All Bookmarks shows every unpinned website recursively. A specific folder shows its immediate bookmarks and subfolders. Breadcrumbs navigate back through the hierarchy.
- **Search:** The search box above folders searches names and URLs across all bookmarks. Press `/` to focus it.
- **Toolbar popup:** Click the Anaquel icon while viewing a website to see every bookmark saved for its domain, regardless of folder. `www` and the bare domain are treated as the same site; other subdomains remain separate. The header shows the current website's favicon, while each bookmark keeps its simple letter tile and lets you pin/unpin or delete it; deletion asks for confirmation. In the footer, the Anaquel logo opens the clean Pinned view, while **Manage bookmarks** opens All Bookmarks with the current domain already searched, preserving the popup's exact-domain results.
- **Left tools:** Create a main folder, filter the folder list, and open appearance settings.
- **Right tools:** Add a bookmark or subfolder, filter/sort the current view, and enter organize mode. There is no `#` control.
- **Folder colors:** Choose a preset or custom color when creating a folder. In organize mode, use a folder’s edit button to change its color; a live initial preview follows the name. Colors stay with folders when renamed or moved, including nested folders. Browser-owned roots support color changes while their names and locations remain protected.
- **Pins:** Hover or focus a bookmark and select its pin. Pinned bookmarks rise to the top. Pins are independent for each folder and All Bookmarks; drag pinned items to change their pin order.
- **Drag and drop:** Drop at a tile’s left/right edge to place before/after it. Drop in the center of a folder to move inside it. You can also drop bookmarks onto left-column folders. Clear filters and use “My order” for manual ordering.
- **All Bookmarks order:** Because this view combines different folders, its custom order is stored locally without changing parent folders. Ordering inside a real folder changes Brave’s actual bookmark order.
- **Organize mode:** The pencil enables gently wiggling icons and minus buttons. Select minus to delete, or the item’s edit button to change its name, URL, or parent folder. Select **Done** or press Escape to exit. Edit/move dialogs also provide an alternative to dragging.
- **Batch deletion:** In organize mode, enable “Select multiple”, choose items or “Select all in view”, then select “Delete selected”. Confirmation includes nested folder contents. Changing the view clears selections that are no longer visible.
- **Settings:** Dark/light appearance, small/medium/large icons, and opening websites in a new tab. Large icons give bookmark names more room to breathe. The bottom control collapses the folders column.

Bookmark additions, edits, moves, and deletions affect the real browser bookmark tree immediately. Folder deletion includes all nested content and asks for confirmation. Browser-owned roots and managed bookmarks cannot be renamed or deleted. Bookmarks edited elsewhere in the browser update here automatically.

Folder colors, pins, All Bookmarks order, and preferences live in `chrome.storage.local` on this device. Native bookmarks follow the browser’s existing sync configuration. Favicons are loaded only when an icon enters the visible area of the active Anaquel tab, including miniature folder previews. Anaquel first checks the browser’s favicon API, then the site’s own `/favicon.ico` if necessary. After a visit, the favicon URL reported by the browser is also available for sites using custom icon paths. No paid API, API key, third-party icon service, or service quota is involved. Executable bookmarklet URLs are not launched from the extension.

## Favicon caching and permissions

- Favicon loading runs directly in the Anaquel page, without requiring a background message receiver. Both the page and background worker detect visits; cache changes are shared through storage events.
- Saved icons are read and decoded locally before the first bookmark render. Folder switches and redraws attach them immediately, including miniature previews; visit-triggered refreshes keep the previous image visible until its replacement is ready.
- One persistent IndexedDB cache entry per website origin (scheme, hostname, and port), shared by duplicate bookmarks and folder previews. Icons for different paths on the same site share this entry.
- Icons request 128, 256, or 512 pixels to match the largest grid icon and screen pixel density. Smaller browser results are compared with original site icons, keeping the sharper available image. Upgrading the favicon loader retries older cache entries once, only when visible; even a site without a larger icon is then cached without repeated upgrade attempts. The loader recognizes image bytes even when Brave or a website omits the MIME header.
- Existing icons and missing-icon results are reused across scrolling, filtering, rerendering, page reloads, and browser restarts. There is no timed refresh or background polling.
- Visiting or revisiting a cached site—including opening a bookmark—marks its icon for refresh. The refresh waits until the icon is visible in an active Anaquel tab. Old icons remain visible if the refresh fails.
- Simultaneous requests for the same site are combined. At most four sites per Anaquel tab are looked up concurrently. Shared browser locks prevent duplicate same-site requests across tabs. Requests have a six-second timeout and a 256 KiB image limit.
- Missing icons keep the letter fallback until a visit allows another attempt. A never-visited site without a conventional `/favicon.ico` may need a visit before its custom icon is discovered.
- The extension requests HTTP/HTTPS host access to retrieve website icons and receive tab URL/favicon updates for visit-triggered refreshes. Direct requests omit cookies and referrers; Anaquel does not inject content scripts or read page contents. Cache records stay on this device. Browser-originated page/icon requests retain the browser’s own normal behavior.
- The cache is shared by origin, so a visit to another page on the same website can refresh that website’s bookmark icon. Incognito visits are ignored.

## Preview without touching your bookmarks

```sh
npm run preview
```

Open <http://localhost:4173>. Outside the extension, the page clearly displays **Demo workspace**, uses sample folders, and saves only to the preview origin’s local storage. Sample icons are illustrative; the installed extension uses your browser’s actual favicons. Clear that origin’s local storage to reset the demo.

## Development and verification

```sh
npm install
npm test
npm run test:browser
```

The unit suite checks recursive navigation, filtering, URL validation, protected folders, and order calculations. The browser suite launches headless Brave with a disposable profile and the real extension loaded; it never accesses your personal browser profile. It exercises native bookmark CRUD, nested navigation, drag ordering/moves, persistent pins, search, settings, and responsive overflow. Separate local-server tests verify lazy favicon loading, per-site deduplication, positive/negative cache persistence, and refresh after visits and bookmark clicks.

The default test executable is Brave’s standard macOS path. Set `BROWSER_PATH` for another installation or a Chromium executable supporting `--load-extension`.

Files:

- `manifest.json`: permissions, bookmark-manager override, toolbar entry.
- `popup.html`, `popup.css`, `src/popup.js`: the toolbar popup that lists bookmarks for the active website's domain.
- `src/background.js`: opens/focuses the manager from the popup.
- `src/app.js`: rendering and interactions.
- `src/store.js`: native bookmark/storage APIs and separate demo adapter.
- `src/model.js`: tree, permission, filtering, and ordering logic.
- `src/favicons.js`: visibility-based icon loading and display.
- `src/favicon-service.js`, `src/favicon-cache.js`: request deduplication, visit invalidation, and persistent icon caching.
- `src/styles.css`, `src/theme.css`: responsive layout and themes.

API references: [Chrome bookmarks API](https://developer.chrome.com/docs/extensions/reference/api/bookmarks), [extension favicon API](https://developer.chrome.com/docs/extensions/how-to/ui/favicons), [cross-origin requests](https://developer.chrome.com/docs/extensions/develop/concepts/network-requests), [tab events and permissions](https://developer.chrome.com/docs/extensions/reference/api/tabs).

The header, favicon, and extension icons use the supplied Anaquel app icon. The interface uses neutral gray accents and a shared 120% text scale. Inter is bundled locally in `fonts/InterVariable.woff`, under the SIL Open Font License in `fonts/OFL.txt`.
