// src/shaders/star_effect.vert
uniform float u_time;
uniform float u_magnitude;
varying vec3 vNormal;

void main() {
    vNormal = normal; // Pass normal for potential lighting/color

    // 1. Calculate displacement vector: Normalized position * sine wave
    // 'normal' is a vector pointing outward from the surface
    vec3 displacement = normal * (sin(u_time * 5.0) * u_magnitude + 0.5 * u_magnitude);
    
    // 2. Apply displacement to the vertex position
    vec3 newPosition = position + displacement;

    // Standard Three.js matrix multiplication using the new position
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}