import * as THREE from '/plugins/three/build/three.module.js';
import { OBJLoader } from '/plugins/three/examples/jsm/loaders/OBJLoader.js';

export const bombMeshes = new Map();
export let bombTemplate = null;

export function loadBombTemplate(path) {
  return new Promise((resolve, reject) => {
    const loader = new OBJLoader();
    loader.load(path, obj => {
      const box = new THREE.Box3().setFromObject(obj);
      const center = box.getCenter(new THREE.Vector3());
      obj.position.sub(center);

      const group = new THREE.Group();
      group.add(obj);
      group.scale.set(0.5, 0.5, 0.5);

      bombTemplate = group;
      resolve(group);
    }, undefined, reject);
  });
}

export function updateBombs(scene, bombs) {
  bombMeshes.forEach((mesh, id) => {
    if (!bombs.find(b => b.id === id)) {
      const pos = mesh.position.clone();
      createCrossFire(pos, scene, 3); 
      scene.remove(mesh);
      bombMeshes.delete(id);
    }
  });

  bombs.forEach(bomb => {
    if (!bombMeshes.has(bomb.id) && bombTemplate) {
      const mesh = bombTemplate.clone();
      mesh.position.set(bomb.x - 25, 1, bomb.y - 25);
      scene.add(mesh);
      bombMeshes.set(bomb.id, mesh);
    }
  });
}

export function animateBombs() {
  bombMeshes.forEach(mesh => {
    mesh.rotation.y += 0.03;
    mesh.position.y = 0.5 + Math.sin(Date.now() * 0.005) * 0.05;
  });
}

function createCrossFire(position, scene, range = 3) {
  const group = new THREE.Group();

  const material = new THREE.MeshBasicMaterial({
    color: 0xff6600,
    transparent: true,
    opacity: 0.9
  });
  
  const geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);

  const center = new THREE.Mesh(geometry, material.clone());
  center.position.copy(position);
  group.add(center);

  const directions = [
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(-1, 0, 0),
    new THREE.Vector3(0, 0, 1),
    new THREE.Vector3(0, 0, -1)
  ];

  for (const dir of directions) {
    for (let i = 1; i <= range; i++) {
      const flame = new THREE.Mesh(geometry, material.clone());
      flame.position.copy(position).addScaledVector(dir, i);
      group.add(flame);
    }
  }

  scene.add(group);

  setTimeout(() => {
    scene.remove(group);
    group.traverse(obj => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) obj.material.dispose();
    });
  }, 500);
}

