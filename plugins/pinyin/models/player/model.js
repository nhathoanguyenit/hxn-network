import * as THREE from "/plugins/three/build/three.module.js";
import { createHead } from "./head.js";
import { createBody } from "./body.js";
import { createArms } from "./arms.js";
import { createLegs } from "./legs.js";

export function createPlayer(opts = {}) {
  const g = new THREE.Group();
  g.add(createLegs(opts.clothColor));
  g.add(createBody(opts.clothColor));
  g.add(createHead(opts));
  g.add(createArms(opts.clothColor));

  if (opts.preset === "ninja") {
    const mask = new THREE.Mesh(
      new THREE.PlaneGeometry(1.1, 0.45),
      new THREE.MeshStandardMaterial({ color: 0x111111 })
    );
    mask.position.set(0, 2.05, 0.78);
    g.add(mask);
  } else if (opts.preset === "wizard") {
    const hat = new THREE.ConeGeometry(0.9, 1.6, 24);
    const hatMat = new THREE.MeshStandardMaterial({ color: 0x4b2b86 });
    const hatMesh = new THREE.Mesh(hat, hatMat);
    hatMesh.position.set(0, 3.1, 0);
    hatMesh.rotation.z = 0.05;
    g.add(hatMesh);
  }

  g.scale.set(1, 1, 1);
  g.position.set(0, 0, 0);

  return g;
}
