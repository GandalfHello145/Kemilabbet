import * as THREE from './vendor/three/three.module.min.js';

/**
 * A schematic molecular view, not a molecular-dynamics or scale model.
 * 48 stable identities cross phase boundaries; H–O bonds never change.
 * The owner supplies the only animation loop through update(state, seconds).
 */
export function createWaterScene(canvas, { onSelect, onReady, onError } = {}) {
  const COUNT = 48;
  const TAU = Math.PI * 2;
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const smooth = (a, b, x) => {
    const t = clamp((x - a) / (b - a), 0, 1);
    return t * t * (3 - 2 * t);
  };
  let live = false;
  let destroyed = false;
  const announce = (fn, value) => queueMicrotask(() => { if (!destroyed) fn?.(value); });
  const fail = (error) => {
    live = false;
    announce(onError, error instanceof Error ? error : new Error(String(error)));
  };
  const empty = {
    update() {}, setZoom() {}, setSelected() {}, setMotion() {}, resetView() {},
    destroy() { destroyed = true; }, get available() { return false; },
  };
  if (!canvas?.getContext) {
    fail(new Error('Molekylvyn behöver ett canvas-element.'));
    return empty;
  }

  let renderer;
  try {
    const context = canvas.getContext('webgl2', {
      alpha: true, antialias: true, powerPreference: 'low-power',
    });
    if (!context) throw new Error('WebGL 2 saknas. Visa den förenklade molekylmodellen.');
    renderer = new THREE.WebGLRenderer({ canvas, context, alpha: true, antialias: true });
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    live = true;
  } catch (error) {
    renderer?.dispose();
    fail(error);
    return empty;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 80);
  const geometries = new Set();
  const materials = new Set();
  const keepGeometry = (g) => (geometries.add(g), g);
  const keepMaterial = (m) => (materials.add(m), m);
  const mesh = (g, m) => {
    const item = new THREE.Mesh(keepGeometry(g), keepMaterial(m));
    scene.add(item);
    return item;
  };
  const lines = (points, color, opacity = 1) => {
    const geometry = keepGeometry(new THREE.BufferGeometry().setFromPoints(points));
    const material = keepMaterial(new THREE.LineBasicMaterial({
      color, transparent: opacity < 1, opacity, depthWrite: false,
    }));
    const item = new THREE.Line(geometry, material);
    scene.add(item);
    return item;
  };
  scene.add(new THREE.HemisphereLight(0xe8f8ff, 0x364757, 2.5));
  const key = new THREE.DirectionalLight(0xfff2e2, 3.5);
  key.position.set(-5, 8, 6);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x8acbff, 2.5);
  rim.position.set(5, 3, -5);
  scene.add(rim);

  // Low-opacity walls and rims show the observation volume without hiding atoms.
  const vessel = mesh(new THREE.CylinderGeometry(3.45, 3.45, 7.2, 64, 1, true),
    new THREE.MeshPhongMaterial({
      color: 0xc4e7f6, transparent: true, opacity: 0.055,
      side: THREE.DoubleSide, depthWrite: false, shininess: 90,
    }));
  vessel.renderOrder = 4;
  const circlePoints = (radius, y) => Array.from({ length: 97 }, (_, i) =>
    new THREE.Vector3(radius * Math.cos(i / 96 * TAU), y, radius * Math.sin(i / 96 * TAU)));
  lines(circlePoints(3.45, 3.6), 0x64879d, 0.45);
  lines(circlePoints(3.45, -3.6), 0x64879d, 0.32);
  const floor = mesh(new THREE.CylinderGeometry(3.45, 3.45, 0.11, 64),
    new THREE.MeshStandardMaterial({ color: 0x214454, roughness: 0.48, metalness: 0.2 }));
  floor.position.y = -3.66;
  const foot = mesh(new THREE.CylinderGeometry(3.7, 3.84, 0.15, 64),
    new THREE.MeshStandardMaterial({ color: 0x173442, roughness: 0.55, metalness: 0.28 }));
  foot.position.y = -3.79;
  for (const angle of [Math.PI * 0.25, Math.PI * 0.75]) {
    const x = 3.45 * Math.cos(angle), z = -3.45 * Math.sin(angle);
    lines([new THREE.Vector3(x, -3.6, z), new THREE.Vector3(x, 3.6, z)], 0x89adbd, 0.18);
    for (let y = -3; y <= 3; y += 0.75) {
      lines([new THREE.Vector3(x - 0.09, y, z), new THREE.Vector3(x + 0.09, y, z)],
        0x89adbd, 0.34);
    }
  }

  const sphereGeometry = keepGeometry(new THREE.SphereGeometry(1, 18, 12));
  const bondGeometry = keepGeometry(new THREE.CylinderGeometry(1, 1, 1, 8));
  const oxygenMaterial = keepMaterial(new THREE.MeshStandardMaterial({
    color: 0xf24b55, roughness: 0.28, metalness: 0.08,
  }));
  const hydrogenMaterial = keepMaterial(new THREE.MeshStandardMaterial({
    color: 0xf4f5f1, roughness: 0.23, metalness: 0.03,
  }));
  const bondMaterial = keepMaterial(new THREE.MeshStandardMaterial({
    color: 0xa5c7d6, roughness: 0.38, metalness: 0.13,
  }));
  const oxygen = new THREE.InstancedMesh(sphereGeometry, oxygenMaterial, COUNT);
  const hydrogen = new THREE.InstancedMesh(sphereGeometry, hydrogenMaterial, COUNT * 2);
  const bonds = new THREE.InstancedMesh(bondGeometry, bondMaterial, COUNT * 2);
  for (const group of [oxygen, hydrogen, bonds]) {
    group.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    group.frustumCulled = false;
    scene.add(group);
  }

  const random = (i, channel = 0) => {
    const x = Math.sin(i * 127.1 + channel * 311.7 + 17.8) * 43758.5453123;
    return x - Math.floor(x);
  };
  const position = [], ice = [], liquid = [], gas = [], velocity = [], spinAxis = [];
  const rotation = [], baseRotation = [], weights = [], spinAngles = [];
  const center = new THREE.Vector3();
  for (let i = 0; i < COUNT; i++) {
    const layer = Math.floor(i / 12), slot = i % 12;
    const radius = slot < 6 ? 2.32 : 1.13;
    const angle = slot % 6 / 6 * TAU + (slot < 6 ? 0 : Math.PI / 6) + (layer % 2) * Math.PI / 6;
    ice.push(new THREE.Vector3(Math.cos(angle) * radius, -2.85 + layer * 0.85,
      Math.sin(angle) * radius));
    // A close-packed-looking sample occupies slightly less volume than the open lattice.
    const disc = Math.sqrt((slot + 0.5) / 12) * 2.42;
    const phi = slot * 2.399963229728653 + layer * 0.8;
    liquid.push(new THREE.Vector3(Math.cos(phi) * disc, -2.85 + layer * 0.77,
      Math.sin(phi) * disc));
    const gasRadius = Math.sqrt(random(i, 1)) * 2.95;
    const gasAngle = random(i, 2) * TAU;
    gas.push(new THREE.Vector3(Math.cos(gasAngle) * gasRadius, -2.9 + random(i, 3) * 5.9,
      Math.sin(gasAngle) * gasRadius));
    velocity.push(new THREE.Vector3(random(i, 4) - 0.5, random(i, 5) - 0.5,
      random(i, 6) - 0.5).normalize().multiplyScalar(0.65 + random(i, 7) * 0.5));
    spinAxis.push(new THREE.Vector3(random(i, 8) - 0.5, random(i, 9) - 0.5,
      random(i, 10) - 0.5).normalize());
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(
      random(i, 11) * TAU, random(i, 12) * TAU, random(i, 13) * TAU));
    baseRotation.push(q);
    rotation.push(q.clone());
    position.push(liquid[i].clone());
    weights.push({ ice: 0, liquid: 1, gas: 0 });
    spinAngles.push(0);
  }

  // Faint intermolecular guides are distinct from the solid H–O bond rods.
  const latticePairs = [];
  for (let i = 0; i < COUNT; i++) {
    const neighbours = [];
    for (let j = i + 1; j < COUNT; j++) neighbours.push([ice[i].distanceTo(ice[j]), j]);
    neighbours.sort((a, b) => a[0] - b[0]);
    for (const [distance, j] of neighbours.slice(0, 2)) {
      if (distance < 1.55) latticePairs.push([i, j]);
    }
  }
  const latticeArray = new Float32Array(latticePairs.length * 6);
  const latticeGeometry = keepGeometry(new THREE.BufferGeometry());
  latticeGeometry.setAttribute('position', new THREE.BufferAttribute(latticeArray, 3));
  const latticeMaterial = keepMaterial(new THREE.LineDashedMaterial({
    color: 0x65bfc5, transparent: true, opacity: 0.3, dashSize: 0.09,
    gapSize: 0.08, depthWrite: false,
  }));
  const lattice = new THREE.LineSegments(latticeGeometry, latticeMaterial);
  scene.add(lattice);

  const haloMaterial = keepMaterial(new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { strength: { value: 0.45 } },
    vertexShader: 'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
    fragmentShader: 'varying vec2 vUv; uniform float strength; void main(){float r=length(vUv-0.5)*2.0; float glow=pow(max(0.0,1.0-r),2.8); gl_FragColor=vec4(1.0,0.68,0.18,glow*strength);}',
  }));
  const halo = mesh(new THREE.PlaneGeometry(2.2, 2.2), haloMaterial);
  halo.visible = false;
  halo.renderOrder = 2;
  const TRAIL = 90;
  const trailPoints = Array.from({ length: TRAIL }, () => new THREE.Vector3());
  const trailArray = new Float32Array(TRAIL * 3);
  const trailColors = new Float32Array(TRAIL * 3);
  const trailGeometry = keepGeometry(new THREE.BufferGeometry());
  trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailArray, 3));
  trailGeometry.setAttribute('color', new THREE.BufferAttribute(trailColors, 3));
  trailGeometry.setDrawRange(0, 0);
  for (let i = 0; i < TRAIL; i++) {
    const t = i / (TRAIL - 1);
    trailColors.set([0.27 + t * 0.72, 0.34 + t * 0.32, 0.37 - t * 0.15], i * 3);
  }
  const trail = new THREE.Line(trailGeometry, keepMaterial(new THREE.LineBasicMaterial({
    vertexColors: true, transparent: true, opacity: 0.65, depthWrite: false,
  })));
  trail.frustumCulled = false;
  trail.visible = false;
  scene.add(trail);

  let simulationTime = 0;
  let motion = !globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  let selected = false, selectedIndex = 7, trailLength = 0, trailClock = 0;
  let azimuth = 0.3, elevation = 0.22, zoom = 0.38;
  let width = 0, height = 0, pixelRatio = 0, dirtySize = true;
  let lastState = { temperature: 20, iceFraction: 0, liquidFraction: 1, vaporFraction: 0 };
  const target = new THREE.Vector3(0, -0.15, 0);
  const wantedTarget = new THREE.Vector3();
  const dummy = new THREE.Object3D();
  const h1 = new THREE.Vector3(), h2 = new THREE.Vector3(), endpoint = new THREE.Vector3();
  const direction = new THREE.Vector3(), middle = new THREE.Vector3();
  const unitY = new THREE.Vector3(0, 1, 0);
  const spin = new THREE.Quaternion();
  const halfAngle = 104.5 / 2 * Math.PI / 180;
  const localH = [new THREE.Vector3(Math.sin(halfAngle), Math.cos(halfAngle), 0).multiplyScalar(0.37),
    new THREE.Vector3(-Math.sin(halfAngle), Math.cos(halfAngle), 0).multiplyScalar(0.37)];
  const white = new THREE.Color(0xffffff), selectedTint = new THREE.Color(0xffdf9d);
  const bondTint = new THREE.Color(0xffd16f);

  function tintSelection() {
    for (let i = 0; i < COUNT; i++) {
      const active = selected && i === selectedIndex;
      oxygen.setColorAt(i, active ? selectedTint : white);
      for (let j = 0; j < 2; j++) {
        hydrogen.setColorAt(i * 2 + j, active ? selectedTint : white);
        bonds.setColorAt(i * 2 + j, active ? bondTint : white);
      }
    }
    oxygen.instanceColor.needsUpdate = true;
    hydrogen.instanceColor.needsUpdate = true;
    bonds.instanceColor.needsUpdate = true;
  }
  function clearTrail() {
    trailLength = 0;
    trailClock = 0;
    trailGeometry.setDrawRange(0, 0);
  }
  function setSelected(value) {
    if (!live) return;
    selected = Boolean(value);
    halo.visible = trail.visible = selected;
    clearTrail();
    tintSelection();
  }
  function size() {
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width || canvas.clientWidth || 480));
    const h = Math.max(1, Math.round(rect.height || canvas.clientHeight || 420));
    const ratio = Math.min(1.6, globalThis.devicePixelRatio || 1);
    if (dirtySize || w !== width || h !== height || ratio !== pixelRatio) {
      width = w; height = h; pixelRatio = ratio; dirtySize = false;
      renderer.setPixelRatio(ratio);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
  }
  function setZoom(value) {
    if (Number.isFinite(Number(value))) zoom = clamp(Number(value), 0, 1);
  }
  function resetView() {
    azimuth = 0.3; elevation = 0.22; zoom = 0.38;
    target.set(0, -0.15, 0);
    clearTrail();
  }

  function update(state = lastState, dtSeconds = 0) {
    if (!live || destroyed) return;
    lastState = state || lastState;
    try {
      size();
      const dt = clamp(Number(dtSeconds) || 0, 0, 0.08);
      const step = motion ? dt : 0;
      const temp = clamp(Number(lastState.temperature) || 0, -80, 250);
      const speed = Math.sqrt((temp + 273.15) / 293.15);
      simulationTime += step * speed;
      let solidFraction = clamp(Number(lastState.iceFraction) || 0, 0, 1);
      let vaporFraction = clamp(Number(lastState.vaporFraction) || 0, 0, 1);
      const liquidFraction = clamp(Number(lastState.liquidFraction) || 0, 0, 1);
      const fractionSum = solidFraction + liquidFraction + vaporFraction;
      if (fractionSum > 0) {
        solidFraction /= fractionSum; vaporFraction /= fractionSum;
      }
      const easing = dt > 0 ? 1 - Math.exp(-dt * 5) : 1;
      for (let i = 0; i < COUNT; i++) {
        const rank = ((i * 19) % COUNT + 0.5) / COUNT;
        const solid = solidFraction === 1 ? 1 : solidFraction === 0 ? 0 :
          smooth(rank - 0.035, rank + 0.035, solidFraction);
        const vapor = vaporFraction === 1 ? 1 : vaporFraction === 0 ? 0 :
          smooth(1 - rank - 0.035, 1 - rank + 0.035, vaporFraction);
        const fluid = Math.max(0, 1 - solid - vapor);
        const total = solid + fluid + vapor;
        const w = weights[i];
        w.ice = solid / total; w.liquid = fluid / total; w.gas = vapor / total;
        const gasPoint = gas[i], v = velocity[i];
        gasPoint.addScaledVector(v, step * speed * 1.5);
        const radial = Math.hypot(gasPoint.x, gasPoint.z);
        if (radial > 3.02) {
          const nx = gasPoint.x / radial, nz = gasPoint.z / radial;
          const outward = v.x * nx + v.z * nz;
          if (outward > 0) { v.x -= 2 * outward * nx; v.z -= 2 * outward * nz; }
          gasPoint.x = nx * 3.02; gasPoint.z = nz * 3.02;
        }
        if (gasPoint.y > 3.08) { gasPoint.y = 3.08; v.y = -Math.abs(v.y); }
        if (gasPoint.y < -3.08) { gasPoint.y = -3.08; v.y = Math.abs(v.y); }
        const t = simulationTime, seed = i * 1.729;
        const thermal = 0.019 * w.ice + 0.16 * w.liquid;
        center.copy(ice[i]).multiplyScalar(w.ice)
          .addScaledVector(liquid[i], w.liquid).addScaledVector(gasPoint, w.gas);
        center.x += Math.sin(t * (1.7 + random(i, 14)) + seed) * thermal;
        center.y += Math.sin(t * (2.1 + random(i, 15)) + seed * 1.3) * thermal * 0.6;
        center.z += Math.cos(t * (1.9 + random(i, 16)) + seed * 0.9) * thermal;
        position[i].lerp(center, easing);
        spinAngles[i] += step * speed * (0.42 * w.liquid + 0.8 * w.gas);
        const angle = spinAngles[i] + Math.sin(t * 2 + seed) * 0.035 * w.ice;
        spin.setFromAxisAngle(spinAxis[i], angle);
        rotation[i].copy(baseRotation[i]).multiply(spin);
        dummy.position.copy(position[i]); dummy.quaternion.identity(); dummy.scale.setScalar(0.205);
        dummy.updateMatrix(); oxygen.setMatrixAt(i, dummy.matrix);
        h1.copy(localH[0]).applyQuaternion(rotation[i]).add(position[i]);
        h2.copy(localH[1]).applyQuaternion(rotation[i]).add(position[i]);
        for (let j = 0; j < 2; j++) {
          endpoint.copy(j ? h2 : h1);
          dummy.position.copy(endpoint); dummy.quaternion.identity(); dummy.scale.setScalar(0.127);
          dummy.updateMatrix(); hydrogen.setMatrixAt(i * 2 + j, dummy.matrix);
          direction.subVectors(endpoint, position[i]);
          middle.copy(position[i]).add(endpoint).multiplyScalar(0.5);
          dummy.position.copy(middle); dummy.quaternion.setFromUnitVectors(unitY, direction.normalize());
          dummy.scale.set(0.047, 0.37, 0.047); dummy.updateMatrix();
          bonds.setMatrixAt(i * 2 + j, dummy.matrix);
        }
      }
      for (const group of [oxygen, hydrogen, bonds]) group.instanceMatrix.needsUpdate = true;
      for (let j = 0; j < latticePairs.length; j++) {
        const [a, b] = latticePairs[j];
        latticeArray.set(position[a].toArray(), j * 6);
        endpoint.copy(position[a]).lerp(position[b], Math.min(weights[a].ice, weights[b].ice));
        latticeArray.set(endpoint.toArray(), j * 6 + 3);
      }
      latticeGeometry.attributes.position.needsUpdate = true;
      lattice.computeLineDistances();
      latticeMaterial.opacity = 0.3 * solidFraction * solidFraction;
      lattice.visible = solidFraction > 0.08;
      if (selected) {
        halo.position.copy(position[selectedIndex]);
        halo.quaternion.copy(camera.quaternion);
        haloMaterial.uniforms.strength.value = 0.44 + 0.06 * Math.sin(simulationTime * 2);
        trailClock += step;
        if (step > 0 && (trailClock > 0.065 || trailLength === 0)) {
          trailClock = 0;
          if (trailLength < TRAIL) trailLength++;
          else for (let j = 0; j < TRAIL - 1; j++) trailPoints[j].copy(trailPoints[j + 1]);
          trailPoints[trailLength - 1].copy(position[selectedIndex]);
          for (let j = 0; j < trailLength; j++) {
            trailPoints[j].toArray(trailArray, j * 3);
            const fade = trailLength > 1 ? j / (trailLength - 1) : 1;
            trailColors.set([0.27 + fade * 0.72, 0.34 + fade * 0.32, 0.37 - fade * 0.15], j * 3);
          }
          trailGeometry.attributes.position.needsUpdate = true;
          trailGeometry.attributes.color.needsUpdate = true;
          trailGeometry.setDrawRange(0, trailLength);
        }
      }
      wantedTarget.set(0, -0.15, 0);
      if (selected) wantedTarget.lerp(position[selectedIndex], 0.17);
      target.lerp(wantedTarget, dt > 0 ? 1 - Math.exp(-dt * 2.5) : 1);
      const aspectDistance = 8.1 / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect);
      const distance = Math.max(15.4, aspectDistance) * (1.22 - zoom * 0.45);
      camera.position.set(Math.sin(azimuth) * Math.cos(elevation) * distance,
        Math.sin(elevation) * distance, Math.cos(azimuth) * Math.cos(elevation) * distance).add(target);
      camera.lookAt(target);
      if (selected) halo.quaternion.copy(camera.quaternion);
      renderer.render(scene, camera);
    } catch (error) { fail(error); }
  }

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const pointers = new Map();
  let dragged = false, pinchDistance = 0, pointerStart = null;
  const originalTouchAction = canvas.style.touchAction;
  const originalCursor = canvas.style.cursor;
  const originalTabIndex = canvas.getAttribute('tabindex');
  const originalLabel = canvas.getAttribute('aria-label');
  canvas.style.touchAction = 'pan-y';
  canvas.style.cursor = 'grab';
  if (originalTabIndex === null) canvas.tabIndex = 0;
  if (originalLabel === null) canvas.setAttribute('aria-label',
    'Roterbar molekylmodell. Dra i sidled, använd piltangenter eller välj en molekyl.');
  const handlers = [];
  const listen = (type, handler, options) => {
    canvas.addEventListener(type, handler, options);
    handlers.push([type, handler, options]);
  };
  const getPinch = () => {
    const points = [...pointers.values()];
    return points.length >= 2 ? Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y) : 0;
  };
  listen('pointerdown', (event) => {
    if (!live || event.button > 0) return;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    pointerStart = { x: event.clientX, y: event.clientY };
    dragged = false;
    if (event.pointerType !== 'touch') canvas.setPointerCapture?.(event.pointerId);
    if (pointers.size === 2) { pinchDistance = getPinch(); dragged = true; }
    canvas.style.cursor = 'grabbing';
  });
  listen('pointermove', (event) => {
    if (!pointers.has(event.pointerId)) return;
    const previous = pointers.get(event.pointerId);
    const dx = event.clientX - previous.x, dy = event.clientY - previous.y;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.size >= 2) {
      const distance = getPinch();
      if (pinchDistance) setZoom(zoom + (distance - pinchDistance) / 220);
      pinchDistance = distance; dragged = true;
      if (event.cancelable) event.preventDefault();
      return;
    }
    if (pointerStart && Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y) > 5) dragged = true;
    azimuth -= dx * 0.007;
    // A single touch can scroll the page vertically; mouse dragging also tilts.
    if (event.pointerType !== 'touch') elevation = clamp(elevation + dy * 0.005, -0.12, 0.68);
  });
  const endPointer = (event, cancelled = false) => {
    if (!pointers.has(event.pointerId)) return;
    if (!cancelled && !dragged && pointers.size === 1) {
      const rect = canvas.getBoundingClientRect();
      pointer.set((event.clientX - rect.left) / rect.width * 2 - 1,
        -(event.clientY - rect.top) / rect.height * 2 + 1);
      oxygen.computeBoundingSphere(); hydrogen.computeBoundingSphere();
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects([oxygen, hydrogen], false);
      if (hits.length) {
        const hit = hits[0];
        selectedIndex = hit.object === oxygen ? hit.instanceId : Math.floor(hit.instanceId / 2);
        setSelected(true);
        onSelect?.({ selected: true, index: selectedIndex });
      }
    }
    pointers.delete(event.pointerId); pinchDistance = 0;
    canvas.style.cursor = pointers.size ? 'grabbing' : 'grab';
    if (canvas.hasPointerCapture?.(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
  };
  listen('pointerup', (e) => endPointer(e));
  listen('pointercancel', (e) => endPointer(e, true));
  listen('pointerleave', (e) => { if (!canvas.hasPointerCapture?.(e.pointerId)) endPointer(e, true); });
  listen('wheel', (event) => {
    if (!live) return;
    setZoom(zoom - clamp(event.deltaY, -150, 150) * 0.0015);
    event.preventDefault();
  }, { passive: false });
  listen('keydown', (event) => {
    let handled = true;
    switch (event.key) {
      case 'ArrowLeft': azimuth += 0.1; break;
      case 'ArrowRight': azimuth -= 0.1; break;
      case 'ArrowUp': elevation = clamp(elevation + 0.06, -0.12, 0.68); break;
      case 'ArrowDown': elevation = clamp(elevation - 0.06, -0.12, 0.68); break;
      case '+': case '=': setZoom(zoom + 0.08); break;
      case '-': setZoom(zoom - 0.08); break;
      case '0': case 'Home': resetView(); break;
      case 'Enter': setSelected(!selected); onSelect?.({ selected, index: selectedIndex }); break;
      default: handled = false;
    }
    if (handled) event.preventDefault();
  });
  listen('webglcontextlost', (event) => {
    event.preventDefault();
    fail(new Error('3D-grafiken tappade kontakten. Visa den förenklade modellen.'));
  });
  const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(() => { dirtySize = true; }) : null;
  observer?.observe(canvas);
  tintSelection();
  update(lastState, 0);
  if (live) announce(onReady, { moleculeCount: COUNT, renderer: 'WebGL2', version: THREE.REVISION });

  return {
    update, setZoom, setSelected, resetView,
    setMotion(value) { motion = Boolean(value); },
    get available() { return live && !destroyed; },
    destroy() {
      if (destroyed) return;
      destroyed = true; live = false;
      observer?.disconnect();
      for (const [type, handler, options] of handlers) canvas.removeEventListener(type, handler, options);
      canvas.style.touchAction = originalTouchAction;
      canvas.style.cursor = originalCursor;
      if (originalTabIndex === null) canvas.removeAttribute('tabindex');
      else canvas.setAttribute('tabindex', originalTabIndex);
      if (originalLabel === null) canvas.removeAttribute('aria-label');
      else canvas.setAttribute('aria-label', originalLabel);
      for (const geometry of geometries) geometry.dispose();
      for (const material of materials) material.dispose();
      for (const group of [oxygen, hydrogen, bonds]) group.dispose();
      scene.clear();
      renderer.dispose();
      renderer.forceContextLoss();
      pointers.clear();
    },
  };
}
