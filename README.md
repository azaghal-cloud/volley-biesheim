# Volley Biesheim — Site web du club

Site vitrine du club de volley-ball de Biesheim, hébergé gratuitement sur **GitHub Pages**.

🟣 **URL de test (durant le développement) :** https://azaghal-cloud.github.io/volley-biesheim/
🟣 **URL finale (une fois le domaine branché) :** https://volley-biesheim.asso.st

## Les pages du site

| Fichier | Page |
|---|---|
| `index.html` | Accueil : bandeau, actus, aperçu équipes, matchs, contact |
| `club.html` | Le club : comité directeur, encadrement, arbitre, partenaires |
| `equipes.html` | Équipes : coachs, horaires, galerie photos |
| `contact.html` | Inscriptions : cotisations 2025-2026, documents, contact |
| `photos/` | Dossier des photos des équipes (format .jpeg, noms sans accents) |
| `.github/workflows/deploy.yml` | Publication automatique — ne pas modifier |

## Modifier le contenu (pour le comité)

Depuis un navigateur (même sur téléphone), sans rien installer :

1. Ouvrir https://github.com/azaghal-cloud/volley-biesheim
2. Cliquer sur le fichier à modifier (ex. `index.html`) → icône ✏️ « Edit this file »
3. Modifier le texte — les actus sont entre `<article class="nitem">` et `</article>` :
   pour en ajouter une, copier un bloc existant et changer le texte
4. **Commit changes** → le site se met à jour tout seul en 1 à 2 minutes

## Ajouter des photos des équipes

1. Sur la page du dépôt : **Add file → Upload files**
2. Glisser les photos dans le dossier `photos/` (noms sans accents ni espaces :
   `m11-garcons.jpeg`, `m15.jpeg`, `seniores.jpeg`, `m11-debutant-2.jpeg`, etc.)
3. **Commit changes** — les photos apparaissent automatiquement dans la galerie

⚠️ Pensez à redimensionner les photos avant envoi (max ~1600px de large) pour
que le site reste rapide sur mobile.

## Le domaine volley-biesheim.asso.st

Le fichier `CNAME` a été retiré temporairement durant le développement.
Quand le site sera finalisé :
1. Chez azote.org (asso.st) : enregistrement CNAME vers `azaghal-cloud.github.io` (déjà configuré)
2. Re-créer le fichier `CNAME` à la racine avec le contenu `volley-biesheim.asso.st`
3. Settings → Pages → Custom domain = `volley-biesheim.asso.st`
