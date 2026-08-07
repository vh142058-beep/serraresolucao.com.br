/* ==========================================================================
   SERRA REFORMA & SOLUÇÕES — MOTOR 3D FOTORREALISTA
   Three.js r128 global (sem ES modules) — funciona em qualquer browser/servidor
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Cena 3D de fundo — casa fotorrealista
    init3DHouseBackground();
    // 2. Navbar scroll & menu mobile
    initNavbar();
    // 3. Simulador de orçamento
    initSimulator();
    // 4. Contadores animados
    initCounters();
    // 5. Filtro do portfólio
    initPortfolioFilter();
    // 6. FAQ accordion
    initFAQ();
    // 7. Tilt 3D nos cards
    init3DTilt();
    // 8. Scroll reveal
    initScrollReveal();
    // 9. Formulário de contato
    initForm();
});

/* ==========================================================================
   1. MOTOR 3D — CENA FOTORREALISTA
   Sky procedural via ShaderMaterial, iluminação PBR, sombras PCFSoft,
   OrbitControls com autoRotate, casa residencial com garagem anexa.
   ========================================================================== */
function init3DHouseBackground() {
    var canvas = document.getElementById('house-3d-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    var W = window.innerWidth;
    var H = window.innerHeight;
    var isMobile = function() { return W <= 768; };

    /* ── RENDERER ─────────────────────────────────────────────────────────── */
    var renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: !isMobile(),
        alpha: false,
        powerPreference: 'high-performance'
    });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile() ? 1.5 : 2));
    renderer.shadowMap.enabled = !isMobile();
    renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
    renderer.toneMapping       = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.90;
    renderer.outputEncoding    = THREE.sRGBEncoding; // API correta do r128

    /* ── SCENE & FOG ──────────────────────────────────────────────────────── */
    var scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xC2DCF0, 32, 90);

    /* ── CÂMERA ───────────────────────────────────────────────────────────── */
    var camera = new THREE.PerspectiveCamera(48, W / H, 0.1, 200);
    camera.position.set(5, 6.5, 18);

    /* ── SKY PROCEDURAL (ShaderMaterial — sem addon externo) ──────────────── */
    var sunDir = new THREE.Vector3(-0.38, 0.56, -0.74).normalize();

    var skyVS = [
        'varying vec3 vWorldPos;',
        'void main() {',
        '  vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;',
        '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
        '}'
    ].join('\n');

    var skyFS = [
        'uniform vec3 uSunDir;',
        'varying vec3 vWorldPos;',
        'void main() {',
        '  vec3 dir   = normalize(vWorldPos);',
        '  float elev = dir.y;',
        // Gradiente zenith → horizonte → névoa quente (hora dourada)
        '  vec3 zenith  = vec3(0.10, 0.34, 0.70);',
        '  vec3 horizon = vec3(0.58, 0.80, 0.97);',
        '  vec3 haze    = vec3(0.98, 0.84, 0.62);',
        '  float t  = clamp(elev, 0.0, 1.0);',
        '  float hT = clamp(1.0 - abs(elev) * 5.0, 0.0, 1.0);',
        '  vec3 sky = mix(horizon, zenith, pow(t, 0.52));',
        '  sky = mix(sky, haze, hT * 0.52);',
        // Disco solar + halo
        '  float sd   = dot(dir, normalize(uSunDir));',
        '  float sun  = pow(max(0.0, sd), 1800.0);',
        '  float halo = pow(max(0.0, sd), 10.0) * 0.14;',
        '  sky += vec3(1.0, 0.94, 0.78) * (sun + halo);',
        // Chão (abaixo do horizonte)
        '  if (elev < 0.0) {',
        '    sky = mix(sky, vec3(0.30, 0.46, 0.20), clamp(-elev * 8.0, 0.0, 1.0));',
        '  }',
        '  gl_FragColor = vec4(sky, 1.0);',
        '}'
    ].join('\n');

    if (!isMobile()) {
        var skyMesh = new THREE.Mesh(
            new THREE.SphereGeometry(95, 24, 12),
            new THREE.ShaderMaterial({
                uniforms: { uSunDir: { value: sunDir } },
                vertexShader: skyVS,
                fragmentShader: skyFS,
                side: THREE.BackSide,
                depthWrite: false
            })
        );
        scene.add(skyMesh);
    } else {
        // Mobile: cor plana para economizar GPU
        renderer.setClearColor(0x9CCCE0, 1);
    }

    /* ── ILUMINAÇÃO PBR ───────────────────────────────────────────────────── */
    // HemisphereLight: gradiente natural céu (azul) / chão (verde)
    scene.add(new THREE.HemisphereLight(0x88C8E8, 0x4A7A30, 0.72));

    // AmbientLight balanceada
    scene.add(new THREE.AmbientLight(0xFFF4E0, 0.28));

    // Sol principal (hora dourada) com sombras PCFSoft
    var sun = new THREE.DirectionalLight(0xFFEDD5, 2.4);
    sun.position.set(-19, 28, -37); // corresponde à direção sunDir
    sun.castShadow               = !isMobile();
    sun.shadow.mapSize.width     = 2048;
    sun.shadow.mapSize.height    = 2048;
    sun.shadow.camera.near       = 1;
    sun.shadow.camera.far        = 85;
    sun.shadow.camera.left       = -20;
    sun.shadow.camera.right      = 20;
    sun.shadow.camera.top        = 20;
    sun.shadow.camera.bottom     = -20;
    sun.shadow.radius            = 4;
    sun.shadow.bias              = -0.0004;
    scene.add(sun);

    // Luz de preenchimento do lado oposto (simula reflexo do céu)
    var fill = new THREE.DirectionalLight(0xB0D5F8, 0.50);
    fill.position.set(-12, 7, 9);
    scene.add(fill);

    // Luzes interiores quentes (janelas — pisca suavemente)
    var wLight1 = new THREE.PointLight(0xFF8C30, 1.15, 7, 1.8);
    wLight1.position.set(2.7, 2.1, 3.5);
    scene.add(wLight1);

    var wLight2 = new THREE.PointLight(0xFF8C30, 1.15, 7, 1.8);
    wLight2.position.set(6.9, 2.1, 3.5);
    scene.add(wLight2);

    /* ── GRAMADO ──────────────────────────────────────────────────────────── */
    var grass = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 100),
        new THREE.MeshStandardMaterial({ color: 0x3E6B2A, roughness: 1.0 })
    );
    grass.rotation.x    = -Math.PI / 2;
    grass.receiveShadow = true;
    scene.add(grass);

    // Pavimento de concreto ao redor da casa
    var pave = new THREE.Mesh(
        new THREE.PlaneGeometry(26, 14),
        new THREE.MeshStandardMaterial({ color: 0xBDB5A8, roughness: 0.97 })
    );
    pave.rotation.x    = -Math.PI / 2;
    pave.position.set(0, 0.007, 1.5);
    pave.receiveShadow = true;
    scene.add(pave);

    /* ── CASA PROCEDURAL ──────────────────────────────────────────────────── */
    // ==========================================================================
    // 🏠 PONTO DE INTEGRAÇÃO — Modelo .glb fotorrealista
    //    Quando disponível, use GLTFLoader (precisa de servidor HTTP):
    //
    //    var loader = new THREE.GLTFLoader();  // adicione o script GLTFLoader.js
    //    loader.load('./SUA_CASA.glb',
    //        function(gltf) {
    //            var model = gltf.scene;
    //            model.traverse(function(child) {
    //                if (child.isMesh) { child.castShadow = child.receiveShadow = true; }
    //            });
    //            scene.add(model);
    //        },
    //        function(xhr) { console.log((xhr.loaded / xhr.total * 100) + '% carregado'); },
    //        function(err) { console.error('Erro GLB:', err); scene.add(buildProceduralHouse()); }
    //    );
    // ==========================================================================
    var houseGroup = buildProceduralHouse();
    houseGroup.position.set(2.5, 0, 0); // centra o conjunto casa+garagem
    scene.add(houseGroup);

    /* ── ÁRVORES ──────────────────────────────────────────────────────────── */
    var treePositions = [
        [-13, 0, -4], [-13, 0,  4], [-13, 0, -11],
        [ 11, 0, -4], [ 11, 0,  3], [ 11, 0, -11],
        [ -2, 0, -12], [ 4, 0, -12], [ 9, 0, -12],
        [-13, 0,  12], [  4, 0,  12]
    ];
    treePositions.forEach(function(p) { addTree(scene, p[0], p[1], p[2]); });

    // Sebe / cerca viva
    var hedge = new THREE.Mesh(
        new THREE.BoxGeometry(9.5, 0.68, 0.48),
        new THREE.MeshStandardMaterial({ color: 0x2B5C1C, roughness: 0.93 })
    );
    hedge.position.set(-4.7, 0.34, 4.6);
    hedge.castShadow = true;
    scene.add(hedge);

    /* ── ORBIT CONTROLS ───────────────────────────────────────────────────── */
    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping    = true;
    controls.dampingFactor    = 0.06;
    controls.minDistance      = 6;
    controls.maxDistance      = 34;
    controls.minPolarAngle    = Math.PI / 9;
    controls.maxPolarAngle    = Math.PI / 2.1;
    controls.enablePan        = false;
    controls.autoRotate       = true;
    controls.autoRotateSpeed  = 0.55;
    controls.target.set(0, 2.4, 0);
    controls.enableRotate     = !isMobile();
    controls.enableZoom       = !isMobile();

    /* ── LOOP DE ANIMAÇÃO ─────────────────────────────────────────────────── */
    var clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        var t = clock.getElapsedTime();
        // Flicker suave das luzes interiores
        wLight1.intensity = 1.1 + Math.sin(t * 1.85)      * 0.14;
        wLight2.intensity = 1.1 + Math.sin(t * 2.35 + 0.7) * 0.14;
        controls.update();
        renderer.render(scene, camera);
    }
    animate();

    /* ── RESIZE ───────────────────────────────────────────────────────────── */
    function onResize() {
        W = window.innerWidth;
        H = window.innerHeight;
        camera.aspect = W / H;
        camera.updateProjectionMatrix();
        renderer.setSize(W, H);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile() ? 1.5 : 2));
        controls.enableRotate = !isMobile();
        controls.enableZoom   = !isMobile();
    }
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', function() { setTimeout(onResize, 250); });

    /* ── DISPOSE / LIMPEZA DE MEMÓRIA ─────────────────────────────────────── */
    window.__serraDispose3D = function() {
        scene.traverse(function(obj) {
            if (obj.geometry) obj.geometry.dispose();
            var mats = obj.material
                ? (Array.isArray(obj.material) ? obj.material : [obj.material])
                : [];
            mats.forEach(function(m) { m.dispose(); });
        });
        renderer.dispose();
        controls.dispose();
        window.removeEventListener('resize', onResize);
    };
}

