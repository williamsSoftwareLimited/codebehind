import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

const canvas = document.getElementById('diamond-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setClearColor(0x000000, 0);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // cap at 2x for perf

function resizeRenderer() {
  // Re-read clientWidth/Height after layout — avoids the 0x0 bug on mobile
  const w = canvas.clientWidth  || canvas.offsetWidth  || 300;
  const h = canvas.clientHeight || canvas.offsetHeight || 300;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
camera.position.z = 3;

const solidMaterial = new THREE.MeshStandardMaterial({
  color: 0x0ea5e9,
  roughness: 0.15,
  metalness: 0.9
});
const solidRingMaterial = new THREE.MeshStandardMaterial({
  color: 0x7dd3fc,
  roughness: 0.35,
  metalness: 0.25,
  side: THREE.DoubleSide
});

const wireMaterial = new THREE.MeshBasicMaterial({
  color: 0x22d3ee,
  wireframe: true,
  transparent: true,
  opacity: 0.9
});
const wireRingMaterial = new THREE.MeshBasicMaterial({
  color: 0x22d3ee,
  wireframe: true,
  transparent: true,
  opacity: 0.9,
  side: THREE.DoubleSide
});

function buildSaturn(planetMat, ringMat) {
  const group = new THREE.Group();

  const planetGeo = new THREE.SphereGeometry(0.62, 32, 32);
  const planet = new THREE.Mesh(planetGeo, planetMat);
  group.add(planet);

  const ringGeo = new THREE.RingGeometry(0.86, 1.33, 72);
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2.35;
  group.add(ring);

  group.rotation.z = -0.45;

  return group;
}

const saturn = buildSaturn(solidMaterial, solidRingMaterial);
scene.add(saturn);

const saturnWireframe = buildSaturn(wireMaterial, wireRingMaterial);
saturnWireframe.scale.setScalar(1.01);
scene.add(saturnWireframe);

const ambient = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambient);
const light = new THREE.DirectionalLight(0xffffff, 1.2);
light.position.set(5, 5, 5);
scene.add(light);

// Store base intensities for the h-brightness effect
const ambientBaseIntensity = 0.4;
const lightBaseIntensity   = 1.2;

// Touch-drag to spin Saturn
let isDragging = false;
let lastX = 0, lastY = 0;
let velX = 0.015, velY = 0.01; // default auto-spin velocity

canvas.addEventListener('touchstart', e => {
  isDragging = true;
  lastX = e.touches[0].clientX;
  lastY = e.touches[0].clientY;
  e.preventDefault();
}, { passive: false });

canvas.addEventListener('touchmove', e => {
  if (!isDragging) return;
  const dx = e.touches[0].clientX - lastX;
  const dy = e.touches[0].clientY - lastY;
  velX = dx * 0.005;
  velY = dy * 0.005;
  lastX = e.touches[0].clientX;
  lastY = e.touches[0].clientY;
  e.preventDefault();
}, { passive: false });

canvas.addEventListener('touchend', () => { isDragging = false; });

// Mouse drag too (bonus)
canvas.addEventListener('mousedown', e => { isDragging = true; lastX = e.clientX; lastY = e.clientY; });
canvas.addEventListener('mousemove', e => {
  if (!isDragging) return;
  velX = (e.clientX - lastX) * 0.005;
  velY = (e.clientY - lastY) * 0.005;
  lastX = e.clientX; lastY = e.clientY;
});
canvas.addEventListener('mouseup', () => { isDragging = false; });

function animate() {
  // Gradually drift back to gentle auto-spin when not dragging
  if (!isDragging) {
    velX += (0.015 - velX) * 0.02;
    velY += (0.010 - velY) * 0.02;
  }
  saturn.rotation.y += velX;
  saturn.rotation.x += velY;
  saturnWireframe.rotation.copy(saturn.rotation);

  // h-brightness: ramp scene lighting up then back down over ~10 s
  // Timing in milliseconds: rise=400 ms, hold=8 s, fade=2 s
  const H_RISE = 400, H_HOLD = 8000, H_FADE = 2000;
  // window._hPressTime is set by the non-module event-handler script below;
  // window is the only shared scope between a <script type="module"> and a plain <script>.
  const hElapsed = window._hPressTime ? Date.now() - window._hPressTime : Infinity;
  let hBrightness = 0;
  if (hElapsed < H_RISE) {
    hBrightness = hElapsed / H_RISE;
  } else if (hElapsed < H_HOLD) {
    hBrightness = 1;
  } else if (hElapsed < H_HOLD + H_FADE) {
    hBrightness = 1 - (hElapsed - H_HOLD) / H_FADE;
  }
  light.intensity   = lightBaseIntensity   + hBrightness * 10;
  ambient.intensity = ambientBaseIntensity  + hBrightness * 3;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

// Wait one frame for layout, then init size and start
requestAnimationFrame(() => {
  resizeRenderer();
  animate();
});

window.addEventListener('resize', resizeRenderer);
// Also handle orientation change on mobile
window.addEventListener('orientationchange', () => setTimeout(resizeRenderer, 200));
