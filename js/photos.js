// Galerie photos du club (lit photos.json genere au deploiement)
function libelle(nomFichier) {
  var s = nomFichier.replace(/\.[^.]+$/, "");
  s = s.replace(/^\d{4}-\d{2}-\d{2}-/, "");
  return s.replace(/[-_]+/g, " ");
}
function datePhoto(nomFichier) {
  var m = nomFichier.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) { return null; }
  var mois = ["janvier","fevrier","mars","avril","mai","juin",
    "juillet","aout","septembre","octobre","novembre","decembre"];
  return parseInt(m[3], 10) + " " + mois[parseInt(m[2], 10) - 1]
    + " " + m[1];
}
function initLightbox() {
  var lb = document.getElementById("lightbox");
  var galerie = document.getElementById("galerie");
  var links = galerie.querySelectorAll(".gitem");
  links.forEach(function(a) {
    a.addEventListener("click", function(ev) {
      ev.preventDefault();
      document.getElementById("lb-img").src =
        a.getAttribute("data-img");
      document.getElementById("lb-cap").textContent =
        a.getAttribute("data-lib");
      document.getElementById("lb-date").textContent =
        a.getAttribute("data-date");
      lb.classList.add("open");
    });
  });
  var close = document.getElementById("lb-close");
  if (close) {
    close.addEventListener("click", function() {
      lb.classList.remove("open");
    });
  }
  lb.addEventListener("click", function(ev) {
    if (ev.target === lb) { lb.classList.remove("open"); }
  });
  document.addEventListener("keydown", function(ev) {
    if (ev.key === "Escape") { lb.classList.remove("open"); }
  });
}
function afficher(data) {
  var galerie = document.getElementById("galerie");
  var re = /\.(jpe?g|png|webp|gif)$/i;
  var photos = (data || []).filter(function(f) {
    return f.type === "file" && re.test(f.name);
  });
  if (!photos.length) {
    galerie.innerHTML = '<div class="ph-empty">'
      + 'Les photos arrivent bientot !</div>';
    return;
  }
  photos.sort(function(a, b) {
    return b.name.localeCompare(a.name);
  });
  galerie.innerHTML = photos.map(function(f) {
    var lib = libelle(f.name);
    var d = datePhoto(f.name);
    var h = '<a class="gitem" href="' + f.download_url + '"';
    h += ' target="_blank" rel="noopener"';
    h += ' data-img="' + f.download_url + '"';
    h += ' data-lib="' + lib + '"';
    h += ' data-date="' + (d || "") + '">';
    h += '<img src="' + f.download_url + '" alt="' + lib;
    h += '" loading="lazy">';
    h += '<div class="gcap">' + lib;
    if (d) { h += "<span>" + d + "</span>"; }
    h += "</div></a>";
    return h;
  }).join("");
  initLightbox();
}
fetch("photos.json?r=" + Math.floor(Date.now() / 3600000))
  .then(function(r) {
    if (!r.ok) { throw new Error("photos.json indisponible"); }
    return r.json();
  })
  .then(afficher)
  .catch(function() {
    var g = document.getElementById("galerie");
    g.innerHTML = '<div class="ph-empty">'
      + 'Les photos arrivent bientot !</div>';
  });
