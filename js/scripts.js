import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js';

let scene, camera, renderer, controls;

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.set(5,5,5);

    renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('container').appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Освещение
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5,10,7.5);
    scene.add(dirLight);

    // Пол
    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(50,50),
        new THREE.MeshStandardMaterial({color:0x555555})
    );
    floor.rotation.x = -Math.PI/2;
    scene.add(floor);

    // Дом (блоки)
    const houseGeometry = new THREE.BoxGeometry(2,2,2);
    const houseMaterial = new THREE.MeshStandardMaterial({color:0xffcc00});
    const house = new THREE.Mesh(houseGeometry, houseMaterial);
    scene.add(house);

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// Обработка ресайза
window.addEventListener('resize', ()=>{
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

init();

// Обработка формы
const form = document.getElementById('builderForm');
form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const fd = new FormData(form);
    const type = fd.get('type');
    const floors = fd.get('floors');
    const area = fd.get('area');
    const finish = fd.get('finish');
    const extras = [];
    if(fd.get('garage')) extras.push('garage');
    if(fd.get('terrace')) extras.push('terrace');
    const name = fd.get('name');
    const phone = fd.get('phone');

    document.getElementById('builderStatus').textContent = 'Заявка отправлена. Спасибо!';

    console.log({type,floors,area,finish,extras,name,phone});
});
