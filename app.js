const PLANETS = [
  {
    id: "mercury",
    name: "Mercury",
    type: "rocky",
    tier: "Collector Edition",
    price: 4.8,
    unit: "B",
    image: "mercury.png",
    summary: "A fast-orbiting metallic frontier for collectors who want a sharp, stark destination.",
    description: "Mercury is a premium minimalist world in the collection: cratered, dramatic, and wrapped in extremes. It suits shoppers who love hard-science visuals and rare cosmic objects.",
    climate: "Extreme thermal swings",
    distance: "57.9M km from Sun",
    rarity: "Ultra Rare",
    vibe: "Industrial luxury",
    tags: ["fast orbit", "crater view", "science icon"]
  },
  {
    id: "venus",
    name: "Venus",
    type: "rocky",
    tier: "Atmospheric Icon",
    price: 5.1,
    unit: "B",
    image: "venus.jpg",
    summary: "A glowing cloud-shrouded world with unmatched drama and bold visual identity.",
    description: "Venus is for shoppers who want spectacle and mythic status. Dense clouds and fierce atmosphere make it one of the strongest statement pieces in the catalog.",
    climate: "Dense super-heated atmosphere",
    distance: "108.2M km from Sun",
    rarity: "Iconic",
    vibe: "High-pressure opulence",
    tags: ["bright sky object", "volcanic mystery", "luxury showpiece"]
  },
  {
    id: "earth",
    name: "Earth",
    type: "habitable fantasy",
    tier: "Best Seller",
    price: 12.4,
    unit: "B",
    image: "earth.jpg",
    summary: "The blue-chip biosphere listing with oceans, weather, and balanced familiarity.",
    description: "Earth is the lifestyle centerpiece of the collection: oceanic, lush, and iconic. It represents the premium benchmark that other worlds are compared against.",
    climate: "Life-supporting and dynamic",
    distance: "149.6M km from Sun",
    rarity: "Best Seller",
    vibe: "Premium living",
    tags: ["oceans", "green zones", "balanced climate"]
  },
  {
    id: "mars",
    name: "Mars",
    type: "rocky",
    tier: "Explorer Favorite",
    price: 8.6,
    unit: "B",
    image: "mars.jpg",
    summary: "The red frontier listing for ambitious explorers, colony dreamers, and sci-fi fans.",
    description: "Mars has the strongest adventure energy in the collection. Its canyon systems, dust fields, and future-colony fantasy make it perfect for bold buyers.",
    climate: "Cold desert atmosphere",
    distance: "227.9M km from Sun",
    rarity: "Popular",
    vibe: "Pioneer energy",
    tags: ["future colony", "red desert", "explorer pick"]
  },
  {
    id: "jupiter",
    name: "Jupiter",
    type: "gas giant",
    tier: "Grand Scale",
    price: 14.9,
    unit: "B",
    image: "juipter.jpg",
    summary: "A massive prestige listing with storm belts, scale drama, and gravitational presence.",
    description: "Jupiter is the flagship gas giant for customers who want scale above all else. It is all about spectacle, dominance, and giant-world energy.",
    climate: "Storm-driven giant atmosphere",
    distance: "778.5M km from Sun",
    rarity: "Monumental",
    vibe: "Empire luxury",
    tags: ["great red spot", "massive scale", "storm belts"]
  },
  {
    id: "saturn",
    name: "Saturn",
    type: "gas giant",
    tier: "Luxury Signature",
    price: 16.3,
    unit: "B",
    image: "saturn.jpg",
    summary: "The ringed crown jewel of the storefront and the most photogenic planet in the lineup.",
    description: "Saturn is the luxury signature product of Planet Shop. The rings alone make it a hero product, and the story centers on elegance and instantly recognizable beauty.",
    climate: "Cold ringed gas giant",
    distance: "1.43B km from Sun",
    rarity: "Signature",
    vibe: "Editorial elegance",
    tags: ["rings", "iconic silhouette", "showstopper"]
  },
  {
    id: "uranus",
    name: "Uranus",
    type: "ice giant",
    tier: "Design Pick",
    price: 9.7,
    unit: "B",
    summary: "A cool-toned atmospheric statement piece for shoppers who prefer niche prestige.",
    description: "Uranus stands out through tone and uniqueness. Its icy palette and unusual tilt make it the design-lover planet of the store.",
    climate: "Frigid tilted atmosphere",
    distance: "2.87B km from Sun",
    rarity: "Niche Rare",
    vibe: "Minimal sci-fi",
    tags: ["icy palette", "tilted axis", "understated prestige"]
  },
  {
    id: "neptune",
    name: "Neptune",
    type: "ice giant",
    tier: "Deep Space Elite",
    price: 11.8,
    unit: "B",
    image: "neptune.jpg",
    summary: "A deep-blue outer-system listing built for remote exclusivity and high-speed storms.",
    description: "Neptune is the far-edge luxury item of the catalog. It appeals to buyers who want distance, mystery, and strong visual identity.",
    climate: "Cold and wind-swept",
    distance: "4.50B km from Sun",
    rarity: "Elite Remote",
    vibe: "Deep-space exclusivity",
    tags: ["outer edge", "high winds", "blue luxury"]
  }
];

