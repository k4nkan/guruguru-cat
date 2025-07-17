import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// シーン＆カメラ
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff); // 背景を白に

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 1, 10);

// レンダラー
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 照明（環境光とディレクショナルライト）
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(1, 1, 1);
scene.add(dirLight);

// モデル読み込み
let model;
let rotationSpeed = 0.01; // 初期速度

new GLTFLoader().load(
  'cat.glb',
  (gltf) => {
    model = gltf.scene;

    // マテリアルが付いていないメッシュにベーシックなマテリアルを自動付与（見えるように）
    model.traverse((child) => {
      if (child.isMesh && !child.material) {
        child.material = new THREE.MeshStandardMaterial({ color: 0x888888 });
      }
    });

    scene.add(model);
  },
  undefined,
  (err) => console.error(err)
);

// リサイズ対応
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function updateRotationSpeed() {
  const min = -0.1;
  const max = 0.5;

  rotationSpeed = Math.random() * (max - min) + min;
}

// PCクリック対応
window.addEventListener('click', updateRotationSpeed);

// スマホタップ対応
window.addEventListener('touchstart', updateRotationSpeed);

function animate() {
  requestAnimationFrame(animate);
  if (model) model.rotation.y += rotationSpeed;
  renderer.render(scene, camera);
}
animate();
