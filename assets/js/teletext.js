/*
 * Motor común del sitio: genera en cada página la cabecera (reloj + cinta + título),
 * los menús de sección y los botones de navegación a partir de config.js.
 *
 * Cada página solo necesita:
 *   <body data-page="201">  ("home" para el menú principal)
 *   <main class="tt-screen"> ...contenido... </main>
 */
(function () {
  "use strict";

  var CONFIG = window.TELETEXT_CONFIG;

  // Raíz del sitio calculada a partir de la ubicación de este script (assets/js/teletext.js),
  // así los enlaces funcionan igual en Neocities que abriendo los archivos en local.
  var SCRIPT_URL = document.currentScript.src;
  var ROOT_URL = new URL("../../", SCRIPT_URL);

  var PALETTE = {
    black: "#000000",
    red: "#ff0000",
    green: "#00ff00",
    yellow: "#ffff00",
    blue: "#0000ff",
    magenta: "#ff00ff",
    cyan: "#00ffff",
    white: "#ffffff"
  };

  /* ---------- Utilidades ---------- */

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function urlFor(path) {
    return new URL(path, ROOT_URL).href;
  }

  // Luminancia relativa WCAG para elegir texto blanco o negro con mejor contraste.
  function luminance(hex) {
    var rgb = [1, 3, 5].map(function (i) {
      var c = parseInt(hex.substr(i, 2), 16) / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  }

  function textColorFor(bgHex) {
    var l = luminance(bgHex);
    var contrastWhite = 1.05 / (l + 0.05);
    var contrastBlack = (l + 0.05) / 0.05;
    return contrastWhite >= contrastBlack ? PALETTE.white : PALETTE.black;
  }

  function applyColors(node, colorName) {
    var bg = PALETTE[colorName] || PALETTE.blue;
    node.style.backgroundColor = bg;
    node.style.color = textColorFor(bg);
  }

  function stars(rating) {
    if (typeof rating !== "number") return "";
    var r = Math.max(0, Math.min(5, rating));
    var full = Math.floor(r);
    var half = r - full >= 0.5;
    return "★".repeat(full) + (half ? "½" : "");
  }

  function fullTitle(page) {
    var s = stars(page.rating);
    return s ? page.title + " - " + s : page.title;
  }

  /* ---------- Índice de páginas ---------- */

  // Construye un mapa número → información de página a partir de la configuración.
  var PAGES = {};
  // Orden lineal de todas las páginas, usado por las flechas ◄ ► del "mando".
  var PAGE_ORDER = ["home"];
  PAGES.home = {
    key: "home",
    label: "MENÚ",
    title: CONFIG.home.title,
    color: CONFIG.home.color,
    url: urlFor(CONFIG.home.path)
  };
  CONFIG.sections.forEach(function (section) {
    PAGES[section.number] = {
      key: String(section.number),
      label: "P" + section.number,
      title: section.title,
      color: section.color,
      url: urlFor(section.dir + "/index.html"),
      section: section
    };
    PAGE_ORDER.push(String(section.number));
    section.pages.forEach(function (page) {
      PAGE_ORDER.push(String(page.number));
      PAGES[page.number] = {
        key: String(page.number),
        label: "P" + page.number,
        title: fullTitle(page),
        color: section.color,
        url: urlFor(section.dir + "/" + page.number + ".html"),
        parent: section
      };
    });
  });

  var currentKey = document.body.getAttribute("data-page") || "home";
  var current = PAGES[currentKey] || PAGES.home;

  /* ---------- Cabecera: número de página + fecha/hora ---------- */

  var pageInput = el("span", "tt-page-input", current.label);

  function buildStatusBar() {
    var bar = el("div", "tt-status");
    var left = el("div", "tt-status-left");
    left.appendChild(pageInput);
    left.appendChild(el("span", "tt-site-name", CONFIG.siteName));

    var clock = el("time", "tt-clock");
    bar.appendChild(left);
    bar.appendChild(clock);

    // Fecha y hora en la zona horaria del visitante.
    var dateFmt = new Intl.DateTimeFormat("es", { weekday: "short", day: "2-digit", month: "short" });
    var timeFmt = new Intl.DateTimeFormat("es", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });

    function tick() {
      var now = new Date();
      var date = dateFmt.format(now).replace(/\./g, "").replace(/,/g, "");
      clock.textContent = date.toUpperCase() + "  " + timeFmt.format(now);
      clock.setAttribute("datetime", now.toISOString());
    }
    tick();
    setInterval(tick, 1000);
    return bar;
  }

  /* ---------- Cinta de mensajes ---------- */

  function buildTicker() {
    var ticker = el("div", "tt-ticker");
    ticker.setAttribute("aria-live", "off");
    var msg = el("span", "tt-ticker-msg");
    ticker.appendChild(msg);

    var messages = CONFIG.tickerMessages || [];
    if (!messages.length) return ticker;

    var index = 0;
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var SPEED = 90; // píxeles por segundo

    function show() {
      msg.textContent = messages[index];
      index = (index + 1) % messages.length;

      if (reduceMotion) {
        msg.classList.add("tt-ticker-static");
        setTimeout(show, 5000);
        return;
      }

      // Reinicia la animación con una duración proporcional a la distancia a recorrer.
      msg.classList.remove("tt-ticker-run");
      void msg.offsetWidth;
      var distance = ticker.clientWidth + msg.offsetWidth;
      msg.style.animationDuration = Math.max(4, distance / SPEED) + "s";
      msg.classList.add("tt-ticker-run");
    }

    msg.addEventListener("animationend", show);
    // Espera a que la cinta esté en el DOM para medir anchos.
    requestAnimationFrame(show);
    return ticker;
  }

  /* ---------- Barra de título ---------- */

  function buildTitleBar() {
    var bar = el("h1", "tt-title");
    applyColors(bar, current.color);
    if (current.key !== "home") {
      bar.appendChild(el("span", "tt-title-num", current.key));
    }
    bar.appendChild(el("span", "tt-title-text", current.title));
    return bar;
  }

  /* ---------- Menús generados ---------- */

  function menuItem(page) {
    var li = el("li");
    var a = el("a", "tt-menu-link");
    a.href = page.url;
    a.appendChild(el("span", "tt-menu-num", page.key === "home" ? "" : page.key));
    a.appendChild(el("span", "tt-menu-dots"));
    a.appendChild(el("span", "tt-menu-title", page.title));
    a.style.setProperty("--tt-accent", PALETTE[page.color]);
    li.appendChild(a);
    return li;
  }

  // Rellena <ul data-tt-menu> con las secciones (menú principal) o subpáginas (sección).
  function fillMenus() {
    var lists = document.querySelectorAll("[data-tt-menu]");
    Array.prototype.forEach.call(lists, function (list) {
      list.classList.add("tt-menu");
      var items = [];
      if (current.key === "home") {
        items = CONFIG.sections.map(function (s) { return PAGES[s.number]; });
      } else if (current.section) {
        items = current.section.pages.map(function (p) { return PAGES[p.number]; });
      }
      items.forEach(function (page) { list.appendChild(menuItem(page)); });
      if (!items.length) list.appendChild(el("li", "tt-empty", "Sin páginas todavía."));
    });
  }

  /* ---------- Navegación inferior ---------- */

  function buildNav() {
    var nav = el("nav", "tt-nav");
    nav.setAttribute("aria-label", "Secciones");
    var targets = [PAGES.home].concat(CONFIG.sections.map(function (s) { return PAGES[s.number]; }));
    targets.forEach(function (page) {
      var a = el("a", "tt-nav-btn");
      a.href = page.url;
      applyColors(a, page.color);
      a.appendChild(el("span", "tt-nav-num", page.key === "home" ? "★" : page.key));
      a.appendChild(el("span", "tt-nav-label", page.key === "home" ? "Menú" : page.title));
      var isCurrent = page === current || (current.parent && current.parent.number === Number(page.key));
      if (isCurrent) a.setAttribute("aria-current", "page");
      nav.appendChild(a);
    });
    return nav;
  }

  function buildControlsHint() {
    var hint = el("p", "tt-controls");
    [
      ["◄ ►", "página"],
      ["▲ ▼", "elegir"],
      ["ESPACIO", "abrir"],
      ["0-9", "ir a número"]
    ].forEach(function (pair) {
      var item = el("span", "tt-controls-item");
      item.appendChild(el("kbd", null, pair[0]));
      item.appendChild(document.createTextNode(" " + pair[1]));
      hint.appendChild(item);
    });
    return hint;
  }

  /* ---------- Control con flechas y barra espaciadora (como un mando) ---------- */

  function enableRemoteControl() {
    function isTyping(e) {
      return e.ctrlKey || e.metaKey || e.altKey ||
        /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable;
    }

    function goToOffset(offset) {
      var i = PAGE_ORDER.indexOf(current.key);
      var next = PAGE_ORDER[(i + offset + PAGE_ORDER.length) % PAGE_ORDER.length];
      window.location.href = PAGES[next].url;
    }

    // Opciones seleccionables: enlaces del menú de la página y botones de navegación.
    function options() {
      return Array.prototype.slice.call(document.querySelectorAll(".tt-menu-link, .tt-nav-btn"));
    }

    function select(node) {
      var prev = document.querySelector(".tt-selected");
      if (prev) prev.classList.remove("tt-selected");
      node.classList.add("tt-selected");
      node.focus({ preventScroll: true });
      node.scrollIntoView({ block: "nearest" });
    }

    function move(step) {
      var list = options();
      if (!list.length) return;
      var i = list.indexOf(document.querySelector(".tt-selected"));
      var next = i === -1 ? (step > 0 ? 0 : list.length - 1) : (i + step + list.length) % list.length;
      select(list[next]);
    }

    // Mantiene la selección sincronizada si el usuario usa Tab o el ratón.
    document.addEventListener("focusin", function (e) {
      if (options().indexOf(e.target) !== -1 && !e.target.classList.contains("tt-selected")) {
        select(e.target);
      }
    });

    document.addEventListener("keydown", function (e) {
      if (isTyping(e)) return;
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          goToOffset(-1);
          break;
        case "ArrowRight":
          e.preventDefault();
          goToOffset(1);
          break;
        case "ArrowUp":
          e.preventDefault();
          move(-1);
          break;
        case "ArrowDown":
          e.preventDefault();
          move(1);
          break;
        case " ":
          e.preventDefault();
          var selected = document.querySelector(".tt-selected");
          if (selected) {
            selected.click();
          } else {
            move(1);
          }
          break;
      }
    });
  }

  /* ---------- Saltar a página tecleando su número (como en un televisor) ---------- */

  function enableNumberEntry() {
    var buffer = "";
    var resetTimer;

    document.addEventListener("keydown", function (e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
      if (!/^[0-9]$/.test(e.key)) return;

      buffer += e.key;
      pageInput.textContent = "P" + (buffer + "___").slice(0, 3);
      clearTimeout(resetTimer);

      if (buffer.length === 3) {
        var target = PAGES[buffer];
        if (target) {
          window.location.href = target.url;
        } else {
          pageInput.textContent = "P" + buffer + " ?";
          resetTimer = setTimeout(function () { pageInput.textContent = current.label; }, 1500);
        }
        buffer = "";
      } else {
        resetTimer = setTimeout(function () {
          buffer = "";
          pageInput.textContent = current.label;
        }, 3000);
      }
    });
  }

  /* ---------- Montaje ---------- */

  var screen = document.querySelector(".tt-screen") || document.body;
  var header = el("header", "tt-header");
  header.appendChild(buildStatusBar());
  header.appendChild(buildTicker());
  header.appendChild(buildTitleBar());
  screen.insertBefore(header, screen.firstChild);
  screen.appendChild(buildNav());
  screen.appendChild(buildControlsHint());

  fillMenus();
  enableNumberEntry();
  enableRemoteControl();
  document.title = (current.key === "home" ? "" : current.key + " · ") + current.title + " | " + CONFIG.siteName;
})();
