// Authentication JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin');
    
    // Toggle between login and register forms
    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', function(e) {
            e.preventDefault();
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
        });
    }
    
    if (showLoginLink) {
        showLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
            registerForm.style.display = 'none';
            loginForm.style.display = 'block';
        });
    }
    
    // Handle Registration
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('registerConfirmPassword').value;
            
            // Validate passwords match
            if (password !== confirmPassword) {
                showNotification('Passwords do not match!', 'error');
                return;
            }
            
            // Check if user already exists
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const userExists = users.find(u => u.email === email);
            
            if (userExists) {
                showNotification('User already exists! Please login.', 'error');
                return;
            }
            
            // Create new user
            const newUser = {
                id: Date.now().toString(),
                name: name,
                email: email,
                password: password // In production, this should be hashed
            };
            
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            showNotification('Registration successful! Please login.', 'success');
            
            // Switch to login form
            registerForm.style.display = 'none';
            loginForm.style.display = 'block';
            registerForm.reset();
        });
    }
    
    // Handle Login
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            // Get users from localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                // Store current user
                localStorage.setItem('currentUser', JSON.stringify(user));
                showNotification('Login successful!', 'success');
                
                // Redirect to home page after 1 second
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            } else {
                showNotification('Invalid email or password!', 'error');
            }
        });
    }
    
    // Update user icon if logged in
    updateUserIcon();
});

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('currentUser') !== null;
}

// Get current user
function getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    showNotification('Logged out successfully!', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
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