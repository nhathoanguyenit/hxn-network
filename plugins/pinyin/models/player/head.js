import * as THREE from "/plugins/three/build/three.module.js";

export function createHead(opts) {
  const g = new THREE.Group();

  const headGeo = new THREE.SphereGeometry(0.85, 32, 32);
  const headMat = new THREE.MeshStandardMaterial({ color: opts.skinColor, roughness: 0.6, metalness: 0 });
  const head = new THREE.Mesh(headGeo, headMat);
  head.position.set(0, 3.05, 0);
  head.castShadow = true;
  g.add(head);

  const hairGeo = new THREE.SphereGeometry(0.86, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5);
  const hairMat = new THREE.MeshStandardMaterial({ color: opts.hairColor, roughness: 0.5 });
  const hair = new THREE.Mesh(hairGeo, hairMat);
  hair.position.set(0, 3.05, -0.02);
  hair.castShadow = true;
  g.add(hair);

  const fontHairGeo = new THREE.SphereGeometry(0.87, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.4);
  const fontHairMat = new THREE.MeshStandardMaterial({ color: opts.hairColor, roughness: 0.7 });
  const fontHair = new THREE.Mesh(fontHairGeo, fontHairMat);
  fontHair.position.set(0, 3.05, 0.02);
  fontHair.castShadow = true;
  g.add(fontHair);

  const eyeGeo = new THREE.PlaneGeometry(0.22, 0.16);
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
  const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
  const rightEye = leftEye.clone();
  leftEye.position.set(-0.22, 3.1, 0.84);
  rightEye.position.set(0.22, 3.1, 0.84);
  g.add(leftEye, rightEye);

  const mouthGeo = new THREE.PlaneGeometry(0.18, 0.06);
  const mouthMat = new THREE.MeshBasicMaterial({ color: 0x7a2f2f });
  const mouth = new THREE.Mesh(mouthGeo, mouthMat);
  mouth.position.set(0, 2.7, 0.78);
  g.add(mouth);

  const neckGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.25, 16);
  const neckMat = new THREE.MeshStandardMaterial({ color: 0xedb51a, roughness: 0.6 });
  const neck = new THREE.Mesh(neckGeo, neckMat);
  neck.position.set(0, 2.2, 0);
  neck.castShadow = true;
  neck.rotation.x = 0.1;
  g.add(neck);

  return g;
}
