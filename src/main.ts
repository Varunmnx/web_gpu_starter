// src/main.ts
import * as THREE from "three/webgpu";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";
import { getMaterial } from "./utils/getMaterial";
import { GeometryAttribute } from "./constants/attributes.geometry.enums";

interface Options {
  dom: HTMLCanvasElement;
}

export default class Sketch {
  scene: THREE.Scene | undefined;
  container: HTMLCanvasElement;
  renderer: THREE.WebGPURenderer;
  width: number;
  height: number;
  camera: THREE.PerspectiveCamera;
  controls: typeof OrbitControls;
  isPlaying: boolean = false;
  settings: any;
  gui: typeof GUI;
  material: THREE.NodeMaterial | undefined;
  geometry: THREE.PlaneGeometry | undefined;
  plane: THREE.Mesh | undefined;
  time: number;
  positions: Float32Array | undefined;
  colors: Float32Array | undefined;
  instancesMesh: THREE.InstancedMesh | undefined;
  length: number = 0;

  constructor(options: Options) {
    this.scene = new THREE.Scene();
    this.container = options.dom;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer = new THREE.WebGPURenderer();
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0x0000000, 1);
    this.container.appendChild(this.renderer.domElement);
    this.camera = new THREE.PerspectiveCamera(
      70,
      this.width / this.height,
      0.01,
      1000
    );
    this.camera.position.set(0, 0, 10);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.isPlaying = true;
    this.time = 0;
    this.addObjects();
    this.resize();
    this.render();
    this.setupResize();
  }

  createAsciiTexture() {
    let dict = `.-':_,^=;><+!rc*/z?sLTv)J7(|Fi{C}fI31tlu[neoZ5Yxjya]2ESwqkP6h9d4VpOGbUAKXHm8RD#$Bg0MNWQ%&@`;
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    this.length = dict.length;
    canvas.width = this.length * 64;
    canvas.height = 64;
    ctx.font = "64px monospace";
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    for (let i = 0; i < dict.length; i++) {
      // ctx.fillText(dict[i], 32 + i * 64, 40);
      if (i > 50) {
        for (let j = 0; j < 6; j++) {
          ctx.filter = `blur(${j}px)`;
          ctx.fillText(dict[i], 32 + i * 64, 40);
        }
      }
      ctx.filter = "none";
      ctx.fillText(dict[i], 32 + i * 64, 40);
    }
    let asciiTexture = new THREE.Texture(canvas);
    asciiTexture.needsUpdate = true;
    return asciiTexture;
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
      progress: 0,
    };
    this.gui = new GUI();
    this.gui
      .add(this.settings, "progress", 0, 1, 0.01)
      .onChange((value: any) => {});
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  addObjects() {
    this.material = getMaterial({
      asciiTexture: this.createAsciiTexture(),
      length: this.length,
    });

    let rows = 100;
    let columns = 100;
    let instances = rows * columns;
    let size = 0.1;
    this.geometry = new THREE.PlaneGeometry(size, size, 1, 1);

    this.positions = new Float32Array(instances * 3); // 7500 values
    this.colors = new Float32Array(instances * 3); // 7500 colors

    this.instancesMesh = new THREE.InstancedMesh(
      this.geometry,
      this.material,
      instances
    );

    let uv = new Float32Array(instances * 2);
    let random = new Float32Array(instances);

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        let index = i * columns + j; // 0 to 2499

        this.positions[index * 3] = i * size - (size * (rows - 1)) / 2; // -2.45 to 2.45
        this.positions[index * 3 + 1] = j * size - (size * (columns - 1)) / 2; // -2.45 to 2.45
        this.positions[index * 3 + 2] = 0; // z index always 0

        uv[index * 2] = i / (rows - 1); // uv[0] t0 uv[2498]
        uv[index * 2 + 1] = j / (columns - 1); // uv[0] t0 uv[2499]

        let m = new THREE.Matrix4();

        m.setPosition(
          this.positions[index * 3],
          this.positions[index * 3 + 1],
          this.positions[index * 3 + 2]
        );

        this.instancesMesh.setMatrixAt(index, m); // 0th square to 2499th square

        random[index] = Math.pow(Math.random(), 20);
      }
    }

    this.instancesMesh.instanceMatrix.needsUpdate = true;
    this.geometry.setAttribute(
      GeometryAttribute.aPixelUV,
      new THREE.InstancedBufferAttribute(uv, 2)
    );
    this.geometry.setAttribute(
      GeometryAttribute.aRandom,
      new THREE.InstancedBufferAttribute(random, 1)
    );
    // ADD THIS LINE - Actually add the mesh to the scene!
    this.scene?.add(this.instancesMesh);
  }

  addLights() {
    const light1 = new THREE.AmbientLight(0x404040, 0.5);
    this.scene?.add(light1);
    const light2 = new THREE.DirectionalLight(0xffffff, 0.5);
    light2.position.set(0.5, 0, 0.866);
    this.scene?.add(light2);
  }

  render() {
    if (!this.isPlaying) return;
    if (!this.scene) return;
    if (!this.camera) return;
    if (!this.material) return;
    this.time += 0.05;
    requestAnimationFrame(this.render.bind(this));
    this.renderer.renderAsync(this.scene, this.camera);
  }
}

new Sketch({
  dom: document.getElementById("container") as HTMLCanvasElement,
});
