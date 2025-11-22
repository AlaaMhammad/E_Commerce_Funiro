
// Main JavaScript file
document.addEventListener('DOMContentLoaded', function () {
    console.log('Funiro Furniture Website Loaded!');

    // -------------------------------------------------------------------
    // وظيفة معالجة رابط "Shop" (القسم المضاف بناءً على طلبك)
    // ملاحظة: يجب أن يكون للرابط في HTML المعرف (ID) التالي: id="shopNavLink"
    // -------------------------------------------------------------------
    const shopNavLink = document.getElementById('shopNavLink');

    if (shopNavLink) {
        shopNavLink.addEventListener('click', function (e) {
            e.preventDefault(); // منع الانتقال المباشر للرابط

            // نتحقق مما إذا كانت الدالة isLoggedIn() موجودة قبل استدعائها
            if (typeof isLoggedIn === 'function' && !isLoggedIn()) {
                // إذا لم يكن مسجل دخول، اذهب لصفحة تسجيل الدخول
                window.location.href = 'login.html';
            } else {
                // إذا كان مسجل دخول، اذهب لصفحة المتجر الرئيسية
                window.location.href = 'shop.html';
            }
        });
    }
    // -------------------------------------------------------------------


    // روابط الـ Navbar
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // أيقونات الهيدر
    const iconLinks = document.querySelectorAll('.icon-link');
    iconLinks.forEach(icon => {
        icon.addEventListener('click', function () {
            // إزالة active من كل الأيقونات
            iconLinks.forEach(i => i.querySelector('i').classList.remove('active'));
            // إضافة active للأيقونة اللي ضغطت عليها
            const innerIcon = this.querySelector('i');
            if (innerIcon) innerIcon.classList.add('active');
        });
    });

    const scrollTopBtn = document.getElementById('scrollTop');

    // عند التمرير
    window.addEventListener('scroll', function () {
        if (window.scrollY > 300) { // يظهر بعد 300px
            scrollTopBtn.style.display = 'block';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    });

    // عند الضغط على الزر
    scrollTopBtn.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });


    // ===== Smooth Scrolling =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ===== Scroll Animations =====

    // ===== Product Card Hover Effects =====
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        const overlay = card.querySelector('.product-overlay');

        card.addEventListener('mouseenter', function () {
            if (overlay && !overlay.classList.contains('active')) {
                overlay.style.opacity = '1';
            }
        });

        card.addEventListener('mouseleave', function () {
            if (overlay && !overlay.classList.contains('active')) {
                overlay.style.opacity = '0';
            }
        });
    });

    // ===== Add to Cart Functionality =====
    const addToCartButtons = document.querySelectorAll('.btn-add-cart');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();

            // Add animation
            this.innerHTML = '<i class="fas fa-check"></i> Added!';
            this.style.background = '#2EC1AC';

            // Reset after 2 seconds
            setTimeout(() => {
                this.innerHTML = 'Add to cart';
                this.style.background = '';
            }, 2000);

            // Show notification
            showNotification('Product added to cart!');
        });
    });

    // ===== Share and Like Buttons =====
    const actionButtons = document.querySelectorAll('.action-btn');

    actionButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const icon = this.querySelector('i');

            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                this.style.color = '#E89F71';
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                this.style.color = '';
            }
        });
    });

    // ===== Hero Carousel =====
    let currentSlide = 0;
    const carouselDots = document.querySelectorAll('.hero-carousel .dot');
    const heroImages = [
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
        'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800',
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800',
        'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800'
    ];

    function updateHeroCarousel(index) {
        const heroImageContainer = document.querySelector('.hero-image-container');
        if (heroImageContainer) {
            heroImageContainer.style.background = `url('${heroImages[index]}') center/cover`;

            carouselDots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        }
    }

    // Carousel navigation buttons
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');

    if (prevBtn) {
        prevBtn.addEventListener('click', function () {
            currentSlide = (currentSlide - 1 + heroImages.length) % heroImages.length;
            updateHeroCarousel(currentSlide);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function () {
            currentSlide = (currentSlide + 1) % heroImages.length;
            updateHeroCarousel(currentSlide);
        });
    }

    // Carousel dots click
    carouselDots.forEach((dot, index) => {
        dot.addEventListener('click', function () {
            currentSlide = index;
            updateHeroCarousel(currentSlide);
        });
    });

    // Auto-play carousel
    let carouselInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % heroImages.length;
        updateHeroCarousel(currentSlide);
    }, 5000);

    // Pause on hover
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroSection.addEventListener('mouseenter', () => {
            clearInterval(carouselInterval);
        });

        heroSection.addEventListener('mouseleave', () => {
            carouselInterval = setInterval(() => {
                currentSlide = (currentSlide + 1) % heroImages.length;
                updateHeroCarousel(currentSlide);
            }, 5000);
        });
    }

    // ===== Gallery Slider =====
    const gallerySlider = document.querySelector('.gallery-slider');
    const galleryDots = document.querySelectorAll('.rooms-section .gallery-dots .dot');

    if (gallerySlider) {
        let isDown = false;
        let startX;
        let scrollLeft;

        gallerySlider.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - gallerySlider.offsetLeft;
            scrollLeft = gallerySlider.scrollLeft;
            gallerySlider.style.cursor = 'grabbing';
        });

        gallerySlider.addEventListener('mouseleave', () => {
            isDown = false;
            gallerySlider.style.cursor = 'grab';
        });

        gallerySlider.addEventListener('mouseup', () => {
            isDown = false;
            gallerySlider.style.cursor = 'grab';
        });

        gallerySlider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - gallerySlider.offsetLeft;
            const walk = (x - startX) * 2;
            gallerySlider.scrollLeft = scrollLeft - walk;
        });

        // Update dots based on scroll position
        gallerySlider.addEventListener('scroll', () => {
            const scrollPercentage = (gallerySlider.scrollLeft / (gallerySlider.scrollWidth - gallerySlider.clientWidth)) * 100;
            const activeIndex = Math.round((scrollPercentage / 100) * (galleryDots.length - 1));

            galleryDots.forEach((dot, index) => {
                dot.classList.toggle('active', index === activeIndex);
            });
        });
    }

    // ===== Newsletter Form =====
    const newsletterForm = document.querySelector('.newsletter-form');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value;

            if (validateEmail(email)) {
                showNotification('Thank you for subscribing!');
                emailInput.value = '';
            } else {
                showNotification('Please enter a valid email address.', 'error');
            }
        });
    }

    // ===== Search Functionality =====
    const searchInput = document.querySelector('.search-box input');

    if (searchInput) {
        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const searchTerm = this.value.trim();
                if (searchTerm) {
                    showNotification(`Searching for: ${searchTerm}`);
                    // Here you would implement actual search functionality
                }
            }
        });
    }

    // ===== Show More Products =====
    const showMoreBtn = document.querySelector('.btn-show-more');

    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', function (e) {
            e.preventDefault();
            showNotification('Loading more products...');
            // Here you would implement loading more products
        });
    }

    // ===== Navbar Scroll Effect =====
    let lastScroll = 0;
    const header = document.querySelector('.header');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
        }

        lastScroll = currentScroll;
    });

    // ===== Mobile Menu Toggle =====
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', function () {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
        });
    }

    // ===== Utility Functions =====
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        // Style the notification
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

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // ===== Lazy Loading Images =====
    const lazyImages = document.querySelectorAll('.product-image, .tip-image, .gallery-grid-item');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.5s ease';

                setTimeout(() => {
                    img.style.opacity = '1';
                }, 100);

                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));

    // ===== Parallax Effect =====
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-image-container');

        parallaxElements.forEach(el => {
            const speed = 0.5;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    console.log('All interactive features initialized!');

    document.addEventListener('DOMContentLoaded', function () {
        const slider = document.querySelector('.gallery-slider');
        const dots = document.querySelectorAll('.gallery-dots .dot');
        const items = document.querySelectorAll('.gallery-item');

        let currentIndex = 0;

        function updateSlider() {
            const offset = -items[currentIndex].offsetLeft;
            slider.style.transform = `translateX(${offset}px)`;
            dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
        }

        // Pagination click
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                currentIndex = parseInt(dot.dataset.index);
                updateSlider();
            });
        });

        // Optional: Auto-play
        setInterval(() => {
            currentIndex = (currentIndex + 1) % items.length;
            updateSlider();
        }, 5000);
    });

    // gallery

    // ===== Gallery Carousel JS =====

    // المتغيرات الجديدة
    const featuredImage_b = document.querySelector('.featured-image_b');
    const roomNumber_b = document.querySelector('.room-number_b');
    const roomType_b = document.querySelector('.room-type_b');
    const roomName_b = document.querySelector('.room-name_b');
    const carouselItems_b = document.querySelectorAll('.carousel-item_b');
    const indicators_b = document.querySelectorAll('.indicator_b');
    const nextBtn_b = document.getElementById('nextBtn_b');
    const sideCarousel_b = document.querySelector('.side-carousel_b');
    const exploreBtn_b = document.querySelector('.btn-explore_b');

    // بيانات الغرف
    const rooms_b = [
        { image: './img/galary/Img1.svg', number: '01', type: 'Bed Room', title: 'Inner Peace' },
        { image: './img/galary/Img2.svg', number: '02', type: 'Living Room', title: 'Modern Comfort' },
        { image: './img/galary/Img3.svg', number: '03', type: 'Kitchen', title: 'Cozy Corner' },
        { image: './img/furniture/img_pag.svg', number: '04', type: 'Table', title: 'Table Corner' }
    ];

    let currentSlide_b = 0;
    const totalSlides_b = carouselItems_b.length;

    // تحديث الكاروسيل لإظهار الشريحة المحددة
    function showSlide_b(index) {
        // إزالة active من كل العناصر
        carouselItems_b.forEach(item => item.classList.remove('active_b'));
        indicators_b.forEach(ind => ind.classList.remove('active_b'));

        // إضافة active للشريحة الحالية
        carouselItems_b[index].classList.add('active_b');
        indicators_b[index].classList.add('active_b');

        // تحديث الصورة الرئيسية
        const room = rooms_b[index] || rooms_b[0];
        featuredImage_b.style.opacity = '0';
        setTimeout(() => {
            featuredImage_b.src = room.image;
            roomNumber_b.textContent = room.number;
            roomType_b.textContent = room.type;
            roomName_b.textContent = room.title;
            featuredImage_b.style.opacity = '1';
        }, 200);

        currentSlide_b = index;
    }

    // زر التالي
    nextBtn_b.addEventListener('click', () => {
        const nextSlide = (currentSlide_b + 1) % totalSlides_b;
        showSlide_b(nextSlide);
    });

    // النقر على المؤشرات
    indicators_b.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide_b(index);
        });
    });

    // التشغيل التلقائي كل 5 ثواني
    let autoPlay_b = setInterval(() => {
        const nextSlide = (currentSlide_b + 1) % totalSlides_b;
        showSlide_b(nextSlide);
    }, 5000);

    // إيقاف التشغيل التلقائي عند المرور على الكاروسيل
    sideCarousel_b.addEventListener('mouseenter', () => clearInterval(autoPlay_b));
    sideCarousel_b.addEventListener('mouseleave', () => {
        autoPlay_b = setInterval(() => {
            const nextSlide = (currentSlide_b + 1) % totalSlides_b;
            showSlide_b(nextSlide);
        }, 5000);
    });

    // دعم السحب على الموبايل
    let touchStartX_b = 0;
    let touchEndX_b = 0;

    sideCarousel_b.addEventListener('touchstart', e => {
        touchStartX_b = e.changedTouches[0].screenX;
    });

    sideCarousel_b.addEventListener('touchend', e => {
        touchEndX_b = e.changedTouches[0].screenX;
        handleSwipe_b();
    });

    function handleSwipe_b() {
        const diff = touchStartX_b - touchEndX_b;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                // Swipe left - التالي
                const nextSlide = (currentSlide_b + 1) % totalSlides_b;
                showSlide_b(nextSlide);
            } else {
                // Swipe right - السابق
                const prevSlide = (currentSlide_b - 1 + totalSlides_b) % totalSlides_b;
                showSlide_b(prevSlide);
            }
        }
    }

    // دعم مفاتيح الأسهم
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            const nextSlide = (currentSlide_b + 1) % totalSlides_b;
            showSlide_b(nextSlide);
        } else if (e.key === 'ArrowLeft') {
            const prevSlide = (currentSlide_b - 1 + totalSlides_b) % totalSlides_b;
            showSlide_b(prevSlide);
        }
    });

    // زر استكشاف المزيد
    exploreBtn_b.addEventListener('click', () => {
        document.querySelector('.gallery-right_b').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    // تهيئة أول شريحة
    showSlide_b(0);


});