/* ==========================================================================
   HELPERS 3D
   ========================================================================== */

/**
 * Cria e adiciona um BoxGeometry mesh ao parent
 */
function box3d(parent, w, h, d, x, y, z, mat, shadow) {
    shadow = shadow || false;
    var m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z);
    m.castShadow    = shadow;
    m.receiveShadow = shadow;
    parent.add(m);
    return m;
}

/**
 * Telhado de duas águas (prisma triangular via ExtrudeGeometry)
 * @param {number} width   largura total com beiral
 * @param {number} height  altura da cumeeira
 * @param {number} depth   profundidade / comprimento
 * @param {THREE.Material} mat
 */
function gableRoof(width, height, depth, mat) {
    var hw    = width / 2;
    var shape = new THREE.Shape();
    shape.moveTo(-hw, 0);
    shape.lineTo( hw, 0);
    shape.lineTo(  0, height);
    shape.closePath();

    var geo = new THREE.ExtrudeGeometry(shape, { depth: depth, bevelEnabled: false });
    geo.translate(0, 0, -depth / 2);
    geo.computeVertexNormals();

    var mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow    = true;
    mesh.receiveShadow = true;
    return mesh;
}

/**
 * Janela com caixilho, vidro PBR, divisores e brilho interior quente
 * @param {THREE.Object3D} parent
 * @param {number} x,y,z    posição central
 * @param {number} w,h      largura e altura
 * @param {THREE.Material} fMat  caixilho (alumínio escuro)
 * @param {THREE.Material} gMat  vidro (semi-transparente)
 * @param {string} axis     'z' = parede frontal/traseira | 'x' = lateral
 */
