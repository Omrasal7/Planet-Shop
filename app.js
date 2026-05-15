const planets = [
    { id: 'mercury', name: 'Mercury', type: 'Rocky', price: 1500000, img: 'mercury.png', desc: 'Mercury is the smallest planet in our solar system, closest to the Sun, and the fastest.' },
    { id: 'venus', name: 'Venus', type: 'Rocky', price: 2000000, img: 'venus.jpg', desc: 'Venus is Earth\'s twin in size but has a thick, toxic atmosphere and extreme temperatures.' },
    { id: 'earth', name: 'Earth', type: 'Rocky', price: 9500000, img: 'earth.jpg', desc: 'Our home planet, the only known place with life, abundant water, and a breathable atmosphere.' },
    { id: 'mars', name: 'Mars', type: 'Rocky', price: 3200000, img: 'mars.jpg', desc: 'The Red Planet, known for its rusty surface, giant volcanoes, and deep canyons.' },
    { id: 'jupiter', name: 'Jupiter', type: 'Gas Giant', price: 12000000, img: 'juipter.jpg', desc: 'The largest planet in our solar system, a gas giant with a Great Red Spot and dozens of moons.' },
    { id: 'saturn', name: 'Saturn', type: 'Gas Giant', price: 10500000, img: 'saturn.jpg', desc: 'Famous for its stunning ring system, Saturn is a massive gas giant with unique weather patterns.' },
    { id: 'uranus', name: 'Ice Giant', type: 'Ice Giant', price: 6000000, img: 'mercu.png', desc: 'An ice giant that rotates on its side, featuring a pale blue color and faint rings.' },
    { id: 'neptune', name: 'Neptune', type: 'Ice Giant', price: 7500000, img: 'neptune.jpg', desc: 'The farthest known planet from the Sun, a cold, dark, and windy ice giant.' }
];

// Cart State
let cart = JSON.parse(localStorage.getItem('planetCart')) || [];

function getCartItems() {
    return cart
        .map(id => planets.find(planet => planet.id === id))
        .filter(Boolean);
}

function saveCart() {
    localStorage.setItem('planetCart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const countEl = document.getElementById('cart-count');
    if (countEl) {
        countEl.textContent = cart.length;
    }
}

function formatPrice(num) {
    return '$' + num.toLocaleString();
}

function calculateCartTotals() {
    const subtotal = getCartItems().reduce((sum, planet) => sum + planet.price, 0);
    const tax = subtotal * 0.05;
    const total = subtotal + tax;

    return { subtotal, tax, total };
}

function addToCart(id) {
    if (!cart.includes(id)) {
        cart.push(id);
        saveCart();
        alert('Added to cart!');
    } else {
        alert('Already in cart!');
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item !== id);
    saveCart();
    renderCart();
}

function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const currentHash = window.location.hash;
    const navLinks = document.querySelectorAll('nav a');
    const pageAliases = {
        'product.html': 'catalog.html'
    };
    const normalizedPage = pageAliases[currentPage] || currentPage;

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href || link.classList.contains('signup')) return;

        link.classList.remove('active');

        if (currentPage === 'index.html' || currentPage === '') {
            if ((href === 'index.html' && !currentHash) || href === currentHash) {
                link.classList.add('active');
            }
        } else if (href === normalizedPage) {
            link.classList.add('active');
        }
    });
}

