# Blogue de Xander — Version 2

Travail limité à **`xanderbat1980/blog-version-2`**, pour l’[issue #1](https://github.com/xanderbat1980/blog-version-2/issues/1).

La branche `fix/issue-1-audit-pages` alimente la [Pull Request #2](https://github.com/xanderbat1980/blog-version-2/pull/2). Sa mise à jour est autorisée ; aucune fusion ni activation de GitHub Pages ne sont autorisées. Le dépôt original sert uniquement de référence en lecture seule pour la restauration visuelle.

Le site reste statique : aucun serveur PHP, aucune compilation JavaScript et aucun service de collecte ne sont nécessaires pour le consulter.

## État et documents

- [Rapport d’audit et de corrections](docs/AUDIT.md)
- [Restauration visuelle et tests de l’animation Anonymous](docs/VISUAL_RESTORATION.md)
- [Résultats historiques de la première vérification](docs/VALIDATION.md)
- [Inventaire des images manquantes](docs/missing-assets.json)
- [Contrôle des sources externes](docs/external-links.json)
- [Titre et description de PR préparés](docs/PULL_REQUEST_DRAFT.md)
- [Bibliothèques et licences](docs/THIRD_PARTY.md)

**79 images ont été récupérées à leur chemin exact dans le dépôt original, ainsi que les deux GIF déjà utilisés par son thème.** Il reste **12 chemins d’images absents (19 références), un emplacement sans adresse, `background.jpg` et le fichier `article10.html`**. Aucun visuel ni article de remplacement n’a été inventé. L’animation Anonymous d’origine est restaurée sur l’accueil et `article5.html`, avec un fondu de quatre secondes, une commande pour la passer et le respect de la réduction des mouvements. Les liens sociaux inconnus et l’envoi de commentaires restent explicitement non configurés.

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

Fournir les images aux chemins et à la casse documentés dans `docs/missing-assets.json`. Une image réellement restaurée redevient visible sans changer son adresse dans le HTML. Remplacer ensuite son texte alternatif d’indisponibilité par une description fidèle et compléter ses dimensions réelles. Les deux variantes `Assets/` et `assets/` ne doivent pas être fusionnées sans vérifier les fichiers reçus.

Pour l’article 10, fournir le texte original avant de créer sa page et de réactiver son lien. Les profils sociaux, les fragments de démonstration et le fonctionnement des commentaires nécessitent également des informations ou une décision du propriétaire.
