import * as THREE from './three/build/three.module.js'
import { data } from './data.js';
import { buildControls } from './components/Controls.js';
import { buildCamera } from './components/Camera.js';
import { buildScene, buildLight } from './components/Scene.js';
import { buildRenderer } from './components/Renderer.js';
import { loadAssets } from './components/utils.js';
import { UIControls } from './components/UIControls.js';

const container = document.getElementById('container');
var load_icon = document.getElementById("loader");

var camera, scene, renderer, controls;

var charPos = {
    'top': [],
    'neck': [],
    'right': [],
    'left': [],
    'inside': [],
};

var ring, chars, graphs;



init();
animate();


//INITIALIZATION OF THREE.JS
function init() {

    scene = buildScene();
    camera = buildCamera(scene, container);
    renderer = buildRenderer(container);
    controls = buildControls(camera, renderer)
    buildLight(scene, camera);

    loadAssets(scene, renderer, (_ring, _graphs, _chars) => {
        ring = _ring;
        chars = _chars;
        graphs = _graphs;
        load_icon.style.display = 'none';

        UIControls(ring, graphs, charPos, scene, camera, controls);
        changeText('LOYAL_HIGHSCHOOL', 'top');
        changeText('FAMILY', 'right');
        changeText('2021', 'left');
        changeText('NEW BEGINNINGS', 'inside');
        changeGraph('soccer_ball', 'left');
        changeGraph('graduate', 'right')
        controls.autoRotate = false;
    });

    window.addEventListener('resize', onWindowResize, false);
}



function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();
}


export function changeGraph(graphName, side) {
    if (ring[side] !== null) {
        ring[side].geometry.dispose();
        // 
        scene.remove(ring[side]);
        ring[side] = null;
    }

    ring[side] = graphs[graphName].clone();
    var a = data[side + '_graph'];
    ring[side].position.set(a.position[0], a.position[1], a.position[2]);
    const rot = a.rotation; console.log(rot)
    ring[side].rotation.set(rot[0], rot[1], -rot[2])
    ring[side].scale.set(a.scale[0], a.scale[1], a.scale[2]);


    ring[side].visible = true;
    scene.add(ring[side]);
}



// RETURN LETTER MESH
function getMesh(code, fontName, fontType) {
    var mesh;
    if (code === 32) {
        mesh = new THREE.Mesh();
    } else {
        mesh = chars[fontName][fontType][code];
    }
    return mesh;
}

function removeChars(side) {
    charPos[side].forEach((v) => { scene.remove(v); v.geometry.dispose(); });
    charPos[side] = [];
}

function reverseString(str) {
    var splitString = str.split("");
    var reverseArray = splitString.reverse();
    var joinArray = reverseArray.join("");
    return joinArray;
}

