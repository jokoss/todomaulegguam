/**
 * TODOMauleg - Premium Plumbing Website
 * Modern JavaScript with Advanced Animations & Interactions
 * 2024
 */

(function() {
    'use strict';
    
    // ========================================
    // CONFIGURATION & CONSTANTS
    // ========================================
    
    const CONFIG = {
        scrollThreshold: 100,
        animationDuration: 300,
        debounceDelay: 100,
        throttleDelay: 16
    };
    
    // ========================================
    // DOM ELEMENTS
    // ========================================
    
    const elements = {
        header: document.getElementById('header'),
        navToggle: document.querySelector('.nav-toggle'),
        navMenu: document.getElementById('main-menu'),
        backToTop: document.getElementById('backToTop'),
        currentYear: document.getElementById('current-year'),
        heroContent: document.querySelector('.hero-content'),
        serviceCards: document.querySelectorAll('.service-card'),
        testimonialCards: document.querySelectorAll('.testimonial-card')
    };
    
    // ========================================
    // UTILITY FUNCTIONS
    // ========================================
    
    const utils = {
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        
        throttle(func, limit) {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },
        
        isElementInViewport(el, threshold = 0.1) {
            const rect = el.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            const windowWidth = window.innerWidth || document.documentElement.clientWidth;
            
            return (
                rect.top <= windowHeight * (1 - threshold) &&
                rect.bottom >= windowHeight * threshold &&
                rect.left <= windowWidth &&
                rect.right >= 0
            );
        },
        
        addClass(element, className) {
            if (element && !element.classList.contains(className)) {
                element.classList.add(className);
            }
        },
        
        removeClass(element, className) {
            if (element && element.classList.contains(className)) {
                element.classList.remove(className);
            }
        },
        
        toggleClass(element, className) {
            if (element) {
                element.classList.toggle(className);
            }
        }
    };
    
    // ========================================
    // ANIMATION SYSTEM
    // ========================================
    
    class AnimationManager {
        constructor() {
            this.observers = new Map();
            this.init();
        }
        
        init() {
            this.createIntersectionObserver();
            this.observeElements();
        }
        
        createIntersectionObserver() {
            const options = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };
            
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateElement(entry.target);
                    }
                });
            }, options);
        }
        
        observeElements() {
            // Observe service cards
            elements.serviceCards.forEach(card => {
                this.observer.observe(card);
            });
            
            // Observe testimonial cards
            elements.testimonialCards.forEach(card => {
                this.observer.observe(card);
            });
        }
        
        animateElement(element) {
            // Add staggered animation delay
            const index = Array.from(element.parentNode.children).indexOf(element);
            const delay = index * 100;
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, delay);
        }
        
        setupInitialStates() {
            // Set initial states for animated elements
            elements.serviceCards.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            });
            
            elements.testimonialCards.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            });
        }
    }
    
    // ========================================
    // NAVIGATION SYSTEM
    // ========================================
    
    class NavigationManager {
        constructor() {
            this.isMenuOpen = false;
            this.init();
        }
        
        init() {
            this.bindEvents();
            this.setupAccessibility();
        }
        
        bindEvents() {
            if (elements.navToggle) {
                elements.navToggle.addEventListener('click', () => this.toggleMenu());
            }
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (this.isMenuOpen && 
                    !elements.navToggle.contains(e.target) && 
                    !elements.navMenu.contains(e.target)) {
                    this.closeMenu();
                }
            });
            
            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isMenuOpen) {
                    this.closeMenu();
                }
            });
            
            // Close menu on window resize
            window.addEventListener('resize', utils.debounce(() => {
                if (window.innerWidth > 768 && this.isMenuOpen) {
                    this.closeMenu();
                }
            }, CONFIG.debounceDelay));
        }
        
        toggleMenu() {
            if (this.isMenuOpen) {
                this.closeMenu();
            } else {
                this.openMenu();
            }
        }
        
        openMenu() {
            this.isMenuOpen = true;
            utils.addClass(elements.navMenu, 'open');
            elements.navToggle.setAttribute('aria-expanded', 'true');
            elements.navToggle.setAttribute('aria-label', 'Close navigation menu');
            document.body.style.overflow = 'hidden';
        }
        
        closeMenu() {
            this.isMenuOpen = false;
            utils.removeClass(elements.navMenu, 'open');
            elements.navToggle.setAttribute('aria-expanded', 'false');
            elements.navToggle.setAttribute('aria-label', 'Open navigation menu');
            document.body.style.overflow = '';
        }
        
        setupAccessibility() {
            if (elements.navMenu) {
                const menuItems = elements.navMenu.querySelectorAll('a');
                const firstItem = menuItems[0];
                const lastItem = menuItems[menuItems.length - 1];
                
                elements.navMenu.addEventListener('keydown', (e) => {
                    if (e.key === 'Tab') {
                        if (e.shiftKey && document.activeElement === firstItem) {
                            e.preventDefault();
                            lastItem.focus();
                        } else if (!e.shiftKey && document.activeElement === lastItem) {
					e.preventDefault();
                            firstItem.focus();
				}
			}
		});
            }
        }
    }
    
    // ========================================
    // SCROLL EFFECTS SYSTEM
    // ========================================
    
    class ScrollEffectsManager {
        constructor() {
            this.lastScrollY = window.scrollY;
            this.isScrolling = false;
            this.init();
        }
        
        init() {
            this.bindEvents();
            this.setupInitialStates();
        }
        
        bindEvents() {
            window.addEventListener('scroll', 
                utils.throttle(() => this.handleScroll(), CONFIG.throttleDelay),
                { passive: true }
            );
        }
        
        handleScroll() {
            const scrollY = window.scrollY;
            const direction = scrollY > this.lastScrollY ? 'down' : 'up';
            
            this.updateHeader(scrollY);
            this.updateBackToTop(scrollY);
            this.updateScrollDirection(direction);
            
            this.lastScrollY = scrollY;
        }
        
        updateHeader(scrollY) {
            if (elements.header) {
                if (scrollY > CONFIG.scrollThreshold) {
                    utils.addClass(elements.header, 'scrolled');
                } else {
                    utils.removeClass(elements.header, 'scrolled');
                }
            }
        }
        
        updateBackToTop(scrollY) {
            if (elements.backToTop) {
                if (scrollY > 300) {
                    utils.addClass(elements.backToTop, 'visible');
                } else {
                    utils.removeClass(elements.backToTop, 'visible');
                }
            }
        }
        
        updateScrollDirection(direction) {
            // Add scroll direction class for advanced animations
            document.body.classList.toggle('scroll-down', direction === 'down');
            document.body.classList.toggle('scroll-up', direction === 'up');
        }
        
        setupInitialStates() {
            // Set initial header state
            if (elements.header) {
                elements.header.style.transition = 'all 0.3s ease';
            }
            
            // Set initial back to top state
            if (elements.backToTop) {
                elements.backToTop.style.transition = 'all 0.3s ease';
            }
        }
    }
    
    // ========================================
    // INTERACTION SYSTEM
    // ========================================
    
    class InteractionManager {
        constructor() {
            this.init();
        }
        
        init() {
            this.bindEvents();
            this.setupSmoothScrolling();
        }
        
        bindEvents() {
            // Back to top button
            if (elements.backToTop) {
                elements.backToTop.addEventListener('click', () => this.scrollToTop());
            }
            
            // Service card hover effects
            elements.serviceCards.forEach(card => {
                card.addEventListener('mouseenter', () => this.handleCardHover(card, true));
                card.addEventListener('mouseleave', () => this.handleCardHover(card, false));
            });
            
            // Button click effects
            document.querySelectorAll('.btn').forEach(btn => {
                btn.addEventListener('click', (e) => this.handleButtonClick(e));
            });
        }
        
        scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
        
        handleCardHover(card, isHovering) {
            if (isHovering) {
                card.style.transform = 'translateY(-8px) scale(1.02)';
            } else {
                card.style.transform = 'translateY(0) scale(1)';
            }
        }
        
        handleButtonClick(e) {
            // Add ripple effect
            const button = e.currentTarget;
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        }
        
        setupSmoothScrolling() {
            const anchorLinks = document.querySelectorAll('a[href^="#"]');
            
            anchorLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    const href = link.getAttribute('href');
                    if (href === '#') return;
                    
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        
                        const headerHeight = elements.header ? elements.header.offsetHeight : 0;
                        const targetPosition = target.offsetTop - headerHeight - 20;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                        
                        // Focus management for accessibility
                        target.setAttribute('tabindex', '-1');
                        target.focus();
                    }
                });
            });
        }
    }
    
    // ========================================
    // PERFORMANCE MONITORING
    // ========================================
    
    class PerformanceMonitor {
        constructor() {
            this.init();
        }
        
        init() {
            this.monitorPageLoad();
            this.monitorScrollPerformance();
        }
        
        monitorPageLoad() {
            window.addEventListener('load', () => {
                const loadTime = performance.now();
                console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
            });
        }
        
        monitorScrollPerformance() {
            let frameCount = 0;
            let lastTime = performance.now();
            
            const countFrames = () => {
                frameCount++;
                const currentTime = performance.now();
                
                if (currentTime - lastTime >= 1000) {
                    const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                    if (fps < 30) {
                        console.warn(`Low FPS detected: ${fps}`);
                    }
                    frameCount = 0;
                    lastTime = currentTime;
                }
                
                requestAnimationFrame(countFrames);
            };
            
            requestAnimationFrame(countFrames);
        }
    }
    
    // ========================================
    // INITIALIZATION
    // ========================================
    
    class App {
        constructor() {
            this.animationManager = null;
            this.navigationManager = null;
            this.scrollEffectsManager = null;
            this.interactionManager = null;
            this.performanceMonitor = null;
        }
        
        init() {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.initialize());
            } else {
                this.initialize();
            }
        }
        
        initialize() {
            try {
                this.setCurrentYear();
                this.initializeManagers();
                this.setupErrorHandling();
                this.setupServiceWorker();
                
                console.log('TODOMauleg website initialized successfully');
            } catch (error) {
                console.error('Error initializing website:', error);
            }
        }
        
        setCurrentYear() {
            if (elements.currentYear) {
                elements.currentYear.textContent = new Date().getFullYear();
            }
        }
        
        initializeManagers() {
            this.animationManager = new AnimationManager();
            this.navigationManager = new NavigationManager();
            this.scrollEffectsManager = new ScrollEffectsManager();
            this.interactionManager = new InteractionManager();
            this.performanceMonitor = new PerformanceMonitor();
            
            // Setup initial animation states
            this.animationManager.setupInitialStates();
        }
        
        setupErrorHandling() {
            window.addEventListener('error', (e) => {
                console.error('JavaScript error:', e.error);
            });
            
            window.addEventListener('unhandledrejection', (e) => {
                console.error('Unhandled promise rejection:', e.reason);
            });
        }
        
        setupServiceWorker() {
            if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                    navigator.serviceWorker.register('/sw.js')
                        .then(registration => {
                            console.log('SW registered: ', registration);
                        })
                        .catch(registrationError => {
                            console.log('SW registration failed: ', registrationError);
                        });
                });
            }
        }
    }
    
    // ========================================
    // START APPLICATION
    // ========================================
    
    const app = new App();
    app.init();
    
    // ========================================
    // ADDITIONAL STYLES FOR INTERACTIONS
    // ========================================
    
    // Add ripple effect styles
    const style = document.createElement('style');
    style.textContent = `
        .btn {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .service-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .scroll-down .site-header {
            transform: translateY(-100%);
        }
        
        .scroll-up .site-header {
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
    
})();