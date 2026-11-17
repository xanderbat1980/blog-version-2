# Audit et corrections — issue #1

## Périmètre et état de livraison

Travail exclusivement dans `xanderbat1980/blog-version-2`, sur la branche locale `fix/issue-1-audit-pages`, à partir du commit `ba502d097ffd4fd971ea81f65779852fb6e294cf`. Le dépôt `xanderbat1980/blog` n’a été ni consulté ni modifié.

Les problèmes ont été présentés au propriétaire avant toute modification. Les corrections, les tests et le texte de PR sont préparés localement. **Aucun push, aucune création de Pull Request, aucune fusion, aucune publication.** Ces actions attendent le feu vert final demandé par le propriétaire.

## Problèmes constatés et traitement

| Constat initial | Correction ou décision |
|---|---|
| 23 pages HTML, erreurs de fermeture et d’imbrication dans de nombreuses pages ; `arts.html` inachevé | Réparation selon les règles HTML5 ; fermeture de la structure, listes de navigation valides, identifiants uniques, suppression des imbrications bouton/lien, titres principaux rétablis |
| 3 pages avec deux balises `<title>` ; titres génériques ; descriptions répétées ou mal déclarées | Un titre et une description propres à chaque page ; métadonnées Open Graph et URL canoniques ; langue principale adaptée au contenu |
| Aucun balisage structuré ni sitemap | JSON-LD pour les articles et pages éditoriales disponibles ; sitemap limité aux pages indexables ; aucune date, image ou donnée de popularité inventée |
| 12 pages avec viewport invalide ; 12 références HTML commençant par `/` | Viewport corrigé et chemins adaptés au sous-dossier `/blog-version-2/`, y compris le chemin d’image absolu |
| Liens `error404html`, `article1`, `article10.html` absent ; 812 liens vers une page d’attente | Corrections des destinations certaines ; catalogue, catégories et recherche locale ; références inconnues signalées sans fausse destination |
| 343 emplacements d’images, aucun fichier d’image d’article dans le dépôt | 91 chemins distincts documentés pour 342 références ; un emplacement vide signalé séparément ; URL conservées et indication textuelle honnête en cas d’échec |
| Menu mobile sans nom ni état accessibles ; focus supprimé ; images sans alternative | Nom, état et panneaux associés ; usage au clavier, fermeture par Échap, lien d’évitement ; contrastes et distinction des liens améliorés |
| CSS mal formé et animations imbriquées par erreur | Suppression du bloc Deadline dupliqué et corrompu dans la feuille globale ; correction de l’animation dans `style3.css`, gardée uniquement sur sa page ; contraintes de largeur et grille responsive |
| Initialisation globale de Masonry/Swiper sans vérifier les éléments ; chargement artificiel d’environ 4 secondes | Grille CSS indépendante du chargement des images ; Swiper conditionnel ; retrait du loader et des scripts morts ; exécution différée |
| Dépendance aux CDN pour icônes et comportement | Copies locales des dépendances avec licences et empreintes ; Swiper 6.7.0 remplacé par 11.2.10 ; jQuery retiré de Deadline |
| Formulaires de commentaires visuellement actifs sans envoi fonctionnel | Champs et bouton désactivés, note explicite ; commentaires et textes existants conservés ; aucun message transmis et aucun faux succès |
| PHP de contact invalide et non utilisable sur Pages | Source conservée dans `docs/legacy/emailResponse.php.txt`, exclue de l’artefact public ; adresse existante accessible par `mailto:` |
| Animations et vidéo automatiques | Contrôles de pause des carrousels et de Deadline ; respect de la préférence de réduction des animations, y compris la vidéo existante |
| Absence de vraie page 404 pour Pages | Nouveau `404.html`, sans indexation, avec base du projet pour les URL imbriquées ; l’ancienne page de construction est conservée |
| Pas de vérification reproductible | Contrôles locaux, tests navigateur, contrôle HTML5 et conservation du contenu ; workflow de validation sans déploiement |

La palette rose/turquoise, les polices demandées, les colonnes, les articles, les vidéos et les animations sont conservés dans leur principe. Le rose des textes et le gris secondaire ont été assombris pour améliorer le contraste. Les captures ne constituent pas une validation de l’apparence avec les images réelles : celles-ci manquent toujours.

La réparation du HTML implique une normalisation des entités, attributs et fermetures : le diff est donc étendu. Le contrôle `scripts/check_content.py` compare les mots visibles, les références d’images et les liens HTTPS avec le commit de départ sur les 23 pages d’origine. Il vérifie aussi l’absence d’erreurs de parsing HTML5 dans toutes les pages actuelles. Ce contrôle protège contre les pertes de contenu ; il ne constitue pas une validation éditoriale des affirmations des articles.

## Contenus manquants ou nécessitant le propriétaire

### Images et article 10

Le fichier [`missing-assets.json`](missing-assets.json) indique chaque chemin, les pages concernées et le nombre de références. La casse et les variantes de chemins ont été conservées, sauf le retrait du `/` initial incompatible avec l’hébergement de projet. Les noms proches ne prouvent pas que deux fichiers étaient identiques : aucune fusion ni substitution n’a été faite.

L’emplacement `<img>` vide de `aVif.html` n’a pas de nom de fichier à inventorier ; il reste signalé « Image non renseignée ». Des images figurent aussi dans des sections commentées, conservées telles quelles et non rendues : elles ne sont pas ajoutées au compteur des références actives.

