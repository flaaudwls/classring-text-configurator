import * as THREE from '../three/build/three.module.js';

export const buildCamera = (scene, container) => {
    const camera = new THREE.PerspectiveCamera(30, container.clientWidth / container.clientHeight, 1, 5000);
    camera.position.set(-28, 46, 64);
    scene.add(camera);
    return camera;
}