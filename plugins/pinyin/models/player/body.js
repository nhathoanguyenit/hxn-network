import * as THREE from '/plugins/three/build/three.module.js';

export function createBody(clothColor){
  const bodyShape = new THREE.Shape();
  const w = 0.9, h = 1.2, r = 0.25;
  bodyShape.moveTo(-w/2 + r, -h/2);
  bodyShape.lineTo(w/2 - r, -h/2);
  bodyShape.quadraticCurveTo(w/2, -h/2, w/2, -h/2 + r);
  bodyShape.lineTo(w/2, h/2 - r);
  bodyShape.quadraticCurveTo(w/2, h/2, w/2 - r, h/2);
  bodyShape.lineTo(-w/2 + r, h/2);
  bodyShape.quadraticCurveTo(-w/2, h/2, -w/2, h/2 - r);
  bodyShape.lineTo(-w/2, -h/2 + r);
  bodyShape.quadraticCurveTo(-w/2, -h/2, -w/2 + r, -h/2);

  const extrudeSettings = { depth: 0.6, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 0.08, bevelThickness: 0.08 };
  const bodyGeo = new THREE.ExtrudeGeometry(bodyShape, extrudeSettings);
  const bodyMat = new THREE.MeshStandardMaterial({ color: clothColor, roughness:0.7 });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.set(0, 1.5, -0.25);
  body.castShadow = true;

  return body;
}
