// Génère actus.json et photos.json pour le site statique
// Exécuté automatiquement à chaque déploiement GitHub Pages
const fs = require("fs");

// ---------- Actus ----------
const petites = new Set(["de", "du", "des", "la", "le", "les", "et", "a", "au", "aux", "en", "d", "l"]);
const elision = ["d", "l", "s", "n", "j", "qu", "c", "m", "t"];

function capWord(p) {
  if (p.length === 0) return p;
  if (p === p.toUpperCase() && p.length <= 6) return p; // M11, FFVB...
  return p.charAt(0).toUpperCase() + p.slice(1);
}

function capitalize(t) {
  return t.split(" ").map(function (w, i) {
    if (w.length === 0) return w;
    var m = w.split("'");
    if (m.length > 1 && elision.indexOf(m[0].toLowerCase()) !== -1) {
      return m[0].toLowerCase() + "'" + m.slice(1).map(capWord).join("'");
    }
    if (i > 0 && petites.has(w.toLowerCase())) return w.toLowerCase();
    return capWord(w);
  }).join(" ");
}

const actus = [];
if (fs.existsSync("actus")) {
  for (const f of fs.readdirSync("actus")) {
    if (!/\.txt$/i.test(f)) continue;
    const txt = fs.readFileSync("actus/" + f, "utf8").trim();
    if (!txt) continue;
    const lignes = txt.split("\n");
    const m = f.match(/^(\d{4})-(\d{2})-(\d{2})/);
    let titre = f.replace(/\.txt$/i, "").replace(/^\d{4}-\d{2}-\d{2}-/, "").replace(/[-_]+/g, " ");
    titre = capitalize(titre.trim());
    let categorie = "";
    let texte = txt;
    if (lignes.length > 1 && lignes[0].trim().length > 0 && lignes[0].length < 60) {
      categorie = lignes[0].trim();
      texte = lignes.slice(1).join("\n").trim();
    }
    actus.push({
      titre: titre, categorie: categorie, texte: texte,
      date: m ? m[0] : null,
      jour: m ? parseInt(m[3], 10) : null,
      mois: m ? parseInt(m[2], 10) : null,
    });
  }
}
actus.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
fs.writeFileSync("actus.json", JSON.stringify(actus, null, 1));
console.log("actus.json :", actus.length, "actus");

// ---------- Photos ----------
const photos = [];
if (fs.existsSync("photos")) {
  for (const f of fs.readdirSync("photos")) {
    if (!/\.(jpe?g|png|webp|gif)$/i.test(f)) continue;
    photos.push({ name: f, type: "file", download_url: "photos/" + encodeURIComponent(f) });
  }
}
photos.sort((a, b) => b.name.localeCompare(a.name));
fs.writeFileSync("photos.json", JSON.stringify(photos, null, 1));
console.log("photos.json :", photos.length, "photos");
