const planets = [
    { id: 'mercury', name: 'Mercury', type: 'Rocky', price: 1500000, img: 'mercury.png', desc: 'Mercury is the smallest planet in our solar system, closest to the Sun, and the fastest.' },
    { id: 'venus', name: 'Venus', type: 'Rocky', price: 2000000, img: 'venus.jpg', desc: 'Venus is Earth\'s twin in size but has a thick, toxic atmosphere and extreme temperatures.' },
    { id: 'earth', name: 'Earth', type: 'Rocky', price: 9500000, img: 'earth.jpeg?v=20260515-images', desc: 'Our home planet, the only known place with life, abundant water, and a breathable atmosphere.' },
    { id: 'mars', name: 'Mars', type: 'Rocky', price: 3200000, img: 'mars.jpg?v=20260515-images', desc: 'The Red Planet, known for its rusty surface, giant volcanoes, and deep canyons.' },
    { id: 'jupiter', name: 'Jupiter', type: 'Gas Giant', price: 12000000, img: 'juipter.jpeg?v=20260515-images', desc: 'The largest planet in our solar system, a gas giant with a Great Red Spot and dozens of moons.' },
    { id: 'saturn', name: 'Saturn', type: 'Gas Giant', price: 10500000, img: 'saturn.jpg', desc: 'Famous for its stunning ring system, Saturn is a massive gas giant with unique weather patterns.' },
    { id: 'uranus', name: 'Uranus', type: 'Ice Giant', price: 6000000, img: 'mercu.png', desc: 'An ice giant that rotates on its side, featuring a pale blue color and faint rings.' },
    { id: 'neptune', name: 'Neptune', type: 'Ice Giant', price: 7500000, img: 'neptune.jpeg?v=20260515-images', desc: 'The farthest known planet from the Sun, a cold, dark, and windy ice giant.' }
];

const USER_STORAGE_KEY = 'planetShopUser';
const USERS_STORAGE_KEY = 'planetShopUsers';
const CART_STORAGE_KEY = 'planetCart';
const LAST_ORDER_STORAGE_KEY = 'planetLastOrder';

let cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];

function getStoredUsers() {
    return JSON.parse(localStorage.getItem(USERS_STORAGE_KEY)) || [];
}

function saveStoredUsers(users) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem(USER_STORAGE_KEY));
}

function setCurrentUser(user) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

function clearCurrentUser() {
    localStorage.removeItem(USER_STORAGE_KEY);
}

function getUserInitials(name = '') {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    return (parts[0]?.[0] || 'P') + (parts[1]?.[0] || '');
}

function getCartItems() {
    return cart.map(id => planets.find(planet => planet.id === id)).filter(Boolean);
}

function saveCart() {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const countEl = document.getElementById('cart-count');
    if (countEl) countEl.textContent = cart.length;
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
        if (!href || link.classList.contains('signup') || link.classList.contains('logout-btn')) return;

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

    const sections = ['home', 'offers', 'about'].map(id => document.getElementById(id)).filter(Boolean);
    const linkMap = {
        home: document.querySelector('nav a[href="index.html"]'),
        offers: document.querySelector('nav a[href="#offers"]'),
        about: document.querySelector('nav a[href="#about"]')
    };

    const observer = new IntersectionObserver(entries => {
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

function updateAuthUI() {
    const user = getCurrentUser();
    const authLink = document.querySelector('.auth-trigger');
    const authCta = document.querySelector('.auth-cta');

    if (authCta) {
        if (user) {
            authCta.textContent = 'VIEW CATALOG';
            authCta.setAttribute('href', 'catalog.html');
        } else {
            authCta.textContent = 'JOIN NOW';
            authCta.setAttribute('href', 'signup.html');
        }
    }

    if (!authLink) return;

    const authItem = authLink.closest('li');
    if (!authItem) return;

    if (!user) {
        authItem.innerHTML = '<a href="signup.html" class="signup auth-trigger">SIGN UP</a>';
        return;
    }

    authItem.innerHTML = `
        <div class="auth-chip">
            <span class="auth-avatar">${getUserInitials(user.name)}</span>
            <span class="auth-meta">
                <span class="auth-label">Signed in</span>
                <span class="auth-name">${user.name}</span>
            </span>
            <button type="button" class="logout-btn" id="logout-btn">LOGOUT</button>
        </div>
    `;

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            clearCurrentUser();
            window.location.href = 'index.html';
        });
    }
}

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

