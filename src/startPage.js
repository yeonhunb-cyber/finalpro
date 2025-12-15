import * as THREE from 'three';

import { showElementQuizModal } from './elementQuizModal.js';
import { getGameState } from './gameState.js';

const ELEMENT_SYMBOLS = [
  { number: 1, symbol: 'H' },
  { number: 2, symbol: 'He' },
  { number: 3, symbol: 'Li' },
  { number: 4, symbol: 'Be' },
  { number: 5, symbol: 'B' },
  { number: 6, symbol: 'C' },
  { number: 7, symbol: 'N' },
  { number: 8, symbol: 'O' },
  { number: 9, symbol: 'F' },
  { number: 10, symbol: 'Ne' },
  { number: 11, symbol: 'Na' },
  { number: 12, symbol: 'Mg' },
  { number: 13, symbol: 'Al' },
  { number: 14, symbol: 'Si' },
  { number: 15, symbol: 'P' },
  { number: 16, symbol: 'S' },
  { number: 17, symbol: 'Cl' },
  { number: 18, symbol: 'Ar' },
  { number: 19, symbol: 'K' },
  { number: 20, symbol: 'Ca' },
  { number: 26, symbol: 'Fe' },
  { number: 29, symbol: 'Cu' }
];

/**
 * 창을 든 가디언(사람 형태) 생성
 */
function createGuardianWithSpear(material) {
  const group = new THREE.Group();

  // 몸통 (원통)
  const bodyGeo = new THREE.CylinderGeometry(0.4, 0.5, 1.8, 8);
  const body = new THREE.Mesh(bodyGeo, material);
  body.position.y = 0.9;
  group.add(body);

  // 머리 (구)
  const headGeo = new THREE.SphereGeometry(0.35, 8, 8);
  const head = new THREE.Mesh(headGeo, material);
  head.position.y = 2.1;
  group.add(head);

  // 팔 (원통 2개)
  const armGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.8, 6);
  const leftArm = new THREE.Mesh(armGeo, material);
  leftArm.position.set(-0.6, 1.2, 0);
  leftArm.rotation.z = Math.PI / 6;
  group.add(leftArm);

  const rightArm = new THREE.Mesh(armGeo, material);
  rightArm.position.set(0.6, 1.2, 0);
  rightArm.rotation.z = -Math.PI / 6;
  group.add(rightArm);

  // 다리 (원통 2개)
  const legGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.2, 6);
  const leftLeg = new THREE.Mesh(legGeo, material);
  leftLeg.position.set(-0.25, -0.6, 0);
  group.add(leftLeg);

  const rightLeg = new THREE.Mesh(legGeo, material);
  rightLeg.position.set(0.25, -0.6, 0);
  group.add(rightLeg);

  // 창 (긴 원통 + 끝부분)
  const spearShaftGeo = new THREE.CylinderGeometry(0.05, 0.05, 3, 6);
  const spearShaft = new THREE.Mesh(spearShaftGeo, new THREE.MeshPhongMaterial({ color: 0x8b7355 }));
  spearShaft.position.set(0.8, 1.5, 0);
  spearShaft.rotation.z = -Math.PI / 3;
  group.add(spearShaft);

  const spearTipGeo = new THREE.ConeGeometry(0.1, 0.4, 6);
  const spearTip = new THREE.Mesh(spearTipGeo, new THREE.MeshPhongMaterial({ color: 0xc0c0c0 }));
  spearTip.position.set(0.8, 2.8, 0);
  spearTip.rotation.z = -Math.PI / 3;
  group.add(spearTip);

  return group;
}

/**
 * 움직일 수 있는 플레이어 캐릭터 생성
 */