function addWindow(parent, x, y, z, w, h, fMat, gMat, axis) {
    axis = axis || 'z';
    var fd      = 0.17;
    var zFacing = axis === 'z';
    var sign    = zFacing ? (z >= 0 ? 1 : -1) : (x >= 0 ? 1 : -1);
    if (z === 0) sign = 1;
    if (x === 0) sign = 1;

    // Caixilho externo
    box3d(parent,
        zFacing ? w + 0.16 : fd,
        h + 0.16,
        zFacing ? fd : w + 0.16,
        x, y, z, fMat, false);

    // Vidro
    var gOff = 0.07;
    box3d(parent,
        zFacing ? w - 0.07 : 0.045,
        h - 0.07,
        zFacing ? 0.045 : w - 0.07,
        zFacing ? x : x + sign * gOff,
        y,
        zFacing ? z + sign * gOff : z,
        gMat, false);

    // Barra horizontal (traversa)
    box3d(parent,
        zFacing ? w : fd + 0.02,
        0.075,
        zFacing ? fd + 0.02 : w,
        x, y, z, fMat, false);

    // Barra vertical (montante)
    box3d(parent,
        zFacing ? 0.075 : fd + 0.02,
        h,
        zFacing ? fd + 0.02 : 0.075,
        x, y, z, fMat, false);

    // Brilho interior quente (luz visível através do vidro)
    var igMat = new THREE.MeshBasicMaterial({ color: 0xFFD580, transparent: true, opacity: 0.60 });
    var iOff  = 0.11;
    box3d(parent,
        zFacing ? w - 0.18 : 0.035,
        h - 0.18,
        zFacing ? 0.035 : w - 0.18,
        zFacing ? x : x - sign * iOff,
        y,
        zFacing ? z - sign * iOff : z,
        igMat, false);
}

