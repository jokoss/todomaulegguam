// Modern JavaScript for TODOMauleg Website
(function() {
    'use strict';
    
    // DOM Elements
    const header = document.getElementById('header');
    const navToggle = document.querySelector('.nav-toggle');
    const mainMenu = document.getElementById('main-menu');
    const backToTop = document.getElementById('backToTop');
    const currentYear = document.getElementById('current-year');
    
    // Initialize
    document.addEventListener('DOMContentLoaded', function() {
        initNavigation();
        initScrollEffects();
        initBackToTop();
        initAnimations();
        setCurrentYear();
        initSmoothScrolling();
    });
    
    // Navigation Functions
    function initNavigation() {
        if (navToggle && mainMenu) {
            navToggle.addEventListener('click', toggleMobileMenu);
            
            // Close menu when clicking outside
            document.addEventListener('click', function(e) {
                if (!navToggle.contains(e.target) && !mainMenu.contains(e.target)) {
                    closeMobileMenu();
                }
            });
            
            // Close menu on escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    closeMobileMenu();
                }
            });
        }
    }
    
    function toggleMobileMenu() {
        const isOpen = mainMenu.classList.contains('open');
        
        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }
    
    function openMobileMenu() {
        mainMenu.classList.add('open');
        navToggle.setAttribute('aria-expanded', 'true');
        navToggle.setAttribute('aria-label', 'Close navigation menu');
        document.body.style.overflow = 'hidden';
    }
    
    function closeMobileMenu() {
        mainMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open navigation menu');
        document.body.style.overflow = '';
    }
    
    // Scroll Effects
    function initScrollEffects() {
        let lastScrollY = window.scrollY;
        let ticking = false;
        
        function updateScrollEffects() {
            const scrollY = window.scrollY;
            
            // Header scroll effect
            if (header) {
                if (scrollY > 100) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }
            
            // Back to top button
            if (backToTop) {
                if (scrollY > 300) {
                    backToTop.classList.add('visible');
                } else {
                    backToTop.classList.remove('visible');
                }
            }
            
            lastScrollY = scrollY;
            ticking = false;
        }
        
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestTick, { passive: true });
    }
    
    // Back to Top
    function initBackToTop() {
        if (backToTop) {
            backToTop.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }
    
    // Animations
    function initAnimations() {
        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Observe elements with animation classes
        const animatedElements = document.querySelectorAll('.service-card, .contact-card');
        animatedElements.forEach(function(el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
    
    // Set Current Year
    function setCurrentYear() {
        if (currentYear) {
            currentYear.textContent = new Date().getFullYear();
        }
    }
    
    // Smooth Scrolling for Anchor Links
    function initSmoothScrolling() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    
                    const headerHeight = header ? header.offsetHeight : 0;
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
    
    // Utility Functions
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = function() {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(function() {
                    inThrottle = false;
                }, limit);
            }
        };
    }
    
    // Performance optimizations
    const debouncedResize = debounce(function() {
        // Handle resize events
        closeMobileMenu();
    }, 250);
    
    window.addEventListener('resize', debouncedResize);
    
    // Service Worker Registration (for future PWA features)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js')
                .then(function(registration) {
                    console.log('SW registered: ', registration);
                })
                .catch(function(registrationError) {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }
    
    // Error Handling
    window.addEventListener('error', function(e) {
        console.error('JavaScript error:', e.error);
    });
    
    // Accessibility improvements
    function initAccessibility() {
        // Skip link functionality
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.focus();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
        
        // Keyboard navigation for mobile menu
        if (mainMenu) {
            const menuItems = mainMenu.querySelectorAll('a');
            const firstItem = menuItems[0];
            const lastItem = menuItems[menuItems.length - 1];
            
            mainMenu.addEventListener('keydown', function(e) {
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
    
    // Initialize accessibility features
    initAccessibility();
    
})();