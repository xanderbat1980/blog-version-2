# Projet de Pull Request — non envoyée

Ce fichier contient le titre et la description préparés. Il ne représente pas une Pull Request existante. Ne pousser la branche et ne créer la PR qu’après le feu vert final du propriétaire.

**Dépôt :** `xanderbat1980/blog-version-2`
**Base :** `main`
**Branche :** `fix/issue-1-audit-pages`

## Titre proposé

Corriger la navigation, l’affichage et le SEO du blogue ; documenter les contenus manquants

## Description proposée

La navigation du blogue dirigeait de nombreux liens vers des pages d’attente ou des chemins inexistants ; des balises HTML/CSS et viewport invalides perturbaient l’affichage et l’indexation. Cette modification répare la structure, rend les articles disponibles accessibles depuis un catalogue, des catégories et une recherche locale, et prépare un site statique pour le sous-chemin GitHub Pages `/blog-version-2/`.

Les articles et références existants sont conservés. **Les images et l’article 10 manquants n’ont pas été recréés. Cette PR ne doit pas être présentée comme une restauration visuelle complète.**

Référence : #1. L’issue reste ouverte pour le suivi des contenus et décisions manquants.

### Corrections

- Navigation principale vers les pages disponibles, correction des chemins relatifs et fragments, suppression des fausses destinations pour les liens inconnus.
- Catalogue de 13 pages éditoriales existantes, catégories par sujets présents et recherche locale par titre/description, avec liste complète disponible sans JavaScript.
- Menu mobile utilisable au clavier, état accessible, touche Échap, repli sans JavaScript ; grille responsive et médias contenus dans la largeur disponible.
- Réparation des fermetures et imbrications HTML, listes de navigation et identifiants ; un titre principal et une balise `<title>` par page.
- Titres/descriptions distincts, langues adaptées, Open Graph, JSON-LD sans dates ni images inventées, URL canoniques et sitemap ; brouillons/démonstrations conservés en `noindex`.
- Suppression de l’attente artificielle au chargement ; retrait de Masonry au profit de CSS, suppression de jQuery, scripts différés et chargement différé des images/iframes secondaires.
- Swiper 11.2.10 et Font Awesome 5.15.2 distribués localement avec licences et empreintes ; contrôle de pause et réduction des animations respectée.
- Champs de commentaires non fonctionnels désactivés et expliqués ; lien de contact `mailto:` utilisant l’adresse déjà présente.
- Politique CSP pour les ressources réellement utilisées ; vrai `404.html` fonctionnel sur les chemins imbriqués du projet.
- Contrôles locaux et workflow de validation produisant un artefact statique, sans déploiement ni autorisation d’écriture.

### Conservation et nettoyage justifié

- Aucune page HTML d’origine supprimée ; les 23 pages restent présentes.
- Normalisation HTML5 nécessaire pour les nombreuses structures mal fermées ; le diff est étendu. Le contrôle de conservation compare le contenu visible, les images et les liens HTTPS au commit initial `ba502d097ffd4fd971ea81f65779852fb6e294cf`.
- `style2.css` et `varLoader.js` supprimés après retrait de toutes leurs références actives : ils servaient uniquement au loader bloquant et à son fond absent.
- Bloc d’animation Deadline dupliqué/corrompu retiré de la feuille globale ; animation conservée dans sa feuille dédiée et son script natif.
- Ancien PHP de contact invalide conservé comme archive exacte dans `docs/legacy/emailResponse.php.txt`, sans exposition dans l’artefact public.
- Aucun doublon de fichier strictement identique identifié ; aucune suppression de contenu fondée sur une ressemblance supposée.

### Limites qui demandent des contenus ou une décision

- 91 chemins d’images absents, utilisés 342 fois, et un emplacement vide ; inventaire complet dans `docs/missing-assets.json`. Les chemins sont conservés, les images non disponibles signalées sans description visuelle inventée.
- `article10.html` absent ; lien explicitement désactivé, aucun article substitué.
- Destinations sociales et certaines rubriques inconnues ; aucun compte ou service externe supposé. Les commentaires nécessitent une solution réelle avant réactivation.
- Pages de démonstration, Lorem Ipsum, compteurs et commentaires anciens conservés pour décision éditoriale.
- Audit de 50 liens externes : 38 accessibles, une source HTTP 410 signalée, 11 résultats non concluants. Les références sont conservées ; les vidéos et GIF externes nécessitent une vérification depuis un navigateur autorisé.
- Adresse future supposée : `https://xanderbat1980.github.io/blog-version-2/`. Aucun domaine ni réglage Pages ou Search Console modifié.

### Vérifications à consulter

Résultat local : **11 tests de navigateur réussis**, couvrant les 27 pages à trois largeurs et les scénarios fonctionnels. Les contrôles statiques et de conservation du contenu passent. Détails et captures dans `docs/VALIDATION.md`.

- `npm run check` : liens/fragments, métadonnées, sitemap, ressources CSS, manquants recensés et empreintes des dépendances.
- `npm run test:content` : conservation des 23 pages d’origine et parsing HTML5.
- `npm test` : affichage des 27 pages sur trois largeurs, menu clavier/sans JavaScript, recherche, contenus manquants, restauration d’image, carrousel/Deadline et pause, réduction des mouvements, 404 imbriquée et contrôles axe.
- `node --check` sur les deux scripts ; parsing CSS récursif ; `git diff --check`.
- `npm audit` : aucun problème signalé pour les packages npm contrôlés ; dépendances du navigateur recensées séparément dans `docs/THIRD_PARTY.md`.
- `python3 scripts/build_site.py` : artefact public local `_site/`, excluant les outils et archives.
- `npm run check:assets` : **échec attendu** tant que les images documentées n’ont pas été fournies.

Le rapport détaillé est dans `docs/AUDIT.md`. Les tests de navigateur sont exécutés avec les ressources externes bloquées ; ils ne valident pas les vidéos distantes, l’apparence avec les images absentes, un score Lighthouse ou l’indexation effective par Google.

### Points de revue

Examiner la navigation et le classement des sujets, l’apparence générale et les modifications de contraste, les notes sur les contenus manquants, la mise hors service explicite des commentaires non configurés et l’URL de publication envisagée. Restaurer les fichiers réels avant une validation visuelle complète.

**Aucune fusion automatique et aucun déploiement ne sont demandés par cette modification. Le dépôt original `xanderbat1980/blog` reste hors périmètre.**