/**
 * Árvore procedural: tronco + cluster de esferas de folhagem
 */
function addTree(parent, x, y, z) {
    var h   = 2.0 + Math.random() * 1.0;
    var r   = 1.1 + Math.random() * 0.6;
    var hue = 0.28 + Math.random() * 0.07;
    var gc  = new THREE.Color().setHSL(hue, 0.52, 0.22 + Math.random() * 0.09);

    var tMat = new THREE.MeshStandardMaterial({ color: 0x5C3D1E, roughness: 0.93 });
    var fMat = new THREE.MeshStandardMaterial({ color: gc, roughness: 0.91 });

    // Tronco
    var trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.20, h, 8), tMat);
    trunk.position.set(x, h / 2, z);
    trunk.castShadow = true;
    parent.add(trunk);

    // Folhagem principal
    var bY   = h + r * 0.88;
    var main = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 8), fMat);
    main.position.set(x, bY, z);
    main.castShadow    = true;
    main.receiveShadow = true;
    parent.add(main);

    // Blobs secundários (naturalidade)
    var blobs = [
        [0.72, 0.42, 0.30], [-0.62, 0.24, 0.52],
        [0.32, 0.78,-0.58], [-0.42, 0.58,-0.48],
        [0.52, 0.18, 0.68], [-0.22,-0.18,-0.44]
    ];
    blobs.forEach(function(b) {
        var rb   = 0.68 + Math.random() * 0.42;
        var blob = new THREE.Mesh(new THREE.SphereGeometry(rb, 8, 7), fMat);
        blob.position.set(x + b[0] * r, bY + b[1] * r * 0.58, z + b[2] * r);
        blob.castShadow = true;
        parent.add(blob);
    });
}

/* ==========================================================================
   CASA PROCEDURAL FOTORREALISTA
   Residência moderna brasileira — materiais PBR, telhado de duas águas,
   janelas com caixilho de alumínio e vidro, porta de madeira, varanda,
   chaminé de tijolo, garagem anexa.
   ========================================================================== */
