// BlackTribe E-Commerce JavaScript

// Product Data
const products = [
    {
        id: 1,
        name: "BlackTribe Signature Tee",
        price: 150,
        image: "BlackTribe Tshirt 1.jpeg",
        description: "Elevate your streetwear game with our iconic BlackTribe Signature Tee. Featuring a bold dove and fire design on premium cotton fabric, this tee represents freedom, power, and the spirit of the tribe. Perfect for making a statement wherever you go.",
        colors: [
            { name: "White", value: "#ffffff" },
            { name: "Black", value: "#000000" }
        ],
        sizes: ["S", "M", "L", "XL"],
        category: "tshirt"
    },
    {
        id: 2,
        name: "BlackTribe Globe Tee",
        price: 150,
        image: "BlackTribe Tshirt 2.jpeg",
        description: "Join the worldwide movement with our BlackTribe Globe Tee. This premium t-shirt features our signature globe and barbed wire design, symbolizing global unity and strength. Crafted from 100% premium cotton for ultimate comfort and durability.",
        colors: [
            { name: "White", value: "#ffffff" },
            { name: "Black", value: "#000000" }
        ],
        sizes: ["S", "M", "L", "XL"],
        category: "tshirt"
    },
    {
        id: 3,
        name: "BlackTribe Tank Top",
        price: 70,
        image: "BlackTribe Singlet.jpeg",
        description: "Stay cool and stylish with our BlackTribe Tank Top. Available in multiple colors, this versatile singlet is perfect for workouts, casual outings, or layering. Made from breathable fabric with the iconic BlackTribe logo embroidered for a premium finish.",
        colors: [
            { name: "White", value: "#ffffff" },
            { name: "Black", value: "#000000" },
            { name: "Ash", value: "#808080" },
            { name: "Brown", value: "#8B4513" }
        ],
        sizes: ["S", "M", "L", "XL"],
        category: "singlet"
    },
    {
        id: 4,
        name: "BlackTribe Street Jeans",
        price: 200,
        image: "BlackTribe Jeans.jpeg",
        description: "Complete your tribe look with our exclusive BlackTribe Street Jeans. Featuring unique artistic prints with dove and fire motifs, these premium jeans are designed for those who dare to be different. Comfortable fit with durable construction for everyday wear.",
        colors: [],
        sizes: [],
        category: "jeans"
    }
];

// Cart State
let cart = JSON.parse(localStorage.getItem('blacktribe_cart')) || [];
let currentProduct = null;
let selectedColor = null;
let selectedSize = null;
let itemQuantity = 1;
let currentSlide = 0;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartCount();
    startHeroSlider();
});

// Hero Slider Functions
function startHeroSlider() {
    const slides = document.querySelectorAll('.hero-slider .slide');
    const dots = document.querySelectorAll('.slider-dot');
    
    if (slides.length === 0) return;

    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }, 4000);
}

