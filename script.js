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
async function placeOrder() {
  showLoader();

  const name = fullName.value.trim();
  const addressVal = address.value.trim();
  const emailVal = email.value.trim();
  const contactVal = contact.value.trim();

  if (!name || !addressVal || !emailVal || !contactVal || cart.length === 0) {
    hideLoader();
    alert("Fill all required fields.");
    return;
  }

  const orderData = {
    customer: { name, addressVal, emailVal, contactVal },
    cart,
    total: cart.reduce((t,i)=>t+i.price,0),
    createdAt: new Date()
  };

  try {
    // SAVE TO DATABASE
    await addDoc(collection(db, "orders"), orderData);

    // SEND EMAIL TO YOU
    await emailjs.send("SERVICE_ID","TEMPLATE_ID",{
      name,
      email: emailVal,
      message: JSON.stringify(orderData, null, 2)
    });

    alert("✅ Order sent successfully!");
    clearCart();
    showPage("home");

  } catch (err) {
    alert("❌ Order failed. Try again.");
    console.error(err);
  }

  hideLoader();
}


/* =====================
   BACKGROUND MUSIC
===================== */
const bgMusic = document.getElementById("bgMusic");
const musicIcon = document.getElementById("musicIcon");

let musicEnabled = false;

// Unlock audio on first user interaction
document.addEventListener("click", () => {
  if (bgMusic) bgMusic.volume = 0.4;
}, { once: true });

function toggleMusic() {
  if (!bgMusic || !musicIcon) return;

  if (bgMusic.paused) {
    bgMusic.play().catch(() => {});
    musicIcon.src = "images/UNMUTED.png";
    musicEnabled = true;
  } else {
    bgMusic.pause();
    musicIcon.src = "images/MUTE.png";
    musicEnabled = false;
  }

  localStorage.setItem("musicEnabled", musicEnabled);
}

window.addEventListener("load", () => {
  const saved = localStorage.getItem("musicEnabled");
  if (saved === "true" && bgMusic) {
    bgMusic.volume = 0.4;
    bgMusic.play().catch(() => {});
    musicIcon.src = "images/UNMUTED.png";
  }
});


window.addEventListener("load", () => {
  const saved = localStorage.getItem("musicEnabled");
  if (saved === "true" && bgMusic) {
    bgMusic.volume = 0.4;
    bgMusic.play().catch(() => {});
    musicIcon.src = "images/UNMUTED.png";
  }
});
document.addEventListener("DOMContentLoaded", () => {
  showLoader();
});

window.addEventListener("load", () => {
  hideLoader();
});
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
document.querySelectorAll("img").forEach(img=>{
  img.onload = () => img.classList.add("loaded");
});
