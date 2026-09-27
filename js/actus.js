// Affichage des actus du club (lit actus.json genere au deploiement)
var MOIS = ["janvier","fevrier","mars","avril","mai","juin",
  "juillet","aout","septembre","octobre","novembre","decembre"];
function moisAbrev(n) {
  return MOIS[n - 1].slice(0, 4) + ".";
}
function esc(s) {
  return s.replace(/&/g, "&amp;")
    .replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function carte(actu) {
  var d;
  if (actu.date) {
    d = '<div class="ndate"><b>' + actu.jour;
    d += '</b><span>' + moisAbrev(actu.mois) + '</span></div>';
  } else {
    d = '<div class="ndate"><b>&mdash;</b><span>';
    d += esc(actu.categorie || "Club") + '</span></div>';
  }
  var cat = "";
  if (actu.categorie) {
    cat = '<time>' + esc(actu.categorie) + '</time>';
  }
  var paras = actu.texte.split(/\n\s*\n/);
  var corps = paras.map(function(p) {
    return "<p>" + esc(p.trim()) + "</p>";
  }).join("");
  var h = '<article class="nitem">' + d + '<div>';
  h += '<h3>' + esc(actu.titre) + '</h3>';
  h += cat + corps + '</div></article>';
  return h;
}
function afficherActus(liste) {
  var cible = document.getElementById("news-list");
  if (!liste || !liste.length) {
    cible.innerHTML = '<div class="nitem">' +
      '<div class="ndate"><b>&mdash;</b><span>Club</span></div>' +
      '<div><h3>Les actus arrivent bientot !</h3></div></div>';
    return;
  }
  cible.innerHTML = liste.map(carte).join("");
}
fetch("actus.json", { cache: "no-cache" })
  .then(function(r) {
    if (!r.ok) { throw new Error("actus.json indisponible"); }
    return r.json();
  })
  .then(function(actus) {
    actus.sort(function(a, b) {
      return (b.date || "").localeCompare(a.date || "");
    });
    afficherActus(actus.slice(0, 6));
  })
  .catch(function() {
    afficherActus([]);
  });