function buildProceduralHouse() {
    var G = new THREE.Group();

    /* ── MATERIAIS PBR ────────────────────────────────────────────────────── */
    var wallMat = new THREE.MeshStandardMaterial({
        color: 0xF0EAE0, roughness: 0.88, metalness: 0.01
    });
    var roofMat = new THREE.MeshStandardMaterial({
        color: 0x7B3C2A, roughness: 0.93, metalness: 0.01
    });
    var frameMat = new THREE.MeshStandardMaterial({
        color: 0x181818, roughness: 0.26, metalness: 0.84
    });
    var glassMat = new THREE.MeshStandardMaterial({
        color: 0x88CCDD, roughness: 0.05, metalness: 0.06,
        transparent: true, opacity: 0.50
    });
    var doorMat = new THREE.MeshStandardMaterial({
        color: 0x2A1607, roughness: 0.50, metalness: 0.05
    });
    var concMat = new THREE.MeshStandardMaterial({
        color: 0xABA49A, roughness: 0.97
    });
    var trimMat = new THREE.MeshStandardMaterial({
        color: 0xE4DECF, roughness: 0.82
    });
    var brickMat = new THREE.MeshStandardMaterial({
        color: 0xA06B50, roughness: 0.96
    });
    var handleMat = new THREE.MeshStandardMaterial({
        color: 0xC8A020, metalness: 0.97, roughness: 0.06
    });
    var ridgeMat = new THREE.MeshStandardMaterial({
        color: 0x5A2218, roughness: 0.95
    });
    var garageDoorMat = new THREE.MeshStandardMaterial({
        color: 0x363636, roughness: 0.38, metalness: 0.68
    });
    var panelLineMat = new THREE.MeshStandardMaterial({
        color: 0x252525, metalness: 0.5
    });
    var stoneMat = new THREE.MeshStandardMaterial({
        color: 0xBAB2A7, roughness: 0.94
    });
    var driveMat = new THREE.MeshStandardMaterial({
        color: 0xA6A09A, roughness: 0.96
    });

    /* ════════════════════════════════════════════════════════════════════════
       CORPO PRINCIPAL DA CASA  (8 × 3.5 × 6.5)
       Fundação: base em y = 0 (nível do gramado)
       ════════════════════════════════════════════════════════════════════════ */

    // Fundação
    box3d(G, 8.7, 0.46, 7.2,  0, 0.23, 0, concMat, true);
    // Paredes
    box3d(G, 8.0, 3.50, 6.5,  0, 2.21, 0, wallMat, true);

    // Embasamento de tijolo aparente (rodapé externo)
    box3d(G, 8.1, 0.62, 0.10,  0, 0.31,  3.30, brickMat, false);
    box3d(G, 8.1, 0.62, 0.10,  0, 0.31, -3.30, brickMat, false);
    box3d(G, 0.10, 0.62, 6.5,  4.07, 0.31, 0, brickMat, false);
    box3d(G, 0.10, 0.62, 6.5, -4.07, 0.31, 0, brickMat, false);

    // Cornija (faixa de acabamento no topo)
    box3d(G, 8.32, 0.20, 6.72, 0, 3.60, 0, trimMat, false);

    /* ── TELHADO PRINCIPAL ──────────────────────────────────────────────── */
    var roofMain = gableRoof(8.8, 2.65, 7.3, roofMat);
    roofMain.position.set(0, 3.96, 0);
    G.add(roofMain);

    // Fascias
    box3d(G, 9.0, 0.21, 0.18,  0, 3.96,  3.68, trimMat, false);
    box3d(G, 9.0, 0.21, 0.18,  0, 3.96, -3.68, trimMat, false);
    // Cumeeira
    box3d(G, 0.27, 0.23, 7.5, 0, 6.63, 0, ridgeMat, false);

    /* ── CHAMINÉ ────────────────────────────────────────────────────────── */
    box3d(G, 0.92, 3.15, 0.92,  2.6, 5.04, -0.8, brickMat, true);  // fuste
    box3d(G, 1.25, 0.19, 1.25,  2.6, 6.62, -0.8, concMat, false);  // capelo
    box3d(G, 0.45, 0.10, 0.45,  2.6, 6.72, -0.8,                   // abertura escura
        new THREE.MeshBasicMaterial({ color: 0x080808 }), false);

    /* ── JANELAS FRONTAIS  (z ≈ +3.26) ─────────────────────────────────── */
    addWindow(G, -2.2, 2.20,  3.27, 1.78, 1.38, frameMat, glassMat, 'z');
    addWindow(G,  1.9, 2.20,  3.27, 1.78, 1.38, frameMat, glassMat, 'z');
    addWindow(G,  0,   5.08,  3.27, 0.90, 0.80, frameMat, glassMat, 'z');

    /* ── JANELAS TRASEIRAS  (z ≈ -3.26) ────────────────────────────────── */
    addWindow(G, -2.2, 2.20, -3.27, 1.78, 1.38, frameMat, glassMat, 'z');
    addWindow(G,  2.0, 2.20, -3.27, 1.65, 1.38, frameMat, glassMat, 'z');

    /* ── JANELAS LATERAIS DIREITAS  (x ≈ +4.01) ────────────────────────── */
    addWindow(G,  4.01, 2.10, -0.7, 1.38, 1.22, frameMat, glassMat, 'x');
    addWindow(G,  4.01, 2.10,  1.9, 1.38, 1.22, frameMat, glassMat, 'x');

    /* ── PORTA PRINCIPAL ────────────────────────────────────────────────── */
    box3d(G, 1.60, 2.72, 0.21, -0.1, 1.36, 3.29, frameMat, false); // caixilho
    box3d(G, 1.15, 2.40, 0.11, -0.1, 1.20, 3.37, doorMat,  true);  // folha
    box3d(G, 0.75, 0.76, 0.07, -0.1, 1.86, 3.42, glassMat, false); // vitrine
    box3d(G, 0.06, 0.28, 0.10,  0.38, 1.20, 3.46, handleMat, false); // maçaneta
    box3d(G, 0.05, 0.08, 0.07,  0.38, 1.50, 3.46, handleMat, false); // trinco

    /* ── VARANDA / PÓRTICO ──────────────────────────────────────────────── */
    box3d(G, 4.3, 0.25, 2.15, -0.1, 0.12, 4.55, concMat, true);

    // Degraus (3)
    box3d(G, 3.1, 0.17, 0.54, -0.1, -0.08,  5.50, concMat, true);
    box3d(G, 3.4, 0.17, 0.54, -0.1, -0.25,  6.04, concMat, true);
    box3d(G, 3.7, 0.17, 0.54, -0.1, -0.42,  6.58, concMat, true);

    // Pilares do pórtico (2)
    var pilGeo = new THREE.CylinderGeometry(0.120, 0.152, 3.65, 12);
    [-1.95, 1.75].forEach(function(px) {
        var pil = new THREE.Mesh(pilGeo, trimMat);
        pil.position.set(px, 1.82, 5.30);
        pil.castShadow = true;
        G.add(pil);
        box3d(G, 0.38, 0.23, 0.38, px, 0.11, 5.30, concMat, false); // base
        box3d(G, 0.38, 0.21, 0.38, px, 3.74, 5.30, concMat, false); // capitel
    });

    // Telhado do pórtico
    box3d(G, 4.6, 0.23, 2.50, -0.1, 3.82, 4.72, trimMat, true);

    /* ════════════════════════════════════════════════════════════════════════
       GARAGEM ANEXA  (lado esquerdo, x ≈ -6.6)
       ════════════════════════════════════════════════════════════════════════ */
    box3d(G, 5.3, 0.42, 6.8,  -6.6, -0.21, 0, concMat, false);   // fundação
    box3d(G, 5.0, 3.02, 6.5,  -6.6,  1.51, 0, wallMat, true);    // paredes

    // Embasamento garagem
    box3d(G, 5.0, 0.58, 0.10, -6.6,  0.29,  3.30, brickMat, false);
    box3d(G, 0.10, 0.58, 6.5, -9.15, 0.29,  0,    brickMat, false);

    // Telhado da garagem
    var roofGarage = gableRoof(5.7, 1.58, 7.2, roofMat);
    roofGarage.position.set(-6.6, 3.02, 0);
    G.add(roofGarage);

    // Cumeeira garagem
    box3d(G, 0.27, 0.19, 7.4, -6.6, 4.62, 0, ridgeMat, false);

    // Porta de garagem (seccional)
    box3d(G, 3.95, 2.65, 0.14, -6.6, 1.32, 3.29, garageDoorMat, true);
    [0, 1, 2, 3].forEach(function(i) {
        box3d(G, 3.75, 0.055, 0.10, -6.6, 0.40 + i * 0.65, 3.37, panelLineMat, false);
    });

    // Janela lateral da garagem
    addWindow(G, -9.17, 1.82, -0.6, 1.28, 1.02, frameMat, glassMat, 'x');

    // Parede de ligação (une os dois volumes)
    box3d(G, 0.32, 3.52, 6.5, -4.16, 1.76, 0, wallMat, true);

    /* ── DRIVEWAY E PEDRAS DE JARDIM ────────────────────────────────────── */
    var drive = new THREE.Mesh(
        new THREE.PlaneGeometry(5.9, 6.0),
        driveMat
    );
    drive.rotation.x    = -Math.PI / 2;
    drive.position.set(-6.6, 0.012, 6.5);
    drive.receiveShadow = true;
    G.add(drive);

    for (var si = 0; si < 5; si++) {
        var st = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.065, 0.68), stoneMat);
        st.position.set(-0.1, 0.032, 7.1 + si * 0.72);
        st.rotation.y    = (Math.random() - 0.5) * 0.24;
        st.receiveShadow = true;
        G.add(st);
    }

    return G;
}

