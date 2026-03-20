/* =====================================================
   HUITLACOCHE TAQUERIA — Main Scripts
   Page loader, scroll reveals, hero slideshow,
   smooth interactions — inspired by gourouindianfood.fr
   ===================================================== */

'use strict';

/* ===== UTILITIES ===== */
const qs  = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ===== PAGE LOADER ===== */
function initLoader() {
    const loader  = qs('#loader');
    const nav     = qs('#nav');
    if (!loader) return;

    // After progress bar animation completes (~1.8s), hide loader
    setTimeout(() => {
        loader.style.transition = 'opacity 0.6s ease, visibility 0.6s ease';
        loader.style.opacity    = '0';
        loader.style.visibility = 'hidden';

        // Show nav with slide-down
        if (nav) {
            nav.classList.add('is-visible');
        }

        // Trigger hero content reveals after loader hides
        setTimeout(() => {
            loader.style.display = 'none';
            revealHeroContent();
        }, 600);
    }, 1800);
}

/* ===== HERO CONTENT REVEAL (on load) ===== */
function revealHeroContent() {
    // Wrap each [reveal-line] element in the hero with a .line-inner span
    // and animate them in with stagger
    const heroLines = qsa('.hero [reveal-line]');
    heroLines.forEach((el, i) => {
        // Wrap content if not already wrapped
        if (!el.querySelector('.line-inner')) {
            const inner = document.createElement('span');
            inner.className = 'line-inner';
            inner.innerHTML = el.innerHTML;
            el.innerHTML = '';
            el.appendChild(inner);
        }
        setTimeout(() => {
            el.classList.add('is-revealed');
        }, i * 120);
    });

    // Fade-in elements in hero
    const heroOps = qsa('.hero [reveal-op]');
    heroOps.forEach((el, i) => {
        setTimeout(() => {
            el.classList.add('is-revealed');
        }, heroLines.length * 120 + i * 100 + 200);
    });
}

/* ===== HERO SLIDESHOW ===== */
function initHeroSlideshow() {
    const slides = qsa('.hero-slide');
    const dots   = qsa('.hero-dot');
    if (slides.length < 2) return;

    let current = 0;
    let timer   = null;

    function goTo(index) {
        slides[current].classList.remove('active');
        dots[current]?.classList.remove('active');
        current = (index + slides.length) % slides.length;
        slides[current].classList.add('active');
        dots[current]?.classList.add('active');
    }

    function next() { goTo(current + 1); }

    function start() { timer = setInterval(next, 5000); }
    function stop()  { clearInterval(timer); }

    // Dot click handlers
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            stop();
            goTo(i);
            start();
        });
    });

    // Pause on hover
    const heroEl = qs('.hero');
    if (heroEl) {
        heroEl.addEventListener('mouseenter', stop);
        heroEl.addEventListener('mouseleave', start);
    }

    start();
}

/* ===== NAVIGATION ===== */
function initNav() {
    const nav = qs('#nav');
    if (!nav) return;

    function onScroll() {
        if (window.scrollY > 60) {
            nav.classList.add('is-scrolled');
        } else {
            nav.classList.remove('is-scrolled');
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Smooth anchor scrolling
    qsa('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const target = qs(anchor.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            const offset = nav.offsetHeight + 20;
            window.scrollTo({
                top: target.getBoundingClientRect().top + window.scrollY - offset,
                behavior: 'smooth'
            });
            // Close mobile menu if open
            closeMobileMenu();
        });
    });
}

/* ===== MOBILE MENU ===== */
function initMobileMenu() {
    const hamburger = qs('#navHamburger');
    const menu      = qs('#mobileMenu');
    const closeBtn  = qs('#mobileMenuClose');

    if (!hamburger || !menu) return;

    hamburger.addEventListener('click', openMobileMenu);
    closeBtn?.addEventListener('click', closeMobileMenu);

    // Close on outside click
    menu.addEventListener('click', e => {
        if (e.target === menu) closeMobileMenu();
    });
}

function openMobileMenu() {
    const menu = qs('#mobileMenu');
    menu?.classList.add('is-open');
    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    const menu = qs('#mobileMenu');
    menu?.classList.remove('is-open');
    document.body.style.overflow = '';
}

/* ===== SCROLL REVEAL (IntersectionObserver) ===== */
function initScrollReveal() {
    // Prepare [reveal-line] elements by wrapping content
    qsa('[reveal-line]').forEach(el => {
        // Skip hero elements (handled separately after loader)
        if (el.closest('.hero')) return;
        if (!el.querySelector('.line-inner')) {
            const inner = document.createElement('span');
            inner.className = 'line-inner';
            inner.innerHTML = el.innerHTML;
            el.innerHTML = '';
            el.appendChild(inner);
        }
    });

    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const el = entry.target;

            // Stagger children if it's a container
            if (el.hasAttribute('reveal-card') || el.hasAttribute('reveal-op') || el.hasAttribute('reveal-line')) {
                el.classList.add('is-revealed');
            }

            observer.unobserve(el);
        });
    }, observerOptions);

    // Observe all reveal elements (excluding hero)
    qsa('[reveal-line]:not(.hero [reveal-line]), [reveal-op]:not(.hero [reveal-op]), [reveal-card]').forEach(el => {
        observer.observe(el);
    });

    // Stagger card groups
    const cardGroups = [
        '.dishes-grid',
        '.testimonials-grid',
        '.team-cards',
        '.gallery-mosaic'
    ];

    cardGroups.forEach(selector => {
        const container = qs(selector);
        if (!container) return;

        const containerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const cards = qsa('[reveal-card]', entry.target);
                cards.forEach((card, i) => {
                    setTimeout(() => {
                        card.classList.add('is-revealed');
                    }, i * 100);
                });
                containerObserver.unobserve(entry.target);
            });
        }, { threshold: 0.1 });

        containerObserver.observe(container);
    });
}

