document.addEventListener('DOMContentLoaded', function () {
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    const addToWishlistBtns = document.querySelectorAll('.add-to-wishlist-btn');

    // جلب الزر الجديد
    const showMoreBtn = document.getElementById('showMoreBtn');

    // -------------------------------------------------------------------
    // وظيفة معالجة زر "Show More" (الجديدة)
    // -------------------------------------------------------------------
    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', function (e) {
            e.preventDefault(); // منع العمل الافتراضي للرابط

            if (!isLoggedIn()) {
                // إذا لم يكن مسجل دخول، اذهب لصفحة تسجيل الدخول
                window.location.href = 'login.html';
            } else {
                // إذا كان مسجل دخول، اذهب لصفحة المتجر الرئيسية
                window.location.href = 'shop.html';
            }
        });
    }
    // -------------------------------------------------------------------

    // Add to Cart
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const productId = this.dataset.productId;
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('.product-name').textContent;
            const productDesc = productCard.querySelector('.product-desc').textContent;
            const productImage = productCard.querySelector('img').src;
            const priceCurrent = productCard.querySelector('.price-current').textContent.replace(/Rp\s?|[.]/g, '');
            const price = parseInt(priceCurrent);

            if (!isLoggedIn()) {
                window.location.href = 'login.html';
                return;
            }

            const user = getCurrentUser();
            const cartKey = `cart_${user.id}`;
            let cart = JSON.parse(localStorage.getItem(cartKey) || '[]');

            const existingItem = cart.find(i => i.id === productId);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ id: productId, name: productName, subtitle: productDesc, image: productImage, price: price, quantity: 1 });
            }

            localStorage.setItem(cartKey, JSON.stringify(cart));
            showNotification('Product added to cart!', 'success');
            updateCartCount();
        });
    });

    // Add to Wishlist
    // addToWishlistBtns.forEach(btn => {
    //     btn.addEventListener('click', function (e) {
    //         e.preventDefault();
    //         const productId = this.dataset.productId;
    //         const productCard = this.closest('.product-card');
    //         const productName = productCard.querySelector('.product-name').textContent;
    //         const productDesc = productCard.querySelector('.product-desc').textContent;
    //         const productImage = productCard.querySelector('img').src;
    //         const priceCurrent = productCard.querySelector('.price-current').textContent.replace(/Rp\s?|[.]/g, '');
    //         const price = parseInt(priceCurrent);

    //         if (!isLoggedIn()) {
    //             window.location.href = 'login.html';
    //             return;
    //         }

    //         const user = getCurrentUser();
    //         const wishlistKey = `wishlist_${user.id}`;
    //         let wishlist = JSON.parse(localStorage.getItem(wishlistKey) || '[]');

    //         const exists = wishlist.find(i => i.id === productId);
    //         if (!exists) {
    //             wishlist.push({ id: productId, name: productName, subtitle: productDesc, image: productImage, price: price });
    //             localStorage.setItem(wishlistKey, JSON.stringify(wishlist));
    //             showNotification('Product added to wishlist!', 'success');
    //             updateWishlistCount();

    //             // ✔ تغيير الأيقونة للأحمر
    //             const icon = this.querySelector('i');
    //             icon.classList.remove('far');
    //             icon.classList.add('fas', 'text-danger');

    //         } else {
    //             showNotification('Product already in wishlist!', 'error');
    //         }
    //     });
    // });
    // Add / Remove Wishlist (Toggle)
    addToWishlistBtns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();

            const productId = this.dataset.productId;
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('.product-name').textContent;
            const productDesc = productCard.querySelector('.product-desc').textContent;
            const productImage = productCard.querySelector('img').src;
            const priceCurrent = productCard.querySelector('.price-current').textContent.replace(/Rp\s?|[.]/g, '');
            const price = parseInt(priceCurrent);

            if (!isLoggedIn()) {
                window.location.href = 'login.html';
                return;
            }

            const user = getCurrentUser();
            const wishlistKey = `wishlist_${user.id}`;
            let wishlist = JSON.parse(localStorage.getItem(wishlistKey) || '[]');

            const exists = wishlist.find(i => i.id === productId);
            const icon = this.querySelector('i');

            if (!exists) {
                // إضافة للمفضلة
                wishlist.push({
                    id: productId,
                    name: productName,
                    subtitle: productDesc,
                    image: productImage,
                    price: price
                });

                localStorage.setItem(wishlistKey, JSON.stringify(wishlist));
                showNotification('Product added to wishlist!', 'success');
                icon.classList.remove('far');
                icon.classList.add('fas', 'text-danger');

            } else {
                // حذف من المفضلة
                wishlist = wishlist.filter(i => i.id !== productId);
                localStorage.setItem(wishlistKey, JSON.stringify(wishlist));
                showNotification('Product removed from wishlist!', 'error');
                icon.classList.remove('fas', 'text-danger');
                icon.classList.add('far');
            }

            updateWishlistCount();
            updateWishlistIcons
        });
    });


    // Update counters
    function updateCartCount() {
        if (!isLoggedIn()) return;
        const user = getCurrentUser();
        const cart = JSON.parse(localStorage.getItem(`cart_${user.id}`) || '[]');
        const cartCountElem = document.getElementById('cartCount');
        if (cartCountElem) {
            const count = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCountElem.textContent = count;
            cartCountElem.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    function updateWishlistCount() {
        if (!isLoggedIn()) return;
        const user = getCurrentUser();
        const wishlist = JSON.parse(localStorage.getItem(`wishlist_${user.id}`) || '[]');
        const wishlistCountElem = document.getElementById('wishlistCount');
        if (wishlistCountElem) {
            wishlistCountElem.textContent = wishlist.length;
            wishlistCountElem.style.display = wishlist.length > 0 ? 'flex' : 'none';
        }
    }

    function updateWishlistIcons() {
        if (!isLoggedIn()) return;

        const user = getCurrentUser();
        const wishlist = JSON.parse(localStorage.getItem(`wishlist_${user.id}`) || '[]');

        document.querySelectorAll('.add-to-wishlist-btn').forEach(btn => {
            const id = btn.dataset.productId;
            const icon = btn.querySelector('i');

            const exists = wishlist.find(item => item.id == id);

            if (exists) {
                icon.classList.remove('far');
                icon.classList.add('fas', 'text-danger');
            } else {
                icon.classList.remove('fas', 'text-danger');
                icon.classList.add('far');
            }
        });
    }



    // Check login functions (from auth.js)
    function isLoggedIn() {
        return localStorage.getItem('currentUser') !== null;
    }
    function getCurrentUser() {
        const userStr = localStorage.getItem('currentUser');
        return userStr ? JSON.parse(userStr) : null;
    }

    // Show notification function (from auth.js)
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

    // Initialize counts on load
    updateCartCount();
    updateWishlistCount();
    updateWishlistIcons();

});
