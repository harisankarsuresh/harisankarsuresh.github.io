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
    const typewriters = Array.from(document.querySelectorAll('.typewriter'))
        .map((node) => {
            const words = (node.dataset.words || '')
                .split('|')
                .map((word) => word.trim())
                .filter(Boolean);

            return {
                node,
                shell: node.closest('.type-shell'),
                words
            };
        })
        .filter(({ words }) => words.length);

    if (!typewriters.length) {
        return;
    }

    const createMeasure = (node) => {
        const styles = window.getComputedStyle(node);
        const measure = document.createElement('span');
        measure.className = 'typewriter-measure';
        measure.setAttribute('aria-hidden', 'true');
        measure.style.fontFamily = styles.fontFamily;
        measure.style.fontSize = styles.fontSize;
        measure.style.fontStyle = styles.fontStyle;
        measure.style.fontWeight = styles.fontWeight;
        measure.style.fontStretch = styles.fontStretch;
        measure.style.fontVariant = styles.fontVariant;
        measure.style.letterSpacing = styles.letterSpacing;
        measure.style.lineHeight = styles.lineHeight;
        measure.style.textTransform = styles.textTransform;
        measure.style.wordSpacing = styles.wordSpacing;
        document.body.appendChild(measure);
        return measure;
    };

    const reserveTypeSpace = () => {
        typewriters.forEach(({ node, shell, words }) => {
            if (!shell) {
                return;
            }

            const measure = createMeasure(node);
            const caretReserve = 28;
            const parentWidth = shell.parentElement ? Math.ceil(shell.parentElement.clientWidth) : 0;

            let widestWord = 0;
            words.forEach((word) => {
                measure.style.inlineSize = 'auto';
                measure.style.whiteSpace = 'nowrap';
                measure.textContent = word;
                widestWord = Math.max(widestWord, Math.ceil(measure.getBoundingClientRect().width));
            });

            const naturalWidth = widestWord + caretReserve;
            const shellWidth = parentWidth ? Math.min(naturalWidth, parentWidth) : naturalWidth;
            const multiline = parentWidth > 0 && naturalWidth > parentWidth;
            const textWidth = Math.max(shellWidth - caretReserve, 1);

            let tallestWord = 0;
            words.forEach((word) => {
                measure.style.whiteSpace = multiline ? 'normal' : 'nowrap';
                measure.style.inlineSize = multiline ? `${textWidth}px` : 'auto';
                measure.textContent = word;
                tallestWord = Math.max(tallestWord, Math.ceil(measure.getBoundingClientRect().height));
            });

            measure.remove();

            shell.style.setProperty('--type-width', `${shellWidth}px`);
            shell.style.setProperty('--type-height', `${tallestWord}px`);
            shell.classList.toggle('type-shell-multiline', multiline);
        });
    };

    reserveTypeSpace();
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(reserveTypeSpace);
    }
    window.addEventListener('resize', reserveTypeSpace);

    typewriters.forEach(({ node, words }) => {
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

function initAmbientField() {
    const aura = document.querySelector('.page-aura');
    if (!aura) {
        return;
    }

    const canvas = document.createElement('canvas');
    canvas.className = 'page-aura-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    aura.prepend(canvas);

    const context = canvas.getContext('2d');
    if (!context) {
        canvas.remove();
        return;
    }

    const palette = [
        [26, 115, 232],
        [234, 67, 53],
        [251, 188, 4],
        [52, 168, 83]
    ];
    const rgba = (color, alpha) => `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;
    const seededValue = (seed) => {
        const value = Math.sin(seed * 127.1) * 43758.5453123;
        return value - Math.floor(value);
    };

    let width = 0;
    let height = 0;
    let nodes = [];
    let edges = [];
    let animationFrame = 0;
    let visible = !document.hidden;

    const pointer = {
        x: window.innerWidth * 0.5,
        y: window.innerHeight * 0.36,
        targetX: window.innerWidth * 0.5,
        targetY: window.innerHeight * 0.36,
        active: false
    };

    const buildField = () => {
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.round(width * ratio);
        canvas.height = Math.round(height * ratio);
        context.setTransform(ratio, 0, 0, ratio, 0, 0);

        const columns = width > 1480 ? 9 : width > 1240 ? 8 : width > 960 ? 7 : width > 720 ? 6 : 4;
        const rows = height > 980 ? 8 : height > 820 ? 7 : height > 660 ? 6 : 5;
        const insetX = Math.max(40, width * 0.055);
        const insetY = Math.max(34, height * 0.08);
        const spanX = Math.max(width - insetX * 2, 1);
        const spanY = Math.max(height - insetY * 2, 1);
        const stepX = columns > 1 ? spanX / (columns - 1) : spanX;
        const stepY = rows > 1 ? spanY / (rows - 1) : spanY;

        nodes = [];
        edges = [];

        for (let row = 0; row < rows; row += 1) {
            for (let column = 0; column < columns; column += 1) {
                const index = row * columns + column;
                const jitterX = (seededValue(index + 1) - 0.5) * stepX * 0.28;
                const jitterY = (seededValue(index + 19) - 0.5) * stepY * 0.3;

                nodes.push({
                    x: insetX + stepX * column + jitterX,
                    y: insetY + stepY * row + jitterY,
                    driftX: 12 + seededValue(index + 31) * 24,
                    driftY: 10 + seededValue(index + 47) * 22,
                    speed: 0.85 + seededValue(index + 61) * 1.35,
                    phase: seededValue(index + 73) * Math.PI * 2,
                    pull: 22 + seededValue(index + 97) * 28,
                    reach: 220 + seededValue(index + 109) * 150,
                    ring: 12 + seededValue(index + 127) * 20,
                    dot: 1.8 + seededValue(index + 149) * 2.8,
                    colorIndex: index % palette.length
                });

                if (column < columns - 1) {
                    edges.push([index, index + 1]);
                }

                if (row < rows - 1) {
                    edges.push([index, index + columns]);
                }

                if (column < columns - 1 && row < rows - 1 && (row + column) % 2 === 0) {
                    edges.push([index, index + columns + 1]);
                }
            }
        }

        pointer.x = Math.min(pointer.x, width);
        pointer.y = Math.min(pointer.y, height);
        pointer.targetX = Math.min(pointer.targetX, width);
        pointer.targetY = Math.min(pointer.targetY, height);
    };

    const getPositions = (time) => {
        const timeFactor = time * 0.00032;

        return nodes.map((node) => {
            const orbitX = Math.cos(timeFactor * node.speed + node.phase) * node.driftX;
            const orbitY = Math.sin(timeFactor * (node.speed * 0.92) + node.phase * 1.14) * node.driftY;
            let x = node.x + orbitX;
            let y = node.y + orbitY;

            const offsetX = x - pointer.x;
            const offsetY = y - pointer.y;
            const distance = Math.hypot(offsetX, offsetY) || 1;
            const influence = Math.max(0, 1 - distance / node.reach);

            x += (offsetX / distance) * influence * node.pull;
            y += (offsetY / distance) * influence * node.pull * 0.72;

            return {
                x,
                y,
                influence
            };
        });
    };

    const render = (time = 0) => {
        animationFrame = 0;
        if (!visible) {
            return;
        }

        pointer.x += (pointer.targetX - pointer.x) * 0.08;
        pointer.y += (pointer.targetY - pointer.y) * 0.08;

        context.clearRect(0, 0, width, height);

        const positions = getPositions(time);

        edges.forEach(([startIndex, endIndex]) => {
            const start = positions[startIndex];
            const end = positions[endIndex];
            const startNode = nodes[startIndex];
            const endNode = nodes[endIndex];
            const emphasis = Math.max(start.influence, end.influence);
            const midpointX = (start.x + end.x) * 0.5;
            const midpointY = (start.y + end.y) * 0.5;
            const curve = Math.sin(time * 0.00042 + startNode.phase + endNode.phase) * (8 + emphasis * 10);
            const gradient = context.createLinearGradient(start.x, start.y, end.x, end.y);

            gradient.addColorStop(0, rgba(palette[startNode.colorIndex], 0.075 + emphasis * 0.16));
            gradient.addColorStop(0.5, rgba(palette[startNode.colorIndex], 0.035 + emphasis * 0.08));
            gradient.addColorStop(1, rgba(palette[endNode.colorIndex], 0.07 + emphasis * 0.14));

            context.beginPath();
            context.strokeStyle = gradient;
            context.lineWidth = 1.15 + emphasis * 0.9;
            context.moveTo(start.x, start.y);
            context.quadraticCurveTo(midpointX + curve, midpointY - curve, end.x, end.y);
            context.stroke();
        });

        positions.forEach((position, index) => {
            const node = nodes[index];
            const color = palette[node.colorIndex];
            const emphasis = position.influence;

            context.beginPath();
            context.strokeStyle = rgba(color, 0.12 + emphasis * 0.2);
            context.lineWidth = 1.1;
            context.arc(position.x, position.y, node.ring + emphasis * 5, 0, Math.PI * 2);
            context.stroke();

            context.beginPath();
            context.strokeStyle = rgba(color, 0.055 + emphasis * 0.1);
            context.lineWidth = 1;
            context.arc(position.x, position.y, node.ring * 0.5 + emphasis * 3.2, 0, Math.PI * 2);
            context.stroke();

            context.beginPath();
            context.fillStyle = rgba(color, 0.22 + emphasis * 0.24);
            context.arc(position.x, position.y, node.dot + emphasis * 1.15, 0, Math.PI * 2);
            context.fill();

            context.beginPath();
            context.fillStyle = rgba(color, 0.03 + emphasis * 0.08);
            context.arc(position.x, position.y, node.ring * 1.55 + emphasis * 8, 0, Math.PI * 2);
            context.fill();
        });

        if (pointer.active) {
            const pointerGlow = context.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 280);
            pointerGlow.addColorStop(0, 'rgba(255, 255, 255, 0.24)');
            pointerGlow.addColorStop(0.28, 'rgba(26, 115, 232, 0.08)');
            pointerGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
            context.fillStyle = pointerGlow;
            context.beginPath();
            context.arc(pointer.x, pointer.y, 280, 0, Math.PI * 2);
            context.fill();
        }

        if (!prefersReducedMotion.matches) {
            animationFrame = window.requestAnimationFrame(render);
        }
    };

    const scheduleRender = () => {
        if (animationFrame || !visible) {
            return;
        }

        animationFrame = window.requestAnimationFrame(render);
    };

    const resetPointer = () => {
        pointer.targetX = width * 0.5;
        pointer.targetY = height * 0.36;
        pointer.active = false;
        scheduleRender();
    };

    buildField();
    render(0);

    window.addEventListener('pointermove', (event) => {
        pointer.targetX = event.clientX;
        pointer.targetY = event.clientY;
        pointer.active = true;
        scheduleRender();
    }, { passive: true });

    window.addEventListener('pointerleave', resetPointer);
    window.addEventListener('mouseout', (event) => {
        if (!event.relatedTarget) {
            resetPointer();
        }
    });
    window.addEventListener('blur', resetPointer);
    window.addEventListener('resize', () => {
        if (animationFrame) {
            window.cancelAnimationFrame(animationFrame);
            animationFrame = 0;
        }
        buildField();
        render(0);
    });

    document.addEventListener('visibilitychange', () => {
        visible = !document.hidden;
        if (visible) {
            scheduleRender();
        } else if (animationFrame) {
            window.cancelAnimationFrame(animationFrame);
            animationFrame = 0;
        }
    });
}

initAmbientField();
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