function createPlayerCharacter() {
  const group = new THREE.Group();
  const playerMat = new THREE.MeshPhongMaterial({ color: 0x4a90e2 });

  // 몸통
  const bodyGeo = new THREE.CylinderGeometry(0.5, 0.6, 2, 8);
  const body = new THREE.Mesh(bodyGeo, playerMat);
  body.position.y = 1;
  group.add(body);

  // 머리
  const headGeo = new THREE.SphereGeometry(0.4, 8, 8);
  const head = new THREE.Mesh(headGeo, playerMat);
  head.position.y = 2.4;
  group.add(head);

  // 팔
  const armGeo = new THREE.CylinderGeometry(0.15, 0.15, 1, 6);
  const leftArm = new THREE.Mesh(armGeo, playerMat);
  leftArm.position.set(-0.7, 1.3, 0);
  group.add(leftArm);

  const rightArm = new THREE.Mesh(armGeo, playerMat);
  rightArm.position.set(0.7, 1.3, 0);
  group.add(rightArm);

  // 다리
  const legGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.5, 6);
  const leftLeg = new THREE.Mesh(legGeo, playerMat);
  leftLeg.position.set(-0.3, -0.75, 0);
  group.add(leftLeg);

  const rightLeg = new THREE.Mesh(legGeo, playerMat);
  rightLeg.position.set(0.3, -0.75, 0);
  group.add(rightLeg);

  return group;
}

/**
 * Three.js를 이용해 피라미드와 가디언이 있는 3D 장면을 초기화
 */
