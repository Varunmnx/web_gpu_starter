import { mx_noise_float, mix, attribute, uv, texture, color, cross, dot, float, transformNormalToView, positionLocal, sign, step, Fn, uniform, varying, vec2, vec3, vec4, Loop, pow, ShaderNodeObject } from 'three/tsl';
import * as THREE from 'three/webgpu';
import portrait from "../assets/natalie_portman.jpg"
import { GeometryAttribute } from '../constants/attributes.geometry.enums';
import MathNode from 'three/src/nodes/math/MathNode.js';

// synth wave palette
const palette = [
     "#8c1dff",
     "#f223ff",
     "#ff2976",
     "#ff901f",
     "#ffd318"
]


export function getMaterial(){
     const uTexture = new THREE.TextureLoader().load(portrait)
     const material = new THREE.NodeMaterial()

     const uColor1 = uniform(color(palette[0]))
     const uColor2 = uniform(color(palette[1]))
     const uColor3 = uniform(color(palette[2]))
     const uColor4 = uniform(color(palette[3])) 
     const uColor5 = uniform(color(palette[4])) 

     const asciiCode = Fn(()=>{
        const textureColor = texture(uTexture,attribute(GeometryAttribute.aPixelUV))
        const brightness = pow(textureColor.r, 2.2)
        let finalColor = uColor1 as unknown as ShaderNodeObject<MathNode>
        finalColor = mix(finalColor, uColor2, step(0.2,brightness))
        finalColor = mix(finalColor, uColor3, step(0.4,brightness))
        finalColor = mix(finalColor, uColor4, step(0.6,brightness))
        finalColor = mix(finalColor, uColor5, step(0.6,brightness))
        return vec2(finalColor)
    })
     material.colorNode = asciiCode()
     return material
}