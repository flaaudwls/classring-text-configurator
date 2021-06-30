import * as THREE from '../three/build/three.module.js';

export const buildRenderer = (container) => {

    const renderer = new THREE.WebGLRenderer({ antialias: true });

    const DPR = window.devicePixelRatio ? window.devicePixelRatio : 1;

    // renderer.setPixelRatio(isMobile() ? 0.7 : DPR);

    renderer.setSize(container.clientWidth, container.clientHeight);

    container.appendChild(renderer.domElement);

    renderer.outputEncoding = THREE.sRGBEncoding;

    renderer.shadowMap.enabled = true;


    return renderer;
}