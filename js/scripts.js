let scene, camera, renderer, controls, house;

init();
animate();

function init() {
  // Scene
  scene = new THREE.Scene();

  // Camera
  camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.set(5, 5, 10);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x0b0c0e);
  renderer.shadowMap.enabled = true;
  document.getElementById('canvas-container').appendChild(renderer.domElement);

  // Controls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.target.set(0, 1, 0);

  // Lights
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
  hemiLight.position.set(0, 20, 0);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(5, 10, 7);
  dirLight.castShadow = true;
  scene.add(dirLight);

  // Ground
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 50),
    new THREE.MeshStandardMaterial({ color: 0x223311 })
  );
  ground.rotation.x = -Math.PI/2;
  ground.receiveShadow = true;
  scene.add(ground);

  // Initial House
  house = createHouse();
  scene.add(house);

  // Handle resize
  window.addEventListener('resize', onWindowResize, false);

  // Form event
  document.getElementById('builderForm').addEventListener('submit', updateHouse);
}

// Create House
function createHouse(options = {}) {
  const group = new THREE.Group();
  const floors = options.floors || 2;
  const type = options.type || 'brick';
  const width = options.width || 4;
  const depth = options.depth || 4;
  const height = options.height || 2.5;

  // Material colors
  const wallMat = new THREE.MeshStandardMaterial({ color: type==='brick'?0xaa5555: type==='timber'?0x885522:0xcccccc });
  const roofMat = new THREE.MeshStandardMaterial({ color: 0xff6600 });
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x88ccff, transparent:true, opacity:0.6 });
  const doorMat = new THREE.MeshStandardMaterial({ color: 0x442211 });

  // Floors
  for(let i=0;i<floors;i++){
    const floor = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, depth),
      wallMat
    );
    floor.position.y = height/2 + i*height;
    floor.castShadow = true;
    floor.receiveShadow = true;
    group.add(floor);
  }

  // Roof (pyramid)
  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(Math.sqrt(width*width + depth*depth)/2, 1.5, 4),
    roofMat
  );
  roof.position.y = height*floors + 0.75;
  roof.rotation.y = Math.PI/4;
  group.add(roof);

  // Door
  const door = new THREE.Mesh(
    new THREE.BoxGeometry(1, 2, 0.1),
    doorMat
  );
  door.position.set(0, 1, depth/2 + 0.05);
  group.add(door);

  // Windows
  const window1 = new THREE.Mesh(new THREE.BoxGeometry(1,1,0.1), glassMat);
  window1.position.set(-1.5,2,depth/2 +0.05);
  group.add(window1);

  const window2 = window1.clone();
  window2.position.set(1.5,2,depth/2 +0.05);
  group.add(window2);

  return group;
}

// Update House
function updateHouse(e){
  e.preventDefault();
  const form = e.target;
  const type = form.type.value;
  const floors = parseInt(form.floors.value);

  scene.remove(house);
  house = createHouse({type:type,floors:floors});
  scene.add(house);
  document.getElementById('builderStatus').textContent = 'Дом обновлён!';
}

// Resize
function onWindowResize(){
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animate
function animate(){
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene,camera);
}
