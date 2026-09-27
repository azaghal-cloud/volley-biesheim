// Agenda du club : calendrier mensuel (lit agenda.ics)
var MOIS = ["janvier","fevrier","mars","avril","mai","juin",
  "juillet","aout","septembre","octobre","novembre","decembre"];
var JOURS = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];
var evs = [];
var cur = new Date();
cur.setDate(1);
var sel = null;
var map = {};
function pad(n) { return n < 10 ? "0" + n : "" + n; }
function ymd(d) {
  return d.getFullYear() + "-" + pad(d.getMonth() + 1)
    + "-" + pad(d.getDate());
}
function unesc(v) {
  return v.replace(/\\n/g, "\n")
    .replace(/\\,/g, ",").replace(/\\;/g, ";");
}
function parseDT(v) {
  var re = /^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2}))?(Z)?$/;
  var m = re.exec(v);
  if (!m) { return null; }
  var d;
  if (m[7] === "Z") {
    d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3],
      +(m[4] || 0), +(m[5] || 0), +(m[6] || 0)));
  } else {
    d = new Date(+m[1], +m[2] - 1, +m[3],
      +(m[4] || 0), +(m[5] || 0), +(m[6] || 0));
  }
  return { d: d, time: !!m[4] };
}
function parseRRULE(v) {
  var r = { freq: null, interval: 1, count: null, until: null };
  var kv = v.split(";");
  for (var i = 0; i < kv.length; i++) {
    var p = kv[i].split("=");
    var k = p[0];
    var x = p[1];
    if (k === "FREQ") { r.freq = x; }
    else if (k === "INTERVAL") { r.interval = parseInt(x, 10) || 1; }
    else if (k === "COUNT") { r.count = parseInt(x, 10) || null; }
    else if (k === "UNTIL") {
      var u = parseDT(x);
      if (u) { r.until = u.d; }
    }
  }
  return r.freq ? r : null;
}
function parseICS(t) {
  var out = [];
  var txt = t.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  var lignes = txt.replace(/\n[ \t]/g, "").split("\n");
  var ev = null;
  for (var i = 0; i < lignes.length; i++) {
    var L = lignes[i];
    if (L.indexOf("BEGIN:VEVENT") === 0) {
      ev = { ex: [] };
    } else if (L.indexOf("END:VEVENT") === 0) {
      if (ev && ev.start) { out.push(ev); }
      ev = null;
    } else if (ev) {
      var c = L.indexOf(":");
      if (c < 0) { continue; }
      var key = L.slice(0, c);
      var val = L.slice(c + 1);
      var sc = key.indexOf(";");
      key = sc > -1 ? key.slice(0, sc) : key;
      if (key === "DTSTART") { ev.start = parseDT(val); }
      else if (key === "DTEND") { ev.end = parseDT(val); }
      else if (key === "SUMMARY") { ev.title = unesc(val); }
      else if (key === "LOCATION") { ev.location = unesc(val); }
      else if (key === "DESCRIPTION") { ev.desc = unesc(val); }
      else if (key === "RRULE") { ev.rrule = parseRRULE(val); }
      else if (key === "EXDATE") {
        var xd = parseDT(val);
        if (xd) { ev.ex.push(ymd(xd.d)); }
      }
    }
  }
  return out;
}
function occurrences(ev, from, to) {
  var s = ev.start;
  if (!s) { return []; }
  if (!ev.rrule) {
    return (s.d >= from && s.d <= to) ? [s] : [];
  }
  var r = ev.rrule;
  var out = [];
  var d = new Date(s.d);
  var n = 0;
  var cnt = 0;
  while (n < 800) {
    if (d > to) { break; }
    if (r.until && d > r.until) { break; }
    if (d >= from) {
      out.push({ d: new Date(d), time: s.time });
      if (r.count) {
        cnt += 1;
        if (cnt >= r.count) { break; }
      }
    }
    if (r.freq === "DAILY") { d.setDate(d.getDate() + r.interval); }
    else if (r.freq === "WEEKLY") { d.setDate(d.getDate() + 7 * r.interval); }
    else if (r.freq === "MONTHLY") { d.setMonth(d.getMonth() + r.interval); }
    else if (r.freq === "YEARLY") { d.setFullYear(d.getFullYear() + r.interval); }
    else { break; }
    n += 1;
  }
  return out;
}
function buildMap() {
  map = {};
  var from = new Date(cur.getFullYear(), cur.getMonth(), 1);
  var to = new Date(cur.getFullYear(), cur.getMonth() + 1, 0, 23, 59, 59);
  evs.forEach(function(ev) {
    var ex = {};
    ev.ex.forEach(function(x) { ex[x] = 1; });
    occurrences(ev, from, to).forEach(function(o) {
      if (ex[ymd(o.d)]) { return; }
      var fin = (ev.end && ev.end.d > o.d) ? ev.end.d : o.d;
      var dd = new Date(o.d);
      var k = 0;
      while (dd <= fin && k < 60) {
        var ky = ymd(dd);
        var dansMois = ky >= ymd(from) && ky <= ymd(to);
        if (dansMois) {
          if (!map[ky]) { map[ky] = []; }
          map[ky].push({ ev: ev, start: o });
        }
        dd.setDate(dd.getDate() + 1);
        k += 1;
      }
    });
  });
}
function fmtTime(d) {
  return pad(d.getHours()) + "h"
    + (d.getMinutes() ? pad(d.getMinutes()) : "");
}
function fromToday() {
  return new Date(cur.getFullYear(), cur.getMonth(), 1);
}
function render() {
  var nm = document.getElementById("mname");
  nm.textContent = MOIS[cur.getMonth()] + " " + cur.getFullYear();
  buildMap();
  var g = document.getElementById("grid");
  g.innerHTML = "";
  for (var i = 0; i < 7; i++) {
    var dw = document.createElement("div");
    dw.className = "cal-dow";
    dw.textContent = JOURS[i];
    g.appendChild(dw);
  }
  var first = new Date(cur.getFullYear(), cur.getMonth(), 1);
  var start = (first.getDay() + 6) % 7;
  var nd = new Date(cur.getFullYear(), cur.getMonth() + 1, 0).getDate();
  var today = new Date();
  var ty = ymd(today);
  var cells = start + nd;
  var maxRow = Math.ceil(cells / 7) * 7;
  for (var c = 0; c < maxRow; c++) {
    var cell = document.createElement("div");
    cell.className = "cal-day";
    var dn = c - start + 1;
    if (dn < 1 || dn > nd) {
      cell.className = "cal-day off";
      cell.innerHTML = "&nbsp;";
    } else {
      var d2 = new Date(cur.getFullYear(), cur.getMonth(), dn);
      var ky = ymd(d2);
      cell.setAttribute("data-ymd", ky);
      if (ky === ty) { cell.className = "cal-day today"; }
      if (sel === ky) { cell.className += " sel"; }
      var h = "<b>" + dn + "</b>";
      if (map[ky]) { h = h + '<span class="ev"></span>'; }
      cell.innerHTML = h;
    }
    g.appendChild(cell);
  }
  if (!sel) {
    var memeMois = ty.slice(0, 7) === ymd(first).slice(0, 7);
    if (memeMois) {
      sel = ty;
    } else {
      sel = ymd(fromToday());
    }
  }
  renderDay();
}
function renderDay() {
  var lbl = sel.split("-");
  var dd = new Date(+lbl[0], +lbl[1] - 1, +lbl[2]);
  var dt = document.getElementById("daytitle");
  dt.textContent = dd.getDate() + " " + MOIS[dd.getMonth()];
  var el = document.getElementById("evlist");
  el.innerHTML = "";
  var list = map[sel] || [];
  if (!list.length) {
    el.innerHTML = '<div class="ph-empty">'
      + 'Aucun evenement ce jour-la.</div>';
    return;
  }
  list.sort(function(a, b) {
    return a.start.d - b.start.d;
  });
  list.forEach(function(it) {
    var ev = it.ev;
    var d = it.start.d;
    var div = document.createElement("div");
    div.className = "evitem";
    var w = '<div class="evwhen"><b>' + d.getDate() + '</b>';
    w += '<span>' + MOIS[d.getMonth()].slice(0, 4) + '</span></div>';
    var t2 = "";
    if (it.start.time) {
      t2 = ' <span style="font-weight:700;color:#0066CC;">';
      t2 += fmtTime(d) + '</span>';
    }
    var loc = ev.location ? " &mdash; " + ev.location : "";
    var desc = "";
    if (ev.desc) {
      desc = "<p>" + ev.desc.split("\n")[0] + "</p>";
    }
    div.innerHTML = w + "<div><h3>"
      + (ev.title || "Evenement") + t2 + loc + "</h3>"
      + desc + "</div>";
    el.appendChild(div);
  });
}
document.getElementById("prev").onclick = function() {
  cur.setMonth(cur.getMonth() - 1);
  sel = null;
  render();
};
document.getElementById("next").onclick = function() {
  cur.setMonth(cur.getMonth() + 1);
  sel = null;
  render();
};
document.getElementById("grid").addEventListener("click",
  function(e) {
    var c = e.target.closest(".cal-day");
    if (!c || !c.getAttribute("data-ymd")) { return; }
    sel = c.getAttribute("data-ymd");
    var olds = document.querySelectorAll(".cal-day.sel");
    olds.forEach(function(x) { x.classList.remove("sel"); });
    c.classList.add("sel");
    renderDay();
  });
fetch("agenda.ics?v=" + Math.floor(Date.now() / 3600000))
  .then(function(r) {
    if (!r.ok) { throw new Error("ICS indisponible"); }
    return r.text();
  })
  .then(function(t) {
    evs = parseICS(t);
    if (!evs.length) {
      var el = document.getElementById("evlist");
      el.innerHTML = '<div class="ph-empty">L\'agenda est vide'
        + ' pour le moment.</div>';
    }
    render();
  })
  .catch(function() {
    var el = document.getElementById("evlist");
    el.innerHTML = '<div class="ph-empty">L\'agenda est en'
      + ' cours de synchronisation... Repassez dans quelques'
      + ' minutes !</div>';
  });
