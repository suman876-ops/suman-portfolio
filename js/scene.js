/* ============================================================================
 * scene.js — the Three.js 3D background.
 *
 * Loaded as an ES module. Three.js is pulled in dynamically so that if the
 * CDN is unreachable the page keeps working (main.js falls back to a 2D
 * starfield) instead of throwing and killing the whole script.
 * ==========================================================================*/

export async function initScene() {
  let THREE;
  try {
    THREE = await import("three");
  } catch (err) {
    console.warn("3D scene unavailable — falling back to the 2D starfield.");
    return null;
  }

  const host = document.getElementById("webgl");
  if (!host) return null;

  const isMobile = window.innerWidth < 900;

  const renderer = new THREE.WebGLRenderer({
    antialias: true, alpha: true, powerPreference: "high-performance"
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  host.appendChild(renderer.domElement);
  document.body.classList.add("gl3d");

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 300);
  camera.position.set(0, 0, 17);

  /* soft round sprite used for every glowing point */
  function glowTexture() {
    const s = 128, cv = document.createElement("canvas");
    cv.width = cv.height = s;
    const g = cv.getContext("2d");
    const grd = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    grd.addColorStop(0, "rgba(255,255,255,1)");
    grd.addColorStop(0.25, "rgba(255,255,255,.55)");
    grd.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, s, s);
    return new THREE.CanvasTexture(cv);
  }
  const GLOW = glowTexture();

  /* ---- starfield ---- */
  const N = isMobile ? 1600 : 4200;
  const positions = new Float32Array(N * 3);
  const colors = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const r = 26 + Math.random() * 60;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(ph) * Math.cos(th);
    positions[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
    positions[i * 3 + 2] = r * Math.cos(ph) - 20;
    const c = new THREE.Color().setHSL(0.55 + Math.random() * 0.15, 0.6, 0.6 + Math.random() * 0.3);
    colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  starGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({
    size: 0.42, map: GLOW, transparent: true, depthWrite: false,
    blending: THREE.AdditiveBlending, vertexColors: true, opacity: 0.9
  }));
  scene.add(stars);

  /* ---- wireframe planet + faint core ---- */
  const planetMat = new THREE.MeshBasicMaterial({ color: 0x3ee6ff, wireframe: true, transparent: true, opacity: 0.55 });
  const planet = new THREE.Mesh(new THREE.IcosahedronGeometry(5.4, 3), planetMat);
  planet.position.set(11, -2, -6);
  scene.add(planet);

  const core = new THREE.Mesh(
    new THREE.SphereGeometry(5.25, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0x0a2030, transparent: true, opacity: 0.35 })
  );
  core.position.copy(planet.position);
  scene.add(core);

  /* ---- rings ---- */
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xa974ff, transparent: true, opacity: 0.5, side: THREE.DoubleSide });
  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(8.4, 0.03, 8, 140), ringMat);
  ring1.rotation.x = 1.15; ring1.position.copy(planet.position);
  scene.add(ring1);

  const ring2Mat = ringMat.clone(); ring2Mat.opacity = 0.3;
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(9.6, 0.02, 8, 160), ring2Mat);
  ring2.rotation.set(1.5, 0.4, 0); ring2.position.copy(planet.position);
  scene.add(ring2);

  /* ---- floating geometry ---- */
  const shapes = [];
  const geos = [
    new THREE.OctahedronGeometry(0.5),
    new THREE.TetrahedronGeometry(0.6),
    new THREE.IcosahedronGeometry(0.42)
  ];
  for (let i = 0; i < 9; i++) {
    const m = new THREE.Mesh(geos[i % 3], new THREE.MeshBasicMaterial({
      color: i % 2 ? 0xa974ff : 0x3ee6ff, wireframe: true, transparent: true, opacity: 0.5
    }));
    const a = Math.random() * Math.PI * 2, rr = 8 + Math.random() * 10;
    m.position.set(Math.cos(a) * rr, (Math.random() - 0.5) * 14, -4 - Math.random() * 14);
    m.userData = {
      sx: (Math.random() - 0.5) * 0.006,
      sy: (Math.random() - 0.5) * 0.006,
      fy: Math.random() * 6.28,
      amp: 0.5 + Math.random()
    };
    shapes.push(m);
    scene.add(m);
  }

  /* ---- glow sprites ---- */
  const glows = [];
  [[0x3ee6ff, 10, -6, -14, 9], [0xa974ff, -12, 4, -18, 11], [0xff4d9d, 4, 9, -22, 8]]
    .forEach(([c, x, y, z, s]) => {
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({
        map: GLOW, color: c, transparent: true, opacity: 0.28,
        blending: THREE.AdditiveBlending, depthWrite: false
      }));
      sp.position.set(x, y, z);
      sp.scale.set(s, s, 1);
      scene.add(sp);
      glows.push(sp);
    });

  /* ---- input ---- */
  let targetX = 0, targetY = 0, mx = 0, my = 0, scrollTarget = 0, scroll = 0;
  const onMove = (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetY = (e.clientY / window.innerHeight - 0.5) * 2;
  };
  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener("mousemove", onMove, { passive: true });
  window.addEventListener("resize", onResize);

  const lerp = (a, b, t) => a + (b - a) * t;
  const clock = new THREE.Clock();

  function animate() {
    const t = clock.getElapsedTime();
    mx = lerp(mx, targetX, 0.05);
    my = lerp(my, targetY, 0.05);
    scroll = lerp(scroll, scrollTarget, 0.05);

    camera.position.x = mx * 2.2;
    camera.position.y = -my * 1.6;
    camera.position.z = 17 - scroll * 0.02;
    camera.lookAt(0, 0, -4);

    stars.rotation.y = t * 0.012 + mx * 0.1;
    stars.rotation.x = my * 0.06;

    planet.rotation.y = t * 0.09;
    planet.rotation.x = t * 0.03;
    core.rotation.y = t * 0.09;
    ring1.rotation.z = t * 0.05;
    ring2.rotation.z = -t * 0.04;

    for (const m of shapes) {
      m.rotation.x += m.userData.sx;
      m.rotation.y += m.userData.sy;
      m.position.y += Math.sin(t * 0.6 + m.userData.fy) * 0.006 * m.userData.amp;
    }
    glows.forEach((g, i) => { g.material.opacity = 0.2 + Math.abs(Math.sin(t * 0.5 + i)) * 0.14; });

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();

  /* controller handed back to main.js */
  return {
    setColors(h1, h2) {
      planetMat.color.setHex(h1);
      ringMat.color.setHex(h2);
      ring2Mat.color.setHex(h2);
      shapes.forEach((m, i) => m.material.color.setHex(i % 2 ? h2 : h1));
      glows[0].material.color.setHex(h1);
      glows[1].material.color.setHex(h2);
    },
    onScroll(y) { scrollTarget = y; }
  };
}
