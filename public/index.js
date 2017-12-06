/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


console.log('index');

var lastModifiedTime = 0;

var socket = io();
socket.on('receive', function (str) {
	var obj = JSON.parse(str);
	if (Number(obj.time) > Number(lastModifiedTime)) {
		document.querySelector('textarea').textContent = obj.text;
		lastModifiedTime = Number(obj.time);
	}
});

var send = function send(text) {
	var url = 'http://localhost:3000/send/' + text;
	return fetch(url, {
		method: 'POST',
		mode: 'cors'
	}).then(function (res) {
		return res.text();
	}).then(function (t) {
		if (!t === 'complete') console.log('result: ' + t);
	});
};
var getTimeStamp = function getTimeStamp() {
	var d = new Date();
	var year = d.getFullYear();
	var month = d.getMonth() + 1;
	var day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
	var hour = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
	var min = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
	var sec = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds();
	return Number('' + year + month + day + hour + min + sec);
};

var submitButton = document.querySelector('.submit');
submitButton.addEventListener('click', function (e) {
	var sendObj = {
		time: getTimeStamp(),
		text: document.querySelector('textarea').value
	};
	console.log('send: ', sendObj);
	send(JSON.stringify(sendObj));
});

/***/ })
/******/ ]);