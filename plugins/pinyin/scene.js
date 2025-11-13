import * as THREE from '/plugins/three/build/three.module.js';
import { OrbitControls } from '/plugins/three/examples/jsm/controls/OrbitControls.js';

export function createScene(gridSize, container) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x222222);

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  camera.position.set(0, 60, 40);
  // camera.lookAt(0, 0, 0);
  

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enableZoom = true;
  controls.enablePan = false;


  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(10, 20, 10);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0x404040));

  const floorGeometry = new THREE.PlaneGeometry(gridSize, gridSize);
  const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x555555, side: THREE.DoubleSide });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);

  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0, 0);
  scene.add(floor);

  return { scene, camera, renderer, controls };
}
