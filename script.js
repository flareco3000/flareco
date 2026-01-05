/* =====================
   LOADER
===================== */
function showLoader() {
  const loader = document.getElementById("loadingScreen");
  if (!loader) return;
  loader.style.display = "flex";
  requestAnimationFrame(() => loader.style.opacity = "1");
}

function hideLoader() {
  const loader = document.getElementById("loadingScreen");
  if (!loader) return;
  loader.style.opacity = "0";
  setTimeout(() => loader.style.display = "none", 400);
}

/* =====================
   PAGE NAVIGATION
===================== */
function showPage(id) {
  showLoader();

  requestAnimationFrame(() => {
    document.querySelectorAll(".page").forEach(p =>
      p.classList.add("hidden")
    );

    const page = document.getElementById(id);
    if (page) page.classList.remove("hidden");

    setTimeout(hideLoader, 200);
  });
}

/* =====================
   PRODUCT DATA
===================== */
const images = {
  BLACK: "images/BLACK.jpg",
  WHITE: "images/WHITE.jpg"
};

let currentColor = "BLACK";
let currentSize = "MEDIUM";

/* =====================
   COLOR & SIZE
===================== */
function setColor(color) {
  currentColor = color;
  const img = document.getElementById("productImg");
  if (img) img.src = images[color];
}

function setSize(size) {
  currentSize = size;
}

/* =====================
   IMAGE SLIDER
===================== */
const imgKeys = Object.keys(images);
let imgIndex = 0;

function nextImg() {
  imgIndex = (imgIndex + 1) % imgKeys.length;
  setColor(imgKeys[imgIndex]);
}

function prevImg() {
  imgIndex = (imgIndex - 1 + imgKeys.length) % imgKeys.length;
  setColor(imgKeys[imgIndex]);
}

/* =====================
   CART SYSTEM
===================== */
let cart = [];
const pricePerItem = 550;

function addToCart() {
  showLoader();

  setTimeout(() => {
    cart.push({
      name: "NOIRCORE",
      price: pricePerItem,
      color: currentColor,
      size: currentSize,
      image: images[currentColor]
    });

    updateCartUI();
    hideLoader();
  }, 300);
}

function updateCartUI() {
  const cartItems = document.getElementById("cartItems");
  const cartCountEl = document.getElementById("cartCount");
  const cartTotalEl = document.getElementById("cartTotal");

  if (!cartItems) return;

  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    total += item.price;
    cartItems.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}">
        <div>
          <strong>${item.name}</strong><br>
          Color: ${item.color}<br>
          Size: ${item.size}<br>
          ₱${item.price}
        </div>
      </div>
    `;
  });

  if (cartCountEl) cartCountEl.textContent = cart.length;
  if (cartTotalEl) cartTotalEl.textContent = total;
}

function clearCart() {
  cart = [];
  updateCartUI();
}

/* =====================
   PAYMENT METHOD
===================== */
const paymentSelect = document.getElementById("paymentMethod");
const paymentDetails = document.getElementById("paymentDetails");

if (paymentSelect) {
  paymentSelect.addEventListener("change", () => {
    if (paymentSelect.value === "GCASH") {
      paymentDetails.innerHTML = `
        <p><strong>GCASH</strong><br>
        MARK LORENCE G.<br>
        09924578217</p>
      `;
    } else if (paymentSelect.value === "COD") {
      paymentDetails.innerHTML = `
        <p class="caution">
          <strong>COD:</strong> Please double-check your cart and shipping info.
        </p>
      `;
    } else {
      paymentDetails.innerHTML = "";
    }
  });
}

/* =====================
   PLACE ORDER
===================== */
function placeOrder() {
  showLoader();

  setTimeout(() => {
    const requiredFields = document.querySelectorAll(".required");
    const errorMsg = document.getElementById("formError");
    let valid = true;

    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        field.classList.add("error");
        valid = false;
      } else {
        field.classList.remove("error");
      }
    });

    if (cart.length === 0) {
      hideLoader();
      alert("Your cart is empty!");
      return;
    }

    if (!valid) {
      hideLoader();
      if (errorMsg) errorMsg.classList.remove("hidden");
      return;
    }

    if (errorMsg) errorMsg.classList.add("hidden");

    alert("✅ Order placed successfully!");
    clearCart();
    showPage("home");
  }, 500);
}

/* =====================
   BACKGROUND MUSIC
===================== */
const bgMusic = document.getElementById("bgMusic");
const musicIcon = document.getElementById("musicIcon");

let musicEnabled = false;

document.addEventListener("click", () => {
  if (bgMusic) bgMusic.volume = 0.4;
}, { once: true });

function toggleMusic() {
  if (!bgMusic) return;

  if (bgMusic.paused) {
    bgMusic.play().catch(() => {});
    musicIcon.src = "images/speaker-on.png";
    musicEnabled = true;
  } else {
    bgMusic.pause();
    musicIcon.src = "images/speaker-off.png";
    musicEnabled = false;
  }

  localStorage.setItem("musicEnabled", musicEnabled);
}

window.addEventListener("load", () => {
  const saved = localStorage.getItem("musicEnabled");
  if (saved === "true" && bgMusic) {
    bgMusic.volume = 0.4;
    bgMusic.play().catch(() => {});
    musicIcon.src = "images/speaker-on.png";
  }
});
