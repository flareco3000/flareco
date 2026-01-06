/* =====================
   REALTIME NETWORK LOADER
===================== */
let pendingRequests = 0;

function showLoader() {
  const loader = document.getElementById("loadingScreen");
  if (!loader) return;
  loader.style.display = "flex";
  requestAnimationFrame(() => loader.style.opacity = "1");
}

function hideLoader() {
  const loader = document.getElementById("loadingScreen");
  if (!loader) return;
  if (pendingRequests > 0) return;
  loader.style.opacity = "0";
  setTimeout(() => loader.style.display = "none", 400);
}

function startRequest() {
  pendingRequests++;
  showLoader();
}

function endRequest() {
  pendingRequests = Math.max(0, pendingRequests - 1);
  hideLoader();
}

/* =====================
   PAGE NAVIGATION
===================== */
function showPage(id) {
  startRequest();

  document.querySelectorAll(".page").forEach(p =>
    p.classList.add("hidden")
  );

  const page = document.getElementById(id);
  if (page) page.classList.remove("hidden");

  const imgs = page ? page.querySelectorAll("img") : [];
  let loaded = 0;

  if (imgs.length === 0) {
    endRequest();
    return;
  }

  imgs.forEach(img => {
    if (img.complete) {
      loaded++;
      if (loaded === imgs.length) endRequest();
    } else {
      img.onload = img.onerror = () => {
        loaded++;
        if (loaded === imgs.length) endRequest();
      };
    }
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
  if (!img) return;

  startRequest();
  img.onload = img.onerror = () => endRequest();
  img.src = images[color];
}

function setSize(size) {
  currentSize = size;
}

/* =====================
   IMAGE MODAL
===================== */
function openImage(src) {
  document.getElementById("modalImg").src = src;
  document.getElementById("imgModal").classList.remove("hidden");
}

function closeImage() {
  document.getElementById("imgModal").classList.add("hidden");
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
  startRequest();

  cart.push({
    name: "NOIRCORE",
    price: pricePerItem,
    color: currentColor,
    size: currentSize,
    image: images[currentColor]
  });

  updateCartUI();
  endRequest();
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
   PLACE ORDER (REALTIME NETWORK)
===================== */
async function placeOrder() {
  startRequest();

  const fullName = document.getElementById("fullName");
  const address = document.getElementById("address");
  const email = document.getElementById("email");
  const contact = document.getElementById("contact");

  if (!fullName || !address || !email || !contact) {
    alert("Form elements missing");
    endRequest();
    return;
  }

  const name = fullName.value.trim();
  const addressVal = address.value.trim();
  const emailVal = email.value.trim();
  const contactVal = contact.value.trim();

  if (!name || !addressVal || !emailVal || !contactVal || cart.length === 0) {
    alert("Fill all required fields.");
    endRequest();
    return;
  }

  const orderData = {
    customer: { name, address: addressVal, email: emailVal, contact: contactVal },
    cart,
    total: cart.reduce((t, i) => t + i.price, 0),
    createdAt: new Date().toISOString()
  };

  try {
    await addDoc(collection(db, "orders"), orderData);

    await emailjs.send("SERVICE_ID", "TEMPLATE_ID", {
      name,
      email: emailVal,
      message: JSON.stringify(orderData, null, 2)
    });

    alert("✅ Order sent successfully!");
    clearCart();
    showPage("home");

  } catch (err) {
    console.error(err);
    alert("❌ Order failed. Try again.");
  }

  endRequest();
}

/* =====================
   BACKGROUND MUSIC
===================== */
const bgMusic = document.getElementById("bgMusic");
const musicIcon = document.getElementById("musicIcon");

document.addEventListener("click", () => {
  if (bgMusic) bgMusic.volume = 0.4;
}, { once: true });

function toggleMusic() {
  if (!bgMusic || !musicIcon) return;

  if (bgMusic.paused) {
    bgMusic.play().catch(()=>{});
    musicIcon.src = "images/UNMUTED.png";
    localStorage.setItem("musicEnabled", "true");
  } else {
    bgMusic.pause();
    musicIcon.src = "images/MUTE.png";
    localStorage.setItem("musicEnabled", "false");
  }
}

window.addEventListener("load", () => {
  const saved = localStorage.getItem("musicEnabled");
  if (saved === "true" && bgMusic) {
    bgMusic.volume = 0.4;
    bgMusic.play().catch(()=>{});
    musicIcon.src = "images/UNMUTED.png";
  }
});

/* =====================
   GLOBAL IMAGE NETWORK TRACKING
===================== */
document.querySelectorAll("img").forEach(img => {
  startRequest();
  if (img.complete) {
    endRequest();
  } else {
    img.onload = img.onerror = () => endRequest();
  }
});

/* =====================
   FIREBASE + EMAILJS
===================== */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, addDoc, collection } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

emailjs.init("YOUR_PUBLIC_KEY");

/* =====================
   INITIAL LOADER
===================== */
document.addEventListener("DOMContentLoaded", () => {
  showLoader();
});

window.addEventListener("load", () => {
  hideLoader();
});

