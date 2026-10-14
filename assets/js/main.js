/* Navigation, search, newsletter, and support panels. */
(function () {
  const infoCopy = {
    shipping: {
      title: "Shipping",
      html: "<p>This is a front-end demonstration. Nothing is packed, billed, or shipped.</p><p>In the story of the brand, pieces leave the studio within two working days and move across India in three to six days.</p>"
    },
    returns: {
      title: "Returns",
      html: "<p>No returns are processed here because no orders are placed.</p><p>The fit story allows 30 days to send an unworn piece back, with the original label still on it.</p>"
    },
    size: {
      title: "Size guide",
      html: "<p>A general athletic fit. Measure yourself, then choose the size you already train in.</p><table><thead><tr><th>Size</th><th>Chest</th><th>Waist</th></tr></thead><tbody><tr><td>XS</td><td>76–81 cm</td><td>61–66 cm</td></tr><tr><td>S</td><td>81–89 cm</td><td>66–74 cm</td></tr><tr><td>M</td><td>89–97 cm</td><td>74–82 cm</td></tr><tr><td>L</td><td>97–105 cm</td><td>82–90 cm</td></tr><tr><td>XL</td><td>105–113 cm</td><td>90–98 cm</td></tr></tbody></table><p>Sports bras follow the same letter sizes. Gloves use S, M, and L. The cap is one size.</p>"
    },
    contact: {
      title: "Contact",
      html: "<p>VYRO Athletics<br>Studio 14, Field House<br>Bengaluru 560001</p><p>hello@vyroathletics.demo</p><p>This panel does not send a message. The address is fictional.</p>"
    },
    care: {
      title: "Garment care",
      html: "<p>Wash cold with like colours. Skip the softener. Hang or lay flat. Do not iron the lime marks, prints, or mesh.</p><p>Care copy is product storytelling for this demo.</p>"
    }
  };

  function boot() {
    const params = new URLSearchParams(location.search);
    let key = document.body.dataset.page === "home" ? "home" : "shop";
    if (params.get("gender") === "men") key = "men";
    if (params.get("gender") === "women") key = "women";
    if (params.get("filter") === "new") key = "new";
    document.querySelectorAll("[data-nav]").forEach(function (link) {
      const on = link.dataset.nav === key;
      link.classList.toggle("is-active", on);
      if (on) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });

    const panel = document.getElementById("navPanel");
    const toggle = document.getElementById("navToggle");
    function closeNav(silent) {
      if (!panel || !panel.classList.contains("is-open")) return;
      panel.classList.remove("is-open");
      panel.setAttribute("aria-hidden", "true");
      panel.inert = true;
      if (toggle) {
        toggle.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      }
      if (!silent && window.Vyro.syncLock) window.Vyro.syncLock();
    }
    function openNav() {
      if (!panel) return;
      window.Vyro.closeOverlays("nav");
      panel.classList.add("is-open");
      panel.setAttribute("aria-hidden", "false");
      panel.inert = false;
      if (toggle) {
        toggle.classList.add("is-open");
        toggle.setAttribute("aria-expanded", "true");
        toggle.setAttribute("aria-label", "Close menu");
      }
      window.Vyro.syncLock();
      const first = panel.querySelector("a");
      if (first) first.focus();
    }
    window.Vyro.closeNav = closeNav;
    if (toggle && panel) {
      toggle.addEventListener("click", function () {
        if (panel.classList.contains("is-open")) closeNav();
        else openNav();
      });
    }

    const search = document.getElementById("searchOverlay");
    const searchToggle = document.getElementById("searchToggle");
    const searchInput = document.getElementById("searchInput");
    const searchResults = document.getElementById("searchResults");
    const searchForm = document.getElementById("searchForm");

    function renderSuggestions(query) {
      if (!searchResults) return;
      const q = query.trim().toLowerCase();
      const matches = window.Vyro.products.filter(function (product) {
        return !q || product.name.toLowerCase().indexOf(q) !== -1;
      }).slice(0, 6);
      searchResults.innerHTML = matches.map(function (product) {
        const href = "products.html?search=" + encodeURIComponent(product.name);
        return '<a href="' + href + '"><span>' + window.Vyro.escapeHtml(product.name) + '</span><span>' + window.Vyro.formatPrice(product.price) + "</span></a>";
      }).join("");
    }

    function closeSearch(silent) {
      if (!search || !search.classList.contains("is-open")) return;
      search.classList.remove("is-open");
      search.setAttribute("aria-hidden", "true");
      search.inert = true;
      if (searchToggle) searchToggle.setAttribute("aria-expanded", "false");
      if (!silent && window.Vyro.syncLock) window.Vyro.syncLock();
    }
    function openSearch() {
      if (!search) return;
      window.Vyro.closeOverlays("search");
      search.classList.add("is-open");
      search.setAttribute("aria-hidden", "false");
      search.inert = false;
      if (searchToggle) searchToggle.setAttribute("aria-expanded", "true");
      window.Vyro.syncLock();
      renderSuggestions(searchInput ? searchInput.value : "");
      if (searchInput) searchInput.focus();
    }
    window.Vyro.closeSearch = closeSearch;
    if (searchToggle) searchToggle.addEventListener("click", openSearch);
    const searchClose = document.getElementById("searchClose");
    if (searchClose) searchClose.addEventListener("click", function () { closeSearch(); });
    if (searchInput) searchInput.addEventListener("input", function () { renderSuggestions(searchInput.value); });
    if (searchForm) {
      searchForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const query = searchInput.value.trim();
        if (document.body.dataset.page === "shop" && window.Vyro.applySearch) {
          window.Vyro.applySearch(query);
          closeSearch();
          return;
        }
        location.href = "products.html?search=" + encodeURIComponent(query);
      });
    }

    const info = document.getElementById("infoModal");
    function closeInfo(silent) {
      if (!info || !info.classList.contains("is-open")) return;
      info.classList.remove("is-open");
      info.setAttribute("aria-hidden", "true");
      info.inert = true;
      if (!silent && window.Vyro.syncLock) window.Vyro.syncLock();
    }
    window.Vyro.closeInfo = closeInfo;
    document.querySelectorAll("[data-info]").forEach(function (button) {
      button.addEventListener("click", function () {
        const entry = infoCopy[button.dataset.info];
        if (!entry || !info) return;
        window.Vyro.closeOverlays("info");
        document.getElementById("infoTitle").textContent = entry.title;
        document.getElementById("infoBody").innerHTML = entry.html;
        info.classList.add("is-open");
        info.setAttribute("aria-hidden", "false");
        info.inert = false;
        window.Vyro.syncLock();
        const close = info.querySelector(".modal__close");
        if (close) close.focus();
      });
    });
    if (info) {
      info.querySelectorAll("[data-close-info]").forEach(function (node) {
        node.addEventListener("click", function () { closeInfo(); });
      });
    }

    document.addEventListener("keydown", function (event) {
      if (event.key === "Tab") {
        const active = document.querySelector(".drawer.is-open .drawer__panel, .modal.is-open .modal__panel, .search-overlay.is-open, .nav-panel.is-open");
        if (!active) return;
        const nodes = Array.prototype.filter.call(
          active.querySelectorAll("a, button, input, select, textarea"),
          function (el) { return !el.disabled && el.getClientRects().length; }
        );
        if (!nodes.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
        return;
      }
      if (event.key !== "Escape") return;
      if (document.querySelector(".modal.is-open")) {
        closeInfo(true);
        if (window.Vyro.closeQuick) window.Vyro.closeQuick(true);
      }
      if (window.Vyro.closeBag) window.Vyro.closeBag(true);
      closeSearch(true);
      closeNav(true);
      if (window.Vyro.syncLock) window.Vyro.syncLock();
    });

    const grid = document.getElementById("featuredGrid");
    if (grid) {
      const featured = window.Vyro.products.filter(function (product) { return product.featured; })
        .sort(function (a, b) { return a.order - b.order; });
      grid.innerHTML = featured.map(function (product, index) {
        const wished = window.Vyro.wishlist && window.Vyro.wishlist.has(product.id);
        const hover = product.hover
          ? '<img class="float-piece__alt" src="' + product.hover + '" alt="" data-fallback>'
          : "";
        const label = (product.collection + " · " + product.colors[0].name + " · ss26 · ").toUpperCase();
        const number = String(index + 1).padStart(2, "0");
        return (
          '<article class="float-piece" data-tilt data-id="' + product.id + '">' +
            '<span class="float-piece__num" aria-hidden="true">' + number + "</span>" +
            '<div class="float-piece__frame">' +
              '<button class="float-piece__open" type="button" data-view="' + product.id + '" aria-label="Quick view ' + window.Vyro.escapeHtml(product.name) + '">' +
                '<img src="' + product.image + '" alt="' + window.Vyro.escapeHtml(product.name) + '" data-fallback>' +
                hover +
              "</button>" +
              '<div class="spin-label" aria-hidden="true"><svg viewBox="0 0 100 100"><defs><path id="ring' + index + '" d="M50,50 m-34,0 a34,34 0 1,1 68,0 a34,34 0 1,1 -68,0"/></defs><text font-size="6.2" letter-spacing="1.4"><textPath href="#ring' + index + '">' + window.Vyro.escapeHtml(label) + "</textPath></text></svg></div>" +
            "</div>" +
            '<div class="float-piece__info">' +
              "<p>" + window.Vyro.categoryLabels[product.category] + "</p>" +
              '<h3><button type="button" data-view="' + product.id + '">' + window.Vyro.escapeHtml(product.name) + "</button></h3>" +
              '<p class="price">' + window.Vyro.formatPrice(product.price) + "</p>" +
              '<div class="float-piece__actions">' +
                '<button class="float-piece__add" type="button" data-add="' + product.id + '">Quick add</button>' +
                '<button class="wish' + (wished ? " is-on" : "") + '" type="button" data-wish="' + product.id + '" aria-pressed="' + (wished ? "true" : "false") + '" aria-label="' + (wished ? "Remove from wishlist" : "Save to wishlist") + ": " + window.Vyro.escapeHtml(product.name) + '">' +
                  '<i class="bi ' + (wished ? "bi-heart-fill" : "bi-heart") + '"></i>' +
                "</button>" +
              "</div>" +
            "</div>" +
          "</article>"
        );
      }).join("");
    }

    const form = document.getElementById("newsletterForm");
    const email = document.getElementById("newsletterEmail");
    const message = document.getElementById("newsletterMsg");
    if (form && email && message) {
      let saved = "";
      try { saved = localStorage.getItem("vyro-newsletter") || ""; } catch (error) { saved = ""; }
      if (saved) {
        message.textContent = "Saved on this device. Nothing was sent to a server.";
        message.className = "form-msg is-ok";
      }
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        const value = email.value.trim();
        const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        message.className = "form-msg";
        if (!value) {
          message.textContent = "Enter an email address.";
          message.classList.add("is-error");
          email.setAttribute("aria-invalid", "true");
          return;
        }
        if (!valid) {
          message.textContent = "Enter a valid email address. This demo keeps it on your device only.";
          message.classList.add("is-error");
          email.setAttribute("aria-invalid", "true");
          return;
        }
        email.setAttribute("aria-invalid", "false");
        if (saved && saved.toLowerCase() === value.toLowerCase()) {
          message.textContent = "This address is already saved on this device.";
          message.classList.add("is-ok");
          return;
        }
        try { localStorage.setItem("vyro-newsletter", value); } catch (error) { /* ignore */ }
        saved = value;
        message.textContent = "Saved on this device. Nothing was sent to a server.";
        message.classList.add("is-ok");
        form.reset();
      });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
