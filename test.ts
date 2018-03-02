import * as CGE from './src/CGE'
import { 
    createTexture2DFromImage, 
    DeferredMaterial,
    FullScreenTextureMaterial,
} from './ext'

let test_diff = './resources/spnza_bricks_a_diff.jpg';
let man_diff = './resources/VWS_B_Male2-2.jpg';
let gltf_diff = './resources/Cesium_Man/Cesium_Man.jpg'

import { 
    teapotPositions,
    teapotTexCoords,
    teapotNormals,
    teapotBinormals,
    teapotTangents,
    teapotIndices,
} from './teapot';

let mainScene = new CGE.Scene();

let colorTexrure = createTexture2DFromImage(test_diff, true);
colorTexrure.setWarp(CGE.REPEAT, CGE.REPEAT)
let colorShowingMaterial = new FullScreenTextureMaterial(colorTexrure);

let manTexture = createTexture2DFromImage(man_diff, true);
let manShowingMaterial = new FullScreenTextureMaterial(manTexture);

let loaderCallback = response => {
    CGE.Logger.info(response);
}

let cgeLoader = new CGE.Loader();
cgeLoader.loadUrl('./resources/avatar.dae').then(result => { 
        CGE.Logger.info('load from CGE loader');
        CGE.Logger.info(result);
    });
cgeLoader.loadUrls([
    { 
        url: './resources/Cesium_Man/Cesium_Man.gltf',
    }, 
    {
        url: './resources/avatar.dae',
    }], 
    loaderCallback
);

let dae_doc = undefined;
let loader_geo = undefined;
let func = function(event, object) {
    switch (event) {
        case 'document':
            dae_doc = object;
            CGE.Logger.info(dae_doc);
            break;

        case 'entity':
            CGE.Logger.info(object);
            loader_geo = object;
            let loadShowingTransform = new CGE.Transform(new CGE.Vector3(-20.0, -20.0, -0.1), undefined, new CGE.Vector3(50, 50, 50));
            let loadShowingEntity = CGE.Entity.createRenderableEntity(loader_geo, colorShowingMaterial, loadShowingTransform);
            mainScene.addEntity(loadShowingEntity);
            break;

        case 'error':
            CGE.Logger.error(object);
            break;
    
        default:
            break;
    }
}

let collada = new CGE.ColladaLoader();
collada.load('./resources/avatar.dae', func);


//===========================================================

let gltfJson = undefined;
let gltfCallback = (event, object) => {
    switch (event) {
        case 'entity':
            gltfJson = object[0];
            CGE.Logger.info(gltfJson);
            let loadShowingTransform = new CGE.Transform(new CGE.Vector3(20.0, 20.0, -0.1), undefined, new CGE.Vector3(50, 50, 50));
            let gltfTexture = createTexture2DFromImage(gltf_diff, true);
            let gltfMaterial = new FullScreenTextureMaterial(gltfTexture);
            let loadShowingEntity = CGE.Entity.createRenderableEntity(gltfJson, colorShowingMaterial, loadShowingTransform);
            mainScene.addEntity(loadShowingEntity);   
            break;

        case 'error':
            CGE.Logger.error(object);
            break;
    
        default:
            break;
    }
}

window['CGE'] = CGE;


let gltfTest = new CGE.GltfLoader();
gltfTest.load('./resources/Cesium_Man/Cesium_Man.gltf', gltfCallback);

let gltfBin = undefined;
new Promise((resolve, reject) => {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = () => {
        if (xmlHttp.readyState == 4) {
            if (xmlHttp.status == 200) {
                resolve(xmlHttp);
            } else {
                reject(new Error(this.statusText));
            }
        }
    }
    xmlHttp.open('GET', './resources/Cesium_Man/Cesium_Man.bin', true);
    xmlHttp.responseType = 'arraybuffer';
    xmlHttp.send(null);
}).then((json) => {
    gltfBin = json['response'];
    CGE.Logger.info(json);
}).catch((error) => {
    CGE.Logger.info(error);
});

CGE.Logger.info('now start promise');

let vertexPositionData = new Float32Array([
    -1.0, 1.0, 0.0,  0.0, 5.0,  0.0, 0.0, 1.0,  1.0, 0.0, 0.0,
    1.0,  1.0, 0.0,  5.0, 5.0,  0.0, 0.0, 1.0,  1.0, 0.0, 0.0,
    1.0, -1.0, 0.0,  5.0, 0.0,  0.0, 0.0, 1.0,  1.0, 0.0, 0.0,
    -1.0, -1.0, 0.0, 0.0, 0.0,  0.0, 0.0, 1.0,  1.0, 0.0, 0.0,
]);

let indexData = new Uint16Array([
    0, 2, 1,
    2, 0, 3, 
]);

let planeVertexGeometry = new CGE.Geometry();

let attribs = [
    {
        name: 'Position',
        attribute: CGE.AttribType.POSITION, 
        num: 3,
        offset: 0,
    },
    {
        name: 'UV',
        attribute: CGE.AttribType.TEXCOORD0, 
        num: 2,
        offset: vertexPositionData.BYTES_PER_ELEMENT * 3,
    },
    {
        name: 'Normal',
        attribute: CGE.AttribType.NORMAL, 
        num: 3,
        offset: vertexPositionData.BYTES_PER_ELEMENT * 5,
    },
    {
        name: 'Tangent',
        attribute: CGE.AttribType.TANGENT, 
        num: 3,
        offset: vertexPositionData.BYTES_PER_ELEMENT * 8,
    },
];

planeVertexGeometry.addMultiAttribute(attribs, CGE.FLOAT, vertexPositionData.BYTES_PER_ELEMENT * 11, vertexPositionData);
planeVertexGeometry.setIndexData(indexData);
planeVertexGeometry.setDrawParameter(indexData.length);