/* ==========================================================================
   2. NAVBAR & MENU MOBILE
   ========================================================================== */
function initNavbar() {
    var navbar = document.getElementById('navbar');
    var menuToggle = document.getElementById('menu-toggle');
    var navLinks = document.getElementById('nav-links');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        var sections = document.querySelectorAll('section[id]');
        var scrollY = window.pageYOffset;

        sections.forEach(function(sec) {
            var sectionHeight = sec.offsetHeight;
            var sectionTop = sec.offsetTop - 120;
            var sectionId = sec.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(function(link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });

        document.querySelectorAll('.nav-link').forEach(function(link) {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
            });
        });
    }
}

/* ==========================================================================
   3. SIMULADOR DE ORÇAMENTO
   ========================================================================== */
function initSimulator() {
    var categoryBtns = document.querySelectorAll('#sim-category-group .sim-opt-btn');
    var areaRange = document.getElementById('sim-area-range');
    var areaValDisplay = document.getElementById('area-val-display');
    var checkGestao = document.getElementById('check-gestao');
    var checkLaudo = document.getElementById('check-laudo');
    var calcPriceDisplay = document.getElementById('calc-price-display');
    var sumServiceName = document.getElementById('sum-service-name');
    var sumAreaVal = document.getElementById('sum-area-val');
    var sumDaysVal = document.getElementById('sum-days-val');
    var btnSendWhatsApp = document.getElementById('btn-send-sim-whatsapp');

    if (!areaRange || !calcPriceDisplay) return;

    var selectedCategory = 'Construção / Reforma de Casa';
    var baseRate = 180;

    categoryBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            categoryBtns.forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            selectedCategory = btn.getAttribute('data-name');
            baseRate = parseFloat(btn.getAttribute('data-rate'));
            updateCalculation();
        });
    });

    areaRange.addEventListener('input', function() {
        areaValDisplay.textContent = areaRange.value + ' m²';
        updateCalculation();
    });

    if (checkGestao) checkGestao.addEventListener('change', updateCalculation);
    if (checkLaudo)  checkLaudo.addEventListener('change', updateCalculation);

    function updateCalculation() {
        var area = parseInt(areaRange.value);
        var multiplier = 1;
        if (checkGestao && checkGestao.checked) multiplier += 0.15;
        if (checkLaudo  && checkLaudo.checked)  multiplier += 0.10;

        var totalPrice = Math.round(area * baseRate * multiplier);
        var baseDays = 8;
        if (area > 100) baseDays = 15;
        if (area > 350) baseDays = 25;
        if (area > 700) baseDays = 40;
        var maxDays = Math.round(baseDays * 1.5);

        calcPriceDisplay.textContent = totalPrice.toLocaleString('pt-BR');
        sumServiceName.textContent = selectedCategory;
        sumAreaVal.textContent = area + ' m²';
        sumDaysVal.textContent = baseDays + ' a ' + maxDays + ' dias úteis';
    }

    updateCalculation();

    if (btnSendWhatsApp) {
        btnSendWhatsApp.addEventListener('click', function() {
            var area  = areaRange.value;
            var price = calcPriceDisplay.textContent;
            var days  = sumDaysVal.textContent;
            var extras = [];
            if (checkGestao && checkGestao.checked) extras.push('Gestão 100% In-Loco');
            if (checkLaudo  && checkLaudo.checked)  extras.push('Suporte Técnico');
            var extrasStr = extras.length > 0 ? extras.join(', ') : 'Nenhum';
            var msg = 'Ol%C3%A1!%20Fiz%20uma%20simula%C3%A7%C3%A3o%20pelo%20site%20da%20Serra%20Reforma%20%26%20Solu%C3%A7%C3%B5es%3A%0A%0A%F0%9F%93%90%20*Servi%C3%A7o%3A*%20' +
                encodeURIComponent(selectedCategory) +
                '%0A%F0%9F%93%90%20*Metragem%3A*%20' + area + '%20m%C2%B2%0A%E2%9C%85%20*Adicionais%3A*%20' +
                encodeURIComponent(extrasStr) +
                '%0A%F0%9F%92%B2%20*Estimativa%3A*%20R%24%20' + price +
                '%0A%E2%8F%B3%20*Prazo%3A*%20' + encodeURIComponent(days) +
                '%0A%0AGostaria%20de%20mais%20informa%C3%A7%C3%B5es!';
            window.open('https://wa.me/5541996306393?text=' + msg, '_blank');
        });
    }
}

