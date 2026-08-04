/* ==========================================================================
   SERRA REFORMA & SOLUÇÕES - REALISTIC 3D SCENE WITH INTERACTIVE STARS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize 3D Scene with House & Interactive Stars
    init3DHouseBackground();

    // 2. Initialize Navbar Scroll & Mobile Menu Drawer
    initNavbar();

    // 3. Initialize Interactive Budget Simulator Widget
    initSimulator();

    // 4. Initialize Animated Stat Counters
    initCounters();

    // 5. Initialize Portfolio Category Filter Tabs
    initPortfolioFilter();

    // 6. Initialize FAQ Accordion
    initFAQ();

    // 7. Initialize 3D Card Tilt Effect
    init3DTilt();

    // 8. Initialize Scroll Reveal Observer
    initScrollReveal();

    // 9. Initialize Contact Form Submission Handler
    initForm();
});

/* --- 1. ULTRA-MODERN ARCHITECTURAL MANSION & FLOATING BLUEPRINT BACKGROUND --- */
function init3DHouseBackground() {
    const canvas = document.getElementById('house-3d-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    // Renderer Setup with AA & Alpha transparency
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
    });

    let width = window.innerWidth;
    let height = window.innerHeight;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Scene & Architectural Atmospheric Fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a192f, 0.018);

    // Camera Setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 4.5, 16);

    // Multi-Source Architectural Lighting
    const ambientLight = new THREE.AmbientLight(0xfff8ee, 1.25);
    scene.add(ambientLight);

    const mainSun = new THREE.DirectionalLight(0x38bdf8, 2.2);
    mainSun.position.set(16, 25, 16);
    scene.add(mainSun);

    const warmInteriorLight = new THREE.PointLight(0xffaa44, 2.5, 16);
    warmInteriorLight.position.set(0, 2, 0);
    scene.add(warmInteriorLight);

    const poolBlueLight = new THREE.PointLight(0x00f0ff, 2.8, 14);
    poolBlueLight.position.set(1, -1, 4);
    scene.add(poolBlueLight);

    const rimLight = new THREE.DirectionalLight(0x0284c7, 1.5);
    rimLight.position.set(-15, 10, -12);
    scene.add(rimLight);

    // Main 3D House Container
    const houseGroup = new THREE.Group();
    scene.add(houseGroup);

    // High-End PBR Materials
    const concreteMat = new THREE.MeshStandardMaterial({
        color: 0xf3f4f6,
        roughness: 0.25,
        metalness: 0.08,
        transparent: true,
        opacity: 0.97
    });

    const metalMat = new THREE.MeshStandardMaterial({
        color: 0x111827,
        roughness: 0.3,
        metalness: 0.85
    });

    const woodMat = new THREE.MeshStandardMaterial({
        color: 0xc27838,
        roughness: 0.45,
        metalness: 0.15
    });

    const glassMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        roughness: 0.05,
        metalness: 0.9,
        emissive: 0x0284c7,
        emissiveIntensity: 0.4,
        transparent: true,
        opacity: 0.82
    });

    const glowRoomMat = new THREE.MeshBasicMaterial({
        color: 0xffb74d,
        transparent: true,
        opacity: 0.35
    });

    const poolWaterMat = new THREE.MeshStandardMaterial({
        color: 0x06b6d4,
        roughness: 0.1,
        metalness: 0.8,
        emissive: 0x0891b2,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.78
    });

    const deckMat = new THREE.MeshStandardMaterial({
        color: 0x854d0e,
        roughness: 0.6,
        metalness: 0.1
    });

    // --- ARCHITECTURAL MODEL: ULTRA-MODERN CANTILEVERED RESIDENCE --- //

    // 1. Ground Floor Main Volume (Glass & Steel Pavilion)
    const groundGeo = new THREE.BoxGeometry(9.2, 3.4, 5.8);
    const groundMesh = new THREE.Mesh(groundGeo, concreteMat);
    groundMesh.position.set(0, 0, 0);
    houseGroup.add(groundMesh);

    // Warm Interior Core Room
    const groundGlowGeo = new THREE.BoxGeometry(8.8, 3.1, 5.4);
    const groundGlowMesh = new THREE.Mesh(groundGlowGeo, glowRoomMat);
    groundGlowMesh.position.set(0, 0, 0);
    houseGroup.add(groundGlowMesh);

    // Ground Floor Panoramic Front Glass Facade
    const groundGlassGeo = new THREE.BoxGeometry(8.6, 2.8, 0.1);
    const groundGlassMesh = new THREE.Mesh(groundGlassGeo, glassMat);
    groundGlassMesh.position.set(0, 0.1, 2.92);
    houseGroup.add(groundGlassMesh);

    // Black Metal Framing Columns
    const colGeo = new THREE.BoxGeometry(0.2, 3.4, 0.2);
    [-4.4, -2.2, 0, 2.2, 4.4].forEach(x => {
        const col = new THREE.Mesh(colGeo, metalMat);
        col.position.set(x, 0, 2.95);
        houseGroup.add(col);
    });

    // 2. Upper Cantilever Floor Volume (DRAMATIC OVERHANG)
    const upperGeo = new THREE.BoxGeometry(7.4, 3.2, 6.2);
    const upperMesh = new THREE.Mesh(upperGeo, woodMat);
    upperMesh.position.set(-1.8, 3.3, 0.6);
    houseGroup.add(upperMesh);

    // Upper Floor Glass Window
    const upperGlassGeo = new THREE.BoxGeometry(5.2, 2.4, 0.1);
    const upperGlassMesh = new THREE.Mesh(upperGlassGeo, glassMat);
    upperGlassMesh.position.set(-2.2, 3.3, 3.72);
    houseGroup.add(upperGlassMesh);

    // Upper Interior Room Glow
    const upperGlowGeo = new THREE.BoxGeometry(5.0, 2.2, 5.6);
    const upperGlowMesh = new THREE.Mesh(upperGlowGeo, glowRoomMat);
    upperGlowMesh.position.set(-2.2, 3.3, 0.6);
    houseGroup.add(upperGlowMesh);

    // Flat Metal Roof Slab
    const roofSlabGeo = new THREE.BoxGeometry(7.8, 0.3, 6.6);
    const roofSlab = new THREE.Mesh(roofSlabGeo, metalMat);
    roofSlab.position.set(-1.8, 5.0, 0.6);
    houseGroup.add(roofSlab);

    // Solar Panel Array
    const solarGeo = new THREE.BoxGeometry(5.5, 0.08, 3.5);
    const solarMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.1, metalness: 0.95 });
    const solarPanel = new THREE.Mesh(solarGeo, solarMat);
    solarPanel.position.set(-1.8, 5.2, 0.6);
    houseGroup.add(solarPanel);

    // 3. Upper Terrace Glass Balcony & Deck
    const balconyGlassGeo = new THREE.BoxGeometry(3.6, 1.0, 0.08);
    const balconyGlass = new THREE.Mesh(balconyGlassGeo, glassMat);
    balconyGlass.position.set(2.4, 2.2, 3.6);
    houseGroup.add(balconyGlass);

    const balconyFloorGeo = new THREE.BoxGeometry(3.8, 0.2, 2.8);
    const balconyFloor = new THREE.Mesh(balconyFloorGeo, deckMat);
    balconyFloor.position.set(2.4, 1.6, 2.2);
    houseGroup.add(balconyFloor);

    // 4. Modern Architectural Wooden Pergola Canopy
    const pergolaBeamGeo = new THREE.BoxGeometry(0.12, 0.25, 3.8);
    for (let i = 0; i < 7; i++) {
        const beam = new THREE.Mesh(pergolaBeamGeo, woodMat);
        beam.position.set(1.0 + i * 0.5, 1.7, 4.2);
        houseGroup.add(beam);
    }

    // 5. Hardwood Deck & Concrete Steps
    const deckPlatformGeo = new THREE.BoxGeometry(11.5, 0.3, 6.0);
    const deckPlatform = new THREE.Mesh(deckPlatformGeo, deckMat);
    deckPlatform.position.set(0, -1.85, 4.0);
    houseGroup.add(deckPlatform);

    for (let i = 0; i < 3; i++) {
        const stepGeo = new THREE.BoxGeometry(2.5 + i * 0.4, 0.15, 0.9);
        const step = new THREE.Mesh(stepGeo, concreteMat);
        step.position.set(0, -1.9 - i * 0.18, 7.2 + i * 0.7);
        houseGroup.add(step);
    }

    // 6. ANIMATED INFINITY POOL WATER FEATURE
    const poolGeo = new THREE.PlaneGeometry(6.5, 3.2, 28, 28);
    const poolMesh = new THREE.Mesh(poolGeo, poolWaterMat);
    poolMesh.rotation.x = -Math.PI / 2;
    poolMesh.position.set(-2.2, -1.68, 5.2);
    houseGroup.add(poolMesh);

    const poolBorderGeo = new THREE.BoxGeometry(6.9, 0.35, 3.6);
    const poolBorderMat = new THREE.MeshStandardMaterial({ color: 0x374151, roughness: 0.4 });
    const poolBorder = new THREE.Mesh(poolBorderGeo, poolBorderMat);
    poolBorder.position.set(-2.2, -1.86, 5.2);
    houseGroup.add(poolBorder);

    const poolLightStripGeo = new THREE.BoxGeometry(6.6, 0.08, 0.08);
    const lightStripMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const poolStrip = new THREE.Mesh(poolLightStripGeo, lightStripMat);
    poolStrip.position.set(-2.2, -1.65, 3.65);
    houseGroup.add(poolStrip);

    // 7. LANDSCAPING TREES & LIGHTING BOLLARDS
    const trunkGeo = new THREE.CylinderGeometry(0.1, 0.15, 2.5, 8);
    const foliageGeo = new THREE.SphereGeometry(1.1, 12, 12);
    foliageGeo.scale(1, 1.8, 1);
    const foliageMat = new THREE.MeshStandardMaterial({ color: 0x0d9488, roughness: 0.5 });

    [[-6.2, -0.6, -1], [6.2, -0.6, 1.5], [6.5, -0.6, -3]].forEach(pos => {
        const trunk = new THREE.Mesh(trunkGeo, woodMat);
        trunk.position.set(pos[0], pos[1], pos[2]);
        houseGroup.add(trunk);

        const foliage = new THREE.Mesh(foliageGeo, foliageMat);
        foliage.position.set(pos[0], pos[1] + 1.8, pos[2]);
        houseGroup.add(foliage);
    });

    const bollardGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.8, 8);
    const bollardCapGeo = new THREE.SphereGeometry(0.12, 8, 8);
    const bollardCapMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });

    [[-5.2, -1.4, 6.8], [5.2, -1.4, 6.8], [-5.2, -1.4, 2.0], [5.2, -1.4, 2.0]].forEach(pos => {
        const bollard = new THREE.Mesh(bollardGeo, metalMat);
        bollard.position.set(pos[0], pos[1], pos[2]);
        houseGroup.add(bollard);

        const cap = new THREE.Mesh(bollardCapGeo, bollardCapMat);
        cap.position.set(pos[0], pos[1] + 0.4, pos[2]);
        houseGroup.add(cap);
    });

    // --- DYNAMIC MOVING BACKGROUND ELEMENTS --- //

    // A) 3D FLOATING BLUEPRINT GRID FLOOR
    const gridHelper = new THREE.GridHelper(60, 40, 0x0284c7, 0x0369a1);
    gridHelper.position.y = -2.8;
    gridHelper.material.opacity = 0.45;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    // B) FLOATING GEOMETRIC CONSTELLATION NODES & PRE-ALLOCATED ZERO-GC CONNECTED LINES
    const nodeCount = 50;
    const nodeGeo = new THREE.BufferGeometry();
    const nodePositions = new Float32Array(nodeCount * 3);
    const nodeVelocities = [];

    for (let i = 0; i < nodeCount; i++) {
        nodePositions[i * 3] = (Math.random() - 0.5) * 48;
        nodePositions[i * 3 + 1] = (Math.random() - 0.2) * 28 - 2;
        nodePositions[i * 3 + 2] = (Math.random() - 0.5) * 38 - 5;

        nodeVelocities.push({
            x: (Math.random() - 0.5) * 0.01,
            y: Math.random() * 0.007 + 0.003,
            z: (Math.random() - 0.5) * 0.01
        });
    }

    nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3));
    const nodeMat = new THREE.PointsMaterial({
        color: 0x38bdf8,
        size: 0.32,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const nodeNetwork = new THREE.Points(nodeGeo, nodeMat);
    scene.add(nodeNetwork);

    // Pre-allocated Line Buffer (ZERO GARBAGE COLLECTION)
    const maxLineSegs = 140;
    const linePosArray = new Float32Array(maxLineSegs * 6);
    const lineBufferAttr = new THREE.BufferAttribute(linePosArray, 3);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', lineBufferAttr);

    const lineMat = new THREE.LineBasicMaterial({
        color: 0x0284c7,
        transparent: true,
        opacity: 0.25
    });
    const lineMesh = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lineMesh);

    // C) RISING LUMINESCENT DUST / GOLDEN SPARKLES
    const dustCount = 130;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount * 3; i += 3) {
        dustPos[i] = (Math.random() - 0.5) * 50;
        dustPos[i + 1] = Math.random() * 32 - 4;
        dustPos[i + 2] = (Math.random() - 0.5) * 40;
    }

    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
        color: 0xf59e0b,
        size: 0.22,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    const dustParticles = new THREE.Points(dustGeo, dustMat);
    scene.add(dustParticles);

    // Initial Scale & Positioning (Optimized specifically for mobile & desktop)
    const isMobile = window.innerWidth <= 768;
    const initialScale = isMobile ? 0.65 : 1.05;
    const initialPosX = isMobile ? 0 : 3.2;
    const initialPosY = isMobile ? 0.6 : 0;

    houseGroup.position.set(initialPosX, initialPosY, -1);
    houseGroup.scale.set(initialScale, initialScale, initialScale);

    // Mouse & Touch Interactivity
    let mouseX = 0;
    let mouseY = 0;

    function handlePointerMove(clientX, clientY) {
        mouseX = (clientX / width - 0.5) * 2;
        mouseY = (clientY / height - 0.5) * 2;
    }

    window.addEventListener('mousemove', (e) => handlePointerMove(e.clientX, e.clientY));
    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: true });

    // Resize Event
    function updateCanvasDimensions() {
        width = window.innerWidth;
        height = window.innerHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

        const mobileCheck = width <= 768;
        const targetScale = mobileCheck ? 0.65 : 1.05;
        houseGroup.scale.set(targetScale, targetScale, targetScale);
    }

    window.addEventListener('resize', updateCanvasDimensions);
    window.addEventListener('orientationchange', () => {
        setTimeout(updateCanvasDimensions, 200);
    });

    // --- ANIMATION LOOP (SUPER HIGH PERFORMANCE) --- //
    const poolPositions = poolGeo.attributes.position;
    const originalPoolZ = [];
    for (let i = 0; i < poolPositions.count; i++) {
        originalPoolZ.push(poolPositions.getZ(i));
    }

    function animateLoop() {
        requestAnimationFrame(animateLoop);

        const time = Date.now() * 0.0012;
        const totalScrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollFraction = totalScrollHeight > 0 ? window.pageYOffset / totalScrollHeight : 0;
        const isMobileScreen = width <= 768;

        // 1. Continuous 360 Smooth Rotation & Levitation
        houseGroup.rotation.y += 0.0028;
        houseGroup.position.y = isMobileScreen 
            ? Math.sin(time * 1.1) * 0.15 + 0.6 + (scrollFraction * 0.8)
            : Math.sin(time * 1.1) * 0.2 + (scrollFraction * 1.1 - 0.55);
        houseGroup.position.x = isMobileScreen ? 0 : (3.2 - (scrollFraction * 6.5));

        // Smooth Mouse Parallax & Tilt
        houseGroup.rotation.x = (mouseY * 0.05) + Math.sin(scrollFraction * Math.PI * 2) * 0.07;
        houseGroup.rotation.z = Math.cos(time * 0.6) * 0.012;

        // 2. Animated Pool Water Wave Ripples
        for (let i = 0; i < poolPositions.count; i++) {
            const u = poolPositions.getX(i);
            const v = poolPositions.getY(i);
            const zWave = Math.sin(u * 2.5 + time * 3) * 0.045 + Math.cos(v * 2.2 + time * 2.5) * 0.035;
            poolPositions.setZ(i, originalPoolZ[i] + zWave);
        }
        poolPositions.needsUpdate = true;

        // 3. Blueprint Grid Pulsing & Rotation
        gridHelper.rotation.y += 0.0003;
        gridHelper.material.opacity = 0.32 + Math.sin(time * 1.5) * 0.1;

        // 4. Floating Network Nodes & Line Connections (ZERO GC RE-ALLOCATION)
        const posArr = nodeGeo.attributes.position.array;
        let lineIdx = 0;

        for (let i = 0; i < nodeCount; i++) {
            posArr[i * 3] += nodeVelocities[i].x;
            posArr[i * 3 + 1] += nodeVelocities[i].y;
            posArr[i * 3 + 2] += nodeVelocities[i].z;

            if (posArr[i * 3 + 1] > 25) {
                posArr[i * 3 + 1] = -5;
                posArr[i * 3] = (Math.random() - 0.5) * 48;
            }

            for (let j = i + 1; j < nodeCount; j++) {
                const dx = posArr[i * 3] - posArr[j * 3];
                const dy = posArr[i * 3 + 1] - posArr[j * 3 + 1];
                const dz = posArr[i * 3 + 2] - posArr[j * 3 + 2];
                const distSq = dx * dx + dy * dy + dz * dz;

                if (distSq < 42 && lineIdx < maxLineSegs * 6) {
                    linePosArray[lineIdx++] = posArr[i * 3];
                    linePosArray[lineIdx++] = posArr[i * 3 + 1];
                    linePosArray[lineIdx++] = posArr[i * 3 + 2];
                    linePosArray[lineIdx++] = posArr[j * 3];
                    linePosArray[lineIdx++] = posArr[j * 3 + 1];
                    linePosArray[lineIdx++] = posArr[j * 3 + 2];
                }
            }
        }
        nodeGeo.attributes.position.needsUpdate = true;
        lineGeo.setDrawRange(0, lineIdx / 3);
        lineBufferAttr.needsUpdate = true;

        // 5. Rising Sparkles Motion
        const dustArr = dustGeo.attributes.position.array;
        for (let i = 0; i < dustCount; i++) {
            dustArr[i * 3 + 1] += 0.018;
            dustArr[i * 3] += Math.sin(time + i) * 0.006;
            if (dustArr[i * 3 + 1] > 28) {
                dustArr[i * 3 + 1] = -4;
            }
        }
        dustGeo.attributes.position.needsUpdate = true;
        dustMat.opacity = 0.45 + Math.sin(time * 2) * 0.18;

        // Smooth Camera Follow
        camera.position.x += (mouseX * 1.3 - camera.position.x) * 0.04;
        camera.position.y += (-mouseY * 1.3 + 4.5 - camera.position.y) * 0.04;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
    }

    animateLoop();
}

