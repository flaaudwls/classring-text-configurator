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

        UIControls(ring, graphs, charPos, camera, controls);
        changeText('ABCD_ECD', 'top');
        // changeText('NEWBURYPARK HIGHSCHOOL', 'neck');
        // changeText('JEREMY', 'right');
        // changeText('2021', 'left');
        // changeText('CAD', 'inside');
        // changeGraph('soccer_ball', 'left');
        // changeGraph('graduate', 'right')
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
    rotate(ring[side], a.rotation);
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
    // text = 'ASCCCS_S'
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
            for (var i = 0; i < L + 2; ++i) {
                temp = (orderedString.charAt(i) !== '*') ?
                    getMesh(orderedString.charCodeAt(i), 'arial', 'regular') :
                    chars.star;
                let m = temp.clone();
                var a = data[`top_${L + 2}_${L2 % 2}_${i + 1}`];
                m.position.set(a.position[0], a.position[1], a.position[2]);
                rotate(m, a.rotation);
                m.scale.set(-a.scale[0], a.scale[1], -a.scale[2]);
                m.visible = true;
                m.material = ring.body[0].material;
                charPos.top.push(m);
                scene.add(m);
            }
            break;
        case 'neck':
            removeChars('neck');
            for (var i = 0; i < L; ++i) {
                temp = getMesh(text.charCodeAt(i), 'cambria', 'bold');
                let m = temp.clone();
                let a;
                if (L < 14 || L == 22 || L == 21) {
                    index = neckCharPos[L.toString()][i] - 1;
                    a = data['neck_arr_' + (index + 1)];
                } else {
                    a = data1['neck_' + L + '_' + (i + 1)];
                }

                m.position.set(a.position[0], a.position[1], a.position[2]);
                rotate(m, a.rotation);
                m.scale.set(a.scale[0] - 0.3, 0.8, a.scale[2] + 0.2);
                m.visible = true;
                m.material = ring.body[0].material;
                charPos.neck.push(m);
                scene.add(m);
                if (L == 22 && i == 0) m.position.x -= 0.7//window['first'] = m;
                if (L == 22 && i == 21) m.position.x += 0.7//window['last'] = m;
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

/* Rotate Mesh By Euler From Blender */
function rotate(mesh, e) { //euler
    var qx = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), e[0]);
    var qy = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), e[1]);
    var qz = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), e[2]);
    mesh.applyQuaternion(qx);
    mesh.applyQuaternion(qy);
    mesh.applyQuaternion(qz);
}

