var color = {
    ambient: 0x666666,
    yellow: 0xEDE574,
    blue: 0xDAFBF8,
    green: 0xE1F5C4,
    red: 0xFF4E50,
    orange: 0xFC913A,
    yellow2: 0xEDE574,
    white: 0xFFFFFF,
}

var app = (function() {
    var stats;
    var camera, scene, renderer;
    var mesh;
    var controls;
    var clock;

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
        var worldWidth = 96,
            worldDepth = 96,
            worldHalfWidth = worldWidth / 2,
            worldHalfDepth = worldDepth / 2;

        var data = generateHeight(worldWidth, worldDepth);
        console.log(data)

        camera.position.y = data[worldHalfWidth + worldHalfDepth * worldWidth] * 10 + 500;
        var geometry = new THREE.PlaneBufferGeometry(15000, 15000, worldWidth - 1, worldDepth - 1);
        geometry.rotateX(-Math.PI / 2);

        var vertices = geometry.attributes.position.array;
        for (var i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
            vertices[j + 1] = data[i] * 20;
        }

        var material = new THREE.MeshPhongMaterial({
            color: color.ambient,
            specular: color.orange,
            shininess: 1,
            shading: THREE.FlatShading,
        });

        mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
    }

    function addLight() {
        scene.add( new THREE.AmbientLight(color.blue) );

        var directionalLight = new THREE.DirectionalLight( color.yellow2, 1 );
        directionalLight.position.set( 1, 1, 1 ).normalize();
        scene.add( directionalLight );
    }

    function initRenderer() {
        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setClearColor(color.blue);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
    }

    function init() {
        // scene and camera
        scene = new THREE.Scene();

        clock = new THREE.Clock();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.z = 1000;

        initController();
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
        controls.update(clock.getDelta());
    }


    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        controls.handleResize();
    }


    return {
        init: init,
        animate: animate,
    }
})();

app.init();
app.animate();
window.app = app;
