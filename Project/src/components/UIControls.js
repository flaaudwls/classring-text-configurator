import * as THREE from '../three/build/three.module.js';
import { moveCamera } from "./utils.js";
import { CAMERA_POS } from "./Constant.js";
import { changeText, changeGraph } from '../main.js';

export function UIControls(ring, graphs, charPos, camera, controls) {

    //CHANGE COLOR OF CORE JEWELRY
    document.getElementById('colorSelect').onclick = function () {
        moveCamera(camera, controls, CAMERA_POS.topCore);
    }
    document.getElementById('colorSelect').onchange = function () {
        moveCamera(camera, controls, CAMERA_POS.topCore);
        ring.core.material.map = new THREE.TextureLoader().load(`src/assets/images/${parseInt(this.value) + 1}.jpg`)
    }


    //CHANGE RIGHT GRAPH
    document.getElementById('right_graph').onclick = function () {
        moveCamera(camera, controls, CAMERA_POS.right);
    }
    document.getElementById('right_graph').onchange = function () {
        moveCamera(camera, controls, CAMERA_POS.right);
        changeGraph(this.value, 'right');
    }


    //CHANGE LEFT GRAPH
    document.getElementById('left_graph').onclick = function () {
        moveCamera(camera, controls, CAMERA_POS.left);
    }
    document.getElementById('left_graph').onchange = function () {
        moveCamera(camera, controls, CAMERA_POS.left);
        changeGraph(this.value, 'left');
    }


    // CHANGE RIGHT TEXT 
    document.getElementById('right_text').onfocus = function () {
        moveCamera(camera, controls, CAMERA_POS.rightText);
    }
    document.getElementById('right_text').onkeyup = function () {
        moveCamera(camera, controls, CAMERA_POS.rightText);
        var str = this.value.replace(/[^ -~]+/g, "");
        str = str.toUpperCase();
        str = str.replace(/[\s`{}_\[\]\\|^]/g, '');
        this.value = str;
        changeText(str, 'right')
    }


    // CHANGE LEFT TEXT
    document.getElementById('left_text').onfocus = function () {
        moveCamera(camera, controls, CAMERA_POS.leftText);
    }
    document.getElementById('left_text').onkeyup = function () {
        moveCamera(camera, controls, CAMERA_POS.leftText);
        var str = this.value.replace(/[^ -~]+/g, "");
        str = str.toUpperCase();
        str = str.replace(/[\s`{}_\[\]\\|^]/g, '');
        this.value = str;
        changeText(str, 'left');
    }


    // CHANGE INSIDE TEXT
    document.getElementById('inside_text').onfocus = function () {
        moveCamera(camera, controls, CAMERA_POS.insideText);
    }
    document.getElementById('inside_text').onkeyup = function () {
        moveCamera(camera, controls, CAMERA_POS.insideText);
        var str = this.value.replace(/[^ -~]+/g, "");
        str = str.toUpperCase();
        str = str.replace(/[`{}_\[\]\\|^]/g, '');
        this.value = str;
        changeText(str, 'inside');
    }

    // CHANGE TOP TEXT 1
    document.getElementById('top_text1').onfocus = function () {
        moveCamera(camera, controls, CAMERA_POS.topText);
    }
    document.getElementById('top_text1').onkeyup = function () {
        moveCamera(camera, controls, CAMERA_POS.topText);
        var str = this.value.replace(/[^ -~]+/g, "");
        str = str.toUpperCase();
        str = str.replace(/[`{}_\[\]\\|^]/g, '');
        this.value = str;
        changeText(str + '_' + document.getElementById('top_text1').value, 'top');
    }

    //CHANGE TOP TEXT 2
    document.getElementById('top_text2').onfocus = function () {
        moveCamera(camera, controls, CAMERA_POS.topText);
    }
    document.getElementById('top_text2').onkeyup = function () {
        moveCamera(camera, controls, CAMERA_POS.topText);
        var str = this.value.replace(/[^ -~]+/g, "");
        str = str.toUpperCase();
        str = str.replace(/[`{}_\[\]\\|^]/g, '');
        this.value = str;
        changeText(document.getElementById('top_text1').value + '_' + str, 'top');
    }




    // CHANGE RING COLOR
    document.getElementById('ring_color').onchange = function () {
        ring.color = this.value;
        ring.body[0].material.map = ring.textures[ring.color];
        charPos.right[0].material.map = ring.textures[ring.color];
        charPos.left[0].material.map = ring.textures[ring.color];
        charPos.neck[0].material.map = ring.textures[ring.color];
        graphs['soccer_ball'].material.map = ring.textures[ring.color];
        // graphs[0].material.needsUpdate = false;
    }


}