function setupSectionNav() {
    if (!document.getElementById('offers') || !document.getElementById('about')) return;

    const sections = ['home', 'offers', 'about']
        .map(id => document.getElementById(id))
        .filter(Boolean);

    const linkMap = {
        home: document.querySelector('nav a[href="index.html"]'),
        offers: document.querySelector('nav a[href="#offers"]'),
        about: document.querySelector('nav a[href="#about"]')
    };

    const observer = new IntersectionObserver((entries) => {
        const visible = entries
            .filter(entry => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;

        Object.values(linkMap).forEach(link => link && link.classList.remove('active'));
        const activeLink = linkMap[visible.target.id];
        if (activeLink) activeLink.classList.add('active');
    }, {
        rootMargin: '-35% 0px -45% 0px',
        threshold: [0.2, 0.5, 0.8]
    });

    sections.forEach(section => observer.observe(section));
}

// Catalog Page Logic
function renderCatalog(filterType = 'all') {
    const grid = document.getElementById('catalog-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    const filtered = filterType === 'all' 
        ? planets 
        : planets.filter(p => p.type.toLowerCase() === filterType.toLowerCase());

    filtered.forEach(planet => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${planet.img}" alt="${planet.name}" class="product-img">
            <h3>${planet.name}</h3>
            <p>${planet.type}</p>
            <span class="price">${formatPrice(planet.price)}</span>
            <a href="product.html?id=${planet.id}" class="btn" style="padding: 10px 20px; font-size: 14px;">VIEW DETAILS</a>
        `;
        grid.appendChild(card);
    });
}

// Product Page Logic
function renderProduct() {
    const container = document.getElementById('product-detail-container');
    if (!container) return;

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const planet = planets.find(p => p.id === id);

    if (!planet) {
        container.innerHTML = `<h2>Planet not found</h2><a href="catalog.html" class="btn">Back to Catalog</a>`;
        return;
    }

    container.innerHTML = `
        <div class="product-detail-img">
            <img src="${planet.img}" alt="${planet.name}">
        </div>
        <div class="product-detail-info">
            <h2>${planet.name.toUpperCase()}</h2>
            <span class="type">${planet.type}</span>
            <p>${planet.desc}</p>
            <span class="price">${formatPrice(planet.price)}</span>
            <button class="btn" onclick="addToCart('${planet.id}')">ADD TO CART</button>
        </div>
    `;
}

// Cart Page Logic
function renderCart() {
    const container = document.getElementById('cart-items-container');
    if (!container) return;
    const checkoutBtn = document.getElementById('checkout-btn');
    const checkoutStatus = document.getElementById('checkout-status');

    if (cart.length === 0) {
        container.innerHTML = '<p>Your cart is empty.</p><a href="catalog.html" class="btn" style="margin-top:20px;">BROWSE PLANETS</a>';
        document.getElementById('cart-subtotal').textContent = '$0';
        document.getElementById('cart-tax').textContent = '$0';
        document.getElementById('cart-total').textContent = '$0';
        if (checkoutBtn) checkoutBtn.disabled = true;
        if (checkoutStatus && !checkoutStatus.textContent.trim()) {
            checkoutStatus.classList.remove('is-visible');
        }
        return;
    }

    if (checkoutBtn) checkoutBtn.disabled = false;

    container.innerHTML = '';
    let subtotal = 0;

    cart.forEach(id => {
        const planet = planets.find(p => p.id === id);
        if (planet) {
            subtotal += planet.price;
            const item = document.createElement('div');
            item.className = 'cart-item';
            item.innerHTML = `
                <div class="cart-item-info">
                    <img src="${planet.img}" alt="${planet.name}">
                    <div>
                        <h4>${planet.name}</h4>
                        <span style="opacity:0.7; font-size:14px;">${planet.type}</span>
                    </div>
                </div>
                <div style="display:flex; align-items:center; gap:30px;">
                    <span style="font-weight:bold;">${formatPrice(planet.price)}</span>
                    <button class="remove-btn" onclick="removeFromCart('${planet.id}')">Remove</button>
                </div>
            `;
            container.appendChild(item);
        }
    });

    const tax = subtotal * 0.05;
    const total = subtotal + tax;

    document.getElementById('cart-subtotal').textContent = formatPrice(subtotal);
    document.getElementById('cart-tax').textContent = formatPrice(tax);
    document.getElementById('cart-total').textContent = formatPrice(total);
}

function setupCheckout() {
    const checkoutForm = document.getElementById('checkout-form');
    const checkoutEmail = document.getElementById('checkout-email');
    const checkoutStatus = document.getElementById('checkout-status');
    if (!checkoutForm || !checkoutEmail || !checkoutStatus) return;

    checkoutForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (cart.length === 0) {
            alert('Your cart is empty. Add a planet before checkout.');
            return;
        }

        const email = checkoutEmail.value.trim();
        if (!email) {
            checkoutEmail.focus();
            return;
        }

        const items = getCartItems();
        const totals = calculateCartTotals();
        const orderId = `PS-${Date.now().toString().slice(-8)}`;
        const orderRecord = {
            orderId,
            email,
            items: items.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price
            })),
            subtotal: totals.subtotal,
            tax: totals.tax,
            total: totals.total,
            placedAt: new Date().toISOString()
        };

        localStorage.setItem('planetLastOrder', JSON.stringify(orderRecord));
        cart = [];
        saveCart();
        renderCart();

        checkoutForm.reset();
        checkoutStatus.innerHTML = `
            <strong>Transaction complete.</strong><br>
            Order <strong>${orderId}</strong> has been placed for ${email}.<br>
            Items: ${items.map(item => item.name).join(', ')}.<br>
            Total charged: ${formatPrice(totals.total)}.
        `;
        checkoutStatus.classList.add('is-visible');

        if ('Notification' in window) {
            if (Notification.permission === 'granted') {
                new Notification('Planet Shop Order Confirmed', {
                    body: `${orderId} confirmed for ${email}. Total ${formatPrice(totals.total)}.`
                });
            } else if (Notification.permission === 'default') {
                try {
                    const permission = await Notification.requestPermission();
                    if (permission === 'granted') {
                        new Notification('Planet Shop Order Confirmed', {
                            body: `${orderId} confirmed for ${email}. Total ${formatPrice(totals.total)}.`
                        });
                    }
                } catch (error) {
                    console.error('Notification permission request failed.', error);
                }
            }
        }
    });
}

function setupSignupForm() {
    const form = document.querySelector('.signup-container form');
    if (!form) return;

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = document.getElementById('name');

        alert(`Sign up successful! Welcome to Planet Shop, ${name.value.trim() || 'Explorer'}.`);
        window.location.href = 'index.html#offers';
    });
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    setActiveNavLink();
    setupSectionNav();
    setupCheckout();
    setupSignupForm();

    // Init Catalog Filters
    const filterBtns = document.querySelectorAll('.filter-btn');
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                renderCatalog(e.target.dataset.filter);
            });
        });
        renderCatalog();
    }

    // Init Product Detail
    if (document.getElementById('product-detail-container')) {
        renderProduct();
    }

    // Init Cart
    if (document.getElementById('cart-items-container')) {
        renderCart();
    }
});
