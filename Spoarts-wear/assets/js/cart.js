/* Bag, wishlist, quick view, and product cards. Shared by both pages. */
(function () {
  const CART_KEY = "vyro-cart";
  const WISH_KEY = "vyro-wishlist";

  function readStore(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeStore(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      /* Private mode can block storage. The UI still updates for this visit. */
    }
  }

  function sanitizeCart(items) {
    if (!Array.isArray(items)) return [];
    return items
      .filter(function (item) { return item && typeof item.id === "string"; })
      .map(function (item) {
        return {
          id: item.id,
          color: String(item.color || ""),
          size: String(item.size || ""),
          qty: Math.min(8, Math.max(1, parseInt(item.qty, 10) || 1))
        };
      });
  }

  let cartItems = sanitizeCart(readStore(CART_KEY, []));
  let wishIds = Array.isArray(readStore(WISH_KEY, [])) ? readStore(WISH_KEY, []) : [];
  const cartListeners = [];
  const wishListeners = [];

  function emitCart() {
    writeStore(CART_KEY, cartItems);
    cartListeners.forEach(function (fn) { fn(cartItems); });
    renderBag();
    updateCount();
  }

  function emitWish() {
    writeStore(WISH_KEY, wishIds);
    wishListeners.forEach(function (fn) { fn(wishIds); });
    syncHearts();
  }

  function countItems(items) {
    return items.reduce(function (sum, item) { return sum + item.qty; }, 0);
  }

  function subtotal(items) {
    return items.reduce(function (sum, item) {
      const product = window.Vyro.findProduct(item.id);
      return sum + (product ? product.price * item.qty : 0);
    }, 0);
  }

  const cart = {
    items: function () { return cartItems.slice(); },
    count: function () { return countItems(cartItems); },
    subtotal: function () { return subtotal(cartItems); },
    subscribe: function (fn) { cartListeners.push(fn); },
    add: function (entry) {
      const found = cartItems.find(function (item) {
        return item.id === entry.id && item.color === entry.color && item.size === entry.size;
      });
      if (found) found.qty = Math.min(8, found.qty + (entry.qty || 1));
      else {
        cartItems.push({
          id: entry.id,
          color: entry.color,
          size: entry.size,
          qty: Math.min(8, entry.qty || 1)
        });
      }
      emitCart();
    },
    update: function (index, delta) {
      const item = cartItems[index];
      if (!item) return;
      item.qty = Math.min(8, Math.max(1, item.qty + delta));
      emitCart();
    },
    remove: function (index) {
      cartItems.splice(index, 1);
      emitCart();
    }
  };

  const wishlist = {
    all: function () { return wishIds.slice(); },
    has: function (id) { return wishIds.indexOf(id) !== -1; },
    subscribe: function (fn) { wishListeners.push(fn); },
    toggle: function (id) {
      const index = wishIds.indexOf(id);
      if (index === -1) wishIds.push(id);
      else wishIds.splice(index, 1);
      emitWish();
      return wishIds.indexOf(id) !== -1;
    }
  };

  function defaultSize(product) {
    if (product.sizes.indexOf("M") !== -1) return "M";
    return product.sizes[0];
  }

  function syncHearts() {
    document.querySelectorAll("[data-wish]").forEach(function (button) {
      const on = wishlist.has(button.getAttribute("data-wish"));
      button.classList.toggle("is-on", on);
      button.setAttribute("aria-pressed", on ? "true" : "false");
      const icon = button.querySelector("i");
      if (icon) icon.className = on ? "bi bi-heart-fill" : "bi bi-heart";
    });
  }

  function updateCount() {
    const total = countItems(cartItems);
    document.querySelectorAll("[data-bag-count]").forEach(function (node) {
      node.textContent = String(total);
      node.classList.remove("is-pop");
      void node.offsetWidth;
      node.classList.add("is-pop");
    });
    const toggle = document.getElementById("bagToggle");
    if (toggle) {
      toggle.setAttribute("aria-label", "Shopping bag, " + total + (total === 1 ? " item" : " items"));
    }
  }

  function renderBag() {
    const list = document.getElementById("bagItems");
    const empty = document.getElementById("bagEmpty");
    const foot = document.getElementById("bagFoot");
    const sub = document.getElementById("bagSubtotal");
    if (!list || !empty || !foot) return;

    if (!cartItems.length) {
      list.innerHTML = "";
      empty.hidden = false;
      foot.hidden = true;
      return;
    }

    empty.hidden = true;
    foot.hidden = false;
    list.innerHTML = cartItems.map(function (item, index) {
      const product = window.Vyro.findProduct(item.id);
      const name = product ? product.name : "Removed piece";
      const price = product ? window.Vyro.formatPrice(product.price * item.qty) : "";
      const image = product ? product.image : "assets/images/fallback.svg";
      return (
        '<article class="bag-item">' +
          '<img src="' + image + '" alt="" data-fallback>' +
          '<div>' +
            '<div class="bag-item__row"><h3>' + window.Vyro.escapeHtml(name) + '</h3><span>' + price + '</span></div>' +
            '<p class="bag-item__meta">' + window.Vyro.escapeHtml(item.color) + " / " + window.Vyro.escapeHtml(item.size) + "</p>" +
            '<div class="bag-item__row">' +
              '<div class="qty">' +
                '<button type="button" data-act="dec" data-index="' + index + '" aria-label="Decrease quantity">−</button>' +
                '<span>' + item.qty + '</span>' +
                '<button type="button" data-act="inc" data-index="' + index + '" aria-label="Increase quantity">+</button>' +
              "</div>" +
              '<button type="button" class="remove-link" data-act="remove" data-index="' + index + '">Remove</button>' +
            "</div>" +
          "</div>" +
        "</article>"
      );
    }).join("");

    if (sub) sub.textContent = window.Vyro.formatPrice(subtotal(cartItems));
  }

  const quickState = { id: null, color: "", size: "", qty: 1 };

  function openQuick(id) {
    const product = window.Vyro.findProduct(id);
    const modal = document.getElementById("quickView");
    if (!product || !modal) return;
    window.Vyro.closeOverlays("quick");
    quickState.id = product.id;
    quickState.color = product.colors[0].name;
    quickState.size = product.sizes.length === 1 ? product.sizes[0] : "";
    quickState.qty = 1;

    document.getElementById("quickImage").src = product.image;
    document.getElementById("quickImage").alt = product.name;
    document.getElementById("quickCategory").textContent = window.Vyro.categoryLabels[product.category];
    document.getElementById("quickTitle").textContent = product.name;
    document.getElementById("quickPrice").textContent = window.Vyro.formatPrice(product.price);
    document.getElementById("quickDesc").textContent = product.description;
    document.getElementById("quickQty").textContent = "1";
    document.getElementById("quickError").textContent = "";

    document.getElementById("quickColors").innerHTML = product.colors.map(function (color) {
      const selected = color.name === quickState.color ? " is-selected" : "";
      return '<button type="button" class="color-btn' + selected + '" data-color="' + window.Vyro.escapeHtml(color.name) + '" aria-label="Color ' + window.Vyro.escapeHtml(color.name) + '" aria-pressed="' + (selected ? "true" : "false") + '"><span style="--swatch:' + color.hex + '"></span></button>';
    }).join("");

    const sizes = document.getElementById("quickSizes");
    if (product.sizes.length === 1 && product.sizes[0] === "OS") {
      sizes.innerHTML = '<p>One size</p>';
    } else {
      sizes.innerHTML = '<p>Size</p><div class="size-list">' + product.sizes.map(function (size) {
        return '<button type="button" class="size-btn" data-size="' + size + '" aria-pressed="false">' + size + "</button>";
      }).join("") + "</div>";
    }

    lastFocus = document.activeElement;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    modal.inert = false;
    syncLock();
    const close = modal.querySelector(".modal__close");
    if (close) close.focus();
  }

  function closeQuick(silent) {
    const modal = document.getElementById("quickView");
    if (!modal || !modal.classList.contains("is-open")) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    modal.inert = true;
    if (!silent) syncLock();
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function openBag() {
    const drawer = document.getElementById("bagDrawer");
    if (!drawer) return;
    window.Vyro.closeOverlays("bag");
    lastFocus = document.activeElement;
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    drawer.inert = false;
    syncLock();
    const close = document.getElementById("bagClose");
    if (close) close.focus();
  }

  function closeBag(silent) {
    const drawer = document.getElementById("bagDrawer");
    if (!drawer || !drawer.classList.contains("is-open")) return;
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    drawer.inert = true;
    const note = document.getElementById("checkoutNote");
    if (note) note.hidden = true;
    if (!silent) syncLock();
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  let lastFocus = null;

  function syncLock() {
    const open = document.querySelector(".drawer.is-open, .modal.is-open, .search-overlay.is-open, .nav-panel.is-open");
    document.body.classList.toggle("is-locked", Boolean(open));
  }

  function toast(message, actionLabel, action) {
    const stack = document.getElementById("toastStack");
    if (!stack) return;
    const el = document.createElement("div");
    el.className = "toast";
    el.setAttribute("role", "status");
    const text = document.createElement("p");
    text.textContent = message;
    el.appendChild(text);
    if (actionLabel) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = actionLabel;
      button.addEventListener("click", function () {
        if (action) action();
        el.remove();
      });
      el.appendChild(button);
    }
    stack.appendChild(el);
    setTimeout(function () { el.remove(); }, 4200);
  }

  function markAdded(button) {
    if (!button) return;
    if (!button.dataset.label) button.dataset.label = button.textContent;
    button.classList.add("is-added");
    button.textContent = "Added";
    window.setTimeout(function () {
      button.classList.remove("is-added");
      button.textContent = button.dataset.label;
    }, 1400);
  }

  function addProduct(id, detail) {
    const product = window.Vyro.findProduct(id);
    if (!product) return;
    const size = detail && detail.size ? detail.size : defaultSize(product);
    const color = detail && detail.color ? detail.color : product.colors[0].name;
    const qty = detail && detail.qty ? detail.qty : 1;
    cart.add({ id: product.id, size: size, color: color, qty: qty });
    if (detail && detail.button) markAdded(detail.button);
    const bagButton = document.getElementById("bagToggle");
    if (bagButton) {
      bagButton.classList.remove("is-confirmed");
      void bagButton.offsetWidth;
      bagButton.classList.add("is-confirmed");
    }
    toast(product.name + " added — size " + size + ".", "View bag", openBag);
    window.setTimeout(openBag, 420);
  }

  document.addEventListener("click", function (event) {
    const wish = event.target.closest("[data-wish]");
    const add = event.target.closest("[data-add]");
    const view = event.target.closest("[data-view]");
    if (wish) {
      event.preventDefault();
      wishlist.toggle(wish.getAttribute("data-wish"));
    }
    if (add) {
      event.preventDefault();
      addProduct(add.getAttribute("data-add"), { button: add });
    }
    if (view) {
      event.preventDefault();
      openQuick(view.getAttribute("data-view"));
    }
  });

  document.addEventListener("error", function (event) {
    const img = event.target;
    if (!img || img.tagName !== "IMG" || img.dataset.failed) return;
    if (!img.hasAttribute("data-fallback")) return;
    img.dataset.failed = "1";
    img.src = "assets/images/fallback.svg";
  }, true);

  function bootBag() {
    const list = document.getElementById("bagItems");
    if (list) {
      list.addEventListener("click", function (event) {
        const button = event.target.closest("[data-act]");
        if (!button) return;
        const index = Number(button.dataset.index);
        if (button.dataset.act === "inc") cart.update(index, 1);
        if (button.dataset.act === "dec") cart.update(index, -1);
        if (button.dataset.act === "remove") cart.remove(index);
      });
    }

    const bagToggle = document.getElementById("bagToggle");
    const bagClose = document.getElementById("bagClose");
    const bagBackdrop = document.getElementById("bagBackdrop");
    if (bagToggle) bagToggle.addEventListener("click", openBag);
    if (bagClose) bagClose.addEventListener("click", function () { closeBag(); });
    if (bagBackdrop) bagBackdrop.addEventListener("click", function () { closeBag(); });

    document.querySelectorAll("[data-continue]").forEach(function (link) {
      link.addEventListener("click", function (event) {
        if (document.body.dataset.page === "shop") {
          event.preventDefault();
          closeBag();
        }
      });
    });

    const checkout = document.getElementById("checkoutPreview");
    const note = document.getElementById("checkoutNote");
    if (checkout && note) {
      checkout.addEventListener("click", function () {
        note.hidden = false;
      });
    }

    const modal = document.getElementById("quickView");
    if (modal) {
      modal.querySelectorAll("[data-close-modal]").forEach(function (node) {
        node.addEventListener("click", function () { closeQuick(); });
      });
      modal.addEventListener("click", function (event) {
        const color = event.target.closest("[data-color]");
        const size = event.target.closest("[data-size]");
        if (color) {
          quickState.color = color.dataset.color;
          modal.querySelectorAll("[data-color]").forEach(function (button) {
            const on = button === color;
            button.classList.toggle("is-selected", on);
            button.setAttribute("aria-pressed", on ? "true" : "false");
          });
        }
        if (size) {
          quickState.size = size.dataset.size;
          document.getElementById("quickError").textContent = "";
          modal.querySelectorAll("[data-size]").forEach(function (button) {
            const on = button === size;
            button.classList.toggle("is-selected", on);
            button.setAttribute("aria-pressed", on ? "true" : "false");
          });
        }
      });
    }

    const minus = document.getElementById("qtyMinus");
    const plus = document.getElementById("qtyPlus");
    const qty = document.getElementById("quickQty");
    if (minus && plus && qty) {
      minus.addEventListener("click", function () {
        quickState.qty = Math.max(1, quickState.qty - 1);
        qty.textContent = String(quickState.qty);
      });
      plus.addEventListener("click", function () {
        quickState.qty = Math.min(8, quickState.qty + 1);
        qty.textContent = String(quickState.qty);
      });
    }

    const quickAdd = document.getElementById("quickAdd");
    if (quickAdd) {
      quickAdd.addEventListener("click", function () {
        const product = window.Vyro.findProduct(quickState.id);
        if (!product) return;
        if (product.sizes.length > 1 && !quickState.size) {
          document.getElementById("quickError").textContent = "Select a size to add this piece.";
          return;
        }
        addProduct(product.id, {
          size: quickState.size || product.sizes[0],
          color: quickState.color,
          qty: quickState.qty,
          button: quickAdd
        });
        closeQuick(true);
      });
    }

    renderBag();
    updateCount();
    syncHearts();
  }

  window.Vyro.cart = cart;
  window.Vyro.wishlist = wishlist;
  window.Vyro.toast = toast;
  window.Vyro.openBag = openBag;
  window.Vyro.closeBag = closeBag;
  window.Vyro.openQuick = openQuick;
  window.Vyro.closeQuick = closeQuick;
  window.Vyro.syncLock = syncLock;
  window.Vyro.closeOverlays = function (except) {
    if (except !== "bag") closeBag(true);
    if (except !== "quick") closeQuick(true);
    if (except !== "search" && window.Vyro.closeSearch) window.Vyro.closeSearch(true);
    if (except !== "nav" && window.Vyro.closeNav) window.Vyro.closeNav(true);
    if (except !== "info" && window.Vyro.closeInfo) window.Vyro.closeInfo(true);
    syncLock();
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bootBag);
  else bootBag();
})();
