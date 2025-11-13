import * as THREE from "/plugins/three/build/three.module.js";

export function createLegs(clothColor){
  const group = new THREE.Group();

  // Geometries
  const thighGeo = new THREE.CapsuleGeometry(0.13, 0.3, 4, 8);
  const shinGeo = new THREE.CapsuleGeometry(0.11, 0.3, 4, 8);
  const footGeo = new THREE.CapsuleGeometry(0.1, 0.15, 4, 8);
  const legMat = new THREE.MeshStandardMaterial({ color: clothColor, roughness:0.7 });

  function createLeg(isLeft = true) {
    const sign = isLeft ? -1 : 1;

    // Thigh
    const thigh = new THREE.Mesh(thighGeo, legMat);
    thigh.position.set(0.2 * sign, 0.8, -0.05);
    thigh.rotation.x = -0.15;

    // Shin
    const shin = new THREE.Mesh(shinGeo, legMat);
    shin.position.set(0, -0.35, -0.05);
    shin.rotation.x = 0.35; // bend knee
    thigh.add(shin);

    // Foot
    const foot = new THREE.Mesh(footGeo, legMat);
    foot.position.set(0, -0.25, 0.08);
    foot.rotation.x = Math.PI/2; // point foot slightly down
    shin.add(foot);

    return thigh;
  }

  group.add(createLeg(true));
  group.add(createLeg(false));

  return group;
}