function initPyramidScene(canvas) {
  if (!canvas) {
    console.error('Canvas element not found');
    return;
  }

  const width = canvas.clientWidth || 800;
  const height = canvas.clientHeight || 600;
  canvas.width = width;
  canvas.height = height;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });

  renderer.setSize(width, height, false);
  renderer.setPixelRatio(window.devicePixelRatio);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0712);

  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);

  // 카메라를 구 좌표계로 제어하기 위한 값
  let radius = 35;
  let theta = (Math.PI / 180) * 40;
  let phi = (Math.PI / 180) * 30;

  const updateCameraPosition = () => {
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    camera.position.set(x, y, z);
    camera.lookAt(0, 0, 0);
  };

  updateCameraPosition();

  // 조명
  scene.add(new THREE.AmbientLight(0xfff3c4, 0.7));
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
  dirLight.position.set(20, 40, 20);
  scene.add(dirLight);

  // 사막 평면
  const groundGeo = new THREE.PlaneGeometry(200, 200);
  const groundMat = new THREE.MeshPhongMaterial({
    color: 0xb58b3b,
    shininess: 5
  });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.01;
  scene.add(ground);

  // 재질
  const bigPyramidMat = new THREE.MeshPhongMaterial({ color: 0xfacc15, shininess: 40 });
  const smallPyramidMat = new THREE.MeshPhongMaterial({ color: 0xeab308, shininess: 25 });
  const guardianMat = new THREE.MeshPhongMaterial({ color: 0x78350f, shininess: 20 });

  // 큰 피라미드 (크기 2배)
  const bigGeo = new THREE.ConeGeometry(12, 18, 4);
  bigGeo.rotateY(Math.PI / 4);
  const bigPyramid = new THREE.Mesh(bigGeo, bigPyramidMat);
  bigPyramid.position.set(0, 9, 0);
  scene.add(bigPyramid);

  // 가운데 피라미드에 빛 추가
  const centerLight = new THREE.PointLight(0xfacc15, 2, 50);
  centerLight.position.set(0, 12, 0);
  scene.add(centerLight);
  const centerLightHelper = new THREE.PointLightHelper(centerLight, 2);
  scene.add(centerLightHelper);

  // 가디언(큰 피라미드 앞) - 창을 든 사람 형태
  const bigGuardian = createGuardianWithSpear(guardianMat);
  bigGuardian.position.set(0, 2, 16);
  scene.add(bigGuardian);

  // 작은 피라미드 + 가디언 22개 (크기 2배, 간격 3배)
  const smallGeo = new THREE.ConeGeometry(6, 9, 4);
  smallGeo.rotateY(Math.PI / 4);

  const count = ELEMENT_SYMBOLS.length;
  const radiusCircle = 54; // 간격 3배 (18 * 3)

      // 원소 버튼을 3D 공간에 배치하기 위한 그룹
      const buttonGroup = new THREE.Group();
      scene.add(buttonGroup);

      // 피라미드 위치 저장 (퀴즈 체크용)
      const pyramidPositions = [];

      ELEMENT_SYMBOLS.forEach((el, index) => {
    const angle = (index / count) * Math.PI * 2;
    const x = radiusCircle * Math.cos(angle);
    const z = radiusCircle * Math.sin(angle);

        const pyramid = new THREE.Mesh(smallGeo, smallPyramidMat);
        pyramid.position.set(x, 4.5, z);
        scene.add(pyramid);
        
        // 피라미드 위치 저장
        pyramidPositions.push({ number: el.number, x, z });

    // 가디언 - 창을 든 사람 형태
    const guardian = createGuardianWithSpear(guardianMat);
    const dir = new THREE.Vector3(x, 0, z).normalize();
    guardian.position.set(x - dir.x * 5.6, 2, z - dir.z * 5.6);
    // 가디언이 피라미드를 향하도록 회전
    guardian.lookAt(x, 2, z);
    scene.add(guardian);

        // 원소 버튼을 피라미드 머리 위에 배치 (3D 텍스트 스프라이트)
        const buttonCanvas = document.createElement('canvas');
        buttonCanvas.width = 128;
        buttonCanvas.height = 64;
        const ctx = buttonCanvas.getContext('2d');
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.fillRect(0, 0, 128, 64);
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2;
        ctx.strokeRect(2, 2, 124, 60);
        ctx.fillStyle = '#facc15';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${el.number}`, 64, 20);
        ctx.font = 'bold 20px Arial';
        ctx.fillText(el.symbol, 64, 45);

        const texture = new THREE.CanvasTexture(buttonCanvas);
        const spriteMat = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.scale.set(4, 2, 1);
        // 피라미드 높이(9) + 피라미드 위치(4.5) = 13.5, 그 위에 약간 여유를 두어 14로 설정
        sprite.position.set(x, 14, z);
        buttonGroup.add(sprite);
  });

  // 플레이어 캐릭터 생성 및 배치
  const player = createPlayerCharacter();
  player.position.set(0, 0, 20);
  scene.add(player);

  // 플레이어 이동 제어
  const playerSpeed = 0.5;
  const keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };

  const handleKeyDown = (event) => {
    if (keys.hasOwnProperty(event.key)) {
      keys[event.key] = true;
    }
  };

  const handleKeyUp = (event) => {
    if (keys.hasOwnProperty(event.key)) {
      keys[event.key] = false;
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);

  // 렌더링 루프
  const resizeRenderer = () => {
    const w = canvas.clientWidth || 800;
    const h = canvas.clientHeight || 600;
    if (w > 0 && h > 0) {
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
  };

  resizeRenderer();
  window.addEventListener('resize', resizeRenderer);

  const animate = () => {
    requestAnimationFrame(animate);

    // 플레이어 이동 처리
    if (keys.ArrowUp) {
      player.position.z -= playerSpeed;
    }
    if (keys.ArrowDown) {
      player.position.z += playerSpeed;
    }
    if (keys.ArrowLeft) {
      player.position.x -= playerSpeed;
    }
    if (keys.ArrowRight) {
      player.position.x += playerSpeed;
    }

    // 플레이어가 바닥 위에 있도록
    player.position.y = 0;

    // 원소 버튼 스프라이트가 항상 카메라를 향하도록
    buttonGroup.children.forEach((sprite) => {
      sprite.lookAt(camera.position);
    });

    // 플레이어가 피라미드 앞에 있는지 체크 (퀴즈 트리거)
    pyramidPositions.forEach((pyramid) => {
      const distance = Math.sqrt(
        Math.pow(player.position.x - pyramid.x, 2) +
        Math.pow(player.position.z - pyramid.z, 2)
      );
      if (distance < 8 && !window.quizTriggered) {
        window.quizTriggered = true;
        showElementQuizModal(pyramid.number, () => {
          // 퀴즈 종료 후 플래그 해제 및 플레이어를 가운데 피라미드 앞(0, 0, 20)으로 이동
          window.quizTriggered = false;
          player.position.set(0, 0, 20);
        });
      }
    });

    renderer.render(scene, camera);
  };
  animate();

  // 마우스 드래그로 회전, 휠로 줌
  let isDragging = false;
  let lastX = 0;
  let lastY = 0;

  const onMouseDown = (event) => {
    isDragging = true;
    lastX = event.clientX;
    lastY = event.clientY;
  };

  const onMouseMove = (event) => {
    if (!isDragging) return;
    const deltaX = event.clientX - lastX;
    const deltaY = event.clientY - lastY;
    lastX = event.clientX;
    lastY = event.clientY;

    const ROTATE_SPEED = 0.005;
    theta -= deltaX * ROTATE_SPEED;
    phi -= deltaY * ROTATE_SPEED;
    const EPS = 0.1;
    phi = Math.max(EPS, Math.min(Math.PI - EPS, phi));
    updateCameraPosition();
  };

  const onMouseUp = () => {
    isDragging = false;
  };

  const onWheel = (event) => {
    const ZOOM_SPEED = 0.002;
    radius += event.deltaY * ZOOM_SPEED;
    radius = Math.max(12, Math.min(60, radius));
    updateCameraPosition();
  };

  canvas.addEventListener('mousedown', onMouseDown);
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
  canvas.addEventListener('wheel', onWheel);
}

/**
 * 시작 페이지를 설정하는 함수
 * @param {HTMLElement} root
 * @param {{ onGoBack?: () => void, onGoToSphinx?: () => void }} options
 */
export function setupStartPage(root, { onGoBack, onGoToSphinx } = {}) {
  root.innerHTML = `
    <div class="chat-page">
      <div class="chat-sky"></div>
      <div class="chat-desert"></div>

      <div class="chat-shell">
        <header class="chat-header">
          <div class="sphinx-avatar">
            <img
              src="/sphinx.png"
              alt="이집트 스핑크스"
              class="sphinx-face"
              onerror="this.style.display='none'; this.parentElement.classList.add('sphinx-fallback');"
            />
            <div class="sphinx-fallback-emoji">🧩</div>
          </div>
          <div class="header-text">
            <h1>피라미드 원소 정원</h1>
            <p>마우스로 드래그하여 둘러보고, 휠로 확대/축소해 보세요.</p>
          </div>
          <button id="start-back-button" class="chat-back-button">돌아가기</button>
        </header>

        <main class="start-main">
          <div class="start-3d-wrapper">
            <canvas id="start-3d-canvas"></canvas>
            <div class="start-controls">
              <div class="start-control-hint">방향키로 캐릭터를 움직이세요</div>
              <div class="start-direction-buttons">
                <button class="start-direction-btn" data-key="ArrowUp">↑</button>
                <div class="start-direction-row">
                  <button class="start-direction-btn" data-key="ArrowLeft">←</button>
                  <button class="start-direction-btn" data-key="ArrowDown">↓</button>
                  <button class="start-direction-btn" data-key="ArrowRight">→</button>
                </div>
              </div>
            </div>
            <button id="start-sphinx-back" class="start-sphinx-back-button">스핑크스에게 돌아가기</button>
          </div>
        </main>
      </div>
    </div>
  `;

  const backBtn = root.querySelector('#start-back-button');
  if (backBtn && typeof onGoBack === 'function') {
    backBtn.addEventListener('click', () => {
      onGoBack();
    });
  }

  const sphinxBackBtn = root.querySelector('#start-sphinx-back');
  if (sphinxBackBtn && typeof onGoToSphinx === 'function') {
    sphinxBackBtn.addEventListener('click', () => {
      onGoToSphinx();
    });
  }

  const canvas = root.querySelector('#start-3d-canvas');
  
  // Canvas가 DOM에 추가된 후 초기화
  if (canvas) {
    // 약간의 지연을 두어 DOM이 완전히 렌더링된 후 초기화
    setTimeout(() => {
      initPyramidScene(canvas);
    }, 100);
  } else {
    console.error('Canvas element #start-3d-canvas not found');
  }

  // 방향키 버튼 이벤트 처리
  const directionButtons = root.querySelectorAll('.start-direction-btn');
  directionButtons.forEach((btn) => {
    const key = btn.getAttribute('data-key');
    btn.addEventListener('mousedown', () => {
      const event = new KeyboardEvent('keydown', { key });
      window.dispatchEvent(event);
    });
    btn.addEventListener('mouseup', () => {
      const event = new KeyboardEvent('keyup', { key });
      window.dispatchEvent(event);
    });
    btn.addEventListener('mouseleave', () => {
      const event = new KeyboardEvent('keyup', { key });
      window.dispatchEvent(event);
    });
  });
}