function formatPrice(value, unit) {
  return `$${value.toFixed(1)}${unit}`;
}

function getPlanet(id) {
  return PLANETS.find((planet) => planet.id === id);
}

function getCart() {
  return JSON.parse(localStorage.getItem("planet-shop-cart") || "[]");
}

function saveCart(cart) {
  localStorage.setItem("planet-shop-cart", JSON.stringify(cart));
}

function updateNavCartCount() {
  const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll("#navCartCount").forEach((node) => {
    node.textContent = count;
  });
}

function addToCart(id) {
  const cart = getCart();
  const found = cart.find((item) => item.id === id);
  if (found) {
    found.quantity += 1;
  } else {
    cart.push({ id, quantity: 1 });
  }
  saveCart(cart);
  updateNavCartCount();
}

function changeCartQuantity(id, delta) {
  let cart = getCart();
  cart = cart.map((item) => item.id === id ? { ...item, quantity: item.quantity + delta } : item)
    .filter((item) => item.quantity > 0);
  saveCart(cart);
  updateNavCartCount();
  return cart;
}

function clearCart() {
  saveCart([]);
  updateNavCartCount();
}

function createPlanetVisual(planet, className = "planet-visual") {
  if (planet.image) {
    return `<div class="${className}"><img src="${planet.image}" alt="${planet.name}"></div>`;
  }
  return `<div class="${className}"><div class="planet-gradient-uranus"></div></div>`;
}

function renderCatalog(targetId, filterValue = "all", query = "") {
  const target = document.getElementById(targetId);
  if (!target) return;

  const needle = query.trim().toLowerCase();
  const filtered = PLANETS.filter((planet) => {
    const matchesFilter = filterValue === "all" || planet.type === filterValue;
    const matchesQuery =
      !needle ||
      planet.name.toLowerCase().includes(needle) ||
      planet.type.toLowerCase().includes(needle) ||
      planet.summary.toLowerCase().includes(needle) ||
      planet.tags.some((tag) => tag.toLowerCase().includes(needle));
    return matchesFilter && matchesQuery;
  });

  if (!filtered.length) {
    target.innerHTML = `<div class="glass-card empty-state">No planets match this search yet. Try another filter or keyword.</div>`;
    return;
  }

  target.innerHTML = filtered.map((planet) => `
    <article class="planet-card tilt-card">
      <span class="planet-badge">${planet.tier}</span>
      ${createPlanetVisual(planet)}
      <h3 class="planet-name">${planet.name}</h3>
      <p class="planet-type">${planet.type}</p>
      <p class="planet-copy">${planet.summary}</p>
      <div class="planet-meta">
        <span class="meta-pill">${planet.climate}</span>
        <span class="meta-pill">${planet.rarity}</span>
      </div>
      <div class="planet-footer">
        <div class="price-wrap">
          <strong>${formatPrice(planet.price, planet.unit)}</strong>
          <span>${planet.vibe}</span>
        </div>
        <div class="card-actions">
          <a class="card-btn" href="product.html?id=${planet.id}">View</a>
          <button class="card-btn buy" data-add="${planet.id}">Add</button>
        </div>
      </div>
    </article>
  `).join("");

  target.querySelectorAll("[data-add]").forEach((button) => {
    button.addEventListener("click", () => {
      addToCart(button.dataset.add);
      button.textContent = "Added";
      setTimeout(() => {
        button.textContent = "Add";
      }, 900);
    });
  });

  attachTiltEffects();
}

function initCatalogPage() {
  const grid = document.getElementById("catalogGrid");
  if (!grid) return;

  const params = new URLSearchParams(window.location.search);
  let activeFilter = params.get("filter") || "all";
  const searchInput = document.getElementById("catalogSearch");

  renderCatalog("catalogGrid", activeFilter, searchInput ? searchInput.value : "");

  document.querySelectorAll("[data-filter]").forEach((button) => {
    if (button.dataset.filter === activeFilter) {
      document.querySelectorAll("[data-filter]").forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
    }
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      document.querySelectorAll("[data-filter]").forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      renderCatalog("catalogGrid", activeFilter, searchInput ? searchInput.value : "");
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      renderCatalog("catalogGrid", activeFilter, searchInput.value);
    });
  }
}

