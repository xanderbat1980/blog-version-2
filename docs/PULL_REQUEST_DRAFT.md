# Description de la Pull Request #2 existante

**Dépôt :** `xanderbat1980/blog-version-2`

**Branche :** `fix/issue-1-audit-pages` → `main`

Cette description est mise à jour pour la PR existante, après autorisation du propriétaire. Aucune nouvelle PR, aucune fusion et aucune activation de GitHub Pages.

## Titre proposé

Restaurer l’apparence originale et l’animation Anonymous, avec les corrections techniques

## Description proposée

Cette modification corrige le blogue statique tout en rétablissant son identité visuelle : **palette originale, photos existantes, polices DM Sans/Poppins/Roboto et ouverture Anonymous avec fondu**. Elle répond à l’issue #1 et au [commentaire de restauration visuelle](https://github.com/xanderbat1980/blog-version-2/pull/2#issuecomment-7003981440).

Le dépôt original `xanderbat1980/blog` est utilisé **uniquement en lecture seule**, au commit `20ccee967261fb92f374ad68cdfafa06427c912f`. Aucune page HTML d’origine n’est supprimée et aucun article ou visuel de remplacement n’est inventé.

### Restauration visuelle prioritaire

- Le **GIF Anonymous exact** utilisé dans `style2.css` à l’origine est désormais conservé localement. Sur `index.html` et `article5.html`, le masque apparaît, puis disparaît progressivement par un fondu CSS d’environ quatre secondes.
- L’effet peut être passé au clavier et respecte `prefers-reduced-motion`, y compris un changement de préférence pendant l’ouverture. Sans JavaScript, en cas d’image indisponible ou si l’animation CSS ne se termine pas, le contenu reste accessible.
- `style2.css` et `varLoader.js` sont rétablis dans des versions ciblées et robustes : aucun positionnement global incorrect des titres et aucun masquage du contenu des articles.
- Rose `#f15bb5`, gris de palette `#adb5bd`, turquoise `#2ec4b6`, fonds, ombres, images arrondies, styles d’articles et transition du menu mobile restaurés ou conservés. Les textes et le focus gardent des contrastes lisibles, séparés de la palette décorative.
- Les trois familles de polices originales et les deux GIF du thème sont servis localement, avec sources et empreintes ; les licences des polices sont incluses.
- **79 images réelles** sont récupérées à leur chemin exact dans le dépôt original et vérifiées contre les SHA Git des blobs source. Les dimensions manquantes sont renseignées ; leurs noms ne signalent plus à tort une indisponibilité.

Le rapport de comparaison et les preuves visuelles sont dans [`docs/VISUAL_RESTORATION.md`](https://github.com/xanderbat1980/blog-version-2/blob/fix/issue-1-audit-pages/docs/VISUAL_RESTORATION.md). Il inclut des enregistrements du fondu sur mobile et ordinateur, car une capture statique ne suffit pas à vérifier cet effet.

### Corrections techniques conservées

- Navigation vers les pages disponibles, chemins et fragments compatibles avec le sous-chemin `/blog-version-2/`, lien de contact utilisant l’adresse déjà présente ; destinations inconnues explicitement désactivées.
- Catalogue de 13 pages éditoriales existantes, catégories par sujets présents et recherche locale avec liste complète utilisable sans JavaScript.
- Menu mobile au clavier, état accessible, Échap, repli sans JavaScript ; grille responsive et médias contenus dans la largeur disponible.
- Réparation HTML5, listes de navigation valides, identifiants uniques, un titre principal et une balise `<title>` par page.
- Titres et descriptions distincts, langues adaptées, Open Graph, JSON-LD sans données inventées, URL canoniques et sitemap ; brouillons/démonstrations conservés en `noindex`.
- Grille CSS, scripts différés, images/iframes secondaires différées ; Swiper local et contrôles de pause ; animation Deadline sans jQuery.
- CSP, licences et contrôles d’intégrité des dépendances ; vraie page 404 sur les chemins imbriqués du projet.
- Formulaires de commentaires sans service d’envoi désactivés et expliqués ; ancien PHP invalide conservé comme archive exacte, exclue de l’artefact public.
- Workflow de validation et artefact statique sans déploiement ni autorisation d’écriture.

### Contenus encore manquants

- **12 chemins d’images, 19 références**, plus un emplacement sans adresse : [`docs/missing-assets.json`](https://github.com/xanderbat1980/blog-version-2/blob/fix/issue-1-audit-pages/docs/missing-assets.json).
- `background.jpg` absent aussi dans la référence originale : fond blanc de repli, sans fond inventé.
- `article10.html` absent : aucune page substituée et lien explicitement marqué indisponible.
- Profils sociaux, certaines rubriques et envoi de commentaires encore non configurés ; fragments de démonstration et compteurs anciens conservés pour décision éditoriale.
- Les textes alternatifs des images récupérées utilisent les noms des fichiers ; une révision éditoriale reste utile pour décrire fidèlement les illustrations complexes.
- Le contrôle historique de 50 sources externes a donné 38 réponses accessibles, une réponse 410 et 11 résultats non concluants. Les références sont conservées ; les vidéos distantes restent à vérifier séparément.

### Vérifications

- Suite Playwright : **17 tests réussis**, dont apparition effective du masque, mesures d’opacité depuis le début de l’animation, étape intermédiaire puis disparition à 390 et 1 440 px ; passage au clavier ; réduction des mouvements ; script ou image indisponibles ; chargement réel des trois polices et des photos.
- Tests existants maintenus : 27 pages à 390, 768 et 1 440 px, absence de débordement horizontal et d’erreur JavaScript, navigation avec/sans JS, recherche, contenus manquants, carrousels, Deadline, 404 imbriquée et contrôle axe des violations sérieuses/critiques détectables automatiquement.
- Contrôles statiques des liens, fragments, métadonnées, sitemap, ressources CSS, inventaire des manquants et empreintes des ressources restaurées.
- Conservation des mots visibles, références d’images et liens HTTPS des 23 pages initiales ; parsing HTML5 ; syntaxe des scripts et CSS ; `git diff --check`.
- Le contrôle strict des ressources reste en **échec attendu** tant que les contenus documentés manquent.

Le rapport initial est dans `docs/AUDIT.md` et son complément visuel dans `docs/VISUAL_RESTORATION.md`. Les tests sont effectués avec les ressources externes bloquées : ils ne certifient pas la disponibilité des vidéos distantes, la conformité WCAG complète, un score Lighthouse ou l’indexation effective par Google.

**PR #2 uniquement. Ne pas fusionner, ne pas activer GitHub Pages et ne pas modifier le dépôt original `xanderbat1980/blog`.**
