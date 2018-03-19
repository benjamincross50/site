// ColoredL.js (c) 2018 bc
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'uniform mat4 u_VpMatrix;\n' +
  'uniform mat4 u_MMatrix;\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_Position = u_VpMatrix * u_MMatrix * a_Position;\n' +
  '  v_Color = a_Color;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_FragColor = v_Color;\n' +
  '}\n';

function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Set the vertex information
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  // Set the clear color and enable the depth test
  gl.clearColor(0.8, 0.8, 0.8, 1.0);
  gl.enable(gl.DEPTH_TEST);

  // Get the storage locations of u_MvpMatrices
  var u_VpMatrix = gl.getUniformLocation(gl.program, 'u_VpMatrix');
  if (!u_VpMatrix) {
    console.log('Failed to get the storage location of u_VpMatrix');
    return;
  }
  var u_MMatrix = gl.getUniformLocation(gl.program, 'u_MMatrix');
  if (!u_MMatrix) {
    console.log('Failed to get the storage location of u_MMatrix');
    return;
  }

  // Set the eye point and the viewing volume
  var vpMatrix = new Matrix4();
  vpMatrix.setPerspective(30, 1, 1, 100);
  vpMatrix.lookAt(13, 13, 13, 0, 0, 0, 0, 0, 1);
  
  
  // Current time
  var T=0.0;
  // Model matrix
  
  // Render the scene
  var tick = function(){
      T=get_T();
      draw(gl, n, T, vpMatrix, u_VpMatrix, u_MMatrix);
      requestAnimationFrame(tick);
  };
  tick();

}

function draw(gl, n, T, vpMatrix, u_VpMatrix, u_MMatrix) {
    
  // Pass the view projection matrix to u_VpMatrix
  gl.uniformMatrix4fv(u_VpMatrix, false, vpMatrix.elements);
  
  // Set up the model
  var MMatrix = new Matrix4();
  MMatrix.setRotate(T*360.0, 0, 0, 1);
  MMatrix.translate(0,0,T-2.5);
  
  // Pass the model matrix to u_MMatrix
  gl.uniformMatrix4fv(u_MMatrix, false, MMatrix.elements);

  // Clear color and depth buffer
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  // Draw the cube
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
} 

var g_start = Date.now();
function get_T(){
    var now = Date.now();
    var elapsed = now-g_start;
    var T=(elapsed/1000.0);
    //console.log('time is: '+T+'\n');
    return T %=5;
}

function initVertexBuffers(gl) {
  // Create an L

  var vertices = new Float32Array([   // Vertex coordinates
     0.0,0.0,0.0, 1.0,0.0,0.0, 0.0,2.0,0.0, 1.0,2.0,0.0, // z=0 red
     0.0,1.0,1.0, 1.0,1.0,1.0, 1.0,2.0,1.0, 0.0,2.0,1.0, // z=1 red
     0.0,0.0,3.0, 1.0,0.0,3.0, 0.0,1.0,3.0, 1.0,1.0,3.0, // z=2 red
     0.0,0.0,0.0, 1.0,0.0,0.0, 0.0,2.0,0.0, 1.0,2.0,0.0, // z=0 green
     0.0,1.0,1.0, 1.0,1.0,1.0, 1.0,2.0,1.0, 0.0,2.0,1.0, // z=1 green
     0.0,0.0,3.0, 1.0,0.0,3.0, 0.0,1.0,3.0, 1.0,1.0,3.0, // z=2 green
     0.0,0.0,0.0, 1.0,0.0,0.0, 0.0,2.0,0.0, 1.0,2.0,0.0, // z=0 blue
     0.0,1.0,1.0, 1.0,1.0,1.0, 1.0,2.0,1.0, 0.0,2.0,1.0, // z=1 blue
     0.0,0.0,3.0, 1.0,0.0,3.0, 0.0,1.0,3.0, 1.0,1.0,3.0 // z=2 blue
  ]);

  var colors = new Float32Array([     // Colors
     1.0,0.0,0.0, 1.0,0.0,0.0, 1.0,0.0,0.0, 1.0,0.0,0.0, //
     1.0,0.0,0.0, 1.0,0.0,0.0, 1.0,0.0,0.0, 1.0,0.0,0.0, //
     1.0,0.0,0.0, 1.0,0.0,0.0, 1.0,0.0,0.0, 1.0,0.0,0.0, //
     0.0,1.0,0.0, 0.0,1.0,0.0, 0.0,1.0,0.0, 0.0,1.0,0.0, //
     0.0,1.0,0.0, 0.0,1.0,0.0, 0.0,1.0,0.0, 0.0,1.0,0.0, //
     0.0,1.0,0.0, 0.0,1.0,0.0, 0.0,1.0,0.0, 0.0,1.0,0.0, //
     0.0,0.0,1.0, 0.0,0.0,1.0, 0.0,0.0,1.0, 0.0,0.0,1.0, //
     0.0,0.0,1.0, 0.0,0.0,1.0, 0.0,0.0,1.0, 0.0,0.0,1.0, //
     0.0,0.0,1.0, 0.0,0.0,1.0, 0.0,0.0,1.0, 0.0,0.0,1.0 //
  ]);

  var indices = new Uint8Array([       // Indices of the vertices
     1,3,6, 1,6,5, 1,5,11, 1,11,9,            // red (x faces)
     0,2,7, 0,7,4, 0,4,10, 0,10,8,            // red (x faces)
     12,13,21, 12,21,20, 17,22,23, 17,16,22,  // green (y faces)
     15,14,19, 15,19,18,                      // green (y faces)
     25,24,26, 25,26,27, 35,34,32, 35,32,33,  // blue (z faces)
     30,31,28, 30,28,29                       // blue (z faces)
  ]);

  // Create a buffer object
  var indexBuffer = gl.createBuffer();
  if (!indexBuffer) 
    return -1;

  // Write the vertex coordinates and color to the buffer object
  if (!initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'a_Position'))
    return -1;

  if (!initArrayBuffer(gl, colors, 3, gl.FLOAT, 'a_Color'))
    return -1;

  // Write the indices to the buffer object
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return indices.length;
}

function initArrayBuffer(gl, data, num, type, attribute) {
  var buffer = gl.createBuffer();   // Create a buffer object
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return false;
  }
  // Write date into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  // Assign the buffer object to the attribute variable
  var a_attribute = gl.getAttribLocation(gl.program, attribute);
  if (a_attribute < 0) {
    console.log('Failed to get the storage location of ' + attribute);
    return false;
  }
  gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
  // Enable the assignment of the buffer object to the attribute variable
  gl.enableVertexAttribArray(a_attribute);

  return true;
}
