# Description of existing Pull Request #2

Repository: `xanderbat1980/blog-version-2`

Branch: `fix/issue-1-audit-pages` → `main`

## Titre proposé

Preserve original visuals and Anonymous; recover article 10 and fix asset requests

## Description proposée

Repairs the static blog while preserving its original Anonymous opening, palette, typography, article layout and visual effects. Restores genuine media from the original repository and recovers article 10 from its history, with explicit treatment of source files that cannot be recovered.

References: #1 and the [visual-restoration request](https://github.com/xanderbat1980/blog-version-2/pull/2#issuecomment-7003981440). The original `xanderbat1980/blog` repository is used **only as a read-only reference**.

**Do not merge this PR or activate GitHub Pages. Nine original image sources, an unspecified image slot and the intended background remain unavailable; article 10 is a recovered draft requiring author review. Passing functional tests does not mean the site is visually or editorially complete.**

### Original appearance preserved

- Original Anonymous GIF on the homepage and `article5.html`, with an approximately four-second fade, keyboard skip control, reduced-motion support and safe behaviour if its image or script fails.
- Original pink `#f15bb5`, grey palette `#adb5bd`, turquoise `#2ec4b6`, shadows, rounded imagery, article styles and mobile-menu transition. Readable text/focus colours remain separate from decorative palette values.
- Original DM Sans, Poppins and Roboto families served locally with licences and integrity records; the two existing theme GIFs are local and unchanged.
- 81 genuine original image files recovered, verified against original Git blob hashes, alongside the two theme GIFs. No replacement artwork was generated or substituted without evidence.

### Missing-resource investigation and fixes

- Examined all **51 reachable commits**, **24 distinct recursive trees**, the sole `main` branch and available tags (none), through the initial commit. Evidence is recorded in `docs/asset-history-search.json`.
- Corrected three reported paths: `.jpeg` → the tracked Trump/Covid `.jpg`, `trumpFbiMaralago.jpg` → the original case-sensitive `trumpFBIMaralago.jpg`, and `assets/breakingnews.jpg` → `Assets/breakingnews.jpg`. These correct five references.
- The other nine reported image sources were not found or authoritatively mapped. Their fourteen positions now have labelled, accessible **non-image placeholders**, retaining original source identities in metadata. They do not make broken requests and do not pretend to be recovered artwork.
- Replaced the original source-less image in `aVif.html` with a clearly labelled non-image placeholder. No valid intended image could be inferred.
- `background.jpg` was not found anywhere in the reachable history. The existing white background fallback is explicit; no synthetic background file or nonexistent URL is introduced.
- Current result: **no failed live local image/stylesheet/font/script requests across the site and no image element without a valid source**. The remaining content gaps remain documented rather than hidden.

### Article 10 genuinely recovered

- Restored from commit `87b4567822ebd0f16288f857e16afb3fdd2a26e7`, before deletion `d38fb2130ebc8e54f44c61df28db49dc05ec332a`; original blob `c16a98d046f64365f101a437434d1c45452c348f`.
- Original source bytes preserved losslessly in `docs/legacy/article10-source.json`, excluded from the public build; source SHA and visible-content preservation are verified.
- Historical heading: **Marvel VS DC Comics**. Its genuine illustration was located under `Assets/article12/marvelVsDccomics.jpg`; the original thumbnail path had the wrong directory. The image was visually inspected and its source hash checked.
- Restored homepage links and draft entries in the catalogue, categories and local search; the local article list now has fourteen entries.
- Applied existing HTML5, metadata, accessibility, responsive-image, local-dependency and navigation repairs to the recovered page. No original prose was completed or rewritten.
- **Draft notice, `noindex, follow`, and sitemap exclusion remain mandatory pending author review**: the saved file contains unfinished Marvel/DC sections and mixed political passages. Recovery is not editorial completion.

### Existing technical corrections retained

- Navigation to available pages, corrected project-relative paths/fragments, local search, catalogue/categories, accessible keyboard menu, Escape, resize handling and no-JavaScript fallback.
- Responsive grid/media, repaired HTML5 structure, unique IDs and page headings, distinct titles/descriptions, language metadata, Open Graph, structured data and sitemap handling without invented publication data.
- Deferred scripts/media, CSS grid, local Swiper and pause control, native Deadline animation without jQuery, and reduced-motion support.
- CSP and dependency provenance/integrity records; a real nested-path 404.
- Nonfunctional comment submission explicitly disabled and explained; existing contact email retained through `mailto:`. Invalid old PHP is archived outside the public build.
- Validation workflow builds a static preview artifact only: no deployment and no write permission.

### Verification

- **19 Playwright tests passed**, covering **28 pages** and layout at 390, 768 and 1,440 px.
- New full-site resource test forces lazy images to load and checks successful decoding and HTTP responses for active local images, scripts, stylesheets and fonts. Retired missing paths and `background.jpg` are never requested.
- New recovered-article checks cover homepage navigation, heading, actual thumbnail, visible draft status, local search, `noindex` and sitemap exclusion.
- All previous Anonymous opacity/fade tests, keyboard/skip/reduced-motion and failure-fallback tests, actual original-font/palette checks, navigation, no-JS access, search, carousels, Deadline, nested 404 and serious/critical axe checks pass again.
- Static links, fragments, metadata, source inventories, resource hashes, CSS resources, HTML5 parsing and source-content preservation pass for all 23 initial pages plus the recovered historical article.
- JavaScript syntax, recursive CSS parsing, `git diff --check` and public-artifact generation pass. `npm audit` reports zero vulnerabilities for the npm packages checked; separately vendored files are recorded independently.
- **`npm run check:assets` intentionally still fails**, reflecting genuine missing originals and the unknown image slot, despite the absence of broken requests.

### Reports and remaining author input

- [Detailed current findings, all twelve dispositions and remaining issues](https://github.com/xanderbat1980/blog-version-2/blob/fix/issue-1-audit-pages/docs/MISSING_ASSET_INVESTIGATION.md)
- `docs/asset-resolutions.json`: verified corrections, unavailable originals and recovery evidence.
- `docs/missing-assets.json`: nine still-unavailable original sources and fourteen positions.
- `docs/VISUAL_RESTORATION.md`: visual comparison, original animation videos and opacity measurements.
- `docs/AUDIT.md` and `docs/VALIDATION.md`: earlier audit and validation history, with links to the current report.

Required author input: the nine original images, the intended unnamed image/background if they should exist, and editorial review of recovered article 10. Existing mixed-topic/demo material, old counters, unconfigured social/comment features and historically inconclusive external references are also documented. Remote videos, full WCAG compliance, real-device testing, final loading performance and Google indexing are not certified by these local tests.

**Existing PR #2 only. No original-repository modifications, merging, Pages activation or publication.**
