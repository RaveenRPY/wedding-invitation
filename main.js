// --- 1. Setup Three.js Scene ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0); // Transparent background
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
document.getElementById('scene-container').appendChild(renderer.domElement);

// --- 2. Lighting Setup ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

// Enhanced lighting for gold rings
const pointLight1 = new THREE.PointLight(0xFFD700, 2.0); // Warm gold light
pointLight1.position.set(5, 5, 5);
pointLight1.castShadow = true;
pointLight1.shadow.mapSize.width = 2048;
pointLight1.shadow.mapSize.height = 2048;
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xFFA500, 1.5); // Warm orange-gold light
pointLight2.position.set(-5, -5, 5);
pointLight2.castShadow = true;
scene.add(pointLight2);

const pointLight3 = new THREE.PointLight(0xFFFFFF, 1.0); // White fill light
pointLight3.position.set(0, 5, -5);
scene.add(pointLight3);

// Add directional light for better gold reflection
const directionalLight = new THREE.DirectionalLight(0xFFD700, 1.5);
directionalLight.position.set(5, 10, 5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
scene.add(directionalLight);

// --- 3. Create Wedding Rings - Real Gold ---
const rings = [];

// First ring - Real Gold (14K/18K gold color)
const ringGeometry1 = new THREE.TorusGeometry(1.2, 0.15, 32, 100);
const ringMaterial1 = new THREE.MeshStandardMaterial({
    color: 0xFFD700, // Classic gold color
    metalness: 0.98, // Very metallic
    roughness: 0.15, // Smooth and reflective
    emissive: 0xFFD700,
    emissiveIntensity: 0.1, // Subtle glow
    envMapIntensity: 1.5 // Enhanced environment reflection
});
const ring1 = new THREE.Mesh(ringGeometry1, ringMaterial1);
ring1.position.set(-0.6, 0, 0);
ring1.rotation.y = Math.PI / 6;
ring1.castShadow = true;
ring1.receiveShadow = true;
scene.add(ring1);
rings.push(ring1);

// Second ring - Real Gold (slightly different shade for variety)
const ringGeometry2 = new THREE.TorusGeometry(1, 0.15, 32, 100);
const ringMaterial2 = new THREE.MeshStandardMaterial({
    color: 0xF4D03F, // Warmer gold tone
    metalness: 0.98,
    roughness: 0.15,
    emissive: 0xF4D03F,
    emissiveIntensity: 0.1,
    envMapIntensity: 1.5
});
const ring2 = new THREE.Mesh(ringGeometry2, ringMaterial2);
ring2.position.set(0.6, 0, 0);
ring2.rotation.y = -Math.PI / 6;
ring2.castShadow = true;
ring2.receiveShadow = true;
scene.add(ring2);
rings.push(ring2);

// --- 4. Create Floating Hearts ---
const particles = [];
const particleCount = 80;

// Create heart shape
function createHeartShape() {
    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, 0.25);
    heartShape.bezierCurveTo(0, 0.25, -0.25, 0.5, -0.25, 0);
    heartShape.bezierCurveTo(-0.25, -0.25, 0, -0.5, 0, -0.75);
    heartShape.bezierCurveTo(0, -0.5, 0.25, -0.25, 0.25, 0);
    heartShape.bezierCurveTo(0.25, 0.5, 0, 0.25, 0, 0.25);
    return heartShape;
}

for (let i = 0; i < particleCount; i++) {
    // Create heart-shaped particles
    const heartShape = createHeartShape();
    const heartGeometry = new THREE.ShapeGeometry(heartShape);
    const particleMaterial = new THREE.MeshBasicMaterial({
        color: Math.random() > 0.33 ? (Math.random() > 0.5 ? 0x87A96B : 0xA8C090) : 0xE8F0E4,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide
    });
    
    const particle = new THREE.Mesh(heartGeometry, particleMaterial);
    
    // Random position
    particle.position.x = (Math.random() - 0.5) * 30;
    particle.position.y = (Math.random() - 0.5) * 30;
    particle.position.z = (Math.random() - 0.5) * 20;
    
    // Random scale for variety
    const scale = Math.random() * 0.3 + 0.15;
    particle.scale.set(scale, scale, scale);
    
    // Random velocity for floating effect
    particle.velocity = {
        x: (Math.random() - 0.5) * 0.02,
        y: Math.random() * 0.02 + 0.01,
        z: (Math.random() - 0.5) * 0.02
    };
    
    scene.add(particle);
    particles.push(particle);
}

camera.position.z = 8;

// --- 5. Animation Loop ---
function animate() {
    requestAnimationFrame(animate);
    
    // Gentle rotation for rings
    rings.forEach((ring, index) => {
        ring.rotation.x += 0.001;
        ring.rotation.y += 0.002;
        
        // Gentle floating motion
        ring.position.y = Math.sin(Date.now() * 0.001 + index) * 0.1;
    });
    
    // Animate particles
    particles.forEach(particle => {
        particle.position.x += particle.velocity.x;
        particle.position.y += particle.velocity.y;
        particle.position.z += particle.velocity.z;
        
        // Reset particles that go too far
        if (particle.position.y > 15) particle.position.y = -15;
        if (particle.position.x > 15) particle.position.x = -15;
        if (particle.position.x < -15) particle.position.x = 15;
        if (particle.position.z > 10) particle.position.z = -10;
        if (particle.position.z < -10) particle.position.z = 10;
        
        // Gentle rotation
        particle.rotation.x += 0.01;
        particle.rotation.y += 0.01;
    });
    
    // Gentle camera sway
    camera.position.x = Math.sin(Date.now() * 0.0003) * 0.5;
    camera.position.y = Math.cos(Date.now() * 0.0002) * 0.3;
    camera.lookAt(scene.position);
    
    renderer.render(scene, camera);
}
animate();

