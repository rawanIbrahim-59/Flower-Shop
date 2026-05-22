const products = [
  { id: 1, name: 'Pink Bliss', category: 'roses', price: 49, img: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=400&h=500&fit=crop', tag: 'Bestseller' },
  { id: 2, name: 'Sunshine Meadow', category: 'wildflowers', price: 39, img: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=400&h=500&fit=crop', tag: 'Luxury' },
  { id: 3, name: 'Royal Velvet', category: 'luxury', price: 89, img: 'https://images.unsplash.com/photo-1496062031456-07b8f162a322?w=400&h=500&fit=crop', tag: 'Premium' },
  { id: 4, name: 'Red Romance', category: 'roses', price: 55, img: 'https://images.unsplash.com/photo-1548586196-aa5803b77379?w=400&h=500&fit=crop', tag: 'Romantic' },
  { id: 5, name: 'Wild & Free', category: 'wildflowers', price: 44, img: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=400&h=500&fit=crop', tag: 'Luxury' },
  { id: 6, name: 'Golden Hour', category: 'luxury', price: 99, img: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=400&h=500&fit=crop', tag: 'Luxury' },
  { id: 7, name: 'Blush & Bloom', category: 'roses', price: 52, img: 'https://images.unsplash.com/photo-1591825729269-caeb344f6df2?w=400&h=500&fit=crop', tag: 'Elegant' },
  { id: 8, name: 'Meadow Song', category: 'wildflowers', price: 36, img: 'https://images.unsplash.com/photo-1496062031456-07b8f162a322?w=400&h=500&fit=crop', tag: 'Garden' },
];

const testimonials = [
  { text: 'The bouquet arrived looking even more stunning than the photos! The roses were absolutely perfect and lasted over two weeks. Highly recommend!', author: 'Sarah M.', role: 'Regular Customer', stars: 5 },
  { text: 'I ordered the Royal Velvet arrangement for my anniversary. My wife was speechless — the flowers were breathtaking. Thank you Bloom & Petal!', author: 'James K.', role: 'Verified Buyer', stars: 5 },
  { text: 'Best flower delivery in the city. Same-day delivery saved me and the arrangement was gorgeous. Will definitely order again!', author: 'Emily R.', role: 'Happy Customer', stars: 5 },
  { text: 'The attention to detail in every bouquet is incredible. You can tell they truly care about their craft. My go-to flower shop!', author: 'Michael T.', role: 'Loyal Customer', stars: 5 },
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentSlide = 0;
let slideInterval;
let currentTestimonial = 0;

// Render products
function renderProducts(filter = 'all') {
  const grid = document.getElementById('productsGrid');
  const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);
  grid.innerHTML = filtered.map(p => `
    <div class="product-card" data-id="${p.id}">
      <div class="product-image">
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        <span class="product-tag">${p.tag}</span>
      </div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <p>Beautiful handcrafted bouquet</p>
        <span class="price">$${p.price}</span>
        <button class="add-to-cart" data-id="${p.id}">Add to Cart</button>
      </div>
    </div>
  `).join('');

  grid.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.id);
      addToCart(id);
    });
  });
}

// Cart functions
function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  updateCart();
  showToast(`${product.name} added to cart!`);
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCart();
}

function updateQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) {
      removeFromCart(id);
      return;
    }
    updateCart();
  }
}

function updateCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById('cartCount').textContent = count;

  const container = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');

  if (cart.length === 0) {
    container.innerHTML = `<div class="empty-cart"><i class="fas fa-shopping-bag"></i><p>Your cart is empty</p></div>`;
    totalEl.textContent = '$0.00';
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  totalEl.textContent = `$${total.toFixed(2)}`;

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.img}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>$${item.price}</p>
        <div class="cart-item-qty">
          <button onclick="updateQty(${item.id}, -1)">−</button>
          <span>${item.qty}</span>
          <button onclick="updateQty(${item.id}, 1)">+</button>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${item.id})">Remove</button>
      </div>
    </div>
  `).join('');
}

function showToast(msg) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => toast.classList.remove('show'), 2500);
}

// Hero slideshow
function goToSlide(index) {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  slides.forEach(s => s.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));
  slides[index].classList.add('active');
  dots[index].classList.add('active');
  currentSlide = index;
}

function nextSlide() {
  const slides = document.querySelectorAll('.slide');
  goToSlide((currentSlide + 1) % slides.length);
}

function startSlideshow() {
  slideInterval = setInterval(nextSlide, 5000);
}

document.querySelectorAll('.dot').forEach(dot => {
  dot.addEventListener('click', () => {
    clearInterval(slideInterval);
    goToSlide(parseInt(dot.dataset.slide));
    startSlideshow();
  });
});

// Testimonial slider
function renderTestimonials() {
  const container = document.getElementById('testimonialSlider');
  container.innerHTML = testimonials.map((t, i) => `
    <div class="testimonial-card${i === 0 ? ' active' : ''}">
      <div class="stars">${'★'.repeat(t.stars)}</div>
      <p>"${t.text}"</p>
      <div class="author">${t.author} <span>— ${t.role}</span></div>
    </div>
  `).join('');
}

function showTestimonial(index) {
  const cards = document.querySelectorAll('.testimonial-card');
  cards.forEach(c => c.classList.remove('active'));
  const len = cards.length;
  currentTestimonial = ((index % len) + len) % len;
  cards[currentTestimonial].classList.add('active');
}

document.getElementById('prevTestimonial').addEventListener('click', () => showTestimonial(currentTestimonial - 1));
document.getElementById('nextTestimonial').addEventListener('click', () => showTestimonial(currentTestimonial + 1));

// Filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderProducts(btn.dataset.filter);
  });
});

// Navbar scroll
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.navbar');
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// Hamburger
document.getElementById('hamburger').addEventListener('click', () => {
  document.querySelector('.nav-links').classList.toggle('open');
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelector('.nav-links').classList.remove('open');
  });
});

// Cart toggle
const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const closeCart = document.getElementById('closeCart');

function openCart() {
  cartSidebar.classList.add('open');
  cartOverlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeCartFn() {
  cartSidebar.classList.remove('open');
  cartOverlay.classList.remove('show');
  document.body.style.overflow = '';
}

cartBtn.addEventListener('click', (e) => { e.preventDefault(); openCart(); });
closeCart.addEventListener('click', closeCartFn);
cartOverlay.addEventListener('click', closeCartFn);

// Contact form
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  showToast('Message sent! We\'ll get back to you soon.');
  e.target.reset();
});

// Newsletter form
document.querySelector('.newsletter-form').addEventListener('submit', (e) => {
  e.preventDefault();
  showToast('Subscribed! Check your inbox for 10% off.');
  e.target.reset();
});

// Init
renderProducts();
renderTestimonials();
updateCart();
startSlideshow();
