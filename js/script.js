// Toggle active class untuk Navbar Extra & Navigation
const navbarNav = document.querySelector(".navbar-nav");
const hamburger = document.querySelector("#hamburger-menu");
const shoppingCart = document.querySelector(".shopping-cart");
const shoppingCartBtn = document.querySelector("#shopping-cart");

// Ketika hamburger menu di klik
hamburger.onclick = (e) => {
  navbarNav.classList.toggle("active");
  shoppingCart.classList.remove("active");
  e.preventDefault();
};

// Ketika shopping cart di klik
shoppingCartBtn.onclick = (e) => {
  shoppingCart.classList.toggle("active");
  navbarNav.classList.remove("active");
  e.preventDefault();
};

// Klik di luar sidebar untuk menghilangkan nav & shopping cart
document.addEventListener("click", function (e) {
  if (!hamburger.contains(e.target) && !navbarNav.contains(e.target)) {
    navbarNav.classList.remove("active");
  }

  if (!shoppingCartBtn.contains(e.target) && !shoppingCart.contains(e.target)) {
    shoppingCart.classList.remove("active");
  }
});

// --- LOGIKA KERANJANG BELANJA ---
let cart = [];

function addToCart(name, price, image) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name, price, image, quantity: 1 });
  }

  updateCartUI();
  shoppingCart.classList.add("active"); // Otomatis buka keranjang saat produk ditambah
}

function changeQuantity(name, amount) {
  const item = cart.find((item) => item.name === name);
  if (item) {
    item.quantity += amount;
    if (item.quantity <= 0) {
      cart = cart.filter((i) => i.name !== name);
    }
  }
  updateCartUI();
}

function removeFromCart(name) {
  cart = cart.filter((item) => item.name !== name);
  updateCartUI();
}

function updateCartUI() {
  const container = document.getElementById("cart-items-container");
  const totalElement = document.getElementById("cart-total");

  if (cart.length === 0) {
    container.innerHTML = '<p class="empty-cart">Keranjang masih kosong</p>';
    totalElement.innerText = "IDR 0";
    return;
  }

  let html = "";
  let total = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    html += `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-detail">
          <h4>${item.name}</h4>
          <div class="cart-item-price">IDR ${item.price.toLocaleString("id-ID")}</div>
          <div class="cart-item-amount">
            <button onclick="changeQuantity('${item.name}', -1)">-</button>
            <span>${item.quantity}</span>
            <button onclick="changeQuantity('${item.name}', 1)">+</button>
          </div>
        </div>
        <button class="remove-item-btn" onclick="removeFromCart('${item.name}')">&times;</button>
      </div>
    `;
  });

  container.innerHTML = html;
  totalElement.innerText = `IDR ${total.toLocaleString("id-ID")}`;
}

// Checkout ke WhatsApp
document.getElementById("checkout-wa-btn").onclick = () => {
  if (cart.length === 0) {
    alert("Keranjang kamu masih kosong!");
    return;
  }

  // Nomor WhatsApp Kedai Kopi
  const phoneNumber = "6285814187067";

  let message = "Halo Admin Kualitatifcoffee, saya mau pesan:\n\n";
  let total = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    message += `${index + 1}. ${item.name} (${item.quantity}x) = IDR ${itemTotal.toLocaleString("id-ID")}\n`;
  });

  message += `\n*Total Pesanan: IDR ${total.toLocaleString("id-ID")}*`;

  // Encode URL & Buka WhatsApp
  const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  window.open(waUrl, "_blank");
};
