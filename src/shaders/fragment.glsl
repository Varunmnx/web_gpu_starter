#version 300 es
precision highp float;

in vec4 v_color; // Color from the vertex shader (interpolated across the triangle)

out vec4 outColor;

void main() {
   // Use the interpolated color
   outColor = v_color;
}