
const products = [
    {
        name: "Signature Sneakers",
        category: "Fashion",
        price: "$89.00",
        description: "Everyday comfort with a premium finish.",
        icon: "👟"
    },
    {
        name: "Wireless Headphones",
        category: "Electronics",
        price: "$129.00",
        description: "Immersive sound for your everyday life.",
        icon: "🎧"
    },
    {
        name: "Classic Wristwatch",
        category: "Accessories",
        price: "$159.00",
        description: "Timeless design, modern elegance.",
        icon: "⌚"
    },
    {
        name: "Luxury Handbag",
        category: "Fashion",
        price: "$115.00",
        description: "A refined touch for every occasion.",
        icon: "👜"
    },
    {
        name: "Smart Speaker",
        category: "Electronics",
        price: "$79.00",
        description: "Bring your favorite audio to life.",
        icon: "🔊"
    },
    {
        name: "Premium Sunglasses",
        category: "Accessories",
        price: "$65.00",
        description: "A classic finishing touch.",
        icon: "🕶️"
    }
];

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const categoryButtons = document.querySelectorAll(".category");
const loginModal = document.getElementById("loginModal");
const loginForm = document.getElementById("loginForm");
const welcomeMessage = document.getElementById("welcomeMessage");
const welcomeSubtext = document.getElementById("welcomeSubtext");
const toast = document.getElementById("toast");

let selectedCategory = "All";

function renderProducts() {
    const query = searchInput.value.trim().toLowerCase();

    const filteredProducts = products.filter(product => {
        const matchesCategory =
            selectedCategory === "All" ||
            product.category === selectedCategory;

        const matchesSearch =
            product.name.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query);

        return matchesCategory && matchesSearch;
    });

    if (filteredProducts.length === 0) {
        productGrid.innerHTML =
            '<p>No products found. Try another search.</p>';
        return;
    }

    productGrid.replaceChildren();

    filteredProducts.forEach(product => {
        const card = document.createElement("article");
        card.className = "product-card";

        const visual = document.createElement("div");
        visual.className = "product-visual";
        visual.textContent = product.icon;
        visual.setAttribute("aria-hidden", "true");

        const info = document.createElement("div");
        info.className = "product-info";

        const category = document.createElement("span");
        category.className = "product-category";
        category.textContent = product.category;

        const name = document.createElement("h3");
        name.textContent = product.name;

        const description = document.createElement("p");
        description.textContent = product.description;

        const bottom = document.createElement("div");
        bottom.className = "product-bottom";

        const price = document.createElement("span");
        price.className = "product-price";
        price.textContent = product.price;

        const addButton = document.createElement("button");
        addButton.className = "add-btn";
        addButton.textContent = "Add to bag";
        addButton.addEventListener("click", () => {
            showToast(`${product.name} selected!`);
        });

        bottom.append(price, addButton);
        info.append(category, name, description, bottom);
        card.append(visual, info);
        productGrid.append(card);
    });
}

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    // Automatically hide the notification after a short delay.
    clearTimeout(showToast.timeout);
    showToast.timeout = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

function openLogin() {
    loginModal.classList.add("show");
    loginModal.setAttribute("aria-hidden", "false");
    document.getElementById("customerName").focus();
}

function closeLogin() {
    loginModal.classList.remove("show");
    loginModal.setAttribute("aria-hidden", "true");
}

document.getElementById("openLogin").addEventListener("click", openLogin);
document.getElementById("closeLogin").addEventListener("click", closeLogin);

loginModal.addEventListener("click", event => {
    if (event.target === loginModal) {
        closeLogin();
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeLogin();
    }
});

loginForm.addEventListener("submit", event => {
    event.preventDefault();

    const name = document.getElementById("customerName")
        .value.trim();

    const email = document.getElementById("customerEmail")
        .value.trim();

    const password = document.getElementById("customerPassword")
        .value;

    if (!name || !email || password.length < 6) {
        showToast("Please complete all fields correctly.");
        return;
    }

    welcomeMessage.textContent = `Welcome to LUXE MALL, ${name}!`;
    welcomeSubtext.textContent =
        "We're glad you're here. Discover something exceptional today.";

    document.getElementById("openLogin").textContent = "Welcome, " + name;

    closeLogin();
    loginForm.reset();
    showToast(`Welcome, ${name}!`);
    document.querySelector(".welcome-section")
        .scrollIntoView({ behavior: "smooth" });
});

