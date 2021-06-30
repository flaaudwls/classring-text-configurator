import * as THREE from '../three/build/three.module.js'

export function buildScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    return scene;
}


// CREATE LIGHTS
export function buildLight(scene, camera) {
    scene.add(new THREE.AmbientLight(0xffffff, 1));
    scene.add(new THREE.HemisphereLight(0xffffff, 0xffffff, 1));

    var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(100, 100, 100)
    scene.add(directionalLight);

    var pointLight = new THREE.PointLight(0xffffff, 1, 200);
    camera.add(pointLight);
}