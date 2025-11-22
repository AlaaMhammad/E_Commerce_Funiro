document.addEventListener('DOMContentLoaded', function() {
    const productsContainer = document.querySelector('.product-grid');
    const products = Array.from(productsContainer.children);
    const showCountInput = document.getElementById('show-count');
    const paginationContainer = document.querySelector('.custom-pagination .pagination');
    const showingText = document.querySelector('.filter-bar .text-muted');

    let currentPage = 1;
    let productsPerPage = parseInt(showCountInput.value) || 16;

    function updateShowingText(filteredProducts) {
        const start = (filteredProducts.length === 0) ? 0 : (currentPage - 1) * productsPerPage + 1;
        const end = Math.min(currentPage * productsPerPage, filteredProducts.length);
        showingText.textContent = `Showing ${start}-${end} of ${filteredProducts.length} results`;
    }

    function displayProducts() {
        // في البداية نعتبر كل المنتجات متاحة
        const filteredProducts = products;

        const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
        if(currentPage > totalPages) currentPage = totalPages || 1;

        // اخفاء كل المنتجات
        products.forEach(p => p.style.display = 'none');

        // عرض المنتجات المناسبة للصفحة الحالية
        const start = (currentPage - 1) * productsPerPage;
        const end = start + productsPerPage;
        filteredProducts.slice(start, end).forEach(p => p.style.display = 'block');

        // تحديث النص
        updateShowingText(filteredProducts);

        // إعادة إنشاء pagination
        renderPagination(totalPages);
    }

    function renderPagination(totalPages) {
        paginationContainer.innerHTML = '';

        for(let i = 1; i <= totalPages; i++){
            const li = document.createElement('li');
            li.classList.add('page-item');
            if(i === currentPage) li.classList.add('active');

            const a = document.createElement('a');
            a.classList.add('page-link');
            a.href = '#';
            a.textContent = i;
            a.addEventListener('click', e => {
                e.preventDefault();
                currentPage = i;
                displayProducts();
            });

            li.appendChild(a);
            paginationContainer.appendChild(li);
        }

        // زر Next
        const nextLi = document.createElement('li');
        nextLi.classList.add('page-item');
        const nextA = document.createElement('a');
        nextA.classList.add('page-link');
        nextA.href = '#';
        nextA.textContent = 'Next';
        nextA.addEventListener('click', e => {
            e.preventDefault();
            if(currentPage < totalPages){
                currentPage++;
                displayProducts();
            }
        });
        nextLi.appendChild(nextA);
        paginationContainer.appendChild(nextLi);
    }

    // عند تغيير Show count
    showCountInput.addEventListener('input', () => {
        productsPerPage = parseInt(showCountInput.value) || 1;
        currentPage = 1;
        displayProducts();
    });

    // أول عرض
    displayProducts();
});
