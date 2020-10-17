"use strict";

var THREE = require('./three');

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Number.prototype.clamp = function (min, max) {
  return Math.min(Math.max(this, min), max);
};

var Block = /*#__PURE__*/function () {
  function Block(width, height, depth, scrollHeight) {
    _classCallCheck(this, Block);

    this.width = width;
    this.height = height;
    this.depth = depth;
    this.scrollHeight = scrollHeight;
    var geometry = new THREE.BoxGeometry(width, height, depth);
    geometry.faces[0].color.setHex(0x343844);
    geometry.faces[1].color.setHex(0x343844);
    geometry.faces[2].color.setHex(0xFADCAF);
    geometry.faces[3].color.setHex(0xFADCAF);
    geometry.faces[4].color.setHex(0x57C7F7);
    geometry.faces[5].color.setHex(0x57C7F7);
    geometry.faces[6].color.setHex(0x57C7F7);
    geometry.faces[7].color.setHex(0x57C7F7);
    geometry.faces[8].color.setHex(0xFADCAF);
    geometry.faces[9].color.setHex(0xFADCAF);
    geometry.faces[10].color.setHex(0x343844);
    geometry.faces[11].color.setHex(0x343844); // var material = new THREE.ShaderMaterial( {
    //     vertexShader: document.getElementById('vs').textContent,
    //     fragmentShader: document.getElementById('fs').textContent,
    //     side : THREE.CullFaceNone       
    // } );

    var material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      vertexColors: true,
      side: THREE.CullFaceNone
    });
    this.mesh = new THREE.Mesh(geometry, material);
  }

  _createClass(Block, [{
    key: "setPosition",
    value: function setPosition(x, y, z) {
      this.mesh.position.set(x, y, z);
    }
  }, {
    key: "setRotation",
    value: function setRotation(x, y, z) {
      this.mesh.rotation.set(x, y, z);
    }
  }, {
    key: "setRotationSpeed",
    value: function setRotationSpeed(x, y, z) {
      this.rotationX = x;
      this.rotationY = y;
      this.rotationZ = z;
    }
  }, {
    key: "animate",
    value: function animate(scrollSpeed) {
      this.mesh.position.y += scrollSpeed;
      this.mesh.rotation.x += scrollSpeed * 3.14159 * this.rotationX;
      this.mesh.rotation.y += scrollSpeed * 3.14159 * this.rotationY;
      this.mesh.rotation.z += scrollSpeed * 3.14159 * this.rotationZ;
    }
  }]);

  return Block;
}();

var scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff); //var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000.0);

var MAX_HEIGHT = 990;
var MAX_WIDTH = 1920;
var hh = MAX_HEIGHT;
var hw = MAX_WIDTH - 3;
var camera = new THREE.OrthographicCamera(hw / -2.0, hw / 2.0, hh / 2.0, hh / -2.0, 0.1, 1000);
var canvas = document.querySelector("#c");
var renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true
});
var oldScroll = 0;
renderer.setSize(hw, hh);
camera.position.z = 7;
camera.position.y = 0; //camera.zoom = hw / hh * 35;

camera.zoom = 40;
camera.updateProjectionMatrix();
var cubes = [];
var blockSize = 4;
var cubeA = new Block(blockSize, blockSize, blockSize, 24);
cubeA.setPosition(0, 16, 3);
cubeA.setRotation(0.610865, -0.785398, 0);
cubeA.setRotationSpeed(0.0833, 0.0833, 0.0833);
cubes.push(cubeA);
var cubeB = new Block(blockSize, blockSize, blockSize, 40);
cubeB.setPosition(16, 34, 3);
cubeB.setRotation(0.610865, -0.785398, 0);
cubeB.setRotationSpeed(-0.05, 0.05, -0.05);
cubes.push(cubeB);
var cubeC = new Block(blockSize, blockSize, blockSize, 40);
cubeC.setPosition(-14, 30, 3);
cubeC.setRotation(0.610865, -0.785398, 0);
cubeC.setRotationSpeed(-0.05, 0.05, -0.05);
cubes.push(cubeC);
var cubeD = new Block(blockSize, blockSize, blockSize, 40);
cubeD.setPosition(-20, 31, 3);
cubeD.setRotation(0.610865, -0.785398, 0);
cubeD.setRotationSpeed(-0.05, -0.05, 0.05);
cubes.push(cubeD);
var cubeF = new Block(blockSize, blockSize, blockSize, 30);
cubeF.setPosition(-6, 20, 3);
cubeF.setRotation(0.610865, -0.785398, 0);
cubeF.setRotationSpeed(-0.06667, 0.06667, 0.06667);
cubes.push(cubeF);
var cubeG = new Block(blockSize, blockSize, blockSize, 80);
cubeG.setPosition(8, 70, 3);
cubeG.setRotation(0.610865, -0.785398, 0);
cubeG.setRotationSpeed(-0.05, 0.05, -0.05);
cubes.push(cubeG);
var cubeH = new Block(blockSize, blockSize, blockSize, 40);
cubeH.setPosition(22, 32, 3);
cubeH.setRotation(0.610865, -0.785398, 0);
cubeH.setRotationSpeed(0.05, -0.05, -0.05);
cubes.push(cubeH);
cubes.forEach(function (item) {
  scene.add(item.mesh);
});

export var onScroll = function onScroll(scrollContainer, scroller) {
  var scroll = scrollContainer.scrollTop;
  var accel = oldScroll - scroll;
  cubes.forEach(function (item) {
    var accelCube = accel * (item.scrollHeight / (scroller.clientHeight - scrollContainer.clientHeight));
    item.animate(accelCube);
  });
  oldScroll = scroll;
};

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();