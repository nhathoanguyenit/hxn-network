import * as THREE from "/plugins/three/build/three.module.js";

export function createLegs(clothColor){
  const group = new THREE.Group();

  const thighGeo = new THREE.CapsuleGeometry(0.12, 0.25, 4, 8);
  const shinGeo = new THREE.CapsuleGeometry(0.11, 0.25, 4, 8);
  const footGeo = new THREE.CapsuleGeometry(0.1, 0.1, 4, 8);
  const legMat = new THREE.MeshStandardMaterial({ color: clothColor, roughness:0.7 });

  // Left leg
  const thighL = new THREE.Mesh(thighGeo, legMat);
  const shinL = new THREE.Mesh(shinGeo, legMat);
  const footL = new THREE.Mesh(footGeo, legMat);

  thighL.position.set(-0.2, 0.7, 0);
  thighL.rotation.x = -0.05;

  shinL.position.set(0, -0.275, 0);
  shinL.rotation.x = 0.05;

  footL.position.set(0, -0.175, 0.05);
  footL.rotation.x = 0.1;

  const leftGroup = new THREE.Group();
  leftGroup.add(thighL);
  thighL.add(shinL);
  shinL.add(footL);

  // Right leg
  const thighR = new THREE.Mesh(thighGeo, legMat);
  const shinR = new THREE.Mesh(shinGeo, legMat);
  const footR = new THREE.Mesh(footGeo, legMat);

  thighR.position.set(0.2, 0.7, 0);
  thighR.rotation.x = -0.05;

  shinR.position.set(0, -0.275, 0);
  shinR.rotation.x = 0.05;

  footR.position.set(0, -0.175, 0.05);
  footR.rotation.x = 0.1;

  const rightGroup = new THREE.Group();
  rightGroup.add(thighR);
  thighR.add(shinR);
  shinR.add(footR);

  group.add(leftGroup, rightGroup);
  return group;
}
