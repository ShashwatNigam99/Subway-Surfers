var cubeRotation = 0.0;
// var cube = new Cube();
// var cube1 = new Cube();
var path1 = new Path();
var path2 = new Path();
var walls1 = new Walls();
var walls2 = new Walls();

var coins = new Array();
var barriers1 = new Array();

var back = new Back();
var surfer = new Surfer();

var ncoins = 200;

main();

Mousetrap.bind('space', function () {

  console.log('fuck this shit');
})
Mousetrap.bind(['a','left'], function () {
		// A or Left Key
    if(surfer.pos[0]>-2)
		  surfer.pos[0]-=2;
	})
Mousetrap.bind(['d','right'], function () {
		// D or Right Key
		if(surfer.pos[0]<2)
			surfer.pos[0]+=2;
  })
Mousetrap.bind(['up','w','space'], function () {
		// W or space
		if(surfer.jumping == 0){
			surfer.jumping = 1;
		}
	})



function main() {
  const canvas = document.querySelector('#glcanvas');
  const gl = canvas.getContext('webgl');

  // If we don't have a GL context, give up now

  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }

  // Vertex shader program

  const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec2 aTextureCoord;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying highp vec2 vTextureCoord;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vTextureCoord = aTextureCoord;
    }
  `;

  // Fragment shader program

  const fsSource = `
    varying highp vec2 vTextureCoord;

    uniform sampler2D uSampler;

    void main(void) {
      gl_FragColor = texture2D(uSampler, vTextureCoord);
    }
  `;
  // const vsSource = `
  //   attribute vec4 aVertexPosition;
  //   attribute vec3 aVertexNormal;
  //   attribute vec2 aTextureCoord;
  //
  //   uniform mat4 uNormalMatrix;
  //   uniform mat4 uModelViewMatrix;
  //   uniform mat4 uProjectionMatrix;
  //
  //   varying highp vec2 vTextureCoord;
  //   varying highp vec3 vLighting;
  //
  //   void main(void) {
  //     gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  //     vTextureCoord = aTextureCoord;
  //
  //     // Apply lighting effect
  //
  //     highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
  //     highp vec3 directionalLightColor = vec3(1, 1, 1);
  //     highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));
  //
  //     highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);
  //
  //     highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
  //     vLighting = ambientLight + (directionalLightColor * directional);
  //   }
  // `;
  // const fsSource = `
  //   varying highp vec2 vTextureCoord;
  //   varying highp vec3 vLighting;
  //
  //   uniform sampler2D uSampler;
  //
  //   void main(void) {
  //     highp vec4 texelColor = texture2D(uSampler, vTextureCoord);
  //
  //     gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
  //   }
  // `;

  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
      uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
    },
  };
//   const programInfo = {
//   program: shaderProgram,
//   attribLocations: {
//     vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
//     vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
//     textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
//   },
//   uniformLocations: {
//     projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
//     modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
//     normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
//     uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
//   },
// };

  // cube.init(gl, [2, 0, 0]);
  // cube1.init(gl,[-2, 0, 0]);
  path1.init(gl,[0,0,0]);
  path2.init(gl,[0,0,-100]);
  walls1.init(gl,[0,0,0]);
  walls2.init(gl,[0,0,-120]);
  back.init(gl,[0,0,0]);
  surfer.init(gl,[0,0,0]);

  // for(i=0;i<ncoins;++i){
  //   q = Math.random();
  //   if(q<0.33)
  //       x=-2.0;
  //   else if(q>=0.33 && q<0.67)
  //       x=0;
  //   else
  //       x= 2.0;
  //   c = new Coin();
  //   c.init(gl, [x, -1, -10*i-10*q]);
  //   coins.push(c);
  // }
  for(i=0;i<ncoins;++i){
    q = Math.random();
    if(q<0.33)
        x=-2.5;
    else if(q>=0.33 && q<0.67)
        x=0;
    else
        x= 2.5;
    b = new Barrier1();
    b.init(gl, [x, -1.6, -10*i-10*q]);
    barriers1.push(b);
  }

  var then = 0;

  // Draw the scene repeatedly
  function render(now) {
    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;

    drawScene(gl, deltaTime, programInfo);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}
//135-206-250

function drawScene(gl, deltaTime, programInfo) {
  // gl.clearColor(135.0/255.0, 206.0/255.0, 255.0/255.0, 1.0);  // Clear to black, fully opaque
  gl.clearColor(0,0,0, 1.0);  // Clear to black, fully opaque

  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const fieldOfView = 45 * Math.PI / 180;   // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 121.0;
  var projectionMatrix = mat4.create();

  mat4.perspective(projectionMatrix,
                   fieldOfView,
                   aspect,
                   zNear,
                   zFar);

  var modelViewMatrix = mat4.create();

  var target = [0,0,-10];
  var eye = [0, 0, 5];
  var up = [0, 1, 0];

  mat4.lookAt(modelViewMatrix, eye, target, up);

  // gl = cube.draw(gl, deltaTime, projectionMatrix, modelViewMatrix, programInfo);
  // gl = cube1.draw(gl, deltaTime, projectionMatrix, modelViewMatrix, programInfo);
  gl = back.draw(gl, deltaTime, projectionMatrix, modelViewMatrix, programInfo);
  gl = surfer.draw(gl, deltaTime, projectionMatrix, modelViewMatrix, programInfo);
  gl = path1.draw(gl, deltaTime, projectionMatrix, modelViewMatrix, programInfo);
  gl = path2.draw(gl, deltaTime, projectionMatrix, modelViewMatrix, programInfo);
  gl = walls1.draw(gl, deltaTime, projectionMatrix, modelViewMatrix, programInfo);
  gl = walls2.draw(gl, deltaTime, projectionMatrix, modelViewMatrix, programInfo);
  // for(i=0;i<coins.length;i++){
  //   gl = coins[i].draw(gl, deltaTime, projectionMatrix, modelViewMatrix, programInfo);
  // }
  for(i=0;i<barriers1.length;i++){
    gl = barriers1[i].draw(gl, deltaTime, projectionMatrix, modelViewMatrix, programInfo);
  }


  if(path1.pos[2]>=120){
    path1.pos[2] = -100;
  }
  if(path2.pos[2]>=120){
    path2.pos[2] = -100;
  }
  if(walls1.pos[2]>=120){
    walls1.pos[2]=-120;
  }
  if(walls2.pos[2]>=120){
    walls2.pos[2]=-120;
  }

}

function loadTexture(gl, url) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                width, height, border, srcFormat, srcType,
                pixel);

  const image = new Image();
  image.crossOrigin = "Anonymous";

  image.onload = function() {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                  srcFormat, srcType, image);

    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
       gl.generateMipmap(gl.TEXTURE_2D);
    } else {
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
  };
  image.src = url;

  return texture;
}

function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}

function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }
  return shaderProgram;
}

function loadShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}
