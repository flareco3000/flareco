/* =====================
   PAGE NAVIGATION
===================== */
function showPage(id) {
  showLoader();

  setTimeout(() => {
    document.querySelectorAll(".page").forEach(p =>
      p.classList.add("hidden")
    );
    document.getElementById(id).classList.remove("hidden");
    hideLoader();
  }, 600);
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
  document.getElementById("productImg").src = images[color];
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
  cart.push({
    name: "NOIRCORE",
    price: pricePerItem,
    color: currentColor,
    size: currentSize,
    image: images[currentColor]
  });

  updateCartUI();
}

function updateCartUI() {
  const cartItems = document.getElementById("cartItems");
  const cartCountEl = document.getElementById("cartCount");
  const cartTotalEl = document.getElementById("cartTotal");

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

  cartCountEl.textContent = cart.length;
  cartTotalEl.textContent = total;
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
        <strong>COD:</strong> Please Double-Check Your Cart! To make sure everything is perfect, please take a quick moment to review your items, sizes, and shipping info before checking out..<br>
        No Changes After Checkout To keep our shipping lightning-fast, we don’t allow cancellations or modifications once an order is confirmed.
      </p>
    `;
  } else {
    paymentDetails.innerHTML = "";
  }
});

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
      errorMsg.classList.remove("hidden");
      return;
    }

    errorMsg.classList.add("hidden");
    alert("✅ Order placed successfully!");
    clearCart();
    showPage("home");
  }, 800);
}

  errorMsg.classList.add("hidden");

  alert("✅ Order placed successfully!");
  clearCart();
  function showPage(id) {
  showLoader();

  setTimeout(() => {
    document.querySelectorAll(".page").forEach(p =>
      p.classList.add("hidden")
    );
    document.getElementById(id).classList.remove("hidden");
    hideLoader();
  }, 600);
}

function showLoader() {
  const loader = document.getElementById("loadingScreen");
  loader.style.display = "flex";
  loader.style.opacity = "1";
}

function hideLoader() {
  const loader = document.getElementById("loadingScreen");
  loader.style.opacity = "0";
  setTimeout(() => {
    loader.style.display = "none";
  }, 400);
}


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
  }, 400);
}

const bgMusic = document.getElementById("bgMusic");
const musicIcon = document.getElementById("musicIcon");

let musicEnabled = false;

/* USER MUST INTERACT FIRST (BROWSER RULE) */
document.addEventListener("click", initMusic, { once: true });

function initMusic() {
  bgMusic.volume = 0.4;
}

/* TOGGLE MUSIC */
function toggleMusic() {
  if (bgMusic.paused) {
    bgMusic.play();
    musicIcon.src = "images/UNMUTEDpng";
    musicEnabled = true;
  } else {
    bgMusic.pause();
    musicIcon.src = "images/MUTE.png";
    musicEnabled = false;
  }

  localStorage.setItem("musicEnabled", musicEnabled);
}

/* RESTORE STATE */
window.addEventListener("load", () => {
  const saved = localStorage.getItem("musicEnabled");
  if (saved === "true") {
    bgMusic.volume = 0.4;
    bgMusic.play().catch(() => {});
    musicIcon.src = "images/speaker-on.png";
  }
});
