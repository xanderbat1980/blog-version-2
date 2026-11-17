# Résultats de validation locale

Branche : `fix/issue-1-audit-pages`. Base de conservation : `ba502d097ffd4fd971ea81f65779852fb6e294cf`.

Environnement utilisé : Python 3.12.14, Node.js 24.22.1, Chromium 156.0.8078.79 sur Linux. Les outils sont décrits dans le README ; ces versions ne sont pas des dépendances du site public.

| Contrôle | Résultat |
|---|---|
| `npm run check` | Réussi : 27 pages, liens et fragments locaux, métadonnées, sitemap, ressources CSS, empreintes et manquants documentés |
| `npm run test:content` | Réussi : mots visibles, références d’images et liens HTTPS des 23 pages d’origine conservés ; HTML5 actuel sans erreur de parsing |
| `CHROMIUM_PATH=/usr/bin/chromium npm test` | **11 tests réussis**, environ 1 min 30 s |
| Mise en page | 27 pages × 3 largeurs : 390, 768 et 1 440 px ; pas de débordement horizontal ni d’erreur JavaScript |
| Interactions | Menu clavier/Échap et redimensionnement, accès sans JS, recherche avec accents, manquants et restauration d’image, carrousel, Deadline, pause et réduction des animations : réussis |
| 404 du projet | Statut HTTP 404 sur un chemin imbriqué, CSS et retour d’accueil sous `/blog-version-2/` : réussi |
| axe WCAG A/AA/2.1 AA | Aucune violation sérieuse ou critique détectée sur les 27 pages ; ne vaut pas certification de conformité complète |
| `node --check` | Réussi pour `main.js` et `deadline.js` |
| Parsing CSS récursif avec tinycss2 | Réussi pour `style.css` et `style3.css` |
| `npm audit` | Aucune vulnérabilité signalée pour les packages npm ; ne couvre pas les fichiers vendus dans `vendor/` |
| `python3 scripts/build_site.py` | Artefact local `_site/` généré ; outils de développement et PHP archivé exclus |
| Archive PHP | Identique octet par octet au fichier du commit initial |
| `git diff --check` | Réussi |
| `npm run check:assets` | **Échec attendu** : 91 chemins d’images absents, 342 références et un emplacement sans adresse |

Les 11 scénarios sont consignés dans `tests/site.spec.cjs`. Les tests navigateur bloquent les services externes : ils vérifient l’autonomie des interactions et ressources locales, pas la disponibilité des vidéos distantes. Les essais de restauration d’image utilisent uniquement une réponse réseau simulée en test, sans ajouter de visuel d’article au dépôt.

Les 50 sources externes ont fait l’objet d’un contrôle séparé, détaillé dans `external-links.json` : 38 accessibles, une réponse 410, 11 résultats non concluants. L’article 10 reste absent. Aucun score Lighthouse ni résultat d’indexation Google n’est annoncé.

## Captures relues

Captures de l’artefact local, avec ressources externes bloquées et sans les images d’article manquantes. Elles documentent l’état corrigé et ses limites.

- [Accueil sur téléphone](screenshots/home-mobile.png)
- [Accueil sur ordinateur](screenshots/home-desktop.png)
- [Article sur tablette](screenshots/article-tablet.png)
- [Recherche sur ordinateur](screenshots/search-desktop.png)

Aucun push, aucune PR ni publication n’a été effectué pour obtenir ces résultats.
