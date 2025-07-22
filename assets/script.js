// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// --- 3D Microchip Model ---
const group = new THREE.Group();
const chipBodyMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    metalness: 0.7,
    roughness: 0.4,
});
const chipBody = new THREE.Mesh(new THREE.BoxGeometry(2.5, 2.5, 0.2), chipBodyMaterial);
group.add(chipBody);

const dieMaterial = new THREE.MeshStandardMaterial({
    color: 0x00f2ff,
    metalness: 0.9,
    roughness: 0.2,
    emissive: 0x00aaff,
    emissiveIntensity: 0.5
});
const die = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 0.1), dieMaterial);
die.position.z = 0.15;
group.add(die);

const pinMaterial = new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    metalness: 1.0,
    roughness: 0.2
});
const pinGeometry = new THREE.BoxGeometry(0.1, 0.4, 0.1);
for (let i = 0; i < 8; i++) {
    // Top and Bottom pins
    const pinTop = new THREE.Mesh(pinGeometry, pinMaterial);
    pinTop.position.set(i * 0.3 - 1.05, 1.45, 0);
    group.add(pinTop);
    const pinBottom = new THREE.Mesh(pinGeometry, pinMaterial);
    pinBottom.position.set(i * 0.3 - 1.05, -1.45, 0);
    group.add(pinBottom);

    // Left and Right pins (excluding corners)
    if (i > 0 && i < 7) {
        const pinLeft = new THREE.Mesh(pinGeometry, pinMaterial);
        pinLeft.rotation.z = Math.PI / 2;
        pinLeft.position.set(-1.45, i * 0.3 - 1.05, 0);
        group.add(pinLeft);
        const pinRight = new THREE.Mesh(pinGeometry, pinMaterial);
        pinRight.rotation.z = Math.PI / 2;
        pinRight.position.set(1.45, i * 0.3 - 1.05, 0);
        group.add(pinRight);
    }
}

scene.add(group);

// --- Lighting ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0x00e5ff, 1);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

camera.position.z = 5;

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// Scroll-based animations
function update3D() {
    const scrollY = window.scrollY;
    
    // Rotate based on global scroll
    group.rotation.x = scrollY * 0.001;
    group.rotation.y = scrollY * 0.001;

    // Zoom in/out based on scroll
    camera.position.z = 5 - (scrollY / (document.body.scrollHeight - window.innerHeight)) * 3;
}

window.addEventListener('scroll', update3D);

// Smooth scrolling for nav links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Intersection observer for section visibility and nav link highlighting
const sections = document.querySelectorAll('.content-section');
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        const id = entry.target.getAttribute('id');
        const navLink = document.querySelector(`nav a[href="#${id}"]`);
        
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (navLink) {
                document.querySelectorAll('nav a').forEach(link => link.classList.remove('active'));
                navLink.classList.add('active');
            }
        }
    });
}, { rootMargin: '-50% 0px -50% 0px' });

sections.forEach(section => {
    observer.observe(section);
});