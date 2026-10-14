/* Catalogue filters, sorting, search, and the product grid. */
(function () {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  const countNode = document.getElementById("productCount");
  const sortSelect = document.getElementById("sortSelect");
  const searchInput = document.getElementById("filterSearch");
  const wishToggle = document.getElementById("wishlistToggle");
  const clearButton = document.getElementById("clearFilters");
  const chips = document.getElementById("activeFilters");
  const empty = document.getElementById("emptyState");
  const emptyText = document.getElementById("emptyText");
  const lede = document.getElementById("pageHeroLede");

  const state = {
    category: "all",
    gender: "",
    collection: "",
    onlyNew: false,
    wishlistOnly: false,
    search: "",
    sort: "featured"
  };

  function readUrl() {
    const params = new URLSearchParams(location.search);
    const category = params.get("category");
    if (category && window.Vyro.categoryLabels[category]) state.category = category;
    const gender = params.get("gender");
    if (gender === "men" || gender === "women") state.gender = gender;
    const collection = params.get("collection");
    if (collection === "training" || collection === "movement" || collection === "recovery") state.collection = collection;
    state.onlyNew = params.get("filter") === "new";
    state.wishlistOnly = params.get("wishlist") === "1";
    state.search = params.get("search") || "";
    const sort = params.get("sort");
    if (["featured", "price-asc", "price-desc", "name", "newest"].indexOf(sort) !== -1) state.sort = sort;
  }

  function writeUrl() {
    const params = new URLSearchParams();
    if (state.category !== "all") params.set("category", state.category);
    if (state.gender) params.set("gender", state.gender);
    if (state.collection) params.set("collection", state.collection);
    if (state.onlyNew) params.set("filter", "new");
    if (state.wishlistOnly) params.set("wishlist", "1");
    if (state.search) params.set("search", state.search);
    if (state.sort !== "featured") params.set("sort", state.sort);
    const next = params.toString();
    history.replaceState(null, "", next ? "?" + next : location.pathname);
  }

  function filtered() {
    let list = window.Vyro.products.slice();
    if (state.category !== "all") list = list.filter(function (product) { return product.category === state.category; });
    if (state.gender) {
      list = list.filter(function (product) {
        return product.gender === state.gender || product.gender === "unisex";
      });
    }
    if (state.collection) list = list.filter(function (product) { return product.collection === state.collection; });
    if (state.onlyNew) list = list.filter(function (product) { return product.badge === "new"; });
    if (state.wishlistOnly) list = list.filter(function (product) { return window.Vyro.wishlist.has(product.id); });
    if (state.search) {
      const q = state.search.toLowerCase();
      list = list.filter(function (product) {
        const colors = product.colors.map(function (color) { return color.name.toLowerCase(); }).join(" ");
        return product.name.toLowerCase().indexOf(q) !== -1 ||
          product.category.indexOf(q) !== -1 ||
          product.collection.indexOf(q) !== -1 ||
          product.description.toLowerCase().indexOf(q) !== -1 ||
          colors.indexOf(q) !== -1 ||
          window.Vyro.categoryLabels[product.category].toLowerCase().indexOf(q) !== -1;
      });
    }
    if (state.sort === "price-asc") list.sort(function (a, b) { return a.price - b.price; });
    else if (state.sort === "price-desc") list.sort(function (a, b) { return b.price - a.price; });
    else if (state.sort === "name") list.sort(function (a, b) { return a.name.localeCompare(b.name); });
    else if (state.sort === "newest") list.sort(function (a, b) { return b.newest - a.newest; });
    else list.sort(function (a, b) { return a.order - b.order; });
    return list;
  }

  function renderChips() {
    if (!chips) return;
    const items = [];
    if (state.gender) items.push({ key: "gender", label: state.gender === "men" ? "Men" : "Women" });
    if (state.collection) items.push({ key: "collection", label: state.collection });
    if (state.onlyNew) items.push({ key: "new", label: "New arrivals" });
    if (state.wishlistOnly) items.push({ key: "wishlist", label: "Wishlist" });
    if (state.search) items.push({ key: "search", label: "Search: " + state.search });
    chips.innerHTML = items.map(function (item) {
      return '<button type="button" class="chip" data-clear="' + item.key + '">' + window.Vyro.escapeHtml(item.label) + " ×</button>";
    }).join("");
  }

  function updateLede() {
    if (!lede) return;
    const lines = {
      training: "Load, repeat, and stay sharp. The training edit.",
      movement: "Pace, flow, and the long way around.",
      recovery: "The quieter set. Restore, then go again.",
      men: "Men’s training system, plus the unisex pieces.",
      women: "Women’s training system, plus the unisex pieces.",
      new: "Just in. The newest pieces in the line."
    };
    lede.textContent = lines[state.collection] || lines[state.gender] || (state.onlyNew ? lines.new : "Sixteen pieces. Cut for training, movement, and recovery.");
  }

  function render() {
    const list = filtered();
    const label = String(list.length).padStart(2, "0") + (list.length === 1 ? " piece" : " pieces");
    if (countNode) countNode.textContent = label;
    const editorial = state.category === "all" && !state.gender && !state.collection && !state.onlyNew && !state.wishlistOnly && !state.search && state.sort === "featured";
    grid.innerHTML = list.map(function (product, index) {
      let rhythm = "";
      if (editorial && index === 0) rhythm = " product-card--lead";
      else if (editorial && (index === 5 || index === 10)) rhythm = " product-card--wide";
      return window.Vyro.productCard(product).replace(
        'class="product-card"',
        'class="product-card' + rhythm + '" style="animation-delay:' + Math.min(index * 0.05, 0.45) + 's"'
      );
    }).join("");
    if (empty) {
      const show = list.length === 0;
      empty.hidden = !show;
      if (show && emptyText) {
        if (state.wishlistOnly) emptyText.textContent = "Nothing saved yet. Mark a piece to keep it here.";
        else if (state.search) emptyText.textContent = "No pieces match “" + state.search + "”.";
        else emptyText.textContent = "No pieces match these filters.";
      }
    }
    document.querySelectorAll("#categoryNav [data-category]").forEach(function (button) {
      const on = button.dataset.category === state.category;
      button.setAttribute("aria-selected", on ? "true" : "false");
    });
    if (wishToggle) wishToggle.setAttribute("aria-pressed", state.wishlistOnly ? "true" : "false");
    if (sortSelect) sortSelect.value = state.sort;
    if (searchInput && searchInput.value !== state.search) searchInput.value = state.search;
    renderChips();
    updateLede();
    writeUrl();
  }

  function clearAll() {
    state.category = "all";
    state.gender = "";
    state.collection = "";
    state.onlyNew = false;
    state.wishlistOnly = false;
    state.search = "";
    state.sort = "featured";
    if (searchInput) searchInput.value = "";
    render();
  }

  document.getElementById("categoryNav").addEventListener("click", function (event) {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    state.category = button.dataset.category;
    render();
  });

  if (sortSelect) {
    sortSelect.addEventListener("change", function () {
      state.sort = sortSelect.value;
      render();
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      state.search = searchInput.value.trim();
      render();
    });
  }

  const filterForm = document.getElementById("filterForm");
  if (filterForm) filterForm.addEventListener("submit", function (event) { event.preventDefault(); });

  if (wishToggle) {
    wishToggle.addEventListener("click", function () {
      state.wishlistOnly = !state.wishlistOnly;
      render();
    });
  }

  if (clearButton) clearButton.addEventListener("click", clearAll);
  const emptyClear = document.getElementById("emptyClear");
  if (emptyClear) emptyClear.addEventListener("click", clearAll);

  if (chips) {
    chips.addEventListener("click", function (event) {
      const button = event.target.closest("[data-clear]");
      if (!button) return;
      const key = button.dataset.clear;
      if (key === "gender") state.gender = "";
      if (key === "collection") state.collection = "";
      if (key === "new") state.onlyNew = false;
      if (key === "wishlist") state.wishlistOnly = false;
      if (key === "search") {
        state.search = "";
        if (searchInput) searchInput.value = "";
      }
      render();
    });
  }

  window.Vyro.wishlist.subscribe(function () {
    if (state.wishlistOnly) render();
  });

  window.Vyro.applySearch = function (query) {
    state.search = query;
    state.wishlistOnly = false;
    render();
    const catalogue = document.getElementById("catalogue");
    if (catalogue) catalogue.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  readUrl();
  render();
})();
