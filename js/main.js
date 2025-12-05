// ===== ОСНОВНЫЕ ФУНКЦИИ ДЛЯ ВСЕХ СТРАНИЦ =====

// 1. Текущий год в футере
function updateCurrentYear() {
    const yearElements = document.querySelectorAll('#currentYear, [id*="year"]');
    const currentYear = new Date().getFullYear();
    
    yearElements.forEach(element => {
        if (element.id.includes('year')) {
            element.textContent = currentYear;
        }
    });
}

// 2. Мобильное меню
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (!menuToggle || !mainNav) return;
    
    menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        const isActive = mainNav.classList.contains('active');
        
        // Меняем иконку гамбургера на крестик и обратно
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
    
    // Закрываем меню при клике вне его области
    document.addEventListener('click', (e) => {
        if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
            mainNav.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.style.overflow = '';
        }
    });
}

// 3. Плавный скролл к якорям
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Пропускаем якоря только с #
            if (href === '#') return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                
                // Закрываем мобильное меню если открыто
                const mainNav = document.querySelector('.main-nav');
                const menuToggle = document.getElementById('menuToggle');
                if (mainNav && mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    if (menuToggle) menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                    document.body.style.overflow = '';
                }
                
                // Плавный скролл
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 4. Анимация при прокрутке
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.benefit-card, .service-card, .team-card, .review-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
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

// 5. Форма записи
function initAppointmentForm() {
    const form = document.getElementById('appointmentForm');
    if (!form) return;
    
    // Валидация телефона
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
    
    // Заполнение даты (сегодня + 1 день как минимальная)
    const dateInput = form.querySelector('input[type="date"]');
    if (dateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.min = tomorrow.toISOString().split('T')[0];
        
        // Предлагаем дату через 3 дня
        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() + 3);
        dateInput.value = defaultDate.toISOString().split('T')[0];
    }
    
    // Обработка отправки формы
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Простая валидация
        const name = form.querySelector('#name');
        const phone = form.querySelector('#phone');
        const agreement = form.querySelector('#agreement');
        
        let isValid = true;
        let errorMessage = '';
        
        if (!name || !name.value.trim()) {
            isValid = false;
            errorMessage = 'Пожалуйста, введите ваше имя';
            name?.classList.add('error');
        } else {
            name?.classList.remove('error');
        }
        
        if (!phone || phone.value.replace(/\D/g, '').length < 11) {
            isValid = false;
            errorMessage = 'Пожалуйста, введите корректный номер телефона';
            phone?.classList.add('error');
        } else {
            phone?.classList.remove('error');
        }
        
        if (!agreement || !agreement.checked) {
            isValid = false;
            errorMessage = 'Необходимо согласие на обработку данных';
            agreement?.classList.add('error');
        } else {
            agreement?.classList.remove('error');
        }
        
        if (!isValid) {
            showNotification(errorMessage, 'error');
            return;
        }
        
        // Собираем данные формы
        const formData = {
            name: name?.value,
            phone: phone?.value,
            email: form.querySelector('#email')?.value || '',
            service: form.querySelector('#service')?.value || '',
            doctor: form.querySelector('#doctor')?.value || '',
            date: form.querySelector('#date')?.value || '',
            message: form.querySelector('#message')?.value || '',
            timestamp: new Date().toISOString()
        };
        
        // Имитация отправки (в реальном проекте здесь будет AJAX запрос)
        console.log('Форма отправлена:', formData);
        
        // Показываем сообщение об успехе
        showNotification('Ваша заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.', 'success');
        
        // Сбрасываем форму
        form.reset();
        
        // Возвращаем стандартную дату
        if (dateInput) {
            const defaultDate = new Date();
            defaultDate.setDate(defaultDate.getDate() + 3);
            dateInput.value = defaultDate.toISOString().split('T')[0];
        }
    });
}

