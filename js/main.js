// Загрузка header и footer на всех страницах
document.addEventListener('DOMContentLoaded', function() {
    // Загружаем header
    fetch('/partials/header.html')
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML('afterbegin', data);
            initNavigation();
        })
        .catch(error => console.error('Error loading header:', error));
    
    // Загружаем footer
    fetch('/partials/footer.html')
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML('beforeend', data);
            initFooter();
        })
        .catch(error => console.error('Error loading footer:', error));
});

// Инициализация навигации
function initNavigation() {
    // Мобильное меню
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileToggle && mainNav) {
        mobileToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            mobileToggle.classList.toggle('active');
            
            // Анимация гамбургера
            const spans = mobileToggle.querySelectorAll('span');
            if (mainNav.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Закрытие меню при клике вне его
        document.addEventListener('click', function(event) {
            if (!mainNav.contains(event.target) && !mobileToggle.contains(event.target)) {
                mainNav.classList.remove('active');
                mobileToggle.classList.remove('active');
                const spans = mobileToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
    
    // Dropdown меню для мобильных
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const parent = this.parentElement;
                parent.classList.toggle('active');
            }
        });
    });
    
    // Mega menu для мобильных
    const megaMenuToggles = document.querySelectorAll('.mega-menu .dropdown-toggle');
    megaMenuToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const parent = this.parentElement;
                parent.classList.toggle('active');
            }
        });
    });
    
    // Активный пункт меню
    const currentPage = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (currentPage === linkPath || 
            (currentPage.includes(linkPath) && linkPath !== '/')) {
            link.classList.add('active');
        }
    });
}

// Инициализация футера
function initFooter() {
    // Обновление года в футере
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Общие функции
function initAppointmentForm() {
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Простая валидация
            const phone = this.querySelector('input[type="tel"]');
            if (phone && !phone.value.match(/^[\d\s\-\+\(\)]+$/)) {
                showNotification('Пожалуйста, введите корректный номер телефона', 'error');
                return;
            }
            
            // Здесь обычно отправка на сервер
            showNotification('Спасибо! Ваша заявка принята. Мы свяжемся с вами в ближайшее время.', 'success');
            appointmentForm.reset();
        });
    }
}

// Уведомления
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    document.body.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Закрытие по клику
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
    
    // Автозакрытие
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initFooter();
    initAppointmentForm();
    
    // Плавная прокрутка
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#') && href.length > 1) {
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
});
