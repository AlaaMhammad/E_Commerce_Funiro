// Wishlist JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }
    
    updateUserIcon();
    loadWishlist();
    updateCartCount();
    updateWishlistCount();
});

// Get wishlist from localStorage
function getWishlist() {
    const user = getCurrentUser();
    if (!user) return [];
    const wishlistKey = `wishlist_${user.id}`;
    return JSON.parse(localStorage.getItem(wishlistKey) || '[]');
}

// Save wishlist to localStorage
function saveWishlist(wishlist) {
    const user = getCurrentUser();
    if (!user) return;
    const wishlistKey = `wishlist_${user.id}`;
    localStorage.setItem(wishlistKey, JSON.stringify(wishlist));
    updateWishlistCount();
}

// Load and display wishlist
function loadWishlist() {
    const wishlist = getWishlist();
    const wishlistItemsContainer = document.getElementById('wishlistItems');
    const emptyWishlist = document.getElementById('emptyWishlist');
    
    if (wishlist.length === 0) {
        wishlistItemsContainer.style.display = 'none';
        emptyWishlist.style.display = 'block';
        return;
    }
    
    wishlistItemsContainer.style.display = 'flex';
    emptyWishlist.style.display = 'none';
    
    let html = '';
    
    wishlist.forEach((item, index) => {
        html += `
            <div class="col-lg-3 col-md-6 mb-4">
                <div class="wishlist-card">
                    <button class="wishlist-remove" onclick="removeFromWishlist(${index})">
                        <i class="fas fa-times"></i>
                    </button>
                    <div class="wishlist-image" style="background: url('${item.image}') center/cover"></div>
                    <div class="wishlist-info">
                        <h4>${item.name}</h4>
                        <p>${item.subtitle}</p>
                        <p class="wishlist-price">Rp ${item.price.toLocaleString()}</p>
                        <button class="btn btn-primary btn-sm w-100" onclick="moveToCart(${index})">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    wishlistItemsContainer.innerHTML = html;
}

// Remove from wishlist
function removeFromWishlist(index) {
    const wishlist = getWishlist();
    wishlist.splice(index, 1);
    saveWishlist(wishlist);
    loadWishlist();
    showNotification('Item removed from wishlist', 'success');
}

// Move item from wishlist to cart
function moveToCart(index) {
    const wishlist = getWishlist();
    const item = wishlist[index];
    
    // Add to cart
    const cart = getCart();
    const existingItem = cart.find(i => i.id === item.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({...item, quantity: 1});
    }
    
    saveCart(cart);
    
    // Remove from wishlist
    wishlist.splice(index, 1);
    saveWishlist(wishlist);
    
    loadWishlist();
    updateCartCount();
    showNotification('Item moved to cart!', 'success');
}

// Get cart
function getCart() {
    const user = getCurrentUser();
    if (!user) return [];
    const cartKey = `cart_${user.id}`;
    return JSON.parse(localStorage.getItem(cartKey) || '[]');
}

// Save cart
function saveCart(cart) {
    const user = getCurrentUser();
    if (!user) return;
    const cartKey = `cart_${user.id}`;
    localStorage.setItem(cartKey, JSON.stringify(cart));
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