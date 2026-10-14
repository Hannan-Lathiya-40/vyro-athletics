/* VYRO ATHLETICS — product catalogue.
   Single source of truth for both pages. Image paths live here. */
(function () {
  const products = [
    {
      id: "compression-tee",
      name: "VYRO Compression Training Tee",
      price: 3490,
      category: "tops",
      collection: "training",
      gender: "men",
      colors: [
        { name: "Ink", hex: "#141513" },
        { name: "Bone", hex: "#e6e1d6" },
        { name: "Lime", hex: "#d6ff3c" }
      ],
      sizes: ["XS", "S", "M", "L", "XL"],
      badge: "bestseller",
      newest: 7,
      featured: true,
      order: 1,
      image: "assets/images/products/tee.jpg",
      hover: "assets/images/products/tee-alt.jpg",
      description: "A close-cut training tee in a soft four-way knit. Mapped for laps, lifts, and the warm-up before either."
    },
    {
      id: "performance-leggings",
      name: "VYRO Performance Leggings",
      price: 4290,
      category: "bottoms",
      collection: "movement",
      gender: "women",
      colors: [
        { name: "Ink", hex: "#141513" },
        { name: "Graphite", hex: "#3a3d38" },
        { name: "Bone", hex: "#e6e1d6" }
      ],
      sizes: ["XS", "S", "M", "L", "XL"],
      badge: "bestseller",
      newest: 9,
      featured: true,
      order: 2,
      image: "assets/images/products/leggings.jpg",
      hover: "assets/images/products/leggings-alt.jpg",
      description: "High-rise performance leggings with a locked waist and a smooth, squat-proof face. Built for pace work and studio hours."
    },
    {
      id: "sculpt-bra",
      name: "VYRO Sculpt Sports Bra",
      price: 2890,
      category: "sports-bras",
      collection: "training",
      gender: "women",
      colors: [
        { name: "Ink", hex: "#141513" },
        { name: "Sand", hex: "#c2b6a4" },
        { name: "Lime", hex: "#d6ff3c" }
      ],
      sizes: ["XS", "S", "M", "L", "XL"],
      badge: "new",
      newest: 16,
      featured: true,
      order: 3,
      image: "assets/images/products/bra.jpg",
      hover: "assets/images/products/bra-alt.jpg",
      description: "A medium-support sculpt bra with a clean neckline and a wide underband. Designed to stay put through intervals."
    },
    {
      id: "training-shorts",
      name: "VYRO Training Shorts",
      price: 2490,
      category: "bottoms",
      collection: "training",
      gender: "men",
      colors: [
        { name: "Ink", hex: "#141513" },
        { name: "Olive", hex: "#3e4634" },
        { name: "Bone", hex: "#e6e1d6" }
      ],
      sizes: ["XS", "S", "M", "L", "XL"],
      badge: null,
      newest: 5,
      featured: true,
      order: 4,
      image: "assets/images/products/shorts.jpg",
      hover: "assets/images/products/shorts-alt.jpg",
      description: "A 7-inch training short with a brief liner and a quiet pocket. Light, blunt, and ready for the floor."
    },
    {
      id: "restore-tee",
      name: "VYRO Restore Crew Tee",
      price: 3890,
      category: "tops",
      collection: "recovery",
      gender: "women",
      colors: [
        { name: "Bone", hex: "#e6e1d6" },
        { name: "Ink", hex: "#141513" },
        { name: "Slate", hex: "#5c6158" }
      ],
      sizes: ["XS", "S", "M", "L", "XL"],
      badge: "new",
      newest: 14,
      featured: false,
      order: 5,
      image: "assets/images/products/longsleeve.jpg",
      hover: "",
      description: "A soft crew for restore days and the walk out of the studio. Easy through the shoulder, clean at the hem."
    },
    {
      id: "airflow-tank",
      name: "VYRO Airflow Tank",
      price: 2190,
      category: "tops",
      collection: "training",
      gender: "men",
      colors: [
        { name: "Ink", hex: "#141513" },
        { name: "Lime", hex: "#d6ff3c" },
        { name: "Bone", hex: "#e6e1d6" }
      ],
      sizes: ["S", "M", "L", "XL"],
      badge: null,
      newest: 4,
      featured: false,
      order: 6,
      image: "assets/images/products/tank.jpg",
      hover: "assets/images/products/tank-alt.jpg",
      description: "An open-arm tank cut from a quick-dry jersey. Dropped armholes, a clean hem, and nothing that argues with a barbell."
    },
    {
      id: "studio-jogger",
      name: "VYRO Studio Jogger",
      price: 4590,
      category: "bottoms",
      collection: "recovery",
      gender: "unisex",
      colors: [
        { name: "Ink", hex: "#141513" },
        { name: "Stone", hex: "#b7b1a6" },
        { name: "Olive", hex: "#3e4634" }
      ],
      sizes: ["XS", "S", "M", "L", "XL"],
      badge: null,
      newest: 6,
      featured: false,
      order: 7,
      image: "assets/images/products/jogger.jpg",
      hover: "",
      description: "A tapered recovery jogger with an articulated knee and a soft brushed interior. For the walk home and the day after."
    },
    {
      id: "form-bra",
      name: "VYRO Form Sports Bra",
      price: 3190,
      category: "sports-bras",
      collection: "movement",
      gender: "women",
      colors: [
        { name: "Ink", hex: "#141513" },
        { name: "Bone", hex: "#e6e1d6" },
        { name: "Graphite", hex: "#3a3d38" }
      ],
      sizes: ["XS", "S", "M", "L", "XL"],
      badge: "bestseller",
      newest: 8,
      featured: false,
      order: 8,
      image: "assets/images/products/formbra.jpg",
      hover: "assets/images/products/formbra-alt.jpg",
      description: "Light-support form bra with a squared neck and removable pads. The piece you keep on between studio and street."
    },
    {
      id: "pace-short",
      name: "VYRO Pace Running Short",
      price: 2790,
      category: "bottoms",
      collection: "movement",
      gender: "women",
      colors: [
        { name: "Ink", hex: "#141513" },
        { name: "Lime", hex: "#d6ff3c" },
        { name: "Sand", hex: "#c2b6a4" }
      ],
      sizes: ["XS", "S", "M", "L", "XL"],
      badge: "new",
      newest: 13,
      featured: false,
      order: 9,
      image: "assets/images/products/paceshort.jpg",
      hover: "assets/images/products/paceshort-alt.jpg",
      description: "A split-hem running short with a brief underneath and a key pocket that actually stays shut."
    },
    {
      id: "core-crop",
      name: "VYRO Core Crop Top",
      price: 2690,
      category: "tops",
      collection: "training",
      gender: "women",
      colors: [
        { name: "Bone", hex: "#e6e1d6" },
        { name: "Ink", hex: "#141513" },
        { name: "Lime", hex: "#d6ff3c" }
      ],
      sizes: ["XS", "S", "M", "L", "XL"],
      badge: null,
      newest: 10,
      featured: false,
      order: 10,
      image: "assets/images/products/crop.jpg",
      hover: "",
      description: "A cropped training top with a bound hem and a neckline that stays put when the work gets overhead."
    },
    {
      id: "recovery-hoodie",
      name: "VYRO Recovery Hoodie",
      price: 5490,
      category: "tops",
      collection: "recovery",
      gender: "unisex",
      colors: [
        { name: "Ink", hex: "#141513" },
        { name: "Bone", hex: "#e6e1d6" },
        { name: "Olive", hex: "#3e4634" }
      ],
      sizes: ["XS", "S", "M", "L", "XL"],
      badge: "bestseller",
      newest: 3,
      featured: false,
      order: 11,
      image: "assets/images/products/hoodie.jpg",
      hover: "assets/images/products/hoodie-alt.jpg",
      description: "An oversized recovery hoodie in a dense French terry. Heavy where you want cover, easy where you still need to move."
    },
    {
      id: "grip-gloves",
      name: "VYRO Grip Training Gloves",
      price: 1890,
      category: "accessories",
      collection: "training",
      gender: "unisex",
      colors: [
        { name: "Ink", hex: "#141513" },
        { name: "Bone", hex: "#e6e1d6" }
      ],
      sizes: ["S", "M", "L"],
      badge: null,
      newest: 11,
      featured: false,
      order: 12,
      image: "assets/images/products/gloves.jpg",
      hover: "",
      description: "Low-profile training gloves with a tacky palm and an open back. Made for pulls, not for hiding your hands."
    },
    {
      id: "motion-cap",
      name: "VYRO Motion Cap",
      price: 1490,
      category: "accessories",
      collection: "movement",
      gender: "unisex",
      colors: [
        { name: "Ink", hex: "#141513" },
        { name: "Bone", hex: "#e6e1d6" },
        { name: "Lime", hex: "#d6ff3c" }
      ],
      sizes: ["OS"],
      badge: "new",
      newest: 12,
      featured: false,
      order: 13,
      image: "assets/images/products/cap.jpg",
      hover: "",
      description: "A breathable training cap with a short brim and a mesh crown. One size, with an interior adjuster."
    },
    {
      id: "bike-short",
      name: "VYRO Studio Bike Short",
      price: 2990,
      category: "bottoms",
      collection: "movement",
      gender: "women",
      colors: [
        { name: "Ink", hex: "#141513" },
        { name: "Graphite", hex: "#3a3d38" },
        { name: "Sand", hex: "#c2b6a4" }
      ],
      sizes: ["XS", "S", "M", "L", "XL"],
      badge: null,
      newest: 2,
      featured: false,
      order: 14,
      image: "assets/images/products/bikeshort.jpg",
      hover: "",
      description: "A mid-thigh bike short with a compressive waist and a smooth, gallery-flat seam map. Studio first, street after."
    },
    {
      id: "elite-jacket",
      name: "VYRO Elite Zip Jacket",
      price: 6290,
      category: "tops",
      collection: "training",
      gender: "unisex",
      colors: [
        { name: "Ink", hex: "#141513" },
        { name: "Bone", hex: "#e6e1d6" }
      ],
      sizes: ["XS", "S", "M", "L", "XL"],
      badge: "new",
      newest: 15,
      featured: false,
      order: 15,
      image: "assets/images/products/jacket.jpg",
      hover: "",
      description: "A sharpened zip jacket for warm-up laps and weather that changes its mind. Two pockets, a quiet collar, a precise hem."
    },
    {
      id: "studio-tights",
      name: "VYRO Restore Studio Tights",
      price: 3990,
      category: "bottoms",
      collection: "recovery",
      gender: "women",
      colors: [
        { name: "Ink", hex: "#141513" },
        { name: "Bone", hex: "#e6e1d6" },
        { name: "Olive", hex: "#3e4634" }
      ],
      sizes: ["XS", "S", "M", "L", "XL"],
      badge: null,
      newest: 1,
      featured: false,
      order: 16,
      image: "assets/images/products/tights.jpg",
      hover: "assets/images/products/tights-alt.jpg",
      description: "Softer studio tights for restore days. A higher rise, a gentler compression, and a matte hand that reads tailored."
    }
  ];

  const categoryLabels = {
    tops: "Tops",
    bottoms: "Bottoms",
    "sports-bras": "Sports Bras",
    accessories: "Accessories"
  };

  function formatPrice(value) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(value);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
    });
  }

  function productCard(product) {
    const wished = window.Vyro && window.Vyro.wishlist && window.Vyro.wishlist.has(product.id);
    const badge = product.badge
      ? '<span class="badge' + (product.badge === "bestseller" ? " badge--best" : "") + '">' +
        (product.badge === "new" ? "New" : "Bestseller") + "</span>"
      : "";
    const colors = product.colors
      .map(function (color) {
        return '<span class="swatch" style="--swatch:' + color.hex + '" title="' + escapeHtml(color.name) + '"></span>';
      })
      .join("");
    const colorNames = product.colors.map(function (color) { return color.name; }).join(", ");
    const hover = product.hover
      ? '<img class="product-card__hover" src="' + product.hover + '" alt="" data-fallback>'
      : "";

    return (
      '<article class="product-card" data-tilt data-id="' + product.id + '">' +
        '<div class="product-card__media">' +
          '<button class="product-card__open" type="button" data-view="' + product.id + '" aria-label="Quick view ' + escapeHtml(product.name) + '">' +
            '<img class="product-card__img" src="' + product.image + '" alt="' + escapeHtml(product.name) + '" data-fallback>' +
            hover +
          "</button>" +
          badge +
          '<button class="wish' + (wished ? " is-on" : "") + '" type="button" data-wish="' + product.id + '" aria-pressed="' + (wished ? "true" : "false") + '" aria-label="' + (wished ? "Remove from wishlist" : "Save to wishlist") + ": " + escapeHtml(product.name) + '">' +
            '<i class="bi ' + (wished ? "bi-heart-fill" : "bi-heart") + '"></i>' +
          "</button>" +
          '<button class="product-card__add" type="button" data-add="' + product.id + '">Quick add</button>' +
        "</div>" +
        '<div class="product-card__meta">' +
          '<p class="product-card__cat">' + categoryLabels[product.category] + "</p>" +
          '<div class="product-card__row">' +
            '<h3><button type="button" data-view="' + product.id + '">' + escapeHtml(product.name) + "</button></h3>" +
            '<p class="price">' + formatPrice(product.price) + "</p>" +
          "</div>" +
          '<div class="swatches" aria-hidden="true">' + colors + "</div>" +
          '<p class="visually-hidden">Colors: ' + escapeHtml(colorNames) + "</p>" +
        "</div>" +
      "</article>"
    );
  }

  window.Vyro = window.Vyro || {};
  window.Vyro.products = products;
  window.Vyro.categoryLabels = categoryLabels;
  window.Vyro.formatPrice = formatPrice;
  window.Vyro.escapeHtml = escapeHtml;
  window.Vyro.productCard = productCard;
  window.Vyro.findProduct = function (id) {
    return products.find(function (item) { return item.id === id; }) || null;
  };
})();
