# Remaining-asset investigation and resolution — PR #2

## Current result

The existing branch `fix/issue-1-audit-pages` now has **no broken live local image requests and no image element without a source**. Three of the twelve reported paths were corrected against verified original files. The nine unrecoverable source identities are retained as **14 visible, accessible non-image placeholders**, rather than being requested as nonexistent files.

**Article 10 was recovered from Git history**, including its genuine Marvel/DC illustration. It is restored as an explicitly labelled, non-indexable historical draft, because the original file was deleted and contains unfinished and mixed-topic material. Its wording has not been completed or rewritten.

This is **not a claim that all original artwork has been recovered**. Nine original image sources, the intended image for an empty slot, and `background.jpg` remain unavailable. No replacement artwork or article text was invented. The strict visual-completeness check intentionally remains unsuccessful.

No changes were made to `xanderbat1980/blog`. No merge, new PR, Pages activation or deployment was performed.

## Investigation scope and evidence

- Original repository: `xanderbat1980/blog`, main at `20ccee967261fb92f374ad68cdfafa06427c912f`.
- Read **all 51 reachable commits**, through the initial commit, and all **24 distinct recursive file trees**. None of those tree responses was truncated.
- Read the available branch and tag references: **one branch, `main`, and no tags**.
- Checked exact paths, case differences, extension differences, historical page references and the corresponding tracked file names. Similar or unrelated artwork was not substituted on the basis of a filename guess.
- Commit/tree evidence is recorded in [`asset-history-search.json`](asset-history-search.json). Per-item findings and mappings are in [`asset-resolutions.json`](asset-resolutions.json).
- Newly recovered binary files were verified against the original Git blob SHA and recorded in [`restored-assets.json`](restored-assets.json), alongside the earlier restored images, GIFs and their integrity checks.

The search covers the public repository's reachable history and references, not files that were never committed, private local backups or unreachable deleted branches. Where no authoritative mapping was found, the report says so rather than declaring an arbitrary image to be the missing original.

## Disposition of all twelve reported paths

| Original broken path | References | Resolution and remaining requirement |
|---|---:|---|
| `Assets/Trump/trumpcovid19.jpeg` | 1 | Corrected to the tracked `Assets/Trump/trumpcovid19.jpg`. The existing card identifies the same Trump/Covid subject; the original JPG is already verified and restored. |
| `Assets/article12/bodybuildingPlanDiet.png` | 1 | No matching source or authoritative alternative found. Visible placeholder remains in article 12; the actual diet-plan image is required. The Marvel/DC image found under `Assets/article12/` is unrelated to that diet article and was **not** substituted here. |
| `Assets/article5/trumpFbiMaralago.jpg` | 1 | Case corrected to the original tracked `Assets/article5/trumpFBIMaralago.jpg`; the genuine file is recovered and verified. |
| `Assets/article7(criseeconomique)/thirdWorldWar.jpg` | 1 | No matching source or authoritative alternative found. A labelled placeholder preserves the image position and identity. |
| `Assets/comments/vanessa.jpg` | 1 | No matching source or authoritative identity found. The existing comment is preserved with an unavailable-avatar label; another person's photo was not substituted. |
| `Assets/featurePost/asteroidImpact.jpg` | 1 | No original image recovered. The existing NASA destination and feature text are preserved; a labelled placeholder replaces the broken thumbnail request. |
| `Assets/featurePost/chatGPT1.png` | 1 | No original image recovered. The existing OpenAI destination and feature text are preserved; no contemporary logo or stock image was passed off as the original. |
| `Assets/hockey/31.jpg` | 1 | No matching source or authoritative alternative found. The carousel position remains a labelled placeholder. |
| `Assets/slider/img1.jpg` | 2 | No file with this identity recovered from reachable history; both positions remain labelled placeholders. |
| `Assets/slider/img2.jpg` | 2 | No file with this identity recovered from reachable history; both positions remain labelled placeholders. |
| `Assets/slider/img3.png` | 4 | No file with this identity recovered from reachable history; all four positions remain labelled placeholders. |
| `assets/breakingnews.jpg` | 3 | Directory case corrected to the original `Assets/breakingnews.jpg`. No duplicate lowercase directory or invented copy was added. |

Totals: **three source-path corrections affecting five references**; **nine original sources still unavailable, represented by fourteen placeholders**. Their inventory remains in [`missing-assets.json`](missing-assets.json), which now describes unavailable originals rather than active broken requests.

## Empty image and background

### Empty image in `aVif.html`

The single historical `aVif.html` blob already contains an empty image source, with no filename or indication of an intended subject. No valid image could be inferred. The invalid `<img>` is replaced by a visible, accessible **“Image non renseignée”** placeholder; the surrounding content and draft layout remain intact. There is no `src=""` request or source-less image element in the active DOM.

### `background.jpg`

No `background.jpg` was found in any of the reachable trees or references. The earlier loader stylesheet referred to this nonexistent file, but that declaration had already been removed during restoration. The original rendered white fallback is now explicit in the shared CSS. The Anonymous overlay still uses its verified original GIF; it is not replaced by a synthetic background.

No file named `background.jpg` was fabricated, and no request is made for it. If a photographic background was intended, its original file and intended placement are still needed.

