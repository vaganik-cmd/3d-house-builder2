import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js';

let scene, camera, renderer, controls;

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.set(5,5,7);

    renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('container').appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Освещение
    const ambient = new THREE.AmbientLight(0xffffff,0.5);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xffffff,1);
    dirLight.position.set(10,10,10);
    scene.add(dirLight);

    // Загрузка текстур
    const loader = new THREE.TextureLoader();
    const wallTex = loader.load('textures/brick_wall.jpg');
    const roofTex = loader.load('textures/roof.jpg');
    const floorTex = loader.load('textures/ground.jpg');
    const doorTex = loader.load('textures/door.jpg');

    // Пол
    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(50,50),
        new THREE.MeshStandardMaterial({map: floorTex})
    );
    floor.rotation.x = -Math.PI/2;
    scene.add(floor);

    // Дом (куб)
    const house = new THREE.Group();

    // Стены
    const walls = new THREE.Mesh(
        new THREE.BoxGeometry(4,3,4),
        new THREE.MeshStandardMaterial({map: wallTex})
    );
    house.add(walls);

    // Крыша (пирамидальная)
    const roof = new THREE.Mesh(
        new THREE.ConeGeometry(3,1.5,4),
        new THREE.MeshStandardMaterial({map: roofTex})
    );
    roof.position.y = 2.25;
    roof.rotation.y = Math.PI/4;
    house.add(roof);

    // Дверь (плоскость)
    const door = new THREE.Mesh(
        new THREE.PlaneGeometry(1,2),
        new THREE.MeshStandardMaterial({map: doorTex})
    );
    door.position.set(0,-0.5,2.01);
    house.add(door);

    scene.add(house);

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

window.addEventListener('resize', ()=>{
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

init();