searchInput.addEventListener("input", renderProducts);

categoryButtons.forEach(button => {
    button.addEventListener("click", () => {
        selectedCategory = button.dataset.category;

        categoryButtons.forEach(item => {
            item.classList.toggle("active", item === button);
        });

        renderProducts();
    });
});

document.getElementById("year").textContent =
    new Date().getFullYear();

renderProducts();


const cart = new Map();

const cartModal = document.getElementById("cartModal");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartSubtotal = document.getElementById("cartSubtotal");

function updateCart() {
    cartItems.replaceChildren();

    let count = 0;
    let subtotal = 0;

    cart.forEach((item, name) => {
        count += item.quantity;
        subtotal += item.price * item.quantity;

        const row = document.createElement("div");
        row.className = "cart-item";

        const details = document.createElement("div");
        const title = document.createElement("h3");
        title.textContent = name;

        const price = document.createElement("p");
        price.textContent =
            `$${(item.price * item.quantity).toFixed(2)}`;

        const controls = document.createElement("div");
        controls.className = "cart-controls";

        const minus = document.createElement("button");
        minus.textContent = "−";
        minus.setAttribute("aria-label", `Remove one ${name}`);
        minus.onclick = () => changeQuantity(name, -1);

        const quantity = document.createElement("span");
        quantity.textContent = item.quantity;

        const plus = document.createElement("button");
        plus.textContent = "+";
        plus.setAttribute("aria-label", `Add one ${name}`);
        plus.onclick = () => changeQuantity(name, 1);

        controls.append(minus, quantity, plus);
        details.append(title, price, controls);

        const remove = document.createElement("button");
        remove.className = "remove-item";
        remove.textContent = "Remove";
        remove.onclick = () => {
            cart.delete(name);
            updateCart();
        };

        row.append(details, remove);
        cartItems.append(row);
    });

    if (count === 0) {
        const empty = document.createElement("p");
        empty.className = "cart-empty";
        empty.textContent = "Your shopping bag is empty.";
        cartItems.append(empty);
    }

    cartCount.textContent = count;
    cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
}

function changeQuantity(name, amount) {
    const item = cart.get(name);
    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart.delete(name);
    }

    updateCart();
}

// Replace the existing demo Add to bag behavior.
function addToCart(product) {
    const existing = cart.get(product.name);

    if (existing) {
        existing.quantity++;
    } else {
        cart.set(product.name, {
            price: Number(product.price.replace("$", "")),
            quantity: 1
        });
    }

    updateCart();
    showToast(`${product.name} added to your bag.`);
}

document.getElementById("openCart").addEventListener("click", () => {
    updateCart();
    cartModal.classList.add("show");
    cartModal.setAttribute("aria-hidden", "false");
});

document.getElementById("closeCart").addEventListener("click", () => {
    cartModal.classList.remove("show");
    cartModal.setAttribute("aria-hidden", "true");
});

cartModal.addEventListener("click", event => {
    if (event.target === cartModal) {
        cartModal.classList.remove("show");
        cartModal.setAttribute("aria-hidden", "true");
    }
});

document.getElementById("checkoutBtn").addEventListener("click", () => {
    if (cart.size === 0) {
        showToast("Your shopping bag is empty.");
        return;
    }

    showToast("Checkout will be available in a future update.");
});

// Reconnect each product's button to the real cart.
const originalRenderProducts = renderProducts;

renderProducts = function () {
    originalRenderProducts();

    document.querySelectorAll(".product-card").forEach((card, index) => {
        const productName = card.querySelector("h3")?.textContent;
        const product = products.find(item => item.name === productName);
        const button = card.querySelector(".add-btn");

        if (product && button) {
            button.onclick = () => addToCart(product);
        }
    });
};

renderProducts();
