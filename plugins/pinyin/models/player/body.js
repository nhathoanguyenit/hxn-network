import * as THREE from "/plugins/three/build/three.module.js";

export function createBody(clothColor = 0xff0000) {
    const bodyGroup = new THREE.Group();
    const material = new THREE.MeshStandardMaterial({ color: clothColor });

    const backGeo = new THREE.BoxGeometry(0.75, 0.57, 0.3);
    const back = new THREE.Mesh(backGeo, material);
    back.position.set(0, 1.82, 0.2);
    back.castShadow = true;
    back.rotation.x = 0.1;

    // === Chest (rounded) ===
    const chestLeftGeo = new THREE.BoxGeometry(0.35, 0.35, 0.3);
    const chestLeft = new THREE.Mesh(chestLeftGeo, material);
    chestLeft.position.set(-0.2, 1.9, 0.3);
    chestLeft.castShadow = true;

    const chestRightGeo = new THREE.BoxGeometry(0.35, 0.35, 0.3);
    const chestRight = new THREE.Mesh(chestRightGeo, material);
    chestRight.position.set(0.2, 1.9, 0.3);
    chestRight.castShadow = true;

    // === Shoulders (rounded) ===
    const shoulderGeo = new THREE.SphereGeometry(0.1, 32, 32);
    const shoulderLeft = new THREE.Mesh(shoulderGeo, material);
    shoulderLeft.position.set(-0.42, 2.00, 0.2);

    const shoulderRight = new THREE.Mesh(shoulderGeo, material);
    shoulderRight.position.set(0.42, 2.00, 0.2);

    // === Abdomen (tapered cylinder) ===
    const abdomenGeo = new THREE.BoxGeometry(0.6, 0.5, 0.3);
    const abdomen = new THREE.Mesh(abdomenGeo, material);
    abdomen.rotation.x = -0.05;
    abdomen.position.set(0, 1.3, 0.2);
    abdomen.castShadow = true;

    // === Hips (rounded cylinder) ===
    const hipGeo = new THREE.BoxGeometry(0.7, 0.35, 0.4);
    const hips = new THREE.Mesh(hipGeo, material);
    hips.position.set(0, 1.1, 0.2);
    hips.castShadow = true;

    // Add all parts
    bodyGroup.add(back, chestLeft, chestRight, shoulderLeft, shoulderRight, abdomen, hips);

    // Optional: overall body position
    bodyGroup.position.set(0, 0, -0.25);

    return bodyGroup;
}
