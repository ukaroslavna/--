// Дождаться загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // Инициализация корзины
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartCount();
    
    // Переключение мобильного меню
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            menuToggle.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // Закрытие меню при клике на ссылку
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }
    
    // Добавление в корзину
    document.querySelectorAll('.btn-cart').forEach(button => {
        button.addEventListener('click', function() {
            const dessertId = this.getAttribute('data-id');
            const dessertName = this.closest('.dessert-info').querySelector('h3').textContent;
            const dessertPrice = this.closest('.dessert-footer').querySelector('.price').textContent;
            
            // Эффект добавления
            this.innerHTML = '<i class="fas fa-check"></i> Добавлено';
            this.style.backgroundColor = '#4CAF50';
            
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-plus"></i> В корзину';
                this.style.backgroundColor = '';
            }, 1500);
            
            // Анимация иконки корзины
            const cartIcon = document.querySelector('.cart-icon i');
            cartIcon.classList.add('pulse-animation');
            setTimeout(() => {
                cartIcon.classList.remove('pulse-animation');
            }, 500);
            
            // Добавление товара в корзину
            addToCart({
                id: dessertId,
                name: dessertName,
                price: parseFloat(dessertPrice.replace(/[^\d.]/g, '')),
                quantity: 1
            });
            
            // Обновление счетчика корзины
            updateCartCount();
        });
    });
    
    // Функция добавления товара в корзину
    function addToCart(item) {
        const existingItem = cart.find(cartItem => cartItem.id === item.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push(item);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    // Функция обновления счетчика корзины
    function updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalItems;
            
            // Анимация обновления
            if (totalItems > 0) {
                cartCount.classList.add('updated');
                setTimeout(() => {
                    cartCount.classList.remove('updated');
                }, 300);
            }
        }
    }
    
    // Валидация форм
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            let isValid = true;
            
            // Проверка обязательных полей
            const requiredFields = this.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#ff4d4d';
                    
                    setTimeout(() => {
                        field.style.borderColor = '';
                    }, 3000);
                }
            });
            
            // Если форма не валидна, предотвращаем отправку
            if (!isValid) {
                e.preventDefault();
                alert('Пожалуйста, заполните все обязательные поля!');
            } else {
                // Показываем сообщение об успешной отправке
                const submitBtn = this.querySelector('button[type="submit"]');
                if (submitBtn) {
                    const originalText = submitBtn.textContent;
                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
                    submitBtn.disabled = true;
                    
                    // В реальном приложении здесь был бы AJAX-запрос
                    setTimeout(() => {
                        submitBtn.innerHTML = '<i class="fas fa-check"></i> Успешно отправлено!';
                        submitBtn.style.backgroundColor = '#4CAF50';
                        
                        setTimeout(() => {
                            submitBtn.textContent = originalText;
                            submitBtn.disabled = false;
                            submitBtn.style.backgroundColor = '';
                        }, 2000);
                    }, 1500);
                    
                    // Для демо предотвращаем реальную отправку
                    e.preventDefault();
                }
            }
        });
    });
    
    // Анимация появления элементов при прокрутке
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Наблюдаем за элементами с анимацией
    document.querySelectorAll('.dessert-card, .feature, .about-text, .about-image, .contact-card').forEach(el => {
        observer.observe(el);
    });
    
    // Плавная прокрутка для якорей
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#' && href.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Инициализация карты (для страницы контактов)
    if (document.getElementById('map')) {
        initMap();
    }
    
    // Загрузка десертов для каталога (если страница каталога)
    if (window.location.pathname.includes('catalog.html')) {
        loadDesserts();
    }
});

