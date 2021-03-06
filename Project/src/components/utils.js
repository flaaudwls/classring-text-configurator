import * as THREE from '../three/build/three.module.js'
import { GLTFLoader } from '../three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from '../three/examples/jsm/loaders/RGBELoader.js';

export function loadAssets(scene, renderer, callback) {

    var ring = {
        body: [],
        color: 'gold',
        textures: { 'gold': null, 'rose': null, 'silver': null, 'cad': null },
        core: [], //CORE JEWELRY
        left: null, //LEFT GRAPH
        right: null,
        line: null,
        black: null,
        blackMat: null,
        graphMat: null
    };

    var chars = {
        star: null,
        cambria: { bold: {} },
        arial: {
            bold: {},
            regular: {}
        }
    };

    var graphs = [];

    var promises = [];
    ['gold', 'silver', 'rose', 'black', 'red', 'cad', 'wax'].forEach(colorName => {

        promises.push(
            new Promise(resolve => { new THREE.TextureLoader().load(`src/assets/images/${colorName}.jpg`, resolve) }).then(result => { ring.textures[colorName] = result })
        )
    })


    promises.push(
        new Promise(resolve => {
            new RGBELoader().setDataType(THREE.UnsignedByteType).load('src/assets/env/venice_sunset_1k.hdr', resolve)
        }).then(result => {
            var texture = result;
            var pmremGenerator = new THREE.PMREMGenerator(renderer);
            pmremGenerator.compileEquirectangularShader();
            const envMap = pmremGenerator.fromEquirectangular(texture).texture;
            scene.environment = envMap;
            texture.dispose();
            pmremGenerator.dispose();
        }),
        loadModel('src/assets/ring.glb').then(result => {
            scene.add(result.scene)
            result.scene.traverse(child => {
                let str = child.name;
                if (child.isMesh) {
                    if (str.includes('body')) {
                        ring.body.push(child);
                    }
                    if (str.includes('core')) {
                        ring.core = child;
                    }
                    if (str.includes('black')) {
                        ring.black = child;
                        ring.blackMat = child.material;
                    }
                }
            });
        }),
        loadModel('src/assets/chars.glb').then(result => {
            result.scene.traverse(child => {
                if (child.isMesh) {
                    let str = child.name.split('_');
                    if (str[0].includes('star'))
                        chars['star'] = child;
                    else {
                        chars[str[0]][str[1]][str[2]] = child;
                    }
                }
            });
        }),

        loadModel('src/assets/graphs.glb').then(result => {
            result.scene.traverse(child => {
                let str = child.name;
                graphs[str] = child;
                ring.graphMat = child.material
            });
        })
    )

    Promise.all(promises).then(() => {
        ring.black.material = new THREE.MeshStandardMaterial().copy(ring.blackMat)
        callback(ring, graphs, chars);
    })
}




function loadModel(url) {
    return new Promise(resolve => {
        new GLTFLoader().load(url, resolve);
    });
}



export function moveCamera(camera, controls, camPos) {
    gsap.to(camera.position, {
        duration: 0.8,
        x: camPos.x,
        y: camPos.y,
        z: camPos.z,
        onUpdate: function () {
            controls.update();
        },
    });

}
