# Chrome Web Store submission sheet

Use this sheet when creating Anaquel’s item in the Chrome Web Store Developer Dashboard. It matches the current extension code and [Privacy Policy](../PRIVACY.md). Update both before submitting if the extension’s data handling or permissions change.

## Before opening the dashboard

- [ ] Commit and push `LICENSE`, `PRIVACY.md`, and the current release code to the public repository.
- [ ] Verify that the policy URL is publicly reachable:
  `https://github.com/isaul-garcia/anaquel/blob/master/PRIVACY.md`
- [ ] Test the exact production ZIP in a clean Chrome profile.
- [ ] Do not add any new permission, network service, analytics package, or remotely hosted code after completing these answers without reviewing them again.

## Privacy practices

### Single purpose description

> Anaquel is a local-first visual bookmark manager that lets users organize, search, edit, move, pin, and open their browser bookmarks, with site favicons for saved bookmarks.

### Permission justifications

| Manifest entry | Dashboard justification |
| --- | --- |
| `bookmarks` | Required to display the user’s bookmark tree and to create, edit, move, pin, and delete bookmarks and folders at the user’s direction. |
| `storage` | Required to store local-only Anaquel preferences, pin order, folder colors, and favicon-cache update signals. |
| `favicon` | Required to ask Chrome for favicon images for saved bookmarks and the current website shown in the toolbar popup. |
| `http://*/*` | Required only to request favicon images directly from a user’s saved HTTP bookmarks when Chrome does not provide an icon. Requests omit cookies and referrer data. Anaquel does not inject scripts or read page content. |
| `https://*/*` | Required only to request favicon images directly from a user’s saved HTTPS bookmarks when Chrome does not provide an icon. Requests omit cookies and referrer data. Anaquel does not inject scripts or read page content. |

`chrome_url_overrides.bookmarks` is part of the same bookmark-management purpose: it provides Anaquel as the bookmark-manager page. It does not require a separate permission justification.

### Remote code

Select: **No, I am not using remote code.**

All JavaScript, CSS, fonts, and other executable assets are bundled in the extension package. Favicon requests retrieve image data only; Anaquel never executes downloaded code.

### Data usage disclosure

Select the following data types as handled:

| Data type | Select | Reason |
| --- | --- | --- |
| Personally identifiable information | No | No accounts, sign-in, contact collection, or developer backend. |
| Health information | No | Not accessed. |
| Financial and payment information | No | Not accessed. |
| Authentication information | No | Anaquel does not read passwords, tokens, cookies, or login data. |
| Personal communications | No | Not accessed. |
| Location | No | Not accessed. |
| Web history | Yes | Anaquel reads bookmark URLs and the URL of the active tab for its current-site popup. It also observes completed non-incognito tab URLs only to refresh an already-cached favicon for a bookmarked website. It does not access Chrome’s history database or retain a browsing-history log. |
| User activity | No | Anaquel does not collect behavioral analytics, click tracking, keystrokes, or usage telemetry. |
| Website content | Yes | Anaquel may retrieve and locally cache a bookmarked website’s favicon image. It does not read page text, DOM, forms, links, or other page content. |

For the Limited Use certifications, confirm all applicable statements:

- User data is not sold or transferred to third parties, except as permitted by the Chrome Web Store User Data Policy.
- User data is not used or transferred for purposes unrelated to Anaquel’s single purpose.
- User data is not used or transferred to determine creditworthiness or for lending purposes.

### Privacy-policy URL

> `https://github.com/isaul-garcia/anaquel/blob/master/PRIVACY.md`

Only use this after the file has been pushed and confirmed publicly accessible. If the default branch is renamed, update the URL. A dedicated project website or GitHub Pages URL is also suitable once available.

## Store listing

### Product details

| Field | Value |
| --- | --- |
| Category | Productivity |
| Language | English |
| Mature content | No |
| Homepage URL | `https://github.com/isaul-garcia/anaquel` |
| Support URL | `https://github.com/isaul-garcia/anaquel/issues` |

Leave the **Official URL** field empty unless a domain you own has been verified through Google Search Console. A GitHub repository can be the Homepage URL but is not a verified publisher domain.

### Summary

The manifest summary is under Chrome’s 132-character limit:

> A visual shelf for your bookmarks. Explore folders, pin favorites, and make room for your next discovery.

### Detailed description

> Anaquel is a calm, visual home for the bookmarks you already keep in Chrome.
>
> Browse bookmark folders, search across your collection, pin favorites, and organize bookmarks with drag and drop. Add, edit, move, or remove bookmarks and folders directly from one workspace. The toolbar popup also shows every saved bookmark for the website you are currently viewing.
>
> Anaquel is local-first: there are no accounts, subscriptions, analytics, advertising, or developer-operated servers. Your bookmarks remain in Chrome and follow your browser’s existing sync settings. Anaquel stores only its preferences, pin order, folder colors, and favicon cache locally on your device.
>
> To show bookmark icons, Anaquel requests favicons from Chrome and, when needed, directly from the bookmarked website without cookies or referrer data. See the Privacy Policy for details.
>
> Deleting a bookmark or folder changes your actual browser bookmarks. Anaquel shows a clear confirmation, offers a 15-second undo, and links to Chrome’s native bookmark-export instructions before large deletions.

### Reviewer test instructions

> No account, payment, or test credentials are required. After installation, click the Anaquel toolbar icon on a website to see saved bookmarks for that domain, or open Chrome’s Bookmark Manager to use the full Anaquel workspace. Create a test folder and bookmark to test editing, drag-and-drop organization, deletion, and the 15-second Undo action. All data remains in the reviewer’s local browser profile.

## Final consistency check

Before selecting **Submit for review**, confirm that the following all say the same thing:

1. Manifest permissions and version.
2. Store listing and screenshots.
3. Privacy Practices answers in the dashboard.
4. `PRIVACY.md`.
5. The actual packaged extension.

The Chrome Web Store requires these disclosures to be accurate and consistent with the policy URL and the extension’s behavior.
