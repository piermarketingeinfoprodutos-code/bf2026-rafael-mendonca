/* Lotes automáticos por data + contador. Teste com ?agora=2026-11-12T10:00:00-03:00 */
(function () {
  var C = window.CAMPANHA;
  if (!C) return;
  var base = document.body.getAttribute("data-base") || "";
  var q = new URLSearchParams(location.search).get("agora");
  var offset = q ? new Date(q) - Date.now() : 0;
  function now() { return new Date(Date.now() + offset); }
  function d(s) { return s ? new Date(s) : null; }

  function estado(l, t) {
    if (l.inicio && t < d(l.inicio)) return "lock";
    var fim = l.fim ? d(l.fim) : d(C.aula);
    if (t > fim) return "off";
    return "on";
  }
  function vigente(t) {
    for (var i = 0; i < C.lotes.length; i++) if (estado(C.lotes[i], t) === "on") return i;
    return -1;
  }
  function fimDe(i) { var l = C.lotes[i]; return l.fim ? d(l.fim) : d(C.aula); }
  function abre(l) { return l.inicio ? "Abre em " + l.inicio.slice(8, 10) + "/" + l.inicio.slice(5, 7) : ""; }
  function curto(l) { return l.nome.replace(" (último)", ""); }

  function renderLotes() {
    var t = now(), v = vigente(t);
    document.querySelectorAll("[data-lotes]").forEach(function (box) {
      box.innerHTML = C.lotes.map(function (l, i) {
        var e = estado(l, t);
        var bt = e === "on" ? "Garantir no " + curto(l) : e === "lock" ? abre(l) : "Encerrado";
        var st = e === "on" ? "Disponível agora" : e === "lock" ? "Ainda fechado" : "Encerrado";
        var tag = e === "on" ? "a" : "div";
        var href = e === "on" ? ' href="' + l.checkout + '"' : "";
        return "<" + tag + ' class="lote ' + e + '"' + href + '><img class="cad" alt="" src="' + base + "assets/cadeado-" + (e === "on" ? "aberto" : "fechado") + '.webp" width="130" height="130"><span class="st">' + st + '</span><b class="n">' + l.nome + " · " + l.periodo +
          '</b><span class="pv">' + l.preco + '</span><span class="pc">' + l.parcela + '</span><span class="bt">' + bt + "</span></" + tag + ">";
      }).join("");
    });
    document.querySelectorAll("[data-cta]").forEach(function (a) {
      if (v < 0) { a.removeAttribute("href"); a.textContent = "Ingressos encerrados"; return; }
      a.href = C.lotes[v].checkout;
      var b = a.getAttribute("data-cta");
      a.textContent = b ? b + " · " + curto(C.lotes[v]) + " " + C.lotes[v].preco : "Quero a minha bússola para 2027";
    });
    document.querySelectorAll("[data-lote-atual]").forEach(function (el) {
      el.textContent = v < 0 ? "Encerrado" : curto(C.lotes[v]) + " " + C.lotes[v].preco;
    });
    var lv = C.lotes[v] || C.lotes[C.lotes.length - 1];
    document.querySelectorAll("[data-lote-nome]").forEach(function (el) { el.textContent = curto(lv); });
    document.querySelectorAll("[data-lote-preco]").forEach(function (el) { el.textContent = lv.preco; });
    document.querySelectorAll("[data-lote-parcela]").forEach(function (el) { el.textContent = lv.parcela; });
    document.querySelectorAll("[data-lote-periodo]").forEach(function (el) { el.textContent = lv.periodo; });
    document.querySelectorAll("[data-proximo]").forEach(function (el) {
      var p = C.lotes[v + 1];
      el.textContent = p ? "Depois de " + lv.periodo.replace("até ", "").replace(/^de .* a /, "") + ", o preço sobe para " + p.preco + " e não volta." : "Último lote: as vendas encerram no início da aula.";
    });
    return v;
  }

  function pad(n) { return String(n).padStart(2, "0"); }
  function tick() {
    var v = vig;
    if (v < 0) return;
    var ms = Math.max(0, fimDe(v) - now());
    var dd = Math.floor(ms / 864e5), hh = Math.floor(ms / 36e5) % 24, mm = Math.floor(ms / 6e4) % 60, ss = Math.floor(ms / 1e3) % 60;
    document.querySelectorAll("[data-timer]").forEach(function (el) {
      el.innerHTML = "<div><b>" + pad(dd) + "</b><small>dias</small></div><div><b>" + pad(hh) + "</b><small>horas</small></div><div><b>" +
        pad(mm) + "</b><small>min</small></div><div><b>" + pad(ss) + "</b><small>seg</small></div>";
    });
    document.querySelectorAll("[data-timer-txt]").forEach(function (el) {
      el.textContent = dd + "d " + pad(hh) + "h " + pad(mm) + "min";
    });
    if (ms === 0) vig = renderLotes();
  }
  var vig = renderLotes();
  tick();
  setInterval(tick, 1000);

  // bússola e trajetórias: animam quando entram na tela
  var anima = document.querySelectorAll("[data-anima]");
  if ("IntersectionObserver" in window) {
    var ob = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("on"); ob.unobserve(e.target); } });
    }, { threshold: 0.3 });
    anima.forEach(function (el) { ob.observe(el); });
  } else anima.forEach(function (el) { el.classList.add("on"); });

  // CTA fixo no celular depois da primeira dobra
  var mcta = document.querySelector(".mcta"), hero = document.querySelector(".hero"), ing = document.getElementById("ingressos");
  if (mcta && hero) {
    var upd = function () {
      var r = hero.getBoundingClientRect(), ri = ing ? ing.getBoundingClientRect() : null;
      var noIngresso = ri && ri.top < innerHeight && ri.bottom > 0;
      mcta.classList.toggle("show", r.bottom < 0 && !noIngresso);
    };
    addEventListener("scroll", upd, { passive: true }); upd();
  }

  document.querySelectorAll("[data-grupo]").forEach(function (a) { a.href = C.grupoWhatsApp; });
})();