/* --- 2. NAVBAR & MOBILE MENU DRAWER --- */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active Section Scroll Highlight
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;

        sections.forEach(sec => {
            const sectionHeight = sec.offsetHeight;
            const sectionTop = sec.offsetTop - 120;
            const sectionId = sec.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }
}

/* --- 3. INTERACTIVE BUDGET SIMULATOR --- */
function initSimulator() {
    const categoryBtns = document.querySelectorAll('#sim-category-group .sim-opt-btn');
    const areaRange = document.getElementById('sim-area-range');
    const areaValDisplay = document.getElementById('area-val-display');
    const checkGestao = document.getElementById('check-gestao');
    const checkLaudo = document.getElementById('check-laudo');

    const calcPriceDisplay = document.getElementById('calc-price-display');
    const sumServiceName = document.getElementById('sum-service-name');
    const sumAreaVal = document.getElementById('sum-area-val');
    const sumDaysVal = document.getElementById('sum-days-val');
    const btnSendWhatsApp = document.getElementById('btn-send-sim-whatsapp');

    if (!areaRange || !calcPriceDisplay) return;

    let selectedCategory = "Construção / Reforma de Casa";
    let baseRate = 180;

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedCategory = btn.getAttribute('data-name');
            baseRate = parseFloat(btn.getAttribute('data-rate'));
            updateCalculation();
        });
    });

    areaRange.addEventListener('input', () => {
        areaValDisplay.textContent = `${areaRange.value} m²`;
        updateCalculation();
    });

    if (checkGestao) checkGestao.addEventListener('change', updateCalculation);
    if (checkLaudo) checkLaudo.addEventListener('change', updateCalculation);

    function updateCalculation() {
        const area = parseInt(areaRange.value);
        let multiplier = 1;

        if (checkGestao && checkGestao.checked) multiplier += 0.15;
        if (checkLaudo && checkLaudo.checked) multiplier += 0.10;

        const totalPrice = Math.round(area * baseRate * multiplier);

        let baseDays = 8;
        if (area > 100) baseDays = 15;
        if (area > 350) baseDays = 25;
        if (area > 700) baseDays = 40;

        const maxDays = Math.round(baseDays * 1.5);

        calcPriceDisplay.textContent = totalPrice.toLocaleString('pt-BR');
        sumServiceName.textContent = selectedCategory;
        sumAreaVal.textContent = `${area} m²`;
        sumDaysVal.textContent = `${baseDays} a ${maxDays} dias úteis`;
    }

    updateCalculation();

    if (btnSendWhatsApp) {
        btnSendWhatsApp.addEventListener('click', () => {
            const area = areaRange.value;
            const price = calcPriceDisplay.textContent;
            const days = sumDaysVal.textContent;

            let extras = [];
            if (checkGestao && checkGestao.checked) extras.push('Gestão 100% In-Loco');
            if (checkLaudo && checkLaudo.checked) extras.push('Suporte Técnico');
            const extrasStr = extras.length > 0 ? extras.join(', ') : 'Nenhum';

            const message = `Ol%C3%A1!%20Fiz%20uma%20simula%C3%A7%C3%A3o%20pelo%20site%20da%20Serra%20Reforma%20%26%20Solu%C3%A7%C3%B5es%3A%0A%0A%F0%9F%93%90%20*Servi%C3%A7o%3A*%20${encodeURIComponent(selectedCategory)}%0A%F0%9F%93%90%20*Metragem%3A*%20${area}%20m%C2%B2%0A%E2%9C%85%20*Adicionais%3A*%20${encodeURIComponent(extrasStr)}%0A%F0%9F%92%B2%20*Estimativa%3A*%20R%24%20${price}%0A%E2%8F%B3%20*Prazo%20Estimado%3A*%20${encodeURIComponent(days)}%0A%0AGostaria%20de%20solicitar%20mais%20informa%C3%A7%C3%B5es%20com%20a%20equipe!`;

            window.open(`https://wa.me/5541996306393?text=${message}`, '_blank');
        });
    }
}

