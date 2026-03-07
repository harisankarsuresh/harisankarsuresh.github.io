const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function updateScrollProgress() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    document.documentElement.style.setProperty('--scroll-progress', `${Math.min(progress, 100)}%`);
}

function updateHeaderState() {
    const header = document.querySelector('.site-header');
    if (!header) {
        return;
    }

    header.classList.toggle('is-scrolled', window.scrollY > 12);
}

function bindSmoothAnchors() {
    const navLinks = document.querySelectorAll('.site-nav a.nav-link, .brand[href^="#"]');
    navLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            const targetUrl = new URL(link.href, window.location.origin);
            const currentUrl = new URL(window.location.href);

            if (targetUrl.pathname === currentUrl.pathname && targetUrl.hash) {
                const target = document.querySelector(targetUrl.hash);
                if (!target) {
                    return;
                }

                event.preventDefault();
                target.scrollIntoView({
                    behavior: prefersReducedMotion.matches ? 'auto' : 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function initNavObserver() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.site-nav a.nav-link[href^="#"]');

    if (!sections.length || !navLinks.length) {
        return;
    }

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            const id = entry.target.getAttribute('id');
            const activeLink = document.querySelector(`.site-nav a.nav-link[href="#${id}"]`);
            if (!activeLink) {
                return;
            }

            navLinks.forEach((link) => link.classList.remove('active'));
            activeLink.classList.add('active');
        });
    }, { rootMargin: '-45% 0px -45% 0px' });

    sections.forEach((section) => sectionObserver.observe(section));
}

function initReveal() {
    document.querySelectorAll('[data-stagger]').forEach((group) => {
        Array.from(group.children).forEach((child, index) => {
            child.classList.add('reveal');
            child.style.setProperty('--reveal-delay', `${index * 90}ms`);
        });
    });

    if (prefersReducedMotion.matches) {
        document.querySelectorAll('.reveal').forEach((element) => element.classList.add('in-view'));
        return;
    }

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });

    document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
}

function initTypewriters() {
    const typewriters = document.querySelectorAll('.typewriter');
    typewriters.forEach((node) => {
        const words = (node.dataset.words || '')
            .split('|')
            .map((word) => word.trim())
            .filter(Boolean);

        if (!words.length) {
            return;
        }

        if (prefersReducedMotion.matches) {
            node.textContent = words[0];
            return;
        }

        let wordIndex = 0;
        let charIndex = 0;
        let deleting = false;

        const tick = () => {
            const currentWord = words[wordIndex];
            charIndex += deleting ? -1 : 1;
            node.textContent = currentWord.slice(0, charIndex);

            let delay = deleting ? 55 : 95;

            if (!deleting && charIndex === currentWord.length) {
                deleting = true;
                delay = 1450;
            } else if (deleting && charIndex === 0) {
                deleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                delay = 240;
            }

            window.setTimeout(tick, delay);
        };

        tick();
    });
}

function initMagneticElements() {
    if (prefersReducedMotion.matches) {
        return;
    }

    document.querySelectorAll('.magnetic').forEach((element) => {
        const reset = () => {
            element.style.setProperty('--magnetic-x', '0px');
            element.style.setProperty('--magnetic-y', '0px');
        };

        element.addEventListener('pointermove', (event) => {
            const rect = element.getBoundingClientRect();
            const offsetX = ((event.clientX - rect.left) / rect.width - 0.5) * 14;
            const offsetY = ((event.clientY - rect.top) / rect.height - 0.5) * 14;

            element.style.setProperty('--magnetic-x', `${offsetX}px`);
            element.style.setProperty('--magnetic-y', `${offsetY}px`);
        });

        element.addEventListener('pointerleave', reset);
        element.addEventListener('blur', reset);
    });
}

function initTiltCards() {
    if (prefersReducedMotion.matches) {
        return;
    }

    document.querySelectorAll('.tilt-card').forEach((card) => {
        const reset = () => {
            card.style.setProperty('--tilt-x', '0deg');
            card.style.setProperty('--tilt-y', '0deg');
        };

        card.addEventListener('pointermove', (event) => {
            const rect = card.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;

            card.style.setProperty('--tilt-x', `${x * 6}deg`);
            card.style.setProperty('--tilt-y', `${y * -6}deg`);
        });

        card.addEventListener('pointerleave', reset);
        card.addEventListener('pointerup', reset);
    });
}

function initSceneDrift() {
    if (prefersReducedMotion.matches) {
        return;
    }

    document.querySelectorAll('[data-scene]').forEach((scene) => {
        const pieces = scene.querySelectorAll('[data-depth]');

        const reset = () => {
            pieces.forEach((piece) => {
                piece.style.setProperty('--float-x', '0px');
                piece.style.setProperty('--float-y', '0px');
            });
        };

        scene.addEventListener('pointermove', (event) => {
            const rect = scene.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;

            pieces.forEach((piece) => {
                const depth = Number(piece.dataset.depth || 0);
                piece.style.setProperty('--float-x', `${x * depth}px`);
                piece.style.setProperty('--float-y', `${y * depth}px`);
            });
        });

        scene.addEventListener('pointerleave', reset);
    });
}

updateScrollProgress();
updateHeaderState();
bindSmoothAnchors();
initNavObserver();
initReveal();
initTypewriters();
initMagneticElements();
initTiltCards();
initSceneDrift();

window.addEventListener('scroll', updateScrollProgress, { passive: true });
window.addEventListener('scroll', updateHeaderState, { passive: true });
window.addEventListener('resize', updateScrollProgress);
