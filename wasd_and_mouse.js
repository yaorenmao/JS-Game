// Создаем объект библиотеки
const MyLibrary = (function() {
    let isPointerLocked = false;
    let key = {};
    let camera, renderer, scene, euler, lastTime;

    function init(container) {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);
        camera.position.z = 5;

        euler = new THREE.Euler(0, 0, 0, 'YXZ');

        lastTime = performance.now();

        document.addEventListener('keydown', (event) => {
            key[event.code] = true;
        });

        document.addEventListener('keyup', (event) => {
            key[event.code] = false;
        });

        document.addEventListener('mousemove', (event) => {
            if (isPointerLocked) {
                euler.setFromQuaternion(camera.quaternion);
                euler.y -= event.movementX * 0.002;
                euler.x -= event.movementY * 0.002;
                euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.x));
                camera.quaternion.setFromEuler(euler);
            }
        });

        document.addEventListener('click', (event) => {
            if (!isPointerLocked && event.target === renderer.domElement) {
                renderer.domElement.requestPointerLock();
            }
        });

        document.addEventListener('pointerlockchange', () => {
            isPointerLocked = document.pointerLockElement === renderer.domElement;
            document.body.classList.toggle('hidden-cursor', isPointerLocked);
        });

        window.addEventListener('resize', onWindowResize);

        animate();
    }

    function moveCamera(deltaTime) {
        const forwardDirection = new THREE.Vector3();
        const rightDirection = new THREE.Vector3();
        const upDirection = new THREE.Vector3(0, 1, 0);

        camera.getWorldDirection(forwardDirection);
        forwardDirection.normalize();
        rightDirection.setFromMatrixColumn(camera.matrixWorld, 0);
        rightDirection.normalize();

        let moveDirection = new THREE.Vector3(0, 0, 0);

        if (key['KeyW']) moveDirection.add(forwardDirection);
        if (key['KeyS']) moveDirection.sub(forwardDirection);
        if (key['KeyA']) moveDirection.sub(rightDirection);
        if (key['KeyD']) moveDirection.add(rightDirection);
        if (key['Space']) moveDirection.add(upDirection);
        if (key['ControlLeft'] || key['ControlRight']) moveDirection.sub(upDirection);

        if (moveDirection.lengthSq() > 0) {
            moveDirection.normalize();
        }

        camera.position.addScaledVector(moveDirection, 0.02 * deltaTime);
    }

    function animate() {
        requestAnimationFrame(animate);
        const t = performance.now();
        const deltaTime = (t - lastTime);
        moveCamera(deltaTime);
        renderer.render(scene, camera);
        lastTime = t;
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    return {
        init: init
    };
})();

// Экспортируем библиотеку для использования в других файлах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MyLibrary;
} else {
    window.MyLibrary = MyLibrary;
}