// Функция загрузки десертов
function loadDesserts() {
    // В реальном приложении здесь был бы AJAX-запрос к get_desserts.php
    const desserts = [
        {
            id: 1,
            name: "Клубничный торт",
            description: "Нежный бисквит со свежей клубникой и кремом",
            price: 1850,
            image: "images/cake-2.jpg",
            category: "Торты"
        },
        {
            id: 2,
            name: "Набор макарун",
            description: "6 разноцветных макарун с разными начинками",
            price: 650,
            image: "images/macarons-1.jpg",
            category: "Макаруны"
        },
        {
            id: 3,
            name: "Капкейки",
            description: "Набор из 6 капкейков с разными топпингами",
            price: 720,
            image: "images/cupcakes-1.jpg",
            category: "Капкейки"
        },
        {
            id: 4,
            name: "Пончики",
            description: "6 воздушных пончиков с глазурью и посыпкой",
            price: 480,
            image: "images/donuts-1.jpg",
            category: "Пончики"
        },
        {
            id: 5,
            name: "Шоколадный торт",
            description: "Богатый шоколадный торт с вишневой начинкой",
            price: 2100,
            image: "images/cake-1.jpg",
            category: "Торты"
        },
        {
            id: 6,
            name: "Макарун розовые",
            description: "Розовые макарун с малиновой начинкой",
            price: 120,
            image: "images/macarons-2.jpg",
            category: "Макаруны"
        },
        {
            id: 7,
            name: "Капкейк ванильный",
            description: "Ванильный капкейк с кремом и ягодами",
            price: 150,
            image: "images/cupcakes-2.jpg",
            category: "Капкейки"
        },
        {
            id: 8,
            name: "Пончик шоколадный",
            description: "Шоколадный пончик с карамельной глазурью",
            price: 90,
            image: "images/donuts-2.jpg",
            category: "Пончики"
        }
    ];
    
    const dessertsGrid = document.querySelector('.desserts-grid');
    if (dessertsGrid) {
        dessertsGrid.innerHTML = '';
        
        desserts.forEach(dessert => {
            const dessertCard = `
                <div class="dessert-card">
                    <div class="dessert-img">
                        <img src="${dessert.image}" alt="${dessert.name}">
                    </div>
                    <div class="dessert-info">
                        <span class="dessert-category">${dessert.category}</span>
                        <h3>${dessert.name}</h3>
                        <p>${dessert.description}</p>
                        <div class="dessert-footer">
                            <span class="price">${dessert.price} ₽</span>
                            <button class="btn-cart" data-id="${dessert.id}">
                                <i class="fas fa-plus"></i> В корзину
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            dessertsGrid.innerHTML += dessertCard;
        });
        
        // Повторно привязываем обработчики событий для новых кнопок
        document.querySelectorAll('.btn-cart').forEach(button => {
            button.addEventListener('click', function() {
                const dessertId = this.getAttribute('data-id');
                const dessert = desserts.find(d => d.id == dessertId);
                
                if (dessert) {
                    // Эффект добавления
                    this.innerHTML = '<i class="fas fa-check"></i> Добавлено';
                    this.style.backgroundColor = '#4CAF50';
                    
                    setTimeout(() => {
                        this.innerHTML = '<i class="fas fa-plus"></i> В корзину';
                        this.style.backgroundColor = '';
                    }, 1500);
                    
                    // Добавление в корзину
                    let cart = JSON.parse(localStorage.getItem('cart')) || [];
                    const existingItem = cart.find(item => item.id == dessertId);
                    
                    if (existingItem) {
                        existingItem.quantity += 1;
                    } else {
                        cart.push({
                            id: dessert.id,
                            name: dessert.name,
                            price: dessert.price,
                            quantity: 1
                        });
                    }
                    
                    localStorage.setItem('cart', JSON.stringify(cart));
                    
                    // Обновление счетчика
                    updateCartCount();
                }
            });
        });
    }
}

// Функция обновления счетчика корзины
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Функция инициализации карты
function initMap() {
    // В реальном приложении здесь была бы интеграция с Google Maps API
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
        mapContainer.innerHTML = `
            <div style="width: 100%; height: 100%; background-color: #f0f0f0; display: flex; align-items: center; justify-content: center; border-radius: 15px;">
                <div style="text-align: center; padding: 20px;">
                    <i class="fas fa-map-marker-alt" style="font-size: 48px; color: #ff85a2; margin-bottom: 15px;"></i>
                    <h3 style="color: #ff6392; margin-bottom: 10px;">Мы здесь!</h3>
                    <p style="color: #666;">Москва, ул. Сладкая, 15</p>
                    <p style="color: #888; font-size: 14px; margin-top: 10px;">(Для демо-версии карта заменена на статическое изображение)</p>
                </div>
            </div>
        `;
    }
}

// Добавляем CSS для анимации пульсации
const style = document.createElement('style');
style.textContent = `
    .pulse-animation {
        animation: pulse 0.5s ease;
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.3); }
        100% { transform: scale(1); }
    }
    
    .cart-count.updated {
        animation: bounce 0.3s ease;
    }
    
    @keyframes bounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.3); }
    }
    
    .animated {
        animation: fadeIn 0.8s ease;
    }
`;
document.head.appendChild(style);