
const CART_KEY = "styleZoneCart";
const WISHLIST_KEY = "styleZoneWishlist";

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  renderCart();
}

function addToCart(item) {
  const cart = getCart();
  const existing = cart.find((p) => p.name === item.name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  saveCart(cart);
  openCart();
}

function changeQty(name, delta) {
  const cart = getCart();
  const item = cart.find((p) => p.name === name);
  if (!item) return;
  item.qty += delta;
  const updated = item.qty <= 0 ? cart.filter((p) => p.name !== name) : cart;
  saveCart(updated);
}

function removeFromCart(name) {
  saveCart(getCart().filter((p) => p.name !== name));
}

function renderCart() {
  const cart = getCart();
  const list = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");
  const countEl = document.getElementById("cart-count");

  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  countEl.textContent = count;

  if (cart.length === 0) {
    list.innerHTML = '<p class="empty-cart-msg">Your cart is empty.</p>';
    totalEl.textContent = "";
    return;
  }

  list.innerHTML = cart
    .map(
      (item) => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <strong>${item.name}</strong>
        <p class="price">$${(item.price * item.qty).toFixed(2)}</p>
        <div class="cart-item-qty">
          <button data-action="dec" data-name="${item.name}">-</button>
          <span>${item.qty}</span>
          <button data-action="inc" data-name="${item.name}">+</button>
        </div>
        <button class="remove-item-btn" data-action="remove" data-name="${item.name}">Remove</button>
      </div>
    </div>`
    )
    .join("");

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  totalEl.textContent = `Total: $${total.toFixed(2)}`;
}

function openCart() {
  document.getElementById("cart-drawer").classList.add("open");
  document.getElementById("cart-overlay").classList.add("open");
}

function closeCart() {
  document.getElementById("cart-drawer").classList.remove("open");
  document.getElementById("cart-overlay").classList.remove("open");
}

// ===== Wishlist =====
function getWishlist() {
  return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
}

function toggleWishlist(name, btn) {
  let wishlist = getWishlist();
  if (wishlist.includes(name)) {
    wishlist = wishlist.filter((n) => n !== name);
    btn.classList.remove("active");
    btn.textContent = "♡";
  } else {
    wishlist.push(name);
    btn.classList.add("active");
    btn.textContent = "❤";
  }
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
}

function initWishlistButtons() {
  const wishlist = getWishlist();
  document.querySelectorAll(".wishlist-btn").forEach((btn) => {
    const name = btn.dataset.name;
    if (wishlist.includes(name)) {
      btn.classList.add("active");
      btn.textContent = "❤";
    }
    btn.addEventListener("click", () => toggleWishlist(name, btn));
  });
}

// ===== Search & Filter =====
function applyFilters() {
  const query = document.getElementById("search-input").value.trim().toLowerCase();
  const inStockOnly = document.getElementById("in-stock-filter").checked;

  document.querySelectorAll(".product").forEach((card) => {
    const name = card.dataset.name.toLowerCase();
    const inStock = card.dataset.instock === "true";
    const matchesSearch = name.includes(query);
    const matchesStock = !inStockOnly || inStock;
    card.classList.toggle("hidden", !(matchesSearch && matchesStock));
  });
}


function handleNewsletterSubmit(event) {
  event.preventDefault();
  const emailInput = document.getElementById("newsletter-email");
  const message = document.getElementById("newsletter-message");
  message.textContent = `Thanks for subscribing, ${emailInput.value}!`;
  emailInput.value = "";
}


document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  initWishlistButtons();

  document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      addToCart({
        name: btn.dataset.name,
        price: parseFloat(btn.dataset.price),
        image: btn.dataset.image,
      });
    });
  });

  document.getElementById("cart-toggle").addEventListener("click", openCart);
  document.getElementById("close-cart").addEventListener("click", closeCart);
  document.getElementById("cart-overlay").addEventListener("click", closeCart);

  document.getElementById("cart-items").addEventListener("click", (e) => {
    const action = e.target.dataset.action;
    const name = e.target.dataset.name;
    if (!action) return;
    if (action === "inc") changeQty(name, 1);
    if (action === "dec") changeQty(name, -1);
    if (action === "remove") removeFromCart(name);
  });

  document.getElementById("checkout-btn").addEventListener("click", () => {
    if (getCart().length === 0) return;
    alert("Thank you for your order! This is a demo checkout.");
    saveCart([]);
    closeCart();
  });

  document.getElementById("search-input").addEventListener("input", applyFilters);
  document.getElementById("in-stock-filter").addEventListener("change", applyFilters);

  document.getElementById("newsletter-form").addEventListener("submit", handleNewsletterSubmit);
});