## Article 10: real recovery, not invented completion

- Recovered from `87b4567822ebd0f16288f857e16afb3fdd2a26e7`, before deletion commit `d38fb2130ebc8e54f44c61df28db49dc05ec332a`.
- Original Git blob: `c16a98d046f64365f101a437434d1c45452c348f`.
- Source bytes are preserved losslessly as base64 in [`legacy/article10-source.json`](legacy/article10-source.json), with both Git blob SHA and SHA-256. This archive is excluded from the public build.
- Restored page: `article10.html`, headed **“Marvel VS DC Comics”**. Its original visible words, image identities and HTTPS references are checked against that archived source.
- Its missing thumbnail path `Assets/movies&Series/marvelVsDccomics.jpg` was traced to the genuine tracked `Assets/article12/marvelVsDccomics.jpg`. The exact basename, article heading and visual content agree; the recovered image was inspected and verified against Git blob `ee8f99ce4b7b6efe445724ef54a42eb11550ea60`.
- Homepage links are restored without rewriting the original card label. The catalogue, categories and local search include the draft with a clear status label, bringing the local article list to fourteen entries.
- HTML5 structure, local dependencies, responsive images, unique IDs, accessible navigation, disabled nonfunctional comment submission, CSP and page metadata receive the same repairs as the other pages.
- The page remains **`noindex, follow`** and excluded from `sitemap.xml`. It does not acquire an Anonymous opening overlay: the opening remains on the two original pages only.

**Editorial blocker:** the original saved page has incomplete Marvel/DC sections and substantial political passages copied into it. Its deletion may have been intentional. Restoring the historical file does not make it a finished Marvel/DC article. The author must decide whether to complete, revise or keep it as an archive before treating it as publishable content.

## Preserved appearance and existing corrections

No changes were made to the original Anonymous GIF, opening script, four-second fade, palette values, typography files, menu animation, grid or article styles. The only shared style change makes the existing white body fallback explicit; the separate black Deadline theme still overrides it.

Unavailable images use the same existing `missing-media` presentation as the earlier runtime fallback, so removing broken network requests does not introduce unrelated replacement pictures or a new design. The identifiers of retired source paths remain in `data-original-src` and `data-unavailable-asset` for auditability and future restoration.

The preservation check normalizes **only documented, verified filename corrections**, and accounts for the original identities recorded on non-image placeholders. It still rejects removal of original article words, references or source identities. It also now protects the recovered article 10 against its historical source.

## Verification results

- **19 Playwright tests passed**, including all previous successful scenarios, across **28 HTML pages**. Layout checks cover 390, 768 and 1,440 pixels.
- Added a network/resource test for **every page**, forcing lazy images to load: all active local images decode successfully, and no local image, font, stylesheet or script request returns an error status. None of the retired missing paths or `background.jpg` is requested.
- Added article 10 checks: restored homepage navigation, correct heading, visible draft notice, genuine illustration, local search discovery, `noindex` and sitemap exclusion.
- Reran the real Anonymous appearance/fade/removal checks on desktop and mobile, skipping, reduced-motion behaviour, image/script failure fallback, original palette and actual font loading.
- Reran menu keyboard/resizing, no-JavaScript navigation, search, image restoration, carousels and pause, Deadline, nested 404 and axe accessibility checks. No serious/critical axe violations were detected after the opening animation.
- Static checks pass for local links/fragments, metadata, sitemap, source placeholders, image inventory, CSS resources and resource hashes. The recovered file and all 23 initial pages pass HTML5 parsing and preservation checks.
- JavaScript syntax checks and recursive CSS parsing pass. `npm audit` reports zero vulnerabilities for the npm dependencies checked; it does not audit the separately recorded vendored files. `git diff --check` passes.
- The public build includes the restored page and genuine images, and excludes development files and the historical source archive. No deployment was run.
- **`npm run check:assets` still fails intentionally**: it checks genuine visual completeness, not merely the absence of broken requests. Nine source files and the unspecified image remain unresolved.

## Remaining issues before publication or a claim of completeness

1. Supply the nine original image files listed above, or explicitly decide to retire their image positions. The current labels are honest fallbacks, not recovered artwork.
2. Identify the intended image for the empty `aVif.html` slot and provide any intended `background.jpg`; neither can be inferred from Git history.
3. Review recovered article 10. It is a preserved historical draft, not an editorially completed article.
4. Existing editorial issues remain outside asset recovery: demo text, old counters and comments, mixed-topic sections. Article 12, for example, retains percentages of 60%, 30% and 20% that total 110%, followed by coffee/tea material; these original statements were not silently rewritten or replaced with guessed values.
5. Existing social destinations and comment sending remain unconfigured. Their repeated disabled links are documented; they are not advertised as working features.
6. The earlier external-source audit still contains one HTTP 410 source and eleven inconclusive results. Remote videos need a separate availability check; local tests deliberately block external resources. No fresh claim is made that those remote sources work.
7. Automated checks are not full WCAG certification, real-device testing, a Lighthouse score or proof of Google indexing. The restored media's final loading performance should be measured before publishing.

The branch is updated through **PR #2 only**. Original-repository writes, merging and GitHub Pages activation remain explicitly out of scope.
