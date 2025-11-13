import * as THREE from "/plugins/three/build/three.module.js";

export function createArms(clothColor) {
  const group = new THREE.Group();

  const upperArmGeo = new THREE.CapsuleGeometry(0.08, 0.3, 4, 8);
  const lowerArmGeo = new THREE.CapsuleGeometry(0.07, 0.35, 4, 8);
  const armMat = new THREE.MeshStandardMaterial({ color: clothColor, roughness: 0.7 });

  // Left arm
  const upperArmL = new THREE.Mesh(upperArmGeo, armMat);
  const lowerArmL = new THREE.Mesh(lowerArmGeo, armMat);
  upperArmL.position.set(-0.5, 1.85, -0.05);
  upperArmL.rotation.z = -0.5;
  lowerArmL.position.set(0, -0.325, 0.035);
  lowerArmL.rotation.x = -0.3;

  const leftGroup = new THREE.Group();
  leftGroup.add(upperArmL);
  upperArmL.add(lowerArmL);

  // Right arm
  const upperArmR = new THREE.Mesh(upperArmGeo, armMat);
  const lowerArmR = new THREE.Mesh(lowerArmGeo, armMat);
  upperArmR.position.set(0.5, 1.85, -0.05);
  upperArmR.rotation.z = 0.5;
  lowerArmR.position.set(0, -0.325, 0.035);
  lowerArmR.rotation.x = -0.3;

  const rightGroup = new THREE.Group();
  rightGroup.add(upperArmR);
  upperArmR.add(lowerArmR);

  group.add(leftGroup, rightGroup);
  return group;
}