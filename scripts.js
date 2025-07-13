// DOM Elements
const nav = document.querySelector('.nav-container');
const sections = document.querySelectorAll('.section');
const sectionTitles = document.querySelectorAll('.section-title');
const sectionParagraphs = document.querySelectorAll('.section p');
const gridItems = document.querySelectorAll('.grid-item');
const scrollTopBtn = document.querySelector('.scroll-top');

// Scroll-to-top button functionality
if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
const slides = document.querySelectorAll('.hero-slide');
const dividers = document.querySelectorAll('.divider');
const dividerContents = document.querySelectorAll('.divider-content');
const parallaxSections = document.querySelectorAll('.parallax-section');
const fadeElements = document.querySelectorAll('.fade-in-left, .fade-in-right, .fade-in-up, .fade-in-down');
const textReveal = document.querySelectorAll('.text-reveal');
const bgTransitions = document.querySelectorAll('.bg-transition');
const galleryItems = document.querySelectorAll('.gallery-item');

// Background images for transitions
const backgroundImages = [
    'https://source.unsplash.com/1600x900/?mexican-restaurant',
    'https://source.unsplash.com/1600x900/?mexican-food',
    'https://source.unsplash.com/1600x900/?tacos',
    'https://source.unsplash.com/1600x900/?mexican-decor'
];

let currentBgIndex = 0;

// Slideshow functionality
let slideIndex = 0;

function showSlides() {
    slides.forEach(slide => slide.classList.remove('active'));
    slideIndex++;
    if (slideIndex > slides.length) {slideIndex = 1}
    slides[slideIndex-1].classList.add('active');
    setTimeout(showSlides, 4000); // Change slide every 4 seconds
}

// Background transition function
function changeBackground() {
    if (bgTransitions.length === 0) return;
    
    bgTransitions.forEach(bg => bg.classList.remove('active'));
    
    currentBgIndex = (currentBgIndex + 1) % backgroundImages.length;
    const nextBg = bgTransitions[currentBgIndex % bgTransitions.length];
    
    if (nextBg) {
        nextBg.style.backgroundImage = `url(${backgroundImages[currentBgIndex]})`;
        setTimeout(() => {
            nextBg.classList.add('active');
        }, 100);
    }
}

// Parallax effect function
function handleParallax() {
    parallaxSections.forEach(section => {
        const scrollPosition = window.pageYOffset;
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition > sectionTop - window.innerHeight && 
            scrollPosition < sectionTop + sectionHeight) {
            const speed = section.getAttribute('data-speed') || 0.5;
            const yPos = (scrollPosition - sectionTop) * speed;
            section.style.backgroundPosition = `center ${yPos}px`;
        }
    });
    
    dividers.forEach(divider => {
        const scrollPosition = window.pageYOffset;
        const dividerTop = divider.offsetTop;
        const dividerHeight = divider.offsetHeight;
        
        if (scrollPosition > dividerTop - window.innerHeight && 
            scrollPosition < dividerTop + dividerHeight) {
            const speed = 0.4;
            const yPos = (scrollPosition - dividerTop) * speed;
            divider.style.backgroundPosition = `center ${-yPos}px`;
        }
    });
}

// Start slideshow when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (slides.length > 0) {
        showSlides();
    }
    
    // Initialize text reveal animations immediately
    const textRevealElements = document.querySelectorAll('.text-reveal');
    textRevealElements.forEach(element => {
        // Add visible class immediately to show hero title
        setTimeout(() => {
            element.classList.add('visible');
        }, 100);
    });
    
    // Initialize fade-in elements that are already in view
    const fadeInElements = document.querySelectorAll('.fade-in-left, .fade-in-right, .fade-in-up, .fade-in-down');
    fadeInElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // If element is in view or near the top, make it visible immediately
        if (rect.top < windowHeight && rect.bottom > 0) {
            setTimeout(() => {
                element.classList.add('visible');
            }, 200);
        }
    });
    
    // Initialize background transitions
    if (bgTransitions.length > 0) {
        bgTransitions.forEach((bg, index) => {
            bg.style.backgroundImage = `url(${backgroundImages[index % backgroundImages.length]})`;
        });
        
        // Set first background as active
        if (bgTransitions[0]) {
            bgTransitions[0].classList.add('active');
        }
        
        // Change background every 8 seconds
        setInterval(changeBackground, 8000);
    }
    
    // Add scroll-to-top button if it doesn't exist
    if (!scrollTopBtn) {
        const scrollButton = document.createElement('div');
        scrollButton.classList.add('scroll-top');
        scrollButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
        document.body.appendChild(scrollButton);
        
        // Add event listener to the created button
        scrollButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Initialize gallery functionality if on gallery page
    initGallery();
    
    // Initial animation check
    animateOnScroll();
});

// Gallery initialization function
function initGallery() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (filterButtons.length === 0 || galleryItems.length === 0) return;
    
    // Add staggered animation to gallery items
    galleryItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 100 * index);
    });
    
    // Set up filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            // Filter gallery items with animation
            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // Set up modal functionality
    const modal = document.getElementById('imageModal');
    if (!modal) return;
    
    const modalImg = document.getElementById('modalImage');
    const captionText = document.getElementById('modalCaption');
    const closeBtn = document.querySelector('.close');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            modal.style.display = 'block';
            modalImg.src = item.querySelector('img').src;
            captionText.innerHTML = item.querySelector('.gallery-item-title').textContent;
        });
    });
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Enhanced accessibility and debugging functions
function handleSidebarKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleSidebar();
    } else if (event.key === 'Escape') {
        const sidebar = document.getElementById('sidebar');
        if (sidebar.classList.contains('active')) {
            toggleSidebar();
        }
    }
}