/* ===== SCROLL TO TOP ===== */
function initScrollTop() {
    const btn = qs('#scrollTopBtn');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            btn.classList.add('is-visible');
        } else {
            btn.classList.remove('is-visible');
        }
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ===== PARALLAX BANNER ===== */
function initParallax() {
    const banners = qsa('.banner-section');
    if (!banners.length) return;

    function update() {
        banners.forEach(banner => {
            const rect  = banner.getBoundingClientRect();
            const speed = 0.3;
            const yPos  = -(rect.top * speed);
            banner.style.backgroundPositionY = `calc(50% + ${yPos}px)`;
        });
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
}

/* ===== FORMS ===== */
function initForms() {
    // Reservation form
    const resForm = qs('#reservationForm');
    if (resForm) {
        // Set min date to today
        const dateInput = qs('#res-date');
        if (dateInput) {
            dateInput.min = new Date().toISOString().split('T')[0];
        }

        resForm.addEventListener('submit', e => {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(e.target));

            if (!data.name || !data.phone || !data.date || !data.time) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }

            const btn = resForm.querySelector('button[type="submit"]');
            const orig = btn.textContent;
            btn.textContent = 'Submitting…';
            btn.disabled = true;

            setTimeout(() => {
                showNotification('Thank you! Your reservation request has been received. We will contact you shortly to confirm.', 'success');
                resForm.reset();
                btn.textContent = orig;
                btn.disabled = false;
            }, 1500);
        });
    }

    // Contact form
    const contactForm = qs('#contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', e => {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(e.target));

            if (!data['contact-name'] || !data['contact-email'] || !data['contact-message']) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }

            const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRe.test(data['contact-email'])) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }

            const btn = contactForm.querySelector('button[type="submit"]');
            const orig = btn.textContent;
            btn.textContent = 'Sending…';
            btn.disabled = true;

            setTimeout(() => {
                showNotification('Thank you for your message! We will get back to you within 24 hours.', 'success');
                contactForm.reset();
                btn.textContent = orig;
                btn.disabled = false;
            }, 1500);
        });
    }
}

/* ===== NOTIFICATIONS ===== */
function showNotification(message, type = 'success') {
    // Remove existing
    qs('.notification')?.remove();

    const el = document.createElement('div');
    el.className = `notification notification--${type}`;
    el.textContent = message;
    document.body.appendChild(el);

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            el.classList.add('is-visible');
        });
    });

    setTimeout(() => {
        el.classList.remove('is-visible');
        setTimeout(() => el.remove(), 400);
    }, 5000);
}

/* ===== GALLERY FUNCTIONALITY (gallery.html) ===== */
function initGallery() {
    const filterBtns  = qsa('.filter-btn');
    const galleryItems = qsa('.gallery-item');
    if (!filterBtns.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            galleryItems.forEach(item => {
                const show = filter === 'all' || item.dataset.category === filter;
                item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                if (show) {
                    item.style.display = '';
                    setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'translateY(0)'; }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(16px)';
                    setTimeout(() => { item.style.display = 'none'; }, 300);
                }
            });
        });
    });

    // Modal
    const modal     = qs('#imageModal');
    const modalImg  = qs('#modalImage');
    const modalCap  = qs('#modalCaption');
    const closeBtn  = qs('.modal-close, .close');

    if (modal) {
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const img   = item.querySelector('img');
                const title = item.querySelector('.gallery-item-title');
                if (!img) return;
                modalImg.src = img.src;
                if (modalCap && title) modalCap.textContent = title.textContent;
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            });
        });

        const closeModal = () => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        };

        closeBtn?.addEventListener('click', closeModal);
        modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
        document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
    }
}

/* ===== MENU PAGE ENHANCEMENTS ===== */
function initMenuPage() {
    const menuNav = qs('.menu-nav');
    if (!menuNav) return;

    // Sticky category nav highlight
    const sections = qsa('.menu-section, section[id]');
    const navLinks = qsa('.menu-nav a');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { rootMargin: '-30% 0px -60% 0px' });

    sections.forEach(s => observer.observe(s));
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initHeroSlideshow();
    initNav();
    initMobileMenu();
    initScrollReveal();
    initScrollTop();
    initParallax();
    initForms();
    initGallery();
    initMenuPage();
});