// 6. Уведомления
function showNotification(message, type = 'info') {
    // Удаляем предыдущие уведомления
    const oldNotifications = document.querySelectorAll('.notification');
    oldNotifications.forEach(n => n.remove());
    
    // Создаем новое уведомление
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
    
    document.body.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Закрытие по кнопке
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Автозакрытие через 5 секунд
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// 7. Табы на странице услуг
function initServiceTabs() {
    const tabs = document.querySelectorAll('.category-tab');
    const sections = document.querySelectorAll('.service-detail');
    
    if (tabs.length === 0 || sections.length === 0) return;
    
    // Функция для активации таба
    function activateTab(tabId) {
        // Обновляем URL hash без скролла
        history.pushState(null, null, `#${tabId}`);
        
        // Обновляем активные классы
        tabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('href') === `#${tabId}`) {
                tab.classList.add('active');
            }
        });
        
        // Показываем нужную секцию
        sections.forEach(section => {
            section.classList.remove('active-section');
            if (section.id === tabId) {
                section.classList.add('active-section');
                
                // Добавляем анимацию появления
                section.style.animation = 'fadeIn 0.5s ease';
                setTimeout(() => {
                    section.style.animation = '';
                }, 500);
            }
        });
    }
    
    // Обработка кликов по табам
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = tab.getAttribute('href').substring(1);
            activateTab(targetId);
        });
    });
    
    // Активация таба из URL при загрузке
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        activateTab(hash);
    } else {
        // Активируем первый таб по умолчанию
        const firstTab = tabs[0];
        if (firstTab) {
            const firstTabId = firstTab.getAttribute('href').substring(1);
            activateTab(firstTabId);
        }
    }
}

// 8. Аккордеон FAQ
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length === 0) return;
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (!question || !answer) return;
        
        // Закрываем все ответы кроме первого
        const isFirst = item === faqItems[0];
        if (!isFirst) {
            answer.style.display = 'none';
        }
        
        question.addEventListener('click', () => {
            const isOpen = answer.style.display === 'block';
            
            // Закрываем все другие ответы
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    if (otherAnswer) {
                        otherAnswer.style.display = 'none';
                        otherAnswer.style.maxHeight = null;
                        otherItem.classList.remove('active');
                    }
                }
            });
            
            // Открываем/закрываем текущий ответ
            if (isOpen) {
                answer.style.display = 'none';
                answer.style.maxHeight = null;
                item.classList.remove('active');
            } else {
                answer.style.display = 'block';
                answer.style.maxHeight = answer.scrollHeight + 'px';
                item.classList.add('active');
            }
        });
    });
}