// Handle window resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- 6. GSAP ScrollTrigger Animations ---
gsap.registerPlugin(ScrollTrigger);

// Hero section - rings come together
gsap.to(ring1.position, {
    x: 0.3,
    scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
    }
});

gsap.to(ring2.position, {
    x: -0.3,
    scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
    }
});

// Date section - rings rotate and scale
gsap.to(rings[0].rotation, {
    z: Math.PI * 2,
    scrollTrigger: {
        trigger: "#datetime-section",
        start: "top bottom",
        end: "center center",
        scrub: true,
    }
});

gsap.to(rings[1].rotation, {
    z: -Math.PI * 2,
    scrollTrigger: {
        trigger: "#datetime-section",
        start: "top bottom",
        end: "center center",
        scrub: true,
    }
});

// Story section - rings orbit
gsap.to(rings[0].position, {
    x: -1.5,
    y: 1,
    scrollTrigger: {
        trigger: "#story-section",
        start: "top center",
        end: "bottom center",
        scrub: true,
    }
});

gsap.to(rings[1].position, {
    x: 1.5,
    y: -1,
    scrollTrigger: {
        trigger: "#story-section",
        start: "top center",
        end: "bottom center",
        scrub: true,
    }
});

// RSVP section - rings scale up and glow
gsap.to(rings[0].scale, {
    x: 1.5,
    y: 1.5,
    z: 1.5,
    scrollTrigger: {
        trigger: "#rsvp-section",
        start: "top center",
        end: "center center",
        scrub: true,
    }
});

gsap.to(rings[1].scale, {
    x: 1.5,
    y: 1.5,
    z: 1.5,
    scrollTrigger: {
        trigger: "#rsvp-section",
        start: "top center",
        end: "center center",
        scrub: true,
    }
});

// Animate content cards on scroll
gsap.utils.toArray('.section-content').forEach((section, index) => {
    gsap.from(section, {
        opacity: 0,
        y: 50,
        scale: 0.95,
        scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 50%",
            scrub: 1,
        }
    });
});

// Animate story timeline items
gsap.utils.toArray('.story-item').forEach((item, index) => {
    gsap.from(item, {
        opacity: 0,
        x: -30,
        scrollTrigger: {
            trigger: item,
            start: "top 85%",
            end: "top 65%",
            scrub: 1,
        }
    });
});

// --- 7. Countdown Timer ---
function updateCountdown() {
    const weddingDate = new Date('January 31, 2026 16:00:00').getTime();
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = days;
        document.getElementById('hours').textContent = hours;
        document.getElementById('minutes').textContent = minutes;
        document.getElementById('seconds').textContent = seconds;
    } else {
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
    }
}

// Update countdown every second
setInterval(updateCountdown, 1000);
updateCountdown(); // Initial call

// --- 8. RSVP Button Handler ---
function handleRSVP() {
    const response = confirm('Would you like to RSVP for Nikini & Raveen\'s Wedding?\n\nClick OK to confirm your attendance, or Cancel to go back.');
    if (response) {
        alert('Thank you for your RSVP! 💕\n\nIn a real implementation, this would:\n- Open an RSVP form\n- Collect guest details\n- Handle dietary requirements\n- Send confirmation email\n\nWe look forward to celebrating with you!');
    }
}

// --- 9. Map Function ---
function openMap() {
    const address = 'Hotel Royal Ramesses';
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(mapsUrl, '_blank');
}

// Make functions available globally
window.handleRSVP = handleRSVP;
window.openMap = openMap;

// --- 10. Add Scroll Animations for New Sections ---
gsap.utils.toArray('.countdown-box').forEach((box, index) => {
    gsap.from(box, {
        opacity: 0,
        scale: 0.8,
        y: 30,
        scrollTrigger: {
            trigger: box,
            start: "top 85%",
            end: "top 65%",
            scrub: 1,
        }
    });
});

gsap.utils.toArray('.schedule-item').forEach((item, index) => {
    gsap.from(item, {
        opacity: 0,
        x: index % 2 === 0 ? -50 : 50,
        scrollTrigger: {
            trigger: item,
            start: "top 85%",
            end: "top 65%",
            scrub: 1,
        }
    });
});

gsap.utils.toArray('.dress-card').forEach((card, index) => {
    gsap.from(card, {
        opacity: 0,
        y: 50,
        rotation: index % 2 === 0 ? -5 : 5,
        scrollTrigger: {
            trigger: card,
            start: "top 85%",
            end: "top 65%",
            scrub: 1,
        }
    });
});

gsap.utils.toArray('.gallery-item').forEach((item, index) => {
    gsap.from(item, {
        opacity: 0,
        scale: 0.5,
        rotation: (index % 2 === 0 ? 1 : -1) * 10,
        scrollTrigger: {
            trigger: item,
            start: "top 90%",
            end: "top 70%",
            scrub: 1,
        }
    });
});