function renderProduct() {
    const container = document.getElementById('product-detail-container');
    if (!container) return;

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const planet = planets.find(p => p.id === id);

    if (!planet) {
        container.innerHTML = '<h2>Planet not found</h2><a href="catalog.html" class="btn">Back to Catalog</a>';
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
        if (checkoutStatus && !checkoutStatus.textContent.trim()) checkoutStatus.classList.remove('is-visible');
        return;
    }

    if (checkoutBtn) checkoutBtn.disabled = false;

    container.innerHTML = '';
    let subtotal = 0;

    cart.forEach(id => {
        const planet = planets.find(p => p.id === id);
        if (!planet) return;

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

    const currentUser = getCurrentUser();
    if (currentUser?.email) checkoutEmail.value = currentUser.email;

    checkoutForm.addEventListener('submit', async event => {
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
        const current = getCurrentUser();
        const orderRecord = {
            orderId,
            email,
            customerName: current?.name || 'Guest Explorer',
            items: items.map(item => ({ id: item.id, name: item.name, price: item.price })),
            subtotal: totals.subtotal,
            tax: totals.tax,
            total: totals.total,
            placedAt: new Date().toISOString()
        };

        localStorage.setItem(LAST_ORDER_STORAGE_KEY, JSON.stringify(orderRecord));
        cart = [];
        saveCart();
        renderCart();
        checkoutForm.reset();
        if (current?.email) checkoutEmail.value = current.email;

        checkoutStatus.innerHTML = `
            <strong>Transaction complete.</strong><br>
            Order <strong>${orderId}</strong> has been placed for ${email}.<br>
            Buyer: ${orderRecord.customerName}.<br>
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

function setAuthMode(mode) {
    const authForm = document.getElementById('auth-form');
    const nameField = document.getElementById('name')?.closest('.form-group');
    const submitBtn = document.getElementById('auth-submit-btn');
    const tabs = document.querySelectorAll('.auth-tab');
    const pageTitle = document.querySelector('.page-title');
    const desc = document.querySelector('.auth-page-desc');
    const nameInput = document.getElementById('name');

    if (!authForm || !submitBtn || !pageTitle || !desc || !nameField || !nameInput) return;

    authForm.dataset.mode = mode;
    tabs.forEach(tab => tab.classList.toggle('active', tab.dataset.authMode === mode));

    if (mode === 'login') {
        pageTitle.textContent = 'WELCOME BACK';
        desc.textContent = 'Log in to continue shopping, review your cart, and manage your orbit.';
        submitBtn.textContent = 'LOG IN';
        nameField.style.display = 'none';
        nameInput.required = false;
    } else {
        pageTitle.textContent = 'JOIN THE GALAXY';
        desc.textContent = 'Create an account or log in to manage your cosmic collection.';
        submitBtn.textContent = 'SIGN UP NOW';
        nameField.style.display = 'block';
        nameInput.required = true;
    }
}

function setupAuthForm() {
    const authForm = document.getElementById('auth-form');
    const authStatus = document.getElementById('auth-status');
    const authTabs = document.querySelectorAll('.auth-tab');
    if (!authForm || !authStatus) return;

    const existingUser = getCurrentUser();
    if (existingUser) {
        authStatus.textContent = `You are already signed in as ${existingUser.name}. You can continue browsing or log out from the header.`;
        authStatus.classList.add('is-visible');
    }

    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            authStatus.classList.remove('is-visible');
            authStatus.textContent = '';
            setAuthMode(tab.dataset.authMode);
        });
    });

    authForm.addEventListener('submit', event => {
        event.preventDefault();

        const mode = authForm.dataset.mode || 'signup';
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');

        const name = nameInput.value.trim();
        const email = emailInput.value.trim().toLowerCase();
        const password = passwordInput.value;
        const users = getStoredUsers();

        if (mode === 'signup') {
            if (users.some(user => user.email === email)) {
                authStatus.textContent = 'An account with that email already exists. Use Log In instead.';
                authStatus.classList.add('is-visible');
                return;
            }

            const user = { name, email, password };
            users.push(user);
            saveStoredUsers(users);
            setCurrentUser({ name, email });
            authStatus.textContent = `Account created for ${name}. Redirecting you to the home page.`;
            authStatus.classList.add('is-visible');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 900);
            return;
        }

        const matchedUser = users.find(user => user.email === email && user.password === password);
        if (!matchedUser) {
            authStatus.textContent = 'Login failed. Check your email and password.';
            authStatus.classList.add('is-visible');
            return;
        }

        setCurrentUser({ name: matchedUser.name, email: matchedUser.email });
        authStatus.textContent = `Welcome back, ${matchedUser.name}. Redirecting you now.`;
        authStatus.classList.add('is-visible');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 900);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    updateAuthUI();
    setActiveNavLink();
    setupSectionNav();
    setupCheckout();
    setupAuthForm();

    const filterBtns = document.querySelectorAll('.filter-btn');
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', event => {
                filterBtns.forEach(button => button.classList.remove('active'));
                event.target.classList.add('active');
                renderCatalog(event.target.dataset.filter);
            });
        });
        renderCatalog();
    }

    if (document.getElementById('product-detail-container')) renderProduct();
    if (document.getElementById('cart-items-container')) renderCart();
});
