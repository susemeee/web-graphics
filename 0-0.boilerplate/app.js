var app = (function() {
    var camera, scene, renderer;
    var mesh;

    function addObject() {
        var geometry = new THREE.BoxGeometry(200, 200, 200);
        var material = new THREE.MeshBasicMaterial({
            color: 0xff0000
        });

        mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
    }

    function initRenderer() {
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
    }

    function init() {
        // scene and camera
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.z = 1000;

        addObject();
        initRenderer();
    }

    function animate() {
        requestAnimationFrame(animate);

        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.02;

        renderer.render(scene, camera);
    }

    return {
        init: init,
        animate: animate,
    }
})();

app.init();
app.animate();
window.app = app;