function initProductPage() {
  const imageFrame = document.getElementById("productImageFrame");
  if (!imageFrame) return;

  const params = new URLSearchParams(window.location.search);
  const planet = getPlanet(params.get("id")) || PLANETS[0];

  document.getElementById("productTier").textContent = planet.tier;
  document.getElementById("productName").textContent = `${planet.name} · ${formatPrice(planet.price, planet.unit)}`;
  document.getElementById("productDescription").textContent = planet.description;
  imageFrame.innerHTML = planet.image
    ? `<img src="${planet.image}" alt="${planet.name}">`
    : `<div class="planet-gradient-uranus"></div>`;

  const meta = document.getElementById("productMeta");
  meta.innerHTML = `
    <div class="meta-box"><strong>World Type</strong><span>${planet.type}</span></div>
    <div class="meta-box"><strong>Distance</strong><span>${planet.distance}</span></div>
    <div class="meta-box"><strong>Climate</strong><span>${planet.climate}</span></div>
    <div class="meta-box"><strong>Rarity</strong><span>${planet.rarity}</span></div>
    <div class="meta-box"><strong>Store Vibe</strong><span>${planet.vibe}</span></div>
    <div class="meta-box"><strong>Tags</strong><span>${planet.tags.join(", ")}</span></div>
  `;

  document.getElementById("productAddBtn").addEventListener("click", () => {
    addToCart(planet.id);
  });

  const related = PLANETS.filter((item) => item.id !== planet.id).slice(0, 3);
  const relatedGrid = document.getElementById("relatedGrid");
  relatedGrid.innerHTML = related.map((item) => `
    <article class="planet-card tilt-card">
      <span class="planet-badge">${item.tier}</span>
      ${createPlanetVisual(item)}
      <h3 class="planet-name">${item.name}</h3>
      <p class="planet-copy">${item.summary}</p>
      <div class="planet-footer">
        <div class="price-wrap">
          <strong>${formatPrice(item.price, item.unit)}</strong>
          <span>${item.vibe}</span>
        </div>
        <div class="card-actions">
          <a class="card-btn" href="product.html?id=${item.id}">View</a>
        </div>
      </div>
    </article>
  `).join("");

  attachTiltEffects();
}

function initCartPage() {
  const cartList = document.getElementById("cartPageList");
  if (!cartList) return;

  function render() {
    const cart = getCart();
    if (!cart.length) {
      cartList.innerHTML = `<div class="empty-state">Your interplanetary cart is empty. Add planets from the catalog to continue.</div>`;
      document.getElementById("cartSubtotal").textContent = "$0.0B";
      document.getElementById("cartInsurance").textContent = "$0.0B";
      document.getElementById("cartTotal").textContent = "$0.0B";
      return;
    }

    let subtotal = 0;
    cartList.innerHTML = cart.map((entry) => {
      const planet = getPlanet(entry.id);
      subtotal += planet.price * entry.quantity;
      return `
        <div class="cart-item">
          <div class="cart-orb">
            ${planet.image ? `<img src="${planet.image}" alt="${planet.name}">` : `<div class="planet-gradient-uranus"></div>`}
          </div>
          <div>
            <strong>${planet.name}</strong>
            <span>${formatPrice(planet.price, planet.unit)} each</span>
          </div>
          <div class="card-actions">
            <button class="card-btn" data-delta="-1" data-id="${planet.id}">-</button>
            <span>${entry.quantity}</span>
            <button class="card-btn" data-delta="1" data-id="${planet.id}">+</button>
          </div>
        </div>
      `;
    }).join("");

    const insurance = subtotal * 0.08;
    const total = subtotal + insurance;
    document.getElementById("cartSubtotal").textContent = `$${subtotal.toFixed(1)}B`;
    document.getElementById("cartInsurance").textContent = `$${insurance.toFixed(1)}B`;
    document.getElementById("cartTotal").textContent = `$${total.toFixed(1)}B`;

    cartList.querySelectorAll("[data-id]").forEach((button) => {
      button.addEventListener("click", () => {
        changeCartQuantity(button.dataset.id, Number(button.dataset.delta));
        render();
      });
    });
  }

  render();

  document.getElementById("clearCartBtn").addEventListener("click", () => {
    clearCart();
    render();
  });

  document.getElementById("checkoutBtn").addEventListener("click", () => {
    const cart = getCart();
    if (!cart.length) {
      alert("Your cart is empty. Add a planet first.");
      return;
    }
    alert("Checkout complete. Your fictional cosmic order has been placed.");
  });
}

function attachTiltEffects() {
  document.querySelectorAll(".tilt-card").forEach((card) => {
    card.onmousemove = (event) => {
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      const rotateY = (px - 0.5) * 10;
      const rotateX = (0.5 - py) * 10;
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };
    card.onmouseleave = () => {
      card.style.transform = "";
    };
  });
}

function init() {
  updateNavCartCount();

  const page = document.body.dataset.page;
  if (page === "catalog") initCatalogPage();
  if (page === "product") initProductPage();
  if (page === "cart") initCartPage();

  attachTiltEffects();
}

init();