// Enhanced toggle sidebar with better accessibility
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const isActive = sidebar.classList.toggle('active');
    
    // Update ARIA attributes
    const toggleButton = document.querySelector('.sidebar-toggle');
    if (toggleButton) {
        toggleButton.setAttribute('aria-expanded', isActive.toString());
    }
    
    // Focus management
    if (isActive) {
        // Focus the close button when sidebar opens
        const closeButton = sidebar.querySelector('.sidebar-close');
        if (closeButton) {
            setTimeout(() => closeButton.focus(), 100);
        }
    } else {
        // Return focus to toggle button when sidebar closes
        if (toggleButton) {
            toggleButton.focus();
        }
    }
    
    // Prevent body scroll when sidebar is open
    document.body.style.overflow = isActive ? 'hidden' : '';
}

// Scroll events
window.addEventListener('scroll', function() {
    const scrollPosition = window.scrollY;
    
    // Enhanced scroll effects with performance optimization
    let ticking = false;

    function updateScrollEffects() {
        const scrollPosition = window.scrollY;
        
        // Navbar scroll effect
        if (scrollPosition > 50) {
            nav?.classList.add('scrolled');
        } else {
            nav?.classList.remove('scrolled');
        }
        
        // Show/hide scroll-to-top button with smooth transition
        if (scrollTopBtn) {
            if (scrollPosition > 300) {
                scrollTopBtn.classList.add('visible');
                scrollTopBtn.style.transform = 'translateY(0)';
                scrollTopBtn.style.opacity = '1';
            } else {
                scrollTopBtn.classList.remove('visible');
                scrollTopBtn.style.transform = 'translateY(100px)';
                scrollTopBtn.style.opacity = '0';
            }
        }
        
        // Handle parallax effects
        handleParallax();
        
        // Animate sections on scroll
        animateOnScroll();
        
        ticking = false;
    }

    // Optimized scroll event with requestAnimationFrame
    if (!ticking) {
        requestAnimationFrame(updateScrollEffects);
        ticking = true;
    }
});

// Enhanced animation on scroll with Intersection Observer
function animateOnScroll() {
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Add staggered animation for grid items
                    if (entry.target.classList.contains('grid-container')) {
                        const items = entry.target.querySelectorAll('.grid-item');
                        items.forEach((item, index) => {
                            setTimeout(() => {
                                item.classList.add('visible');
                            }, index * 100);
                        });
                    }
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        fadeElements.forEach(element => observer.observe(element));
        sectionTitles.forEach(title => observer.observe(title));
        document.querySelectorAll('.grid-container').forEach(container => observer.observe(container));
    }
}

// Enhanced smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = nav ? nav.offsetHeight : 80;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Initialize scroll effects
    updateScrollEffects();
    
    // Add loading animation to page
    document.body.classList.add('loaded');
    
    // Enhanced form handling with validation and feedback
    // Reservation form handling
    const reservationForm = document.querySelector('#reservation .contact-form');
    if (reservationForm) {
        reservationForm.addEventListener('submit', handleReservationSubmit);
    }
    
    // Contact form handling
    const contactForm = document.querySelector('#contact .contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
    
    // Set minimum date to today for reservation forms
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        const today = new Date().toISOString().split('T')[0];
        input.setAttribute('min', today);
    });
});

// Initialize animations on page load
window.addEventListener('load', function() {
    // Trigger initial animations
    animateOnScroll();
    
    // Add event listeners for any interactive elements
    const menuItems = document.querySelectorAll('.menu-item');
    if (menuItems) {
        menuItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    }
});

function handleReservationSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const reservationData = Object.fromEntries(formData);
    
    // Simple validation
    if (!validateReservationData(reservationData)) {
        return;
    }
    
    // Show loading state
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Submitting...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        showSuccessMessage('Thank you! Your reservation request has been received. We will contact you shortly to confirm.');
        event.target.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 1500);
}

function handleContactSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const contactData = Object.fromEntries(formData);
    
    // Simple validation
    if (!validateContactData(contactData)) {
        return;
    }
    
    // Show loading state
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        showSuccessMessage('Thank you for your message! We will get back to you within 24 hours.');
        event.target.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 1500);
}

function validateReservationData(data) {
    if (!data.name || !data.phone || !data.date || !data.time) {
        showErrorMessage('Please fill in all required fields.');
        return false;
    }
    
    const selectedDate = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        showErrorMessage('Please select a future date.');
        return false;
    }
    
    return true;
}

function validateContactData(data) {
    if (!data['contact-name'] || !data['contact-email'] || !data['contact-message']) {
        showErrorMessage('Please fill in all required fields.');
        return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data['contact-email'])) {
        showErrorMessage('Please enter a valid email address.');
        return false;
    }
    
    return true;
}

function showSuccessMessage(message) {
    showNotification(message, 'success');
}

function showErrorMessage(message) {
    showNotification(message, 'error');
}

function showNotification(message, type) {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4caf50' : '#f44336'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1001;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}
