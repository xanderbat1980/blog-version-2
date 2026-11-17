# Dépendances du navigateur

Les fichiers distribués sont conservés localement pour rendre la navigation, les icônes et les carrousels indépendants des CDN. Les sources exactes et les empreintes SHA-256 sont dans [`vendor/sources.json`](../vendor/sources.json), vérifiées par `scripts/check_site.py`.

| Dépendance | Version | Utilisation | Licence conservée |
|---|---|---|---|
| Swiper | 11.2.10 | Carrousels existants ; remplace 6.7.0 | [`vendor/swiper/LICENSE`](../vendor/swiper/LICENSE), MIT |
| Font Awesome Free | 5.15.2 | Icônes existantes ; même version | [`vendor/fontawesome/LICENSE.txt`](../vendor/fontawesome/LICENSE.txt), licences distinctes pour icônes, polices et code |

La feuille Font Awesome a été adaptée pour ne référencer que les trois polices WOFF2 réellement distribuées. Son en-tête de licence est conservé ; le manifeste distingue l’empreinte téléchargée et celle du fichier adapté. Les fichiers Swiper conservent leurs en-têtes et leur licence.

Masonry a été remplacé par une grille CSS. jQuery a été retiré : seule l’animation Deadline l’utilisait et son comportement est maintenant écrit en JavaScript natif. Les polices Google restent une amélioration visuelle facultative avec `display=swap` et des polices système de repli. Les vidéos intégrées et les GIF d’animation existants restent externes ; leur disponibilité n’est pas garantie par les tests locaux.

Les packages npm et Python sont des dépendances de développement, exclues de l’artefact public. Aucun code de suivi, compte de service, secret ou destinataire supplémentaire n’a été ajouté.