//CHANGE LETTERS OF EACH AREA
export function changeText(text, side) {
    let L = text.length;
    var temp, index;
    switch (side) {
        case 'top':
            removeChars('top');
            const text1 = text.split('_')[0];
            const text2 = text.split('_')[1];
            const L1 = text1.length;
            const L2 = text2.length;
            L = L1 + L2;

            let orderedString = '';
            orderedString += reverseString(text2.substr(0, Math.ceil(L2 / 2)))
            orderedString += '*';
            orderedString += text1;
            orderedString += '*';
            orderedString += reverseString(text2.substr(Math.ceil(L2 / 2)));

            var top1TextDetector = 0;
            for (var i = 0; i < L + 2; ++i) {
                if (orderedString.charAt(i) === '*') top1TextDetector++;

                temp = (orderedString.charAt(i) !== '*') ?
                    getMesh(orderedString.charCodeAt(i), 'arial', 'regular') :
                    chars.star;
                let m = temp.clone();
                var a = data[`top_${L + 2}_${L2 % 2}_${i + 1}`];
                if (a === undefined) console.log(`top_${L + 2}_${L2 % 2}_${i + 1}`, L1, L2)
                m.position.set(a.position[0], a.position[1], a.position[2]);
                rotate(m, a.rotation);

                m.scale.set((top1TextDetector == 1) ? a.scale[0] : -a.scale[0], a.scale[1], (top1TextDetector == 1) ? a.scale[2] : -a.scale[2]);
                m.visible = true;
                m.material = ring.body[0].material;
                charPos.top.push(m);
                scene.add(m);
            }
            break;
        case 'right':
            removeChars('right');
            for (var i = 0; i < L; ++i) {
                temp = getMesh(text.charCodeAt(i), 'arial', 'bold')
                let m = temp.clone();
                let a = data['right_' + L + '_' + (i + 1)];
                m.position.set(a.position[0], a.position[1], a.position[2]);
                rotate(m, a.rotation);
                m.scale.set(a.scale[0], 1.2, a.scale[2]);
                m.visible = true;
                m.material = ring.body[0].material;
                charPos.right.push(m);
                scene.add(m);
            }
            break;
        case 'left':
            removeChars('left');
            for (var i = 0; i < L; ++i) {
                temp = getMesh(text.charCodeAt(i), 'arial', 'bold')
                let m = temp.clone();
                let a = data['left_' + L + '_' + (i + 1)];
                m.position.set(a.position[0], a.position[1], a.position[2]);
                rotate(m, a.rotation);
                m.scale.set(a.scale[0], a.scale[1], a.scale[2]);
                m.visible = true;
                m.material = ring.body[0].material;
                charPos.left.push(m);
                scene.add(m);
            }
            break;
        case 'inside':
            removeChars('inside');
            for (var i = 0; i < L; ++i) {
                temp = getMesh(text.charCodeAt(i), 'cambria', 'bold')

                let m = temp.clone();
                var a = data['inside_' + L + '_' + (i + 1)];
                m.position.set(a.position[0], a.position[1], a.position[2]);
                const modified = [a.rotation[0], a.rotation[1], -a.rotation[2]]
                rotate(m, modified);
                m.scale.set(a.scale[0], a.scale[1], a.scale[2]);
                m.visible = true;
                m.material = new THREE.MeshBasicMaterial({ color: 0x000000 });
                charPos.inside.push(m);
                scene.add(m);
            }
            break;
    }
}
window.camera = camera;
/* Rotate Mesh By Euler From Blender */
function rotate(mesh, e) { //euler
    var qx = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), e[0]);
    var qy = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), e[1]);
    var qz = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), e[2]);
    mesh.applyQuaternion(qx);
    mesh.applyQuaternion(qy);
    mesh.applyQuaternion(qz);
}


// CHANGE RING COLOR
document.getElementById('ring_color').onchange = function () {

    ring.color = this.value;
    ring.body[0].material.map = ring.textures[ring.color];
    charPos.right[0].material.map = ring.textures[ring.color];
    charPos.left[0].material.map = ring.textures[ring.color];

    graphs['soccer_ball'].material.map = ring.textures[ring.color];

    ring.core.material.map = new THREE.TextureLoader().load(`src/assets/images/${parseInt($('#colorSelect').val()) + 1}.jpg`)

    if (ring.color === 'wax') {
        ring.black.material.map = ring.textures['wax'];
        ring.core.material.map = ring.textures['wax']
        charPos.inside.forEach(m => {
            m.material.color = new THREE.Color(0x332266)
        })

        ring.body[0].material.roughness = 0.8
        ring.black.material.roughness = 0.8;
        graphs['soccer_ball'].material.roughness = 0.8
        ring.core.visible = false;
    } else {
        ring.core.visible = true;
        ring.body[0].material.roughness = 0.1
        ring.black.material.roughness = 0.339;
        graphs['soccer_ball'].material.roughness = 0.5

        if (ring.color === 'cad') {
            ring.black.material.map = ring.textures[ring.color];
            ring.core.material.map = ring.textures['red']
            charPos.inside.forEach(m => {
                m.material.color = new THREE.Color(0x004422)
            })
        } else {
            ring.black.material = new THREE.MeshStandardMaterial().copy(ring.blackMat)
            charPos.inside.forEach(m => {
                m.material.color = new THREE.Color(0x000000)
            })
        }
    }


}