import * as THREE from '/plugins/three/build/three.module.js';
import { GLTFLoader } from '/plugins/three/examples/jsm/loaders/GLTFLoader.js';

const playerGeometry = new THREE.BoxGeometry(1, 1, 1);
const playerMaterialOther = new THREE.MeshStandardMaterial({ color: 0xff0000 });

export const playerMeshes = new Map();
export let playerTemplate = null;

export function loadPlayerTemplate(path) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      path,
      gltf => {
        const obj = gltf.scene;

        const box = new THREE.Box3().setFromObject(obj);
        const center = box.getCenter(new THREE.Vector3());
        obj.position.sub(center);
        obj.position.y += 1.5;

        const group = new THREE.Group();
        group.add(obj);
        group.scale.set(1, 1, 1);

        playerTemplate = group;
        resolve(group);
      },
      undefined,
      reject
    );
  });
}

export function animatePlayers() {
  playerMeshes.forEach(mesh => {
    mesh.rotation.y += 0.03;
    mesh.position.y = 0.5 + Math.sin(Date.now() * 0.005) * 0.05;
  });
}

export function updatePlayers(scene, players) {

  playerMeshes.forEach((mesh, id) => {
    if (!players.find(p => p.id === id)) {
      scene.remove(mesh);
      playerMeshes.delete(id);
    }
  });

  players.forEach(p => {
    let mesh = playerMeshes.get(p.id);
    if (!mesh) {
      mesh = p.isSelf ?  playerTemplate : new THREE.Mesh(playerGeometry, playerMaterialOther);
      scene.add(mesh);
      playerMeshes.set(p.id, mesh);
    }
    mesh.position.set(p.x-25, 1,  p.y-25);
  });
}
