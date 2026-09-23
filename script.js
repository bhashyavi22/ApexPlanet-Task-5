// =====================================================
// STEP 2: Performance-conscious JavaScript
// - Elements cached once (avoids repeated DOM queries)
// - Event delegation used where possible to reduce listeners
// =====================================================

// ---------- Shop: Products, Cart (Local Storage) ----------

const products = [
  { id: 1, name: 'Wireless Earbuds', category: 'electronics', price: 1499, icon: '🎧' },
  { id: 2, name: 'Smart Watch', category: 'electronics', price: 3299, icon: '⌚' },
  { id: 3, name: 'Portable Speaker', category: 'electronics', price: 1199, icon: '🔊' },
  { id: 4, name: 'Laptop Sleeve', category: 'accessories', price: 599, icon: '💼' },
  { id: 5, name: 'Phone Stand', category: 'accessories', price: 299, icon: '📱' },
  { id: 6, name: 'Travel Backpack', category: 'accessories', price: 1799, icon: '🎒' }
];

const CART_KEY = 'task5_cart';

const categoryFilter = document.getElementById('categoryFilter');
const sortOption = document.getElementById('sortOption');
const productGrid = document.getElementById('productGrid');
const cartCount = document.getElementById('cartCount');

function getCart() {
  const stored = localStorage.getItem(CART_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function updateCartCount() {
  const cart = getCart();
  cartCount.textContent = `${cart.length} item${cart.length !== 1 ? 's' : ''}`;
}

function addToCart(productId, btn) {
  const cart = getCart();
  cart.push(productId);
  saveCart(cart);
  updateCartCount();

  btn.textContent = '✅ Added';
  btn.classList.add('added');
  setTimeout(() => {
    btn.textContent = '🛒 Add to Cart';
    btn.classList.remove('added');
  }, 1200);
}

function renderProducts() {
  let filtered = [...products];

  const category = categoryFilter.value;
  if (category !== 'all') {
    filtered = filtered.filter(p => p.category === category);
  }

  const sort = sortOption.value;
  if (sort === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  }

  productGrid.innerHTML = '';

  filtered.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-icon">${product.icon}</div>
      <h3>${product.name}</h3>
      <div class="product-price">₹${product.price}</div>
      <button class="add-cart-btn" data-id="${product.id}">🛒 Add to Cart</button>
    `;
    productGrid.appendChild(card);
  });

  // Event delegation: attach listeners once instead of per-card re-renders
  productGrid.querySelectorAll('.add-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      addToCart(parseInt(btn.dataset.id), btn);
    });
  });
}

categoryFilter.addEventListener('change', renderProducts);
sortOption.addEventListener('change', renderProducts);

renderProducts();
updateCartCount();


// ---------- Contact Form Validation ----------

const form = document.getElementById('contactForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const formSuccess = document.getElementById('formSuccess');

function showError(input, errorId, msg) {
  input.classList.add('invalid');
  document.getElementById(errorId).textContent = msg;
}

function clearError(input, errorId) {
  input.classList.remove('invalid');
  document.getElementById(errorId).textContent = '';
}

form.addEventListener('submit', function (e) {
  e.preventDefault();
  let isValid = true;

  if (nameInput.value.trim() === '') {
    showError(nameInput, 'nameError', 'Name is required.');
    isValid = false;
  } else {
    clearError(nameInput, 'nameError');
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailInput.value.trim() === '') {
    showError(emailInput, 'emailError', 'Email is required.');
    isValid = false;
  } else if (!emailPattern.test(emailInput.value.trim())) {
    showError(emailInput, 'emailError', 'Enter a valid email address.');
    isValid = false;
  } else {
    clearError(emailInput, 'emailError');
  }

  if (messageInput.value.trim() === '') {
    showError(messageInput, 'messageError', 'Message cannot be empty.');
    isValid = false;
  } else {
    clearError(messageInput, 'messageError');
  }

  if (isValid) {
    formSuccess.textContent = '✅ Thanks! Your message has been sent.';
    form.reset();
    setTimeout(() => { formSuccess.textContent = ''; }, 4000);
  }
});
