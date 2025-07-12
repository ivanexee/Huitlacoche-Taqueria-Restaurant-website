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

// Sidebar toggle
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}

// Scroll events
window.addEventListener('scroll', function() {
    const scrollPosition = window.scrollY;
    
    // Navbar scroll effect
    if (scrollPosition > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
    
    // Show/hide scroll-to-top button
    if (scrollTopBtn) {
        if (scrollPosition > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }
    
    // Handle parallax effects
    handleParallax();
    
    // Animate sections on scroll
    animateOnScroll();
});

// Intersection Observer for scroll animations
function animateOnScroll() {
    // Check if IntersectionObserver is available
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);
        
        // Observe section titles
        sectionTitles.forEach(title => {
            observer.observe(title);
        });
        
        // Observe section paragraphs
        sectionParagraphs.forEach(paragraph => {
            observer.observe(paragraph);
        });
        
        // Observe grid items
        gridItems.forEach(item => {
            observer.observe(item);
        });
        
        // Observe divider content
        dividerContents.forEach(content => {
            observer.observe(content);
        });
        
        // Observe fade elements
        fadeElements.forEach(element => {
            observer.observe(element);
        });
        
        // Observe text reveal elements
        textReveal.forEach(element => {
            observer.observe(element);
        });
        
        // Observe gallery items
        galleryItems.forEach(item => {
            observer.observe(item);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (sectionTop < windowHeight * 0.75) {
                section.querySelectorAll('.section-title, p, .grid-item, .fade-in-left, .fade-in-right, .fade-in-up, .fade-in-down, .text-reveal, .gallery-item').forEach(el => {
                    el.classList.add('visible');
                });
            }
        });
        
        dividers.forEach(divider => {
            const dividerTop = divider.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (dividerTop < windowHeight * 0.75) {
                divider.querySelectorAll('.divider-content').forEach(el => {
                    el.classList.add('visible');
                });
            }
        });
    }
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Lazy loading for images
if ('loading' in HTMLImageElement.prototype) {
    // Browser supports native lazy loading
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.setAttribute('loading', 'lazy');
    });
} else {
    // Fallback for browsers that don't support lazy loading
    // You could add a lazy loading library here if needed
}

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
