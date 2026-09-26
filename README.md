# Volley Biesheim — Site web du club

Site vitrine du club de volley-ball de Biesheim, hébergé gratuitement sur **GitHub Pages**.

🟣 **Le site est en ligne à l'adresse :** https://volley-biesheim.asso.st

## Comment modifier le contenu (pour le comité)

Tout le contenu (actus, équipes, matchs, contact) se trouve dans **un seul fichier : `index.html`**.
Sans rien installer, depuis un navigateur (même sur téléphone) :

1. Ouvrir https://github.com/azaghal-cloud/volley-biesheim
2. Cliquer sur `index.html` → icône ✏️ (crayon, « Edit this file »)
3. Modifier le texte — les actus sont entre `<article class="nitem">` et `</article>` :
   pour en ajouter une, copier un bloc existant et changer le texte
4. Cliquer sur **Commit changes** → **le site se met à jour tout seul** en 1 à 2 minutes

## Structure

- `index.html` — tout le site (page unique, responsive mobile/tablette/PC)
- `CNAME` — domaine personnalisé volley-biesheim.asso.st, **ne pas supprimer**
- `.github/workflows/deploy.yml` — publication automatique, ne pas modifier
