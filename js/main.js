// ===== ОСНОВНЫЕ ФУНКЦИИ ДЛЯ САЙТА =====

// 1. Текущий год в футере
function updateCurrentYear() {
    const yearElements = document.querySelectorAll('#currentYear');
    const currentYear = new Date().getFullYear();
    
    yearElements.forEach(element => {
        element.textContent = currentYear;
    });
}

// 2. Мобильное меню
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (!menuToggle || !mainNav) return;
    
    menuToggle.addEventListener('click', () => {
        const isActive = mainNav.classList.toggle('active');
        
        // Меняем иконку
        if (isActive) {
            menuToggle.innerHTML = '<i class="fas fa-times"></i>';
            document.body.style.overflow = 'hidden'; // Блокируем скролл
        } else {
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.style.overflow = '';
        }
    });
    
    // Закрываем меню при клике на ссылку
    const navLinks = mainNav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.style.overflow = '';
        });
    });
    
    // Закрываем меню при клике вне его
    document.addEventListener('click', (e) => {
        if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
            mainNav.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.style.overflow = '';
        }
    });
}

// 3. Плавный скролл
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#' || href.startsWith('#')) {
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    
                    // Закрываем мобильное меню если открыто
                    const mainNav = document.querySelector('.main-nav.active');
                    const menuToggle = document.getElementById('menuToggle');
                    if (mainNav) {
                        mainNav.classList.remove('active');
                        if (menuToggle) menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                        document.body.style.overflow = '';
                    }
                    
                    // Плавный скролл
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// 4. Форма записи
function initAppointmentForm() {
    const form = document.getElementById('appointmentForm');
    if (!form) return;
    
    // Маска для телефона
    const phoneInput = form.querySelector('input[type="tel"]');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 0) {
                if (value[0] !== '7' && value[0] !== '8') {
                    value = '7' + value;
                }
                
                let formattedValue = '+7';
                if (value.length > 1) formattedValue += ' (' + value.substring(1, 4);
                if (value.length > 4) formattedValue += ') ' + value.substring(4, 7);
                if (value.length > 7) formattedValue += '-' + value.substring(7, 9);
                if (value.length > 9) formattedValue += '-' + value.substring(9, 11);
                
                e.target.value = formattedValue;
            }
        });
    }
    
    // Обработка отправки формы
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Валидация
        const inputs = form.querySelectorAll('input[required], select[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('error');
                
                // Анимация ошибки
                input.style.animation = 'shake 0.5s';
                setTimeout(() => {
                    input.style.animation = '';
                }, 500);
            } else {
                input.classList.remove('error');
            }
        });
        
        // Проверка телефона
        if (phoneInput && phoneInput.value.replace(/\D/g, '').length < 11) {
            isValid = false;
            phoneInput.classList.add('error');
            
            // Показываем подсказку
            if (!phoneInput.nextElementSibling || !phoneInput.nextElementSibling.classList.contains('error-message')) {
                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'Введите корректный номер телефона';
                errorMsg.style.color = '#ff4757';
                errorMsg.style.fontSize = '0.875rem';
                errorMsg.style.marginTop = '0.25rem';
                phoneInput.parentNode.appendChild(errorMsg);
                
                setTimeout(() => {
                    errorMsg.remove();
                }, 3000);
            }
        }
        
        if (!isValid) {
            // Показываем сообщение об ошибке
            showNotification('Пожалуйста, заполните все обязательные поля корректно', 'error');
            return;
        }
        
        // Собираем данные
        const formData = {
            name: form.querySelector('input[type="text"]')?.value,
            phone: phoneInput?.value,
            specialist: form.querySelector('select')?.value,
            message: form.querySelector('textarea')?.value,
            timestamp: new Date().toISOString()
        };
        
        console.log('Данные формы:', formData);
        
        // Показываем сообщение об успехе
        showNotification('Спасибо! Ваша заявка принята. Мы свяжемся с вами в ближайшее время для подтверждения записи.', 'success');
        
        // Сбрасываем форму
        form.reset();
        
        // Анимация успеха
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Заявка отправлена!';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// 5. Уведомления
function showNotification(message, type = 'success') {
    // Удаляем старые уведомления
    const oldNotifications = document.querySelectorAll('.notification');
    oldNotifications.forEach(n => n.remove());
    
    // Создаем уведомление
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Стили для уведомления
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        padding: '1rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        maxWidth: '400px',
        transform: 'translateX(150%)',
        transition: 'transform 0.3s ease',
        zIndex: '9999',
        borderLeft: '4px solid'
    });
    
    if (type === 'success') {
        notification.style.borderLeftColor = '#4dabf7';
    } else {
        notification.style.borderLeftColor = '#ff4757';
    }
    
    document.body.appendChild(notification);
    
    // Показываем
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Кнопка закрытия
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(150%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Автозакрытие
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(150%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// 6. Анимации при скролле
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.service-category, .diagnostic-item, .prevention-card, .social-service-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                // Для статистики в герое
                if (entry.target.classList.contains('stat')) {
                    animateCounter(entry.target.querySelector('.stat-number'));
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// 7. Анимация счетчиков
function animateCounter(element) {
    if (!element) return;
    
    const target = parseInt(element.textContent.replace('+', ''));
    const duration = 2000; // 2 секунды
    const steps = 60;
    const step = target / steps;
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + '+';
    }, duration / steps);
}

// 8. Подсветка активного пункта меню при скролле
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    if (sections.length === 0 || navLinks.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-100px 0px -100px 0px'
    });
    
    sections.forEach(section => observer.observe(section));
}

// ===== ИНИЦИАЛИЗАЦИЯ =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('Медицинский центр "Колибри" загружен');
    
    // Инициализация всех функций
    updateCurrentYear();
    initMobileMenu();
    initSmoothScroll();
    initAppointmentForm();
    initScrollAnimations();
    initScrollSpy();
    
    // Добавляем стили для анимаций
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .animated {
            animation: fadeInUp 0.6s ease forwards;
        }
        
        .error {
            border-color: #ff4757 !important;
            background-color: #fff5f5 !important;
        }
        
        .nav-link.active {
            color: #4dabf7;
            background: #e7f5ff;
        }
    `;
    document.head.appendChild(style);
});

// ===== ОБРАБОТКА ОШИБОК =====
window.addEventListener('error', function(e) {
    console.error('Ошибка:', e.error);
});

// ===== ОНЛАЙН/ОФФЛАЙН СТАТУС =====
window.addEventListener('online', function() {
    showNotification('Соединение восстановлено', 'success');
});

window.addEventListener('offline', function() {
    showNotification('Отсутствует интернет-соединение. Некоторые функции могут быть недоступны.', 'error');
});
