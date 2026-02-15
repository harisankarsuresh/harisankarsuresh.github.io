const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const canvasContainer = document.getElementById('canvas-container');
if (canvasContainer && window.THREE) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvasContainer.appendChild(renderer.domElement);

    const group = new THREE.Group();

    const planeGeometry = new THREE.PlaneGeometry(9, 7, 80, 64);
    const planeMaterial = new THREE.MeshStandardMaterial({
        color: 0x5ce1e6,
        wireframe: true,
        transparent: true,
        opacity: 0.24
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2.6;
    plane.position.y = -0.5;
    group.add(plane);

    const basePositions = planeGeometry.attributes.position.array.slice();

    const pointCount = 320;
    const pointPositions = new Float32Array(pointCount * 3);
    for (let i = 0; i < pointCount; i++) {
        const x = (Math.random() - 0.5) * 7;
        const y = (Math.random() - 0.2) * 4;
        const z = (Math.random() - 0.5) * 2;
        pointPositions[i * 3] = x;
        pointPositions[i * 3 + 1] = y;
        pointPositions[i * 3 + 2] = z;
    }

    const pointsGeometry = new THREE.BufferGeometry();
    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(pointPositions, 3));

    const pointsMaterial = new THREE.PointsMaterial({
        color: 0xf6c453,
        size: 0.05,
        transparent: true,
        opacity: 0.5
    });

    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    group.add(points);

    scene.add(group);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambientLight);

    const keyLight = new THREE.PointLight(0x7d7cff, 1.0);
    keyLight.position.set(5, 6, 6);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0x5ce1e6, 0.8);
    fillLight.position.set(-5, -4, 3);
    scene.add(fillLight);

    camera.position.set(0, 1.2, 7);

    let mouseX = 0;
    let mouseY = 0;
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    let clock = 0;

    function animate() {
        if (!prefersReducedMotion) {
            clock += 0.015;

            const positions = planeGeometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                const x = basePositions[i];
                const y = basePositions[i + 1];
                const wave = Math.sin(x * 0.9 + clock) * 0.18 + Math.cos(y * 0.7 - clock) * 0.14;
                positions[i + 2] = wave;
            }
            planeGeometry.attributes.position.needsUpdate = true;

            group.rotation.y += 0.0009;
            group.rotation.x = -0.45 + mouseY * 0.05;
            group.rotation.z = 0.12 + mouseX * 0.04;

            points.rotation.y -= 0.0009;
        }

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

const navLinks = document.querySelectorAll('nav a.nav-link');
navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
        const targetUrl = new URL(link.href, window.location.origin);
        const currentUrl = new URL(window.location.href);
        if (targetUrl.pathname === currentUrl.pathname && targetUrl.hash) {
            const target = document.querySelector(targetUrl.hash);
            if (target) {
                event.preventDefault();
                target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
            }
        }
    });
});

const revealElements = document.querySelectorAll('.reveal');
if (revealElements.length) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    revealElements.forEach((el) => revealObserver.observe(el));
}

const sections = document.querySelectorAll('section[id]');
if (sections.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                const navLink = document.querySelector(`nav a[href="#${id}"]`);
                if (navLink) {
                    document.querySelectorAll('nav a').forEach((link) => link.classList.remove('active'));
                    navLink.classList.add('active');
                }
            }
        });
    }, { rootMargin: '-45% 0px -45% 0px' });

    sections.forEach((section) => sectionObserver.observe(section));
}