let teapotGeometry = new CGE.Geometry();
teapotGeometry.addSingleAttribute('Position', CGE.AttribType.POSITION, 3, CGE.FLOAT, teapotPositions);
teapotGeometry.addSingleAttribute('UV0', CGE.AttribType.TEXCOORD0, 3, CGE.FLOAT, teapotTexCoords);
teapotGeometry.addSingleAttribute('Normal', CGE.AttribType.NORMAL, 3, CGE.FLOAT, teapotNormals);
teapotGeometry.addSingleAttribute('Binormal', CGE.AttribType.BINORMAL, 3, CGE.FLOAT, teapotBinormals);
teapotGeometry.addSingleAttribute('Tangent', CGE.AttribType.TANGENT, 3, CGE.FLOAT, teapotTangents);
teapotGeometry.setIndexData(teapotIndices);
teapotGeometry.setDrawParameter(teapotIndices.length);

// TODO: rebuild this class;
let renderer = new CGE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.enableDepthTest();
renderer.clear();
renderer.setClearColor(0.2, 0.1, 0.1, 1.0);

window['renderer'] = renderer;

document.body.appendChild(renderer.getCanvas());

let colorShowingTransform = new CGE.Transform(new CGE.Vector3(0.0, 0.0, -0.1), undefined, new CGE.Vector3(50, 50, 1));
let colorShowingEntity = CGE.Entity.createRenderableEntity(planeVertexGeometry, colorShowingMaterial, colorShowingTransform);

let teapotTransform = new CGE.Transform(new CGE.Vector3(0.0, 0.0, -0.1), undefined, new CGE.Vector3(1, 1, 1));
let teapotEntity = CGE.Entity.createRenderableEntity(teapotGeometry, colorShowingMaterial, teapotTransform);

window['teapot'] = teapotEntity;

let camera = new CGE.Camera(window.innerWidth, window.innerHeight);
camera.setPosition(new CGE.Vector3(-100, 100, 80));
camera.lookAt(new CGE.Vector3(0, 1, 50));
camera.update(0);

let cameraEntity = new CGE.Entity();
cameraEntity.addComponent(CGE.Component.CreateTransfromComponent(new CGE.Transform()));
cameraEntity.addComponent(CGE.Component.CreateCameraComponent(camera));

mainScene.setMainCamera(cameraEntity);
mainScene.addEntity(colorShowingEntity);
mainScene.addEntity(teapotEntity);

window['scene'] = mainScene;

let events = new Map();

let render = function(delta) {
    // renderTargetScene.update();
    // trans.forEach(function(transform){
    //     transform.applyMatrix4(testMat4);
    // });
    // renderer.renderScene(renderTargetScene, renderTarget);
    events.forEach((event) => {
        event.update(delta);
    });
    mainScene.update(delta);
    renderer.renderScene(mainScene);
};

window.onresize = function() {
    let width = window.innerWidth;
    let height = window.innerHeight;
    renderer.setSize(width, height);
    camera.resize(width, height);
    camera.update(0);
    // renderTargetCamera.resize(width, height);
    // renderTargetCamera.update();
    render(0);
};

let noError = true;
window.onerror = function(event) {
    noError = false;
}

let _d = 0.5 

let forward = CGE.Event.createFromFunc(() => {camera.forwardStep(_d);});
let back = CGE.Event.createFromFunc(() => {camera.forwardStep(-_d);});
let left = CGE.Event.createFromFunc(() => {camera.horizontalStep(-_d);});
let right = CGE.Event.createFromFunc(() => {camera.horizontalStep(_d);});

let verticalTop = CGE.Event.createFromFunc(() => {camera.verticalStep(_d);});
let verticalDown = CGE.Event.createFromFunc(() => {camera.verticalStep(-_d);});

window.onkeydown = function(event) {
    // CGE.Logger.info(event);
    switch(event.which || event.keyCode) {
        case 87:
            events.set(forward.id, forward);
            break;

        case 65:
            events.set(left.id, left);
            break;

        case 83:
            events.set(back.id, back);
            break;

        case 68:
            events.set(right.id, right);
            break;

        case 81:
            events.set(verticalTop.id, verticalTop);
            break;
        
        case 69:
            events.set(verticalDown.id, verticalDown);
            break;

        default:
            break;
    }
}

window.onkeyup = function(event) {
    switch(event.which || event.keyCode) {
        case 87:
            events.delete(forward.id);
            break;

        case 65:
            events.delete(left.id);
            break;

        case 83:
            events.delete(back.id);
            break;

        case 68:
            events.delete(right.id);
            break;

        case 81:
            events.delete(verticalTop.id);
            break;
        
        case 69:
            events.delete(verticalDown.id);
            break;

        default:
            break;
    }
}

window.onblur = function(event) {
    events.clear();
}

let mouseDown = false;

window.onmousemove = function(event) {
    if (mouseDown) {
        let del = 0.005;
        let moveX = event.movementX * del;
        let moveY = event.movementY * del;
        camera.rotateViewFromForward(moveX, moveY);
    }
}

window.onmousedown = function(event) {
    // CGE.Logger.info(event);
    mouseDown = true;
}

window.onmouseup = function(event) {
    mouseDown = false;
}

let dataS = new Date();

function loop() {
    let animationframe = window.requestAnimationFrame
                        ||function(a){
        setTimeout(a, 1000/5);
    };
    if (noError) {
        animationframe(loop);
    }
    let dateE = new Date();
    let delta = dateE.getTime() - dataS.getTime();
    render(delta);
};

setTimeout(render, 200);

loop();