/* --- 4. ANIMATED STAT COUNTERS --- */
function initCounters() {
    const statCards = document.querySelectorAll('.stat-number');
    let counted = false;

    function startCounting() {
        if (counted) return;

        statCards.forEach(card => {
            const target = parseInt(card.getAttribute('data-target'));
            let current = 0;
            const increment = Math.max(1, Math.ceil(target / 40));
            const duration = 1500;
            const stepTime = duration / (target / increment || 1);

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    card.textContent = target;
                    clearInterval(timer);
                } else {
                    card.textContent = current;
                }
            }, stepTime);
        });

        counted = true;
    }

    const heroStats = document.querySelector('.hero-stats-grid');
    if (!heroStats) return;

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            startCounting();
        }
    }, { threshold: 0.5 });

    observer.observe(heroStats);
}

/* --- 5. PORTFOLIO FILTER TABS --- */
function initPortfolioFilter() {
    const filterBtns = document.querySelectorAll('.portfolio-filter-tabs .filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');

    if (!filterBtns.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            portfolioCards.forEach(card => {
                const category = card.getAttribute('data-category');

                if (filterValue === 'all' || filterValue === category) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/* --- 6. FAQ ACCORDION --- */
function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(btn => {
        btn.addEventListener('click', () => {
            const faqItem = btn.parentElement;
            const isActive = faqItem.classList.contains('active');

            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                const ans = item.querySelector('.faq-answer');
                if (ans) ans.style.maxHeight = null;
            });

            if (!isActive) {
                faqItem.classList.add('active');
                const answer = faqItem.querySelector('.faq-answer');
                if (answer) {
                    answer.style.maxHeight = answer.scrollHeight + "px";
                }
            }
        });
    });
}

/* --- 7. 3D TILT EFFECT ON CARDS --- */
function init3DTilt() {
    const tiltCards = document.querySelectorAll('[data-tilt]');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -4;
            const rotateY = ((x - centerX) / centerX) * 4;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });
}

/* --- 8. SCROLL REVEAL OBSERVER --- */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
}

/* --- 9. FORM SUBMISSION HANDLER --- */
function initForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const service = document.getElementById('service').value;
        const messageText = document.getElementById('message').value;

        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Processando Envio...</span>`;

        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<span>Enviar Solicitação no WhatsApp</span>`;

            const waMsg = `Ol%C3%A1!%20Meu%20nome%20%C3%A9%20${encodeURIComponent(name)}%20(${encodeURIComponent(phone)}).%0A%0A*Tipo%20de%20Obra%2FServi%C3%A7o%3A*%20${encodeURIComponent(service)}%0A*Mensagem%3A*%20${encodeURIComponent(messageText)}%0A%0AGostaria%20de%20solicitar%20um%20or%C3%A7amento!`;

            window.open(`https://wa.me/5541996306393?text=${waMsg}`, '_blank');
            form.reset();
        }, 800);
    });
}