function goToSlide(index) {
    const slides = document.querySelectorAll('.hero-slider .slide');
    const dots = document.querySelectorAll('.slider-dot');
    
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = index;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

// Page Navigation
function showPage(page) {
    document.getElementById('homePage').classList.add('hidden');
    document.getElementById('itemPage').classList.add('hidden');
    document.getElementById('cartPage').classList.add('hidden');
    
    if (page === 'home') {
        document.getElementById('homePage').classList.remove('hidden');
    } else if (page === 'item') {
        document.getElementById('itemPage').classList.remove('hidden');
    } else if (page === 'cart') {
        document.getElementById('cartPage').classList.remove('hidden');
        renderCart();
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('hidden');
    menu.classList.toggle('show');
}

// Render Products on Home Page
function renderProducts() {
    const grid = document.getElementById('productGrid');
    if (!grid) return;
    
    grid.innerHTML = products.map(product => `
        <div class="product-card" onclick="viewProduct(${product.id})">
            <div class="badge-hot">
                <i class="fas fa-fire"></i>
                Hot
            </div>
            <div class="image-container">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <div class="overlay">
                    <button class="quick-view-btn bg-bt-gold text-bt-black px-6 py-3 rounded-full font-semibold flex items-center gap-2 hover:bg-bt-gold-dark transition-all">
                        <i class="fas fa-eye"></i>
                        View Details
                    </button>
                </div>
            </div>
            <div class="p-5 relative z-10">
                <h3 class="font-orbitron font-bold text-lg mb-2 text-bt-white">${product.name}</h3>
                <div class="flex items-center justify-between">
                    <span class="text-2xl font-bold text-bt-gold">₵${product.price}</span>
                    <div class="flex items-center gap-1 text-yellow-400 text-sm">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                    </div>
                </div>
                <button onclick="event.stopPropagation(); quickAddToCart(${product.id})" 
                    class="mt-4 w-full bg-bt-gray border border-bt-gold/30 text-bt-gold py-3 rounded-xl font-semibold 
                    hover:bg-bt-gold hover:text-bt-black transition-all duration-300 flex items-center justify-center gap-2">
                    <i class="fas fa-cart-plus"></i>
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// View Single Product
function viewProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    currentProduct = product;
    selectedColor = product.colors.length > 0 ? product.colors[0] : null;
    selectedSize = product.sizes.length > 0 ? product.sizes[0] : null;
    itemQuantity = 1;
    
    // Update page content
    document.getElementById('breadcrumbItem').textContent = product.name;
    document.getElementById('itemImage').src = product.image;
    document.getElementById('itemImage').alt = product.name;
    document.getElementById('itemName').textContent = product.name;
    document.getElementById('itemPrice').textContent = `₵${product.price}`;
    document.getElementById('itemDescription').textContent = product.description;
    document.getElementById('itemQuantity').textContent = itemQuantity;
    
    // Render color options
    const colorSection = document.getElementById('colorSection');
    const colorOptions = document.getElementById('colorOptions');
    
    if (product.colors.length > 0) {
        colorSection.classList.remove('hidden');
        colorOptions.innerHTML = product.colors.map((color, index) => `
            <div class="color-option ${index === 0 ? 'selected' : ''}" 
                style="background-color: ${color.value}; ${color.value === '#ffffff' ? 'border: 2px solid #333;' : ''}"
                onclick="selectColor(${index}, '${color.name}')"
                data-color="${color.name}">
                <span class="color-name">${color.name}</span>
            </div>
        `).join('');
    } else {
        colorSection.classList.add('hidden');
    }
    
    // Render size options
    const sizeSection = document.getElementById('sizeSection');
    const sizeOptions = document.getElementById('sizeOptions');
    
    if (product.sizes.length > 0) {
        sizeSection.classList.remove('hidden');
        sizeOptions.innerHTML = product.sizes.map((size, index) => `
            <button class="size-option ${index === 0 ? 'selected' : ''}" 
                onclick="selectSize('${size}')"
                data-size="${size}">
                ${size}
            </button>
        `).join('');
    } else {
        sizeSection.classList.add('hidden');
    }
    
    // Render other products
    renderOtherProducts(productId);
    
    showPage('item');
}

// Render Other Products
function renderOtherProducts(excludeId) {
    const container = document.getElementById('otherProducts');
    if (!container) return;
    
    const otherProducts = products.filter(p => p.id !== excludeId);
    
    container.innerHTML = otherProducts.map(product => `
        <div class="other-product-card" onclick="viewProduct(${product.id})">
            <div class="image-container">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="p-4">
                <h4 class="font-semibold text-sm mb-1 text-bt-white truncate">${product.name}</h4>
                <span class="text-lg font-bold text-bt-gold">₵${product.price}</span>
            </div>
        </div>
    `).join('');
}

// Select Color
function selectColor(index, colorName) {
    const options = document.querySelectorAll('#colorOptions .color-option');
    options.forEach((opt, i) => {
        opt.classList.toggle('selected', i === index);
    });
    selectedColor = currentProduct.colors[index];
}

// Select Size
function selectSize(size) {
    const options = document.querySelectorAll('#sizeOptions .size-option');
    options.forEach(opt => {
        opt.classList.toggle('selected', opt.dataset.size === size);
    });
    selectedSize = size;
}

// Update Item Quantity on Detail Page
function updateItemQuantity(change) {
    itemQuantity = Math.max(1, itemQuantity + change);
    document.getElementById('itemQuantity').textContent = itemQuantity;
}

// Add to Cart from Detail Page
function addToCartFromDetail() {
    if (!currentProduct) return;
    
    // Validate selection
    if (currentProduct.colors.length > 0 && !selectedColor) {
        showToast('Please select a color', 'warning');
        return;
    }
    if (currentProduct.sizes.length > 0 && !selectedSize) {
        showToast('Please select a size', 'warning');
        return;
    }
    
    const cartItem = {
        id: Date.now(),
        productId: currentProduct.id,
        name: currentProduct.name,
        price: currentProduct.price,
        image: currentProduct.image,
        color: selectedColor ? selectedColor.name : 'N/A',
        size: selectedSize || 'N/A',
        quantity: itemQuantity
    };
    
    cart.push(cartItem);
    saveCart();
    updateCartCount();
    showToast(`${currentProduct.name} added to cart!`, 'success');
}

// Quick Add to Cart from Product Grid
function quickAddToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const cartItem = {
        id: Date.now(),
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        color: product.colors.length > 0 ? product.colors[0].name : 'N/A',
        size: product.sizes.length > 0 ? product.sizes[0] : 'N/A',
        quantity: 1
    };
    
    cart.push(cartItem);
    saveCart();
    updateCartCount();
    showToast(`${product.name} added to cart!`, 'success');
}

// Order Now from Detail Page (Direct WhatsApp)
function orderNowFromDetail() {
    if (!currentProduct) return;
    
    // Validate selection
    if (currentProduct.colors.length > 0 && !selectedColor) {
        showToast('Please select a color', 'warning');
        return;
    }
    if (currentProduct.sizes.length > 0 && !selectedSize) {
        showToast('Please select a size', 'warning');
        return;
    }
    
    const colorText = selectedColor ? selectedColor.name : 'N/A';
    const sizeText = selectedSize || 'N/A';
    const total = currentProduct.price * itemQuantity;
    
    const message = `🛒 *NEW ORDER FROM BLACKTRIBE WEBSITE*\n\n` +
        `━━━━━━━━━━━━━━━\n` +
        `📦 *Order Details:*\n` +
        `━━━━━━━━━━━━━━━\n\n` +
        `🏷️ *Product:* ${currentProduct.name}\n` +
        `🎨 *Color:* ${colorText}\n` +
        `📏 *Size:* ${sizeText}\n` +
        `🔢 *Quantity:* ${itemQuantity}\n` +
        `💰 *Price:* ₵${currentProduct.price}\n` +
        `💵 *Subtotal:* ₵${total}\n\n` +
        `━━━━━━━━━━━━━━━\n` +
        `📋 *TOTAL:* ₵${total}\n` +
        `━━━━━━━━━━━━━━━\n\n` +
        `🚚 *Delivery fee will be calculated based on location*\n\n` +
        `Please provide your:\n` +
        `📍 Delivery Address:\n` +
        `📞 Phone Number:`;
    
    const phone = '+233598666142';
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phone.replace(/\s/g, '')}?text=${encodedMessage}`, '_blank');
}

// Render Cart Page
function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    const cartSummary = document.getElementById('cartSummary');
    
    if (cart.length === 0) {
        emptyCart.classList.remove('hidden');
        cartItems.innerHTML = '';
        cartSummary.classList.add('hidden');
        return;
    }
    
    emptyCart.classList.add('hidden');
    cartSummary.classList.remove('hidden');
    
    cartItems.innerHTML = cart.map((item, index) => `
        <div class="cart-item flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div class="flex gap-4 flex-1 w-full sm:w-auto">
                <img src="${item.image}" alt="${item.name}" class="w-24 h-24 object-cover rounded-xl">
                <div class="flex-1">
                    <h3 class="font-semibold text-lg mb-1">${item.name}</h3>
                    <div class="text-sm text-gray-400 space-y-1">
                        ${item.color !== 'N/A' ? `<p><i class="fas fa-palette mr-2 text-bt-gold"></i>Color: ${item.color}</p>` : ''}
                        ${item.size !== 'N/A' ? `<p><i class="fas fa-ruler mr-2 text-bt-gold"></i>Size: ${item.size}</p>` : ''}
                    </div>
                    <p class="text-bt-gold font-bold text-lg mt-2">₵${item.price}</p>
                </div>
            </div>
            <div class="flex items-center justify-between w-full sm:w-auto gap-4">
                <div class="flex items-center gap-2">
                    <button onclick="updateCartQuantity(${index}, -1)" class="qty-btn">
                        <i class="fas fa-minus text-sm"></i>
                    </button>
                    <span class="w-10 text-center font-bold">${item.quantity}</span>
                    <button onclick="updateCartQuantity(${index}, 1)" class="qty-btn">
                        <i class="fas fa-plus text-sm"></i>
                    </button>
                </div>
                <div class="text-right">
                    <p class="text-lg font-bold text-bt-gold">₵${item.price * item.quantity}</p>
                    <button onclick="removeFromCart(${index})" class="text-red-400 hover:text-red-300 text-sm mt-1 flex items-center gap-1">
                        <i class="fas fa-trash"></i>Remove
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    updateCartSummary();
}

// Update Cart Quantity
function updateCartQuantity(index, change) {
    cart[index].quantity = Math.max(1, cart[index].quantity + change);
    saveCart();
    renderCart();
}

// Remove from Cart
function removeFromCart(index) {
    const removedItem = cart[index];
    cart.splice(index, 1);
    saveCart();
    updateCartCount();
    renderCart();
    showToast(`${removedItem.name} removed from cart`, 'info');
}

// Update Cart Summary
function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('subtotal').textContent = `₵${subtotal.toFixed(2)}`;
    document.getElementById('totalAmount').textContent = `₵${subtotal.toFixed(2)}`;
}

// Update Cart Count in Header
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const countElement = document.getElementById('cartCount');
    
    if (count > 0) {
        countElement.textContent = count;
        countElement.classList.remove('hidden');
    } else {
        countElement.classList.add('hidden');
    }
}

// Save Cart to Local Storage
function saveCart() {
    localStorage.setItem('blacktribe_cart', JSON.stringify(cart));
}

// Checkout via WhatsApp
function checkoutViaWhatsApp() {
    if (cart.length === 0) {
        showToast('Your cart is empty!', 'warning');
        return;
    }
    
    let orderDetails = `🛒 *NEW ORDER FROM BLACKTRIBE WEBSITE*\n\n`;
    orderDetails += `━━━━━━━━━━━━━━━\n`;
    orderDetails += `📦 *Order Details:*\n`;
    orderDetails += `━━━━━━━━━━━━━━━\n\n`;
    
    let total = 0;
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        orderDetails += `${index + 1}. *${item.name}*\n`;
        if (item.color !== 'N/A') orderDetails += `   🎨 Color: ${item.color}\n`;
        if (item.size !== 'N/A') orderDetails += `   📏 Size: ${item.size}\n`;
        orderDetails += `   🔢 Qty: ${item.quantity} × ₵${item.price}\n`;
        orderDetails += `   💰 Subtotal: ₵${itemTotal}\n\n`;
    });
    
    orderDetails += `━━━━━━━━━━━━━━━\n`;
    orderDetails += `📋 *TOTAL:* ₵${total}\n`;
    orderDetails += `━━━━━━━━━━━━━━━\n\n`;
    orderDetails += `🚚 *Delivery fee will be calculated based on location*\n\n`;
    orderDetails += `Please provide your:\n`;
    orderDetails += `📍 Delivery Address:\n`;
    orderDetails += `📞 Phone Number:`;
    
    const phone = '+233598666142';
    const encodedMessage = encodeURIComponent(orderDetails);
    window.open(`https://wa.me/${phone.replace(/\s/g, '')}?text=${encodedMessage}`, '_blank');
}

// Toast Notification
function showToast(message, type = 'success') {
    // Remove any existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const icons = {
        success: 'fas fa-check-circle text-green-400',
        warning: 'fas fa-exclamation-circle text-yellow-400',
        error: 'fas fa-times-circle text-red-400',
        info: 'fas fa-info-circle text-blue-400'
    };
    
    const toast = document.createElement('div');
    toast.className = 'toast flex items-center gap-3 text-bt-white';
    toast.innerHTML = `
        <i class="${icons[type]} text-xl"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Auto remove
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});