/* ==========================================================================
   4. CONTADORES ANIMADOS
   ========================================================================== */
function initCounters() {
    var statCards = document.querySelectorAll('.stat-number');
    var counted = false;

    function startCounting() {
        if (counted) return;
        statCards.forEach(function(card) {
            var target = parseInt(card.getAttribute('data-target'));
            var current = 0;
            var increment = Math.max(1, Math.ceil(target / 40));
            var stepTime = 1500 / (target / increment || 1);
            var timer = setInterval(function() {
                current += increment;
                if (current >= target) { card.textContent = target; clearInterval(timer); }
                else                   { card.textContent = current; }
            }, stepTime);
        });
        counted = true;
    }

    var heroStats = document.querySelector('.hero-stats-grid');
    if (!heroStats) return;

    var observer = new IntersectionObserver(function(entries) {
        if (entries[0].isIntersecting) startCounting();
    }, { threshold: 0.5 });
    observer.observe(heroStats);
}

/* ==========================================================================
   5. FILTRO DO PORTFÓLIO
   ========================================================================== */
function initPortfolioFilter() {
    var filterBtns = document.querySelectorAll('.portfolio-filter-tabs .filter-btn');
    var portfolioCards = document.querySelectorAll('.portfolio-card');
    if (!filterBtns.length) return;

    filterBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            filterBtns.forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            var filterValue = btn.getAttribute('data-filter');
            portfolioCards.forEach(function(card) {
                var category = card.getAttribute('data-category');
                if (filterValue === 'all' || filterValue === category) {
                    card.style.display = 'block';
                    setTimeout(function() {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(function() { card.style.display = 'none'; }, 300);
                }
            });
        });
    });
}

