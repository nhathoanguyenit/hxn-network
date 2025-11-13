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
      scene.remove(mesh);
      bombMeshes.delete(id);
    }
  });

  bombs.forEach(bomb => {
    if (!bombMeshes.has(bomb.id) && bombTemplate) {
      const mesh = bombTemplate.clone();
      mesh.position.set(bomb.x + 0.5, 0.5, bomb.y + 0.5);
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