// 9. Слайдер отзывов
function initReviewsSlider() {
    const sliderContainer = document.querySelector('.reviews-slider');
    if (!sliderContainer || !sliderContainer.children.length > 1) return;
    
    const reviews = Array.from(sliderContainer.children);
    let currentIndex = 0;
    const totalReviews = reviews.length;
    
    // Создаем навигацию если нужно
    if (totalReviews > 1) {
        const navContainer = document.createElement('div');
        navContainer.className = 'reviews-nav';
        
        const prevBtn = document.createElement('button');
        prevBtn.className = 'review-nav-btn prev';
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        
        const nextBtn = document.createElement('button');
        nextBtn.className = 'review-nav-btn next';
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'review-dots';
        
        reviews.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = `review-dot ${index === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
        
        navContainer.appendChild(prevBtn);
        navContainer.appendChild(dotsContainer);
        navContainer.appendChild(nextBtn);
        sliderContainer.parentNode.appendChild(navContainer);
        
        // Функция для перехода к слайду
        function goToSlide(index) {
            currentIndex = (index + totalReviews) % totalReviews;
            
            // Обновляем активный слайд
            reviews.forEach((review, i) => {
                review.style.display = i === currentIndex ? 'block' : 'none';
                review.style.animation = 'fadeIn 0.5s ease';
            });
            
            // Обновляем активную точку
            document.querySelectorAll('.review-dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
            
            // Сбрасываем анимацию
            setTimeout(() => {
                reviews[currentIndex].style.animation = '';
            }, 500);
        }
        
        // Обработчики кнопок
        prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
        nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
        
        // Автопрокрутка
        let autoSlideInterval = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 5000);
        
        // Остановка автопрокрутки при наведении
        sliderContainer.addEventListener('mouseenter', () => {
            clearInterval(autoSlideInterval);
        });
        
        sliderContainer.addEventListener('mouseleave', () => {
            autoSlideInterval = setInterval(() => {
                goToSlide(currentIndex + 1);
            }, 5000);
        });
        
        // Показываем только первый слайд
        reviews.forEach((review, index) => {
            review.style.display = index === 0 ? 'block' : 'none';
        });
    }
}

// 10. Подсветка активного раздела при скролле
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
    
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

// 11. Ленивая загрузка изображений
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// 12. Обратный отсчет для акций
function initCountdownTimer() {
    const countdownElement = document.querySelector('.countdown-timer');
    if (!countdownElement) return;
    
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7); // Акция на 7 дней
    
    function updateCountdown() {
        const now = new Date();
        const difference = targetDate - now;
        
        if (difference <= 0) {
            countdownElement.innerHTML = '<span>Акция завершена</span>';
            return;
        }
        
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        countdownElement.innerHTML = `
            <div class="countdown-item">
                <span class="countdown-value">${days}</span>
                <span class="countdown-label">дней</span>
            </div>
            <div class="countdown-item">
                <span class="countdown-value">${hours}</span>
                <span class="countdown-label">часов</span>
            </div>
            <div class="countdown-item">
                <span class="countdown-value">${minutes}</span>
                <span class="countdown-label">минут</span>
            </div>
            <div class="countdown-item">
                <span class="countdown-value">${seconds}</span>
                <span class="countdown-label">секунд</span>
            </div>
        `;
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ===== ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('Клиника "Колибри" — сайт загружен');
    
    // Инициализация всех функций
    updateCurrentYear();
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initAppointmentForm();
    initServiceTabs();
    initFAQAccordion();
    initReviewsSlider();
    initScrollSpy();
    initLazyLoading();
    initCountdownTimer();
    
    // Добавляем стили для уведомлений
    const notificationStyles = document.createElement('style');
    notificationStyles.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.15);
            padding: 1rem 1.5rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
            max-width: 400px;
            transform: translateX(150%);
            transition: transform 0.3s ease;
            z-index: 9999;
            border-left: 4px solid #4a6fa5;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification-success {
            border-left-color: #50c878;
        }
        
        .notification-error {
            border-left-color: #ff4757;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            flex: 1;
        }
        
        .notification-content i {
            font-size: 1.2rem;
        }
        
        .notification-success .notification-content i {
            color: #50c878;
        }
        
        .notification-error .notification-content i {
            color: #ff4757;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: #7f8c8d;
            cursor: pointer;
            font-size: 1rem;
            padding: 0.25rem;
            transition: color 0.2s;
        }
        
        .notification-close:hover {
            color: #2c3e50;
        }
        
        /* Стили для анимаций при скролле */
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
        
        /* Стили для ошибок в форме */
        input.error, select.error, textarea.error {
            border-color: #ff4757 !important;
            background-color: #fff5f5;
        }
        
        .form-agreement.error label {
            color: #ff4757;
        }
        
        /* Стили для слайдера отзывов */
        .reviews-nav {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1.5rem;
            margin-top: 2rem;
        }
        
        .review-nav-btn {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #4a6fa5;
            color: white;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s;
        }
        
        .review-nav-btn:hover {
            background: #3a5984;
            transform: scale(1.1);
        }
        
        .review-dots {
            display: flex;
            gap: 0.5rem;
        }
        
        .review-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #ddd;
            border: none;
            cursor: pointer;
            transition: all 0.3s;
            padding: 0;
        }
        
        .review-dot.active {
            background: #4a6fa5;
            transform: scale(1.2);
        }
        
        /* Стили для таймера */
        .countdown-timer {
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin-top: 1rem;
        }
        
        .countdown-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            background: #f8f9fa;
            padding: 0.5rem 1rem;
            border-radius: 8px;
            min-width: 60px;
        }
        
        .countdown-value {
            font-size: 1.5rem;
            font-weight: 700;
            color: #4a6fa5;
        }
        
        .countdown-label {
            font-size: 0.75rem;
            color: #7f8c8d;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
    `;
    document.head.appendChild(notificationStyles);
});

// ===== ОБРАБОТКА ОШИБОК =====
window.addEventListener('error', function(e) {
    console.error('Произошла ошибка:', e.error);
    // Можно отправить ошибку на сервер для анализа
});

// ===== ОБРАБОТКА ОФФЛАЙН РЕЖИМА =====
window.addEventListener('online', function() {
    showNotification('Соединение восстановлено', 'success');
});

window.addEventListener('offline', function() {
    showNotification('Отсутствует интернет-соединение', 'error');
});