Les textes alternatifs annoncent actuellement l’indisponibilité et le nom du fichier ; aucune description visuelle n’a été supposée. Après réception des fichiers réels, vérifier les noms, décrire honnêtement les images et renseigner leurs dimensions avant une validation finale de performance et d’accessibilité.

`article10.html` n’a pas été créé. Le lien de la carte correspondante est remplacé par une indication explicite « article indisponible (fichier manquant) ». Le catalogue rappelle cette absence sans inventer le sujet ou le texte de l’article.

### Fonctions et contenus non configurés

Les liens sociaux, certains liens de modèle, des contenus annoncés et les commentaires nécessitent des destinations ou un service réel. Les liens sans destination connue sont présentés comme désactivés plutôt que dirigés vers une page d’erreur. Leur nombre inclut les répétitions des mêmes blocs dans les pages, pas autant de fonctionnalités différentes.

Les brouillons et démonstrations `aVif.html`, `article9.html`, `testPage.html` et `sidebar.html` restent accessibles mais signalés et non indexables. Les pages d’attente et d’animation sont également exclues du sitemap. Du Lorem Ipsum, des commentaires d’exemple, des compteurs anciens et des fragments de rédaction subsistent dans le contenu d’origine : ils demandent une révision éditoriale, et n’ont pas été supprimés arbitrairement.

### Références et médias externes

[`external-links.json`](external-links.json) contient un contrôle de 50 liens HTTPS de sources : 38 réponses accessibles, une réponse HTTP 410, six réponses HTTP non concluantes (blocages ou restrictions) et cinq erreurs réseau non concluantes. Une réponse HEAD accessible ne prouve pas la pertinence du contenu ; un blocage 403/429 ou un délai ne prouve pas une disparition.

La référence Cointribune `crypto-voici-les-trois-choses-qui-vont-conduire-a-une-adoption-massive` renvoie HTTP 410. Son URL et le texte d’origine sont conservés avec une note visible. Aucun nouvel article de remplacement n’a été choisi à la place de l’auteur. Trois liens HTTP ont été passés à HTTPS ; les deux adresses AB Consulting répondent en HTTPS, l’accès à YouTube reste non vérifiable dans l’environnement.

Les vidéos YouTube, la vidéo CloudFront et les GIF externes doivent être vérifiés depuis le navigateur du propriétaire avant publication. Les polices Google restent facultatives avec un repli système. Les tests fonctionnels bloquent les connexions externes pour vérifier que le site lui-même reste utilisable.

## Vérifications

Résultats finaux : **11 tests de navigateur réussis**, contrôles statiques et de conservation du contenu réussis ; le contrôle strict des images reste en échec attendu. Le relevé et les captures relues sont dans [`VALIDATION.md`](VALIDATION.md).

Les commandes et leur installation sont détaillées dans le README. Les vérifications suivantes font partie de la livraison :

- `npm run check` : pages, destinations locales, fragments, identifiants, viewport, titres/descriptions, URL de la version 2, JSON-LD, sitemap, ressources CSS, inventaire des images et empreintes des dépendances.
- `npm run test:content` : conservation du contenu d’origine et parsing HTML5 des pages actuelles.
- `node --check main.js` et `node --check deadline.js` : syntaxe des scripts locaux.
- Analyse récursive des deux feuilles CSS locales avec `tinycss2` : absence d’erreurs de parsing dans les règles et déclarations.
- `npm test` : 27 pages à 390, 768 et 1 440 px ; absence de débordements et d’erreurs JavaScript ; clavier et redimensionnement du menu ; accès sans JavaScript ; recherche avec accents et paramètres d’URL ; signalement des manquants et retour d’une image restaurée ; carrousel et pause ; animation Deadline et réduction des mouvements ; vraie 404 imbriquée ; axe sur toutes les pages pour les violations WCAG sérieuses ou critiques détectables automatiquement.
- `npm audit` : aucune vulnérabilité signalée pour les dépendances npm au moment du contrôle. Les bibliothèques distribuées dans `vendor/` sont recensées séparément ; cette commande npm ne les audite pas.
- `python3 scripts/build_site.py` : génération locale de `_site/` sans documentation, PHP archivé, tests ou dépendances de développement.
- `git diff --check` : absence d’erreurs d’espacement du patch.

Le mode strict `npm run check:assets` doit encore échouer à cause des images absentes : cet échec attendu empêche de présenter la version comme visuellement complète. Les tests automatisés ne certifient ni la conformité WCAG totale, ni l’affichage sur de véritables appareils, ni un score Lighthouse ou une indexation Google. Les performances finales avec les images réelles restent à mesurer.

## Sécurité et préparation Pages

Les scripts actifs sont locaux. Une politique CSP limite les scripts à la même origine, bloque les objets et les soumissions de formulaire et autorise explicitement les sources existantes de polices, d’images d’animation, de vidéos et d’iframes. Les styles inline existants restent autorisés pour préserver le contenu. Les headers HTTP tels que HSTS ou `frame-ancestors` ne sont pas configurables par un simple fichier HTML sur GitHub Pages : aucune prétention contraire n’est faite.

L’artefact `_site/` est limité aux ressources publiques. Le workflow ne possède pas d’autorisation d’écriture et ne comporte pas de déploiement. La configuration GitHub Pages, le domaine, le contrôle Search Console et la publication ne sont pas modifiés. Il n’y a pas de `robots.txt` ajouté au sous-chemin, car il ne contrôlerait pas l’exploration à la racine du domaine.

Avant publication : fournir les contenus manquants, confirmer les destinations et le domaine cible, examiner les contenus d’exemple, effectuer une revue visuelle et des médias, puis autoriser séparément les actions GitHub souhaitées.
