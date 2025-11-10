import { mx_noise_float, uv, texture, color, cross, dot, float, transformNormalToView, positionLocal, sign, step, Fn, uniform, varying, vec2, vec3, vec4, Loop } from 'three/tsl';
import * as THREE from 'three/webgpu';
import portrait from "../assets/natalie_portman.jpg"


/**
 * Returns a THREE.NodeMaterial with a colorNode set to an ASCII art shader.
 * The shader takes a texture sampler as input and outputs a color based on the ASCII art.
 * The material is created with a default color of cyan (0,1,1,1) and the ASCII art shader is applied on top of it.
 * @returns {THREE.NodeMaterial} A material with an ASCII art shader applied to it.
 */
export function getMaterial(){
     const uTexture = new THREE.TextureLoader().load(portrait)
     const material = new THREE.NodeMaterial()
     material.colorNode = vec4(0,1,1,1)
     const asciiCode = Fn(()=>{
        const textureColor = texture(uTexture,uv())
        return textureColor
    })
     material.colorNode = asciiCode()
     return material
}