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

/* --- 1. REALISTIC 3D ARCHITECTURAL HOUSE & INTERACTIVE STARS --- */
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

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 4.2, 15);

    // Multi-Point Architectural Lighting
    const ambientLight = new THREE.AmbientLight(0xfffdf9, 1.15);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0x38bdf8, 2.0);
    sunLight.position.set(14, 22, 14);
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0x0284c7, 1.3);
    fillLight.position.set(-14, -5, -10);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x7dd3fc, 1.6, 32);
    rimLight.position.set(0, 10, -5);
    scene.add(rimLight);

    // 3D House Group
    const houseGroup = new THREE.Group();
    scene.add(houseGroup);

    // Ultra-Refined PBR Materials
    const wallMat = new THREE.MeshStandardMaterial({
        color: 0xfaf8f5,
        roughness: 0.3,
        metalness: 0.05,
        transparent: true,
        opacity: 0.96
    });

    const roofMat = new THREE.MeshStandardMaterial({
        color: 0x072b3e,
        roughness: 0.25,
        metalness: 0.45,
        transparent: true,
        opacity: 0.98
    });

    const glassMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        roughness: 0.05,
        metalness: 0.95,
        emissive: 0x0284c7,
        emissiveIntensity: 0.35,
        transparent: true,
        opacity: 0.85
    });

    const woodAccentMat = new THREE.MeshStandardMaterial({
        color: 0x0f4c81,
        roughness: 0.35,
        metalness: 0.25
    });

    // PISO / GRAMADO DA CASA 3D - ESVERDIADINHO REFINADO
    const groundMat = new THREE.MeshStandardMaterial({
        color: 0x3b7a57,
        roughness: 0.55,
        metalness: 0.1,
        transparent: true,
        opacity: 0.82
    });

    // --- 1. MODERN LUXURY VILLA STRUCTURE ---
    const mainBodyGeo = new THREE.BoxGeometry(8.4, 4.4, 6.2);
    const mainBodyMesh = new THREE.Mesh(mainBodyGeo, wallMat);
    mainBodyMesh.position.y = 0;
    houseGroup.add(mainBodyMesh);

    const upperGeo = new THREE.BoxGeometry(6.0, 3.8, 5.4);
    const upperMesh = new THREE.Mesh(upperGeo, wallMat);
    upperMesh.position.set(-1.2, 4.1, 0.4);
    houseGroup.add(upperMesh);

    // Architectural Wood Louver Accent Panel
    const louverPanelGeo = new THREE.BoxGeometry(2.4, 3.2, 0.1);
    const louverPanel = new THREE.Mesh(louverPanelGeo, woodAccentMat);
    louverPanel.position.set(1.4, 4.1, 3.12);
    houseGroup.add(louverPanel);

    // --- 2. MULTI-GABLED SLATE ROOFS ---
    const mainRoofGeo = new THREE.CylinderGeometry(0, 6.5, 3.3, 4);
    const mainRoofMesh = new THREE.Mesh(mainRoofGeo, roofMat);
    mainRoofMesh.position.set(-1.2, 7.65, 0.4);
    mainRoofMesh.rotation.y = Math.PI / 4;
    houseGroup.add(mainRoofMesh);

    const sideRoofGeo = new THREE.CylinderGeometry(0, 4.0, 2.3, 4);
    const sideRoofMesh = new THREE.Mesh(sideRoofGeo, roofMat);
    sideRoofMesh.position.set(2.9, 3.35, 0);
    sideRoofMesh.rotation.y = Math.PI / 4;
    houseGroup.add(sideRoofMesh);

    // --- 3. GLASS BALCONY & COLUMNS ---
    const balconyGlassGeo = new THREE.BoxGeometry(3.6, 1.1, 0.08);
    const balconyGlass = new THREE.Mesh(balconyGlassGeo, glassMat);
    balconyGlass.position.set(1.5, 3.2, 3.15);
    houseGroup.add(balconyGlass);

    const pillarGeo = new THREE.CylinderGeometry(0.14, 0.14, 4.2, 24);
    const pillarPositions = [
        [-3.2, 0, 3.8], [-1.2, 0, 3.8], [1.2, 0, 3.8], [3.2, 0, 3.8]
    ];

    pillarPositions.forEach(pos => {
        const pillar = new THREE.Mesh(pillarGeo, wallMat);
        pillar.position.set(pos[0], pos[1], pos[2]);
        houseGroup.add(pillar);
    });

    const porchSlabGeo = new THREE.BoxGeometry(7.4, 0.25, 1.8);
    const porchSlab = new THREE.Mesh(porchSlabGeo, woodAccentMat);
    porchSlab.position.set(0, 2.2, 3.8);
    houseGroup.add(porchSlab);

    // --- 4. PANORAMIC GLASS WINDOWS & DOORS ---
    const windowGeo = new THREE.BoxGeometry(1.5, 1.7, 0.08);

    const windowUpper1 = new THREE.Mesh(windowGeo, glassMat);
    windowUpper1.position.set(-2.5, 4.3, 3.15);
    houseGroup.add(windowUpper1);

    const windowGround1 = new THREE.Mesh(windowGeo, glassMat);
    windowGround1.position.set(-2.5, 0.4, 3.15);
    houseGroup.add(windowGround1);

    const doorGeo = new THREE.BoxGeometry(1.6, 2.6, 0.08);
    const doorMesh = new THREE.Mesh(doorGeo, glassMat);
    doorMesh.position.set(0, -0.9, 3.15);
    houseGroup.add(doorMesh);

    const garageGeo = new THREE.BoxGeometry(2.9, 2.4, 0.08);
    const garageMesh = new THREE.Mesh(garageGeo, woodAccentMat);
    garageMesh.position.set(2.6, -0.9, 3.15);
    houseGroup.add(garageMesh);

    // --- 5. CHIMNEY ---
    const chimneyGeo = new THREE.BoxGeometry(1.0, 3.0, 1.0);
    const chimney = new THREE.Mesh(chimneyGeo, woodAccentMat);
    chimney.position.set(-2.8, 7.8, -1.2);
    houseGroup.add(chimney);

    // --- 6. SMOOTH LANDSCAPE BASE & STEPS (PISO ESVERDIADINHO) ---
    const groundGeo = new THREE.CylinderGeometry(11.8, 11.8, 0.35, 48);
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.position.y = -2.38;
    houseGroup.add(groundMesh);

    // Entrance Steps
    const stepGeo = new THREE.BoxGeometry(2.2, 0.15, 0.8);
    const stepMesh = new THREE.Mesh(stepGeo, wallMat);
    stepMesh.position.set(0, -2.15, 3.6);
    houseGroup.add(stepMesh);

    // Architectural Pine Trees
    const treeGeo = new THREE.ConeGeometry(1.3, 3.4, 12);
    const treeMat = new THREE.MeshStandardMaterial({ color: 0x2e6f40, roughness: 0.4 });
    const treeTrunkGeo = new THREE.CylinderGeometry(0.2, 0.25, 1.2, 12);

    const treePositions = [
        [-6.5, -0.8, -3], [-6.8, -0.8, 2.5], [6.5, -0.8, -3], [6.8, -0.8, 2]
    ];

    treePositions.forEach(pos => {
        const treeFoliage = new THREE.Mesh(treeGeo, treeMat);
        treeFoliage.position.set(pos[0], pos[1] + 1.7, pos[2]);
        houseGroup.add(treeFoliage);

        const treeTrunk = new THREE.Mesh(treeTrunkGeo, woodAccentMat);
        treeTrunk.position.set(pos[0], pos[1], pos[2]);
        houseGroup.add(treeTrunk);
    });

    // --- 7. INTERACTIVE 3D TWINKLING STARS FIELD ---
    const starCount = 280;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
        starPositions[i] = (Math.random() - 0.5) * 60;
        starPositions[i + 1] = (Math.random() - 0.3) * 35;
        starPositions[i + 2] = (Math.random() - 0.5) * 40 - 5;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

    const starMat = new THREE.PointsMaterial({
        color: 0x38bdf8,
        size: 0.28,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending
    });

    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // Initial Position & Scale (Adjusted for mobile screens)
    const isMobile = window.innerWidth <= 768;
    const initialScale = isMobile ? 0.75 : 1.12;
    const initialPosX = isMobile ? 0 : 3.5;

    houseGroup.position.set(initialPosX, 0, -2);
    houseGroup.scale.set(initialScale, initialScale, initialScale);

    // Mouse & Touch Interaction Dynamics
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

    // Resize & Orientation Change Handlers
    function updateCanvasDimensions() {
        width = window.innerWidth;
        height = window.innerHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);

        const mobileCheck = width <= 768;
        const targetScale = mobileCheck ? 0.75 : 1.12;
        houseGroup.scale.set(targetScale, targetScale, targetScale);
    }

    window.addEventListener('resize', updateCanvasDimensions);
    window.addEventListener('orientationchange', () => {
        setTimeout(updateCanvasDimensions, 200);
    });

    // Render Animation Loop (60FPS SMOOTH)
    function animateLoop() {
        requestAnimationFrame(animateLoop);

        const totalScrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollFraction = totalScrollHeight > 0 ? window.pageYOffset / totalScrollHeight : 0;
        const isMobileScreen = width <= 768;

        // Continuous 360° Smooth Rotation
        houseGroup.rotation.y += 0.0035;

        // Continuous Floating Motion
        const time = Date.now() * 0.0012;
        houseGroup.position.y = Math.sin(time) * 0.2 + (scrollFraction * 1.2 - 0.6);
        houseGroup.position.x = isMobileScreen ? 0 : (3.5 - (scrollFraction * 7));

        // Twinkling Interactive Star Motion & Rotation
        starField.rotation.y += 0.0006;
        starField.rotation.x = mouseY * 0.05;
        starMat.opacity = 0.55 + Math.sin(time * 2.5) * 0.25;

        // Smooth Camera & House Tilt
        houseGroup.rotation.x = (mouseY * 0.08) + Math.sin(scrollFraction * Math.PI * 2) * 0.12;
        houseGroup.rotation.z = Math.cos(time * 0.5) * 0.02;

        camera.position.x += (mouseX * 1.2 - camera.position.x) * 0.04;
        camera.position.y += (-mouseY * 1.2 + 4.2 - camera.position.y) * 0.04;
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
