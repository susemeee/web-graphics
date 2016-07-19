var app = (function() {
    var stats;
    var camera, scene, renderer;
    var mesh;
    var controls;

    function initController() {
        controls = new THREE.FirstPersonControls(camera);
        controls.movementSpeed = 1000;
        controls.lookSpeed = 0.1;
    }

    function generateHeight(width, height) {
        var size = width * height,
            data = new Uint8Array(size),
            perlin = new ImprovedNoise(),
            quality = 1,
            z = Math.random() * 100;

        for (var j = 0; j < 4; j++) {
            for (var i = 0; i < size; i++) {
                var x = i % width,
                    y = ~~(i / width);
                data[i] += Math.abs(perlin.noise(x / quality, y / quality, z) * quality * 1.75);
            }
            quality *= 5;
        }
        return data;
    }

    function addTerrain() {
        var worldWidth = 192,
            worldDepth = 512,
            worldHalfWidth = worldWidth / 2,
            worldHalfDepth = worldDepth / 2;

        data = generateHeight(worldWidth, worldDepth);

        camera.position.y = data[worldHalfWidth + worldHalfDepth * worldWidth] * 10 + 500;
        var geometry = new THREE.PlaneBufferGeometry(15000, 15000, worldWidth - 1, worldDepth - 1);
        geometry.rotateX(-Math.PI / 2);

        var vertices = geometry.attributes.position.array;
        for (var i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
            vertices[j + 1] = data[i] * 10;
        }

        var material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            specular: 0xffffff,
            shininess: 20,
            morphTargets: true,
            vertexColors: THREE.FaceColors,
            shading: THREE.FlatShading
        });

        mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
    }

    function addLight() {
        var light = new THREE.AmbientLight(0x404040);
        scene.add(light);
    }

    function initRenderer() {
        renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(scene.fog.color);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
    }

    function init() {
        // scene and camera
        scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0xffffff, 1, 5000);
        scene.fog.color.setHSL(0.6, 0, 1);

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.z = 1000;

        // initController();
        addTerrain();
        addLight();
        initRenderer();

        // stats
        stats = new Stats();
        document.body.appendChild(stats.dom);

        // resize event
        window.addEventListener('resize', onWindowResize, false);
    }

    function animate() {
        requestAnimationFrame(animate);

        renderer.render(scene, camera);
    }


    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        // controls.handleResize();
    }


    return {
        init: init,
        animate: animate,
    }
})();

app.init();
app.animate();
window.app = app;
