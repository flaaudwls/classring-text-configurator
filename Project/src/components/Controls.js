import { OrbitControls } from '../three/examples/jsm/controls/OrbitControls.js';

export const buildControls = (camera, renderer) => {

    const controls = new OrbitControls(camera, renderer.domElement);

    controls.target.set(0, 4, 0);

    controls.zoomSpeed = 0.05;

    controls.minDistance = 70

    controls.maxDistance = 100;

    controls.enableDamping = true;

    controls.dampingFactor = 0.05;

    controls.enablePan = false;

    controls.enableKeys = false;

    controls.autoRotate = true;

    return controls;
}