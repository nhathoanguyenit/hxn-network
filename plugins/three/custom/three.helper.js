import * as THREE from "/plugins/three/build/three.module.js";

/**
 * Creates X, Y, Z axes as colored lines.
 */
export const createAxes = (length = 1) => {
  const axes = new THREE.Group();
  const colors = [0xff0000, 0x00ff00, 0x0000ff];
  const vectors = [new THREE.Vector3(length, 0, 0), new THREE.Vector3(0, length, 0), new THREE.Vector3(0, 0, length)];

  vectors.forEach((vec, i) => {
    const mat = new THREE.LineBasicMaterial({ color: colors[i] });
    const geom = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), vec]);
    axes.add(new THREE.Line(geom, mat));
  });

  return axes;
};

/**
 * Creates a WebGLRenderer for a given canvas.
 */
export const createRenderer = (canvas, width, height, antialias = true) => {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias });
  renderer.setSize(width, height);
  return renderer;
};

/**
 * Creates either a Perspective or Orthographic camera.
 */
export const createCamera = (type, position, up = null, lookAt = new THREE.Vector3(0, 0, 0), aspect = 1) => {
  let camera;
  if (type === "perspective") {
    camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 100);
  } else {
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  }
  camera.position.copy(position);
  if (up) camera.up.copy(up);
  camera.lookAt(lookAt);
  return camera;
};

/**
 * Adds standard lights (ambient + directional) to a scene and returns the directional light.
 */
export const createAmbientLight = () => {
  const ambient = new THREE.AmbientLight(0xffffff, 0.5);
  return ambient;
};

export const createDirectionalLights = () => {
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(5, 5, 5);
  dirLight.castShadow = true;
  dirLight.shadow.camera.left = -5;
  dirLight.shadow.camera.right = 5;
  dirLight.shadow.camera.top = 5;
  dirLight.shadow.camera.bottom = -5;
  dirLight.shadow.bias = -0.001;
  return dirLight;
};

export const createPlane = (width, height) => {
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 50),
    new THREE.ShadowMaterial({ opacity: 0.5, color: 0x0000ff })
  );
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = 0;
  plane.receiveShadow = true;
  return plane;
};

export const createDefaultSharp = () => {
  const mean = [];
  const rx0 = 0.6,
    ry0 = 0.66,
    rz0 = 0.6;
  const latSteps = 16,
    lonSteps = 16;

  for (let i = 0; i <= latSteps; i++) {
    const theta = (i / latSteps) * Math.PI;
    const sinTheta = Math.sin(theta),
      cosTheta = Math.cos(theta);
    let a = theta < Math.PI / 3 ? 1.05 : theta < (2 * Math.PI) / 3 ? 1.02 : 0.99;

    for (let j = 0; j < lonSteps; j++) {
      const phi = (j / lonSteps) * 2 * Math.PI;
      mean.push(rx0 * a * sinTheta * Math.cos(phi), ry0 * a * cosTheta, rz0 * a * sinTheta * Math.sin(phi));
    }
  }

  const minY = Math.min(...mean.filter((_, i) => i % 3 === 1));
  for (let i = 1; i < mean.length; i += 3) mean[i] -= minY;

  const pcs = [
    mean.map((v, i) => (i % 3 === 0 ? 0.2 * v : 0)),
    mean.map((v, i) => (i % 3 === 1 ? -0.1 * v : 0)),
    mean.map((v, i) => (i % 3 === 2 ? 0.2 * Math.sin(mean[i - 1] * 2 * Math.PI) : 0)),
  ];

  const indices = [];
  for (let i = 0; i < latSteps; i++) {
    for (let j = 0; j < lonSteps; j++) {
      const a = i * lonSteps + j;
      const b = a + lonSteps;
      let c = b + 1,
        d = a + 1;
      if (j === lonSteps - 1) {
        c -= lonSteps;
        d -= lonSteps;
      }
      indices.push(a, b, d, b, c, d);
    }
  }
  return { mean, indices, pcs };
};
