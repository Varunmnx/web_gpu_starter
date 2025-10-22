// src/main.ts
import * as THREE from 'three/webgpu';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import GUI from 'lil-gui'

interface Options {
    dom: HTMLCanvasElement
}

export default class Sketch {
    scene: THREE.Scene | undefined
    container: HTMLCanvasElement
    renderer: THREE.WebGPURenderer
    width: number
    height: number
    camera: THREE.PerspectiveCamera
    controls: typeof OrbitControls;
    isPlaying: boolean = false;
    settings: any
    gui: typeof GUI
    material: THREE.MeshBasicMaterial | undefined
    geometry: THREE.PlaneGeometry | undefined
    plane: THREE.Mesh | undefined
    time: number

    constructor(options: Options) {
        this.scene = new THREE.Scene();
        this.container = options.dom;
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.renderer = new THREE.WebGPURenderer();
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor(0xeeeeee, 1);

        this.container.appendChild(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(70, this.width / this.height, 0.01, 1000);
        this.camera.position.set(0, 0, 2)
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.isPlaying = true;
        this.time = 0;
        this.addObjects();
        this.resize()
        this.render()
        this.setupResize()
    }

    resize() {
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.renderer.setSize(this.width, this.height);
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
    }

    setUpSettings() {
        this.settings = {
            progress: 0
        }
        this.gui = new GUI();
        this.gui.add(this.settings, 'progress', 0, 1, 0.01).onChange((value: any) => {

        });
    }

    setupResize() {
        window.addEventListener('resize', this.resize.bind(this));

    }

    addObjects() {
        this.material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
        this.plane = new THREE.Mesh(this.geometry, this.material);
        this.scene?.add(this.plane);
    }

    addLights() {
        const light1 = new THREE.AmbientLight(0x404040, 0.5);
        this.scene?.add(light1);
        const light2 = new THREE.DirectionalLight(0xffffff, 0.5);
        light2.position.set(0.5, 0, 0.866);
        this.scene?.add(light2);
    }

    render() {
        if (!this.isPlaying) return
        if (!this.scene) return
        if (!this.camera) return
        if (!this.material) return
        this.time += 0.05;
        requestAnimationFrame(this.render.bind(this));
        this.renderer.renderAsync(this.scene, this.camera);
    }
}

new Sketch({
    dom: document.getElementById('container') as HTMLCanvasElement
})