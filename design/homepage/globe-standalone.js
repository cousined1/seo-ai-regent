/* Three.js wireframe globe with auto city fly-throughs */
(function () {
  const canvas = document.getElementById('globeCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  // ---------- config ----------
  const CITIES = [
    { name: 'New York',    lat: 40.7128,  lon: -74.0060 },
    { name: 'Moscow',      lat: 55.7558,  lon:  37.6173 },
    { name: 'Addis Ababa', lat: 9.1450,   lon:  38.7451 },
    { name: 'Tokyo',       lat: 35.6762,  lon: 139.6503 },
    { name: 'Madrid',      lat: 40.4168,  lon:  -3.7038 },
    { name: 'London',      lat: 51.5074,  lon:  -0.1278 },
    { name: 'Vancouver',   lat: 49.2827,  lon: -123.1207 }
  ];
  const R = 1; // globe radius

  let SPEED = 1.0;
  let ZOOM = 1.0;
  let WIREFRAME = true;
  let PINGS = true;
  let ACCENT = 0x06B6D4;

  // ---------- scene ----------
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(35, 1, 0.01, 100);
  camera.position.set(0, 0, 3.2);

  // Globe group for easy rotation
  const globeGroup = new THREE.Group();
  scene.add(globeGroup);

  // Wireframe shell (transparent — no solid fill)
  const wireGeo = new THREE.SphereGeometry(R, 48, 32);
  const wireMat = new THREE.LineBasicMaterial({
    color: 0x1f4d5a, transparent: true, opacity: 0.45
  });
  const wireMesh = new THREE.LineSegments(
    new THREE.WireframeGeometry(wireGeo), wireMat
  );
  globeGroup.add(wireMesh);

  // Land-only dot field (continents). Built async from an equirectangular
  // land-mask image — we sample pixels and only place dots on land.
  // Fallback: if image fails, fall back to a sparse sphere-wide dot field.
  let pointsMesh = null;
  const pointsMat = new THREE.PointsMaterial({
    color: ACCENT, size: 0.013, transparent: true, opacity: 0.9,
    sizeAttenuation: true
  });

  function buildDots(landSampler) {
    // Even lat/lon sampling with density falloff near poles to avoid clumping.
    const positions = [];
    const LAT_STEPS = 140;            // ~1.3 deg
    for (let i = 0; i < LAT_STEPS; i++) {
      const lat = -90 + (180 * (i + 0.5) / LAT_STEPS);
      const circ = Math.cos(THREE.MathUtils.degToRad(lat));
      if (circ <= 0.02) continue;
      const lonSteps = Math.max(6, Math.round(280 * circ));
      for (let j = 0; j < lonSteps; j++) {
        const lon = -180 + (360 * (j + 0.5) / lonSteps);
        if (!landSampler || landSampler(lat, lon)) {
          const v = latLonToVec3(lat, lon, R * 1.004);
          positions.push(v.x, v.y, v.z);
        }
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
    if (pointsMesh) {
      globeGroup.remove(pointsMesh);
      pointsMesh.geometry.dispose();
    }
    pointsMesh = new THREE.Points(g, pointsMat);
    globeGroup.add(pointsMesh);
  }

  // Ocean fill disk (very subtle) so continents stand out slightly.
  const oceanGeo = new THREE.SphereGeometry(R * 0.995, 64, 48);
  const oceanMat = new THREE.MeshBasicMaterial({
    color: 0x05141a, transparent: true, opacity: 0.55
  });
  const oceanMesh = new THREE.Mesh(oceanGeo, oceanMat);
  globeGroup.add(oceanMesh);

  // Try to load an equirectangular land mask. If it fails (offline/CORS),
  // fall back to a GeoJSON point-in-polygon sampler, then a full-sphere
  // dot field as last resort so the globe never looks broken.
  const LAND_URLS = [
    (window.__resources && window.__resources.earthDark) || 'https://cdn.jsdelivr.net/npm/three-globe@2.24.4/example/img/earth-dark.jpg',
    'https://cdn.jsdelivr.net/npm/three-globe@2.31.1/example/img/earth-dark.jpg',
    'https://unpkg.com/three-globe@2.24.4/example/img/earth-dark.jpg',
    'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/textures/land_ocean_ice_cloud_2048.jpg'
  ];
  const GEOJSON_URLS = [
    'https://cdn.jsdelivr.net/npm/@geo-maps/countries-land-10km@0.6.0/map.geo.json',
    'https://cdn.jsdelivr.net/npm/world-atlas@1.1.4/world/110m.json',
    'https://cdn.jsdelivr.net/gh/johan/world.geo.json@master/countries.geo.json'
  ];

  function pointInRing(lon, lat, ring) {
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const xi = ring[i][0], yi = ring[i][1];
      const xj = ring[j][0], yj = ring[j][1];
      const intersect = ((yi > lat) !== (yj > lat)) &&
        (lon < (xj - xi) * (lat - yi) / ((yj - yi) || 1e-12) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  function buildSamplerFromGeoJSON(geojson) {
    // flatten all polygons into array of rings with bboxes for fast reject
    const polys = [];
    const addPoly = (coords) => {
      // coords: [ [ring], [hole], ... ]
      const outer = coords[0];
      if (!outer || outer.length < 3) return;
      let minX = 180, minY = 90, maxX = -180, maxY = -90;
      for (const p of outer) {
        if (p[0] < minX) minX = p[0];
        if (p[0] > maxX) maxX = p[0];
        if (p[1] < minY) minY = p[1];
        if (p[1] > maxY) maxY = p[1];
      }
      polys.push({ outer, minX, minY, maxX, maxY });
    };
    const feats = geojson.features || [];
    for (const f of feats) {
      const g = f.geometry;
      if (!g) continue;
      if (g.type === 'Polygon') addPoly(g.coordinates);
      else if (g.type === 'MultiPolygon') {
        for (const poly of g.coordinates) addPoly(poly);
      }
    }
    return (lat, lon) => {
      for (const p of polys) {
        if (lon < p.minX || lon > p.maxX || lat < p.minY || lat > p.maxY) continue;
        if (pointInRing(lon, lat, p.outer)) return true;
      }
      return false;
    };
  }

  async function tryGeoJSON() {
    for (const url of GEOJSON_URLS) {
      try {
        const res = await fetch(url, { mode: 'cors' });
        if (!res.ok) continue;
        const j = await res.json();
        if (!j || !j.features) continue;
        const sampler = buildSamplerFromGeoJSON(j);
        buildDots(sampler);
        return true;
      } catch (e) { /* try next */ }
    }
    return false;
  }

  (function loadLandMask() {
    let tryIdx = 0;
    function attempt() {
      if (tryIdx >= LAND_URLS.length) {
        // image path exhausted -> try geojson, then sphere-wide
        tryGeoJSON().then((ok) => { if (!ok) buildDots(null); });
        return;
      }
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const W = 1024, H = 512;
          const c = document.createElement('canvas');
          c.width = W; c.height = H;
          const ctx = c.getContext('2d');
          ctx.drawImage(img, 0, 0, W, H);
          const data = ctx.getImageData(0, 0, W, H).data;
          // Land = brighter-than-threshold pixel (earth-dark has land brighter than ocean)
          const sampler = (lat, lon) => {
            const u = ((lon + 180) / 360) * W;
            const v = ((90 - lat) / 180) * H;
            const x = Math.max(0, Math.min(W - 1, Math.floor(u)));
            const y = Math.max(0, Math.min(H - 1, Math.floor(v)));
            const i = (y * W + x) * 4;
            const r = data[i], g = data[i+1], b = data[i+2];
            const lum = 0.299*r + 0.587*g + 0.114*b;
            return lum > 22; // land threshold
          };
          buildDots(sampler);
        } catch (e) {
          tryIdx++; attempt();
        }
      };
      img.onerror = () => { tryIdx++; attempt(); };
      img.src = LAND_URLS[tryIdx];
    }
    attempt();
  })();

  // Equator ring
  const ringGeo = new THREE.RingGeometry(R * 1.005, R * 1.008, 128);
  const ringMat = new THREE.MeshBasicMaterial({
    color: ACCENT, transparent: true, opacity: 0.3, side: THREE.DoubleSide
  });
  const equator = new THREE.Mesh(ringGeo, ringMat);
  equator.rotation.x = Math.PI / 2;
  globeGroup.add(equator);

  // Latitude rings (extra editorial structure)
  for (let deg = -60; deg <= 60; deg += 30) {
    if (deg === 0) continue;
    const phi = THREE.MathUtils.degToRad(90 - (deg + 90));
    const rr = Math.sin(phi) * R;
    const yy = Math.cos(phi) * R;
    const rg = new THREE.RingGeometry(rr * 1.001, rr * 1.003, 128);
    const rm = new THREE.MeshBasicMaterial({
      color: 0x2a2a2a, transparent: true, opacity: 0.35, side: THREE.DoubleSide
    });
    const r = new THREE.Mesh(rg, rm);
    r.rotation.x = Math.PI / 2;
    r.position.y = yy;
    globeGroup.add(r);
  }

  // Helper: lat/lon -> xyz on sphere
  function latLonToVec3(lat, lon, radius) {
    const phi = THREE.MathUtils.degToRad(90 - lat);
    const theta = THREE.MathUtils.degToRad(lon + 180);
    return new THREE.Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
       radius * Math.cos(phi),
       radius * Math.sin(phi) * Math.sin(theta)
    );
  }

  // City markers + pings
  const cityObjects = CITIES.map((c, i) => {
    const pos = latLonToVec3(c.lat, c.lon, R * 1.01);
    const group = new THREE.Group();
    group.position.copy(pos);

    // look outward from globe center
    group.lookAt(pos.clone().multiplyScalar(2));

    // dot
    const dotGeo = new THREE.CircleGeometry(0.015, 24);
    const dotMat = new THREE.MeshBasicMaterial({ color: ACCENT });
    const dot = new THREE.Mesh(dotGeo, dotMat);
    group.add(dot);

    // halo
    const haloGeo = new THREE.RingGeometry(0.02, 0.028, 32);
    const haloMat = new THREE.MeshBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.6, side: THREE.DoubleSide });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    group.add(halo);

    // ping ring (animated)
    const pingGeo = new THREE.RingGeometry(0.02, 0.022, 48);
    const pingMat = new THREE.MeshBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.8, side: THREE.DoubleSide });
    const ping = new THREE.Mesh(pingGeo, pingMat);
    ping.userData.phase = i / CITIES.length;
    group.add(ping);

    // vertical beam
    const beamGeo = new THREE.CylinderGeometry(0.001, 0.001, 0.12, 6);
    const beamMat = new THREE.MeshBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.5 });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.z = 0.06;
    beam.rotation.x = Math.PI / 2;
    group.add(beam);

    globeGroup.add(group);
    return { data: c, group, dot, halo, ping, beam, basePos: pos.clone() };
  });

  // Ambient star specks (very sparse, outside globe)
  const starCount = 180;
  const starGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const r = 8 + Math.random() * 4;
    const t = Math.random() * Math.PI * 2;
    const p = Math.acos(2 * Math.random() - 1);
    starPos[i*3+0] = r * Math.sin(p) * Math.cos(t);
    starPos[i*3+1] = r * Math.cos(p);
    starPos[i*3+2] = r * Math.sin(p) * Math.sin(t);
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  const starMat = new THREE.PointsMaterial({ color: 0x333333, size: 0.015, transparent: true, opacity: 0.6 });
  scene.add(new THREE.Points(starGeo, starMat));

  // ---------- animation sequence ----------
  // State: we target each city in turn. Each "leg" has:
  // - travel phase (rotate globe so city is centered; camera zooms in)
  // - hold phase (brief pause, "acquired")
  // - pull-back phase (zoom back slightly before next leg)
  // Total ~4s per city.

  let currentCityIdx = 0;
  let legStart = performance.now();
  const BASE_LEG = 4000; // ms per city

  // Globe rotation target (yaw/pitch) to center city in frame
  let targetYaw = 0, targetPitch = 0;
  let currentYaw = 0, currentPitch = 0;
  let baseCamZ = 3.2;
  let targetCamZ = 3.2;
  let currentCamZ = 3.2;

  function computeTargetsFor(cityIdx) {
    const c = CITIES[cityIdx];
    // We want the city's position to face +Z (toward camera).
    // Given latLonToVec3, for city at lat/lon, the point vector.
    // If we rotate globe by -lon (yaw) and +lat (pitch), city comes to front.
    targetYaw = THREE.MathUtils.degToRad(-(c.lon));
    targetPitch = THREE.MathUtils.degToRad(c.lat);
  }
  computeTargetsFor(0);

  // HUD elements
  const hudAz = document.getElementById('hudAz');
  const hudEl = document.getElementById('hudEl');
  const hudAlt = document.getElementById('hudAlt');
  const hudSig = document.getElementById('hudSig');
  const coordLat = document.getElementById('coordLat');
  const coordLng = document.getElementById('coordLng');
  const cityLabel = document.getElementById('cityLabel');
  const acquireLabel = document.getElementById('acqState');

  function fmtLat(v) {
    const s = v >= 0 ? 'N' : 'S';
    return Math.abs(v).toFixed(4) + '° ' + s;
  }
  function fmtLng(v) {
    const s = v >= 0 ? 'E' : 'W';
    return Math.abs(v).toFixed(4) + '° ' + s;
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    renderer.setSize(rect.width, rect.height, false);
    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
  }
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  // lerp helper (framerate-independent)
  function damp(curr, target, lambda, dt) {
    return curr + (target - curr) * (1 - Math.exp(-lambda * dt));
  }

  let last = performance.now();
  function tick(now) {
    requestAnimationFrame(tick);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    const legDur = BASE_LEG / SPEED;
    const t = (now - legStart) / legDur; // 0..1 within leg

    if (t >= 1) {
      currentCityIdx = (currentCityIdx + 1) % CITIES.length;
      computeTargetsFor(currentCityIdx);
      legStart = now;
    }

    // zoom curve: start pulled back, zoom in at 0.4, hold, pull back by 0.95
    // simulate "digital zoom-in" with camera z
    let zt;
    const tt = (now - legStart) / legDur;
    if (tt < 0.55) {
      // zoom in
      const k = tt / 0.55;
      zt = 1 - easeInOutCubic(k) * 0.75 * ZOOM;
    } else if (tt < 0.8) {
      // hold
      zt = 1 - 0.75 * ZOOM;
    } else {
      // pull back
      const k = (tt - 0.8) / 0.2;
      zt = (1 - 0.75 * ZOOM) + easeInOutCubic(k) * 0.75 * ZOOM;
    }
    targetCamZ = baseCamZ * zt;

    currentYaw = damp(currentYaw, targetYaw, 3.2 * SPEED, dt);
    currentPitch = damp(currentPitch, targetPitch, 3.2 * SPEED, dt);
    currentCamZ = damp(currentCamZ, targetCamZ, 6 * SPEED, dt);

    globeGroup.rotation.y = currentYaw;
    globeGroup.rotation.x = currentPitch;
    camera.position.z = currentCamZ;

    // drift: subtle continuous rotation under the targeting rotation
    // (actually keep it as-is; too much drift breaks aim)

    // city animations (pings)
    cityObjects.forEach((co, i) => {
      co.group.visible = PINGS;
      if (!PINGS) return;

      // ping grows & fades
      const phase = ((now / 1800) % 1 + co.ping.userData.phase) % 1;
      const scale = 1 + phase * 2.2;
      co.ping.scale.set(scale, scale, 1);
      co.ping.material.opacity = Math.max(0, 0.85 - phase);

      // emphasize current city
      const isCurrent = i === currentCityIdx;
      const emp = isCurrent ? 1.8 : 1.0;
      co.dot.scale.set(emp, emp, 1);
      co.halo.material.opacity = isCurrent ? 0.9 : 0.5;
      co.beam.material.opacity = isCurrent ? 0.85 : 0.25;
      co.beam.scale.y = isCurrent ? 1.4 : 1.0;
    });

    wireMesh.visible = WIREFRAME;
    wireMesh.material.opacity = WIREFRAME ? 0.6 : 0;

    // HUD updates
    const c = CITIES[currentCityIdx];
    if (cityLabel) cityLabel.textContent = c.name;
    if (coordLat) coordLat.textContent = fmtLat(c.lat);
    if (coordLng) coordLng.textContent = fmtLng(c.lon);

    // cycling fake signal numbers locked to leg progress
    if (hudAz) hudAz.textContent = (((c.lon + 180) + Math.sin(now/900) * 2).toFixed(1)) + '°';
    if (hudEl) hudEl.textContent = (c.lat.toFixed(1)) + '°';
    if (hudAlt) {
      const alt = Math.round((1 - zt) * 24000 + 400);
      hudAlt.textContent = (alt / 1000).toFixed(1) + 'k';
    }
    if (hudSig) hudSig.textContent = (0.9 + Math.sin(now/400) * 0.08).toFixed(3);
    if (acquireLabel) {
      if (tt < 0.55) acquireLabel.textContent = '[ ACQUIRING ]';
      else if (tt < 0.8) { acquireLabel.textContent = '[ LOCKED ]'; acquireLabel.style.color = 'var(--score-excellent)'; }
      else { acquireLabel.textContent = '[ TRANSIT ]'; acquireLabel.style.color = ''; }
      if (tt >= 0.55 && tt < 0.8) acquireLabel.style.color = '#22C55E';
      else acquireLabel.style.color = '';
    }

    renderer.render(scene, camera);
  }

  function easeInOutCubic(x) {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }

  requestAnimationFrame(tick);

  // Expose controls to tweaks UI
  window.__globe = {
    setSpeed(v) { SPEED = Math.max(0.1, v); },
    setZoom(v) { ZOOM = Math.max(0.1, v); },
    setWireframe(b) { WIREFRAME = !!b; },
    setPings(b) { PINGS = !!b; },
    setAccent(hex) {
      ACCENT = parseInt(hex.replace('#',''), 16);
      pointsMat.color.setHex(ACCENT);
      ringMat.color.setHex(ACCENT);
      cityObjects.forEach(co => {
        co.dot.material.color.setHex(ACCENT);
        co.halo.material.color.setHex(ACCENT);
        co.ping.material.color.setHex(ACCENT);
        co.beam.material.color.setHex(ACCENT);
      });
    }
  };
})();
