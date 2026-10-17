(function () {
  var root = document.documentElement;

  /* ---------- theme toggle ---------- */

  function currentTheme() {
    var set = root.getAttribute("data-theme");
    if (set) return set;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  var toggle = document.querySelector(".theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("theme", next);
      } catch (e) {}
      toggle.setAttribute("aria-label", "Switch to " + (next === "dark" ? "light" : "dark") + " mode");
    });
  }

  /* ---------- "Currently" shelves ---------- */

  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }

  function renderShelf(kind, items) {
    var list = document.querySelector('[data-shelf="' + kind + '"]');
    var count = document.querySelector('[data-count="' + kind + '"]');
    if (!list || !items) return;
    if (count) count.textContent = String(items.length).padStart(2, "0");

    items.forEach(function (item) {
      var li = el("li", "item");

      if (item.image) {
        var thumb = el(item.url ? "a" : "div", "item-thumb");
        if (item.url) {
          thumb.href = item.url;
          thumb.target = "_blank";
          thumb.rel = "noopener";
          thumb.tabIndex = -1;
          thumb.setAttribute("aria-hidden", "true");
        }
        var img = el("img");
        img.src = item.image;
        img.alt = "";
        img.loading = "lazy";
        img.decoding = "async";
        img.referrerPolicy = "no-referrer";
        img.addEventListener("error", function () {
          thumb.classList.add("is-missing");
          img.remove();
        });
        thumb.appendChild(img);
        li.appendChild(thumb);
        li.classList.add("has-thumb");
      }

      var body = el("div", "item-body");
      li.appendChild(body);
      var top = el("div", "item-top");
      var h = el("h4", "item-title");
      if (item.url) {
        var a = el("a", null, item.title);
        a.href = item.url;
        a.target = "_blank";
        a.rel = "noopener";
        h.appendChild(a);
      } else {
        h.textContent = item.title;
      }
      top.appendChild(h);
      if (item.meta) body.appendChild(el("span", "mono item-kicker", item.meta));
      body.appendChild(top);

      if (item.by) body.appendChild(el("p", "item-by", item.by));
      if (item.note) body.appendChild(el("p", "item-note", item.note));

      if (typeof item.progress === "number") {
        var pct = Math.max(0, Math.min(100, item.progress));
        var row = el("div", "progress");
        var track = el("div", "progress-track");
        var fill = el("div", "progress-fill");
        fill.style.width = pct + "%";
        track.appendChild(fill);
        row.appendChild(track);
        row.appendChild(el("span", "mono", pct + "%"));
        body.appendChild(row);
      }
      list.appendChild(li);
    });
  }

  if (window.NOW) {
    renderShelf("listening", window.NOW.listening);
    renderShelf("watching", window.NOW.watching);
    renderShelf("reading", window.NOW.reading);
    var updated = document.querySelector("[data-updated]");
    if (updated && window.NOW.updated) updated.textContent = "Updated " + window.NOW.updated;
  }

  /* ---------- reveal on scroll ---------- */

  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach(function (node) {
      io.observe(node);
    });
  } else {
    reveals.forEach(function (node) {
      node.classList.add("in");
    });
  }

  /* ---------- footer year ---------- */

  var year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
})();
