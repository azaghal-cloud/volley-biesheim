# Volley Biesheim — Site web du club

Site vitrine du club de volley-ball de Biesheim, hébergé gratuitement sur **GitHub Pages**.

🟣 **URL de test (durant le développement) :** https://azaghal-cloud.github.io/volley-biesheim/
🟣 **URL finale (une fois le domaine branché) :** https://volley-biesheim.asso.st

## Les pages du site

| Fichier | Page |
|---|---|
| `index.html` | Accueil : bandeau, actus (auto), aperçu équipes, matchs, contact |
| `club.html` | Le club : chiffres clés, équipes & horaires, comité, encadrement, partenaires |
| `photos.html` | Galerie photos auto-alimentée |
| `contact.html` | Inscriptions : cotisations 2025-2026, documents, contact |
| `actus/` | Actualités du club — un fichier texte déposé = une actu affichée automatiquement sur l'accueil |
| `photos/` | Photos du club — une photo déposée = affichée automatiquement dans la galerie |
| `ressources/` | Charte graphique du site : logo.png, bandeau.png |
| `.github/workflows/deploy.yml` | Publication automatique — ne pas modifier |

## Modifier le contenu (pour le comité)

Depuis un navigateur (même sur téléphone), sans rien installer :

1. Ouvrir https://github.com/azaghal-cloud/volley-biesheim
2. Cliquer sur le fichier à modifier (ex. `club.html`) → icône ✏️ « Edit this file »
3. Modifier le texte puis **Commit changes** → le site se met à jour tout seul en 1 à 2 minutes

## Publier une actualité 📰

1. **Add file → Create new file**
2. Nommer le fichier : `AAAA-MM-JJ-titre-de-lactu.txt`
   - la **date** en premier (ex. `2025-11-15-`), sans accents ni espaces (des tirets à la place)
   - la **date est optionnelle** : sans date, l'actu s'affiche avec la catégorie en pastille
   - la page d'accueil affiche les 6 actus les plus récentes
3. Contenu du fichier :
   - **1re ligne** : la catégorie/étiquette (ex. `Résultats du week-end`, `École de volley`)
   - **Ensuite** : le texte de l'actu (une ligne vide = nouveau paragraphe)
4. **Commit changes** — l'actu apparaît sur l'accueil en 1 à 2 minutes

Exemple : `actus/2025-09-11-reprise-de-la-saison.txt`

## Ajouter des photos 📷

1. Sur la page du dépôt : **Add file → Upload files**
2. Glisser les photos dans le dossier `photos/` (noms sans accents ni espaces,
   idéalement préfixés par la date : `2025-09-01-m11-garcons.jpeg`)
3. **Commit changes** — les photos apparaissent automatiquement dans la galerie

⚠️ Pensez à redimensionner les photos avant envoi (max ~1600px de large) pour
que le site reste rapide sur mobile.

## Le domaine volley-biesheim.asso.st

Le fichier `CNAME` a été retiré temporairement durant le développement.
Quand le site sera finalisé :
1. Chez azote.org (asso.st) : enregistrement CNAME vers `azaghal-cloud.github.io` (déjà configuré)
2. Re-créer le fichier `CNAME` à la racine avec le contenu `volley-biesheim.asso.st`
3. Settings → Pages → Custom domain = `volley-biesheim.asso.st`