/* ==========================================================================
   6. ACCORDION FAQ
   ========================================================================== */
function initFAQ() {
    var faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var faqItem = btn.parentElement;
            var isActive = faqItem.classList.contains('active');
            document.querySelectorAll('.faq-item').forEach(function(item) {
                item.classList.remove('active');
                var ans = item.querySelector('.faq-answer');
                if (ans) ans.style.maxHeight = null;
            });
            if (!isActive) {
                faqItem.classList.add('active');
                var answer = faqItem.querySelector('.faq-answer');
                if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
}

/* ==========================================================================
   7. TILT 3D NOS CARDS
   ========================================================================== */
function init3DTilt() {
    var tiltCards = document.querySelectorAll('[data-tilt]');
    tiltCards.forEach(function(card) {
        card.addEventListener('mousemove', function(e) {
            var rect = card.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            var rotX = ((y - rect.height / 2) / (rect.height / 2)) * -4;
            var rotY = ((x - rect.width  / 2) / (rect.width  / 2)) *  4;
            card.style.transform = 'perspective(1000px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg) translateY(-4px)';
        });
        card.addEventListener('mouseleave', function() {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });
}

/* ==========================================================================
   8. SCROLL REVEAL
   ========================================================================== */
function initScrollReveal() {
    var revealElements = document.querySelectorAll('.reveal');
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealElements.forEach(function(el) { observer.observe(el); });
}

/* ==========================================================================
   9. FORMULÁRIO DE CONTATO
   ========================================================================== */
function initForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        var submitBtn = form.querySelector('button[type="submit"]');
        var name        = document.getElementById('name').value;
        var phone       = document.getElementById('phone').value;
        var service     = document.getElementById('service').value;
        var messageText = document.getElementById('message').value;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Processando Envio...</span>';
        setTimeout(function() {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Enviar Solicitação no WhatsApp</span>';
            var waMsg = 'Ol%C3%A1!%20Meu%20nome%20%C3%A9%20' + encodeURIComponent(name) +
                '%20(' + encodeURIComponent(phone) + ').%0A%0A*Tipo%3A*%20' +
                encodeURIComponent(service) + '%0A*Mensagem%3A*%20' +
                encodeURIComponent(messageText) + '%0A%0AQuero%20um%20or%C3%A7amento!';
            window.open('https://wa.me/5541996306393?text=' + waMsg, '_blank');
            form.reset();
        }, 800);
    });
}
