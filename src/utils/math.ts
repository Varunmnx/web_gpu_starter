
export type Mat4 = Float32Array; 

// -------------------------------------------------------------
// Core Matrix Operations
// -------------------------------------------------------------

/** Creates a 4x4 identity matrix. */
export function createIdentity(): Mat4 {
    const mat = new Float32Array(16);
    mat[0] = mat[5] = mat[10] = mat[15] = 1.0;
    return mat;
}

/**
 * Multiplies two 4x4 matrices (A * B = C).
 * This function is the engine for all combined transformations.
 */
function multiplyMat4(a: Mat4, b: Mat4): Mat4 {
    const c = new Float32Array(16);
    
    for (let i = 0; i < 4; i++) { // Row index (0-3)
        for (let j = 0; j < 4; j++) { // Column index (0-3)
            let sum = 0;
            for (let k = 0; k < 4; k++) {
                // Column-Major Indexing: M[row + col*4]
                sum += a[i + k * 4] * b[k + j * 4];
            }
            c[i + j * 4] = sum;
        }
    }
    return c;
}

/**
 * Multiplies three matrices in order: P * V * M.
 */
export function multiplyMatrices(p: Mat4, v: Mat4, m: Mat4): Mat4 {
    const vm = multiplyMat4(v, m);
    const pvm = multiplyMat4(p, vm);
    return pvm;
}

// -------------------------------------------------------------
// Transformation Matrix Creation
// -------------------------------------------------------------

/**
 * Creates a Perspective Projection Matrix.
 */
export function perspective(fov: number, aspect: number, near: number, far: number): Mat4 {
    const mat = new Float32Array(16);
    const f = 1.0 / Math.tan(fov / 2);
    const nf = 1.0 / (near - far); 

    mat[0] = f / aspect;
    mat[5] = f;
    mat[10] = (far + near) * nf;
    mat[11] = -1.0;             
    mat[14] = (2 * far * near) * nf;
    mat[15] = 0.0;
    return mat;
}

/**
 * Creates a simple View Matrix (Camera pull-back).
 */
export function lookAt(eye: number[], center: number[], up: number[]): Mat4 {
    const mat = createIdentity();
    mat[14] = -5.0; // Pushes the world back 5 units
    return mat;
}

/**
 * Creates a rotation matrix around the Y-axis.
 */
export function rotateY(angleInRadians: number): Mat4 {
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);
    const mat = createIdentity();
    
    mat[0] = c;
    mat[2] = s;
    mat[8] = -s;
    mat[10] = c;
    
    return mat;
}