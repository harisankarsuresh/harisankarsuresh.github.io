// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// --- 3D Microchip Model ---
const group = new THREE.Group();

// Chip Body
const chipBodyMaterial = new THREE.MeshStandardMaterial({
    color: 0x222222,
    metalness: 0.8,
    roughness: 0.3,
});
const chipBody = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 0.25), chipBodyMaterial);
group.add(chipBody);

// Central Die
const dieMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000,
    metalness: 0.9,
    roughness: 0.2,
    emissive: 0x0077ff,
    emissiveIntensity: 0.2
});
const die = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 0.15), dieMaterial);
die.position.z = 0.18;
group.add(die);

// Pins
const pinMaterial = new THREE.MeshStandardMaterial({
    color: 0x999999,
    metalness: 1.0,
    roughness: 0.2
});
const pinGeometry = new THREE.BoxGeometry(0.12, 0.5, 0.1);
const numPins = 10;
const pinSpacing = 2.8 / (numPins - 1);

for (let i = 0; i < numPins; i++) {
    const xPos = -1.4 + i * pinSpacing;

    // Top pins
    const pinTop = new THREE.Mesh(pinGeometry, pinMaterial);
    pinTop.position.set(xPos, 1.75, 0);
    group.add(pinTop);

    // Bottom pins
    const pinBottom = new THREE.Mesh(pinGeometry, pinMaterial);
    pinBottom.position.set(xPos, -1.75, 0);
    group.add(pinBottom);
}

const numSidePins = 8;
const sidePinSpacing = 2.8 / (numSidePins - 1);
for (let i = 0; i < numSidePins; i++) {
    const yPos = -1.4 + i * sidePinSpacing;
    // Left pins
    const pinLeft = new THREE.Mesh(pinGeometry, pinMaterial);
    pinLeft.rotation.z = Math.PI / 2;
    pinLeft.position.set(-1.75, yPos, 0);
    group.add(pinLeft);

    // Right pins
    const pinRight = new THREE.Mesh(pinGeometry, pinMaterial);
    pinRight.rotation.z = Math.PI / 2;
    pinRight.position.set(1.75, yPos, 0);
    group.add(pinRight);
}


scene.add(group);

// --- Lighting ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xffffff, 0.8);
spotLight.position.set(5, 10, 10);
spotLight.angle = Math.PI / 8;
spotLight.penumbra = 0.2;
spotLight.castShadow = true;
scene.add(spotLight);

const pointLight = new THREE.PointLight(0x0077ff, 0.5);
pointLight.position.set(-5, -5, 5);
scene.add(pointLight);


camera.position.z = 6;

// --- Mouse Interaction ---
let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});


// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Subtle continuous rotation
    group.rotation.x += 0.001;
    group.rotation.y += 0.002;

    // Mouse follow effect
    group.rotation.x += (mouseY * 0.5 - group.rotation.x) * 0.05;
    group.rotation.y += (mouseX * 0.5 - group.rotation.y) * 0.05;


    renderer.render(scene, camera);
}
animate();

// Smooth scrolling for nav links
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
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

// Intersection observer for nav link highlighting
const sections = document.querySelectorAll('.content-section');
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        const id = entry.target.getAttribute('id');
        const navLink = document.querySelector(`nav a[href="#${id}"]`);
        
        if (entry.isIntersecting) {
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