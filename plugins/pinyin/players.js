import * as THREE from '/plugins/three/build/three.module.js';

const playerGeometry = new THREE.BoxGeometry(1, 1, 1);
const playerMaterialSelf = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const playerMaterialOther = new THREE.MeshStandardMaterial({ color: 0xff0000 });

export const playerMeshes = new Map();

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
      mesh = new THREE.Mesh(playerGeometry, p.isSelf ? playerMaterialSelf : playerMaterialOther);
      scene.add(mesh);
      playerMeshes.set(p.id, mesh);
    }
    mesh.position.set(p.x-25, 1,  p.y-25);
  });
}
