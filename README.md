# Blogue de Xander — Version 2

Travail limité à **`xanderbat1980/blog-version-2`**, pour l’[issue #1](https://github.com/xanderbat1980/blog-version-2/issues/1).

La branche `fix/issue-1-audit-pages` alimente la [Pull Request #2](https://github.com/xanderbat1980/blog-version-2/pull/2). Sa mise à jour est autorisée ; aucune fusion ni activation de GitHub Pages ne sont autorisées. Le dépôt original sert uniquement de référence en lecture seule pour la restauration visuelle.

Le site reste statique : aucun serveur PHP, aucune compilation JavaScript et aucun service de collecte ne sont nécessaires pour le consulter.

## État et documents

- [Rapport d’audit et de corrections](docs/AUDIT.md)
- [État actuel : enquête complète sur les ressources et article 10](docs/MISSING_ASSET_INVESTIGATION.md)
- [Restauration visuelle et tests de l’animation Anonymous](docs/VISUAL_RESTORATION.md)
- [Résultats historiques de la première vérification](docs/VALIDATION.md)
- [Inventaire des images manquantes](docs/missing-assets.json)
- [Contrôle des sources externes](docs/external-links.json)
- [Titre et description de PR préparés](docs/PULL_REQUEST_DRAFT.md)
- [Bibliothèques et licences](docs/THIRD_PARTY.md)

**Les requêtes locales d’images actives sont corrigées ; 81 images originales et les deux GIF du thème sont disponibles.** Trois chemins erronés sont corrigés et l’article 10 est récupéré dans l’historique comme **brouillon à réviser**, sans réécriture inventée. Il reste **neuf sources d’images originales indisponibles (14 emplacements signalés), un emplacement sans image identifiable et `background.jpg` introuvable**. Ces lacunes sont représentées sans requêtes cassées ni élément `<img>` sans source. L’arrière-plan blanc existant est conservé explicitement. Les commentaires et destinations sociales non configurés restent signalés. L’ouverture Anonymous et toutes les corrections techniques sont conservées.


## Vérifier localement

Python 3.10+ et Node.js 22+ sont requis uniquement pour les outils de développement. Les bibliothèques du navigateur sont déjà présentes dans `vendor/`.

```sh
python3 -m venv .venv
. .venv/bin/activate
python -m pip install -r requirements-dev.txt
npm ci --ignore-scripts
npx playwright install chromium
npm run check
npm run test:content
npm test
```

Si Chromium est déjà installé, on peut utiliser `CHROMIUM_PATH=/usr/bin/chromium npm test`.

Le contrôle facultatif `npm run check:assets` échoue tant que les images documentées sont absentes : un succès des tests fonctionnels ne signifie pas que le site est visuellement complet.

## Préparer un aperçu compatible GitHub Pages

```sh
python3 scripts/build_site.py
python3 scripts/serve_site.py
```

Ouvrir `http://localhost:8766/blog-version-2/`. Le serveur reproduit le sous-chemin du projet et les réponses 404. Le dossier `_site/` contient seulement les fichiers publics nécessaires : HTML, CSS, JavaScript, dépendances, éventuelles images restaurées, sitemap et `.nojekyll`. La documentation, le PHP archivé, les tests et les dépendances de développement n’y sont pas copiés.

Le workflow `.github/workflows/check.yml` vérifie le site et prépare un artefact d’aperçu. **Il ne déploie rien** et dispose uniquement d’un accès en lecture.

Les URL canoniques, les données structurées, le sitemap et la base du `404.html` supposent l’adresse future `https://xanderbat1980.github.io/blog-version-2/`. Confirmer cette adresse avant une publication ; si un domaine personnalisé est choisi, adapter ces éléments et le contrôle `BASE` dans `scripts/check_site.py`. Le fichier `robots.txt` d’un sous-dossier ne contrôle pas l’indexation du domaine : les brouillons utilisent `noindex` et sont exclus du sitemap. L’activation de Pages et la soumission du sitemap à Search Console restent des étapes ultérieures.

## Restaurer les contenus réels

Fournir les images aux chemins et à la casse documentés dans `docs/missing-assets.json`. Les emplacements des sources encore absentes sont maintenant des éléments textuels avec `data-original-src` : après réception d’une image réelle, rétablir son `<img>` à l’emplacement documenté, fournir une description fidèle et ses dimensions, puis actualiser l’inventaire. Les trois corrections de noms et l’archive de l’article 10 sont documentées dans `docs/asset-resolutions.json`. Les deux variantes `Assets/` et `assets/` ne doivent pas être fusionnées sans vérifier les fichiers reçus.

L’article 10 est désormais récupéré, lié et disponible en recherche locale, mais reste un brouillon historique en `noindex` : son mélange de sujets et ses sections incomplètes nécessitent une décision éditoriale de l’auteur. Les profils sociaux, les fragments de démonstration et le fonctionnement des commentaires nécessitent également des informations ou une décision du propriétaire.
