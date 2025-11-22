// Cart JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }
    
    updateUserIcon();
    loadCart();
    updateCartCount();
    updateWishlistCount();
    
    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            const cart = getCart();
            if (cart.length === 0) {
                showNotification('Your cart is empty!', 'error');
                return;
            }
            showNotification('Proceeding to checkout...', 'success');
            // Here you would implement actual checkout logic
        });
    }
});

// Get cart from localStorage
function getCart() {
    const user = getCurrentUser();
    if (!user) return [];
    const cartKey = `cart_${user.id}`;
    return JSON.parse(localStorage.getItem(cartKey) || '[]');
}

// Save cart to localStorage
function saveCart(cart) {
    const user = getCurrentUser();
    if (!user) return;
    const cartKey = `cart_${user.id}`;
    localStorage.setItem(cartKey, JSON.stringify(cart));
    updateCartCount();
}

// Load and display cart
function loadCart() {
    const cart = getCart();
    const cartItemsContainer = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    
    if (cart.length === 0) {
        cartItemsContainer.style.display = 'none';
        emptyCart.style.display = 'block';
        updateCartSummary(0);
        return;
    }
    
    cartItemsContainer.style.display = 'block';
    emptyCart.style.display = 'none';
    
    let html = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        html += `
            <div class="cart-item">
                <div class="cart-item-image" style="background: url('${item.image}') center/cover"></div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>${item.subtitle}</p>
                    <p class="cart-item-price">Rp ${item.price.toLocaleString()}</p>
                </div>
                <div class="cart-item-quantity">
                    <button class="qty-btn" onclick="updateQuantity(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
                </div>
                <div class="cart-item-total">
                    <p>Rp ${itemTotal.toLocaleString()}</p>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${index})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = html;
    updateCartSummary(total);
}

// Update quantity
function updateQuantity(index, change) {
    const cart = getCart();
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    
    saveCart(cart);
    loadCart();
}

// Remove from cart
function removeFromCart(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    loadCart();
    showNotification('Item removed from cart', 'success');
}

// Update cart summary
function updateCartSummary(subtotal) {
    document.getElementById('subtotal').textContent = `Rp ${subtotal.toLocaleString()}`;
    document.getElementById('total').textContent = `Rp ${subtotal.toLocaleString()}`;
}

// Update cart count
function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('#cartCount');
    cartCountElements.forEach(el => {
        el.textContent = count;
        el.style.display = count > 0 ? 'flex' : 'none';
    });
}

// Update wishlist count
function updateWishlistCount() {
    const wishlist = getWishlist();
    const wishlistCountElements = document.querySelectorAll('#wishlistCount');
    wishlistCountElements.forEach(el => {
        el.textContent = wishlist.length;
        el.style.display = wishlist.length > 0 ? 'flex' : 'none';
    });
}

// Get wishlist
function getWishlist() {
    const user = getCurrentUser();
    if (!user) return [];
    const wishlistKey = `wishlist_${user.id}`;
    return JSON.parse(localStorage.getItem(wishlistKey) || '[]');
}

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('currentUser') !== null;
}

// Get current user
function getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

// Update user icon
function updateUserIcon() {
    const userIcon = document.getElementById('userIcon');
    if (userIcon && isLoggedIn()) {
        const user = getCurrentUser();
        userIcon.innerHTML = `<img src="https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=E89F71&color=fff&size=32" alt="${user.name}" class="user-avatar">`;
        userIcon.href = '#';
        userIcon.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Do you want to logout?')) {
                logout();
            }
        });
    }
}

// Logout
function logout() {
    localStorage.removeItem('currentUser');
    showNotification('Logged out successfully!', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        background: type === 'success' ? '#2EC1AC' : '#E97171',
        color: 'white',
        borderRadius: '5px',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
        zIndex: '9999',
        animation: 'slideInRight 0.3s ease',
        fontWeight: '500'
    });
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}