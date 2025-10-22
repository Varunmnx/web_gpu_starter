#version 300 es
in vec4 a_position;
in vec4 a_color;

out vec4 v_color; // Pass color to fragment shader

// Uniforms are variables set globally by the JavaScript code
uniform mat4 u_matrix; // Combined PVM (Projection * View * Model) Matrix

void main() {
   // Apply the matrix transformation to the 3D position
   gl_Position = u_matrix * a_position;
   
   // Pass the color through to the fragment shader
   v_color = a_color;
}