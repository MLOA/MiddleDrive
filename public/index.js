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


var _timers = __webpack_require__(1);

var _caretposition = __webpack_require__(5);

var _caretposition2 = _interopRequireDefault(_caretposition);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Measurement = new function () {
	this.caretPos = function (textarea, mode) {
		var targetElement = textarea;
		if (typeof jQuery != 'undefined') {
			if (textarea instanceof jQuery) {
				targetElement = textarea.get(0);
			}
		}
		// HTML Sanitizer
		var escapeHTML = function escapeHTML(s) {
			var obj = document.createElement('pre');
			obj[typeof obj.textContent != 'undefined' ? 'textContent' : 'innerText'] = s;
			return obj.innerHTML;
		};

		// Get caret character position.
		var getCaretPosition = function getCaretPosition(element) {
			var CaretPos = 0;
			var startpos = -1;
			var endpos = -1;
			if (document.selection) {
				// IE Support(not yet)
				var docRange = document.selection.createRange();
				var textRange = document.body.createTextRange();
				textRange.moveToElementText(element);

				var range = textRange.duplicate();
				range.setEndPoint('EndToStart', docRange);
				startpos = range.text.length;

				var range = textRange.duplicate();
				range.setEndPoint('EndToEnd', docRange);
				endpos = range.text.length;
			} else if (element.selectionStart || element.selectionStart == '0') {
				// Firefox support
				startpos = element.selectionStart;
				endpos = element.selectionEnd;
			}
			return { start: startpos, end: endpos };
		};

		// Get element css style.
		var getStyle = function getStyle(element) {
			var style = element.currentStyle || document.defaultView.getComputedStyle(element, '');
			return style;
		};

		// Get element absolute position
		var getElementPosition = function getElementPosition(element) {
			// Get scroll amount.
			var html = document.documentElement;
			var body = document.body;
			var scrollLeft = body.scrollLeft || html.scrollLeft;
			var scrollTop = body.scrollTop || html.scrollTop;

			// Adjust "IE 2px bugfix" and scroll amount.
			var rect = element.getBoundingClientRect();
			var left = rect.left - html.clientLeft + scrollLeft;
			var top = rect.top - html.clientTop + scrollTop;
			var right = rect.right - html.clientLeft + scrollLeft;
			var bottom = rect.bottom - html.clientTop + scrollTop;
			return {
				left: parseInt(left), top: parseInt(top),
				right: parseInt(right), bottom: parseInt(bottom)
			};
		};

		/***************************\
  * Main function start here! *
  \***************************/

		var undefined;
		var salt = "salt.akiroom.com";
		var textAreaPosition = getElementPosition(targetElement);
		var dummyName = targetElement.id + "_dummy";
		var dummyTextArea = document.getElementById(dummyName);
		if (!dummyTextArea) {
			// Generate dummy textarea.
			dummyTextArea = document.createElement("div");
			dummyTextArea.id = dummyName;
			var textAreaStyle = getStyle(targetElement);
			dummyTextArea.style.cssText = textAreaStyle.cssText;

			// Fix for browser differece.
			var isWordWrap = false;
			if (targetElement.wrap == "off") {
				// chrome, firefox wordwrap=off
				dummyTextArea.style.overflow = "auto";
				dummyTextArea.style.whiteSpace = "pre";
				isWordWrap = false;
			} else if (targetElement.wrap == undefined) {
				if (textAreaStyle.wordWrap == "break-word")
					// safari, wordwrap=on
					isWordWrap = true;else
					// safari, wordwrap=off
					isWordWrap = false;
			} else {
				// firefox wordwrap=on
				dummyTextArea.style.overflowY = "auto";
				isWordWrap = true;
			}
			dummyTextArea.style.visibility = 'hidden';
			dummyTextArea.style.position = 'absolute';
			dummyTextArea.style.top = '0px';
			dummyTextArea.style.left = '0px';

			// Firefox Support
			dummyTextArea.style.width = textAreaStyle.width;
			dummyTextArea.style.height = textAreaStyle.height;
			dummyTextArea.style.fontSize = textAreaStyle.fontSize;
			dummyTextArea.style.maxWidth = textAreaStyle.width;
			dummyTextArea.style.backgroundColor = textAreaStyle.backgroundColor;
			dummyTextArea.style.fontFamily = textAreaStyle.fontFamily;
			dummyTextArea.style.padding = textAreaStyle.padding;
			dummyTextArea.style.paddingTop = textAreaStyle.paddingTop;
			dummyTextArea.style.paddingRight = textAreaStyle.paddingRight;
			dummyTextArea.style.paddingBottom = textAreaStyle.paddingBottom;
			dummyTextArea.style.paddingLeft = textAreaStyle.paddingLeft;

			targetElement.parentNode.appendChild(dummyTextArea);
		}

		// Set scroll amount to dummy textarea.
		dummyTextArea.scrollLeft = targetElement.scrollLeft;
		dummyTextArea.scrollTop = targetElement.scrollTop;

		// Set code strings.
		var codeStr = targetElement.value;

		// Get caret character position.
		var selPos = getCaretPosition(targetElement);
		var leftText = codeStr.slice(0, selPos.start);
		var selText = codeStr.slice(selPos.start, selPos.end);
		var rightText = codeStr.slice(selPos.end, codeStr.length);
		if (selText == '') selText = "a";

		// Set keyed text.
		var processText = function processText(text) {
			// Get array of [Character reference] or [Character] or [NewLine].
			var m = escapeHTML(text).match(/((&amp;|&lt;|&gt;|&#34;|&#39;)|.|\n)/g);
			if (m) return m.join('<wbr>').replace(/\n/g, '<br>');else return '';
		};

		// Set calculation text for in dummy text area.
		dummyTextArea.innerHTML = processText(leftText) + '<wbr><span id="' + dummyName + '_i">' + processText(selText) + '</span><wbr>' + processText(rightText);

		// Get caret absolutely pixel position.
		var dummyTextAreaPos = getElementPosition(dummyTextArea);
		var caretPos = getElementPosition(document.getElementById(dummyName + "_i"));
		switch (mode) {
			case 'self':
				// Return absolutely pixel position - (0,0) is most top-left of TEXTAREA.
				return { left: caretPos.left - dummyTextAreaPos.left, top: caretPos.top - dummyTextAreaPos.top };
			case 'body':
			case 'screen':
			case 'stage':
			case 'page':
			default:
				// Return absolutely pixel position - (0,0) is most top-left of PAGE.
				return { left: textAreaPosition.left + caretPos.left - dummyTextAreaPos.left, top: textAreaPosition.top + caretPos.top - dummyTextAreaPos.top };
		}
	};
}();

var deviceName = 'unknown';
var lastSendTime = 0;
var lastJson = {};
var caret = { start: 0, end: 0 };

var textarea = document.querySelector('.textarea');

var getDeviceName = function getDeviceName() {
	var url = '/getdevicename';
	return fetch(url).then(function (res) {
		return res.text();
	}).then(function (res) {
		deviceName = res;
		var setDeviceNameToMyCaret = function setDeviceNameToMyCaret() {
			var myCaret = document.querySelector('.caret');
			myCaret.setAttribute('device-name', deviceName);
			myCaret.querySelector('.device-name').textContent = deviceName;
		};
		setDeviceNameToMyCaret();
		console.log('device', res);
	});
};
getDeviceName();

var moveCarets = function moveCarets(ele, pos) {
	caret.start = textarea.selectionStart;
	caret.end = textarea.selectionEnd;
	var coordinates = (0, _caretposition2.default)(textarea, pos);
	ele.style.top = textarea.offsetTop - textarea.scrollTop + coordinates.top - 5 + 'px';
	ele.style.left = textarea.offsetLeft - textarea.scrollLeft + coordinates.left + 'px';
};

var send = function send() {
	var caretElem = document.querySelector('.caret');
	moveCarets(caretElem, textarea.selectionStart);

	var caretsArr = [];

	if (JSON.stringify(lastJson) !== '{}') {
		caretsArr = lastJson.carets.filter(function (c) {
			return c.device !== deviceName;
		});
	}
	caretsArr.push({
		'device': deviceName,
		'start': caret.start,
		'end': caret.end
	});

	lastSendTime = getTimeStamp();
	var sendObj = {
		'time': lastSendTime,
		'carets': caretsArr,
		'lines': textarea.value.split(/\r?\n/g).map(function (line, i) {
			return {
				num: i + 1,
				text: line
			};
		}),
		'device': deviceName
	};
	var url = '/send/';
	return fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(sendObj),
		mode: 'cors'
	}).then(function (res) {
		return res.text();
	});
};

var update = function update(arr) {
	if (arr !== undefined) {
		var t = arr.map(function (line) {
			return line.text;
		}).join('\n');
		textarea.value = t;
	} else {
		console.log('#update: arr is undefined');
	}
};

var check = function check() {
	var url = '/check/';
	return fetch(url, {
		method: 'GET',
		mode: 'cors'
	}).then(function (res) {
		return res.text();
	}).then(function (data) {
		var decodedText = decodeURI(data);
		var json = JSON.parse(decodedText);
		return json;
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
	var msec = ('000' + d.getMilliseconds()).slice(-3);
	return Number('' + year + month + day + hour + min + sec + msec);
};

textarea.addEventListener('click', function (e) {
	send();
});
textarea.addEventListener('keyup', function (e) {
	send();
});

(0, _timers.setInterval)(function () {
	check().then(function (json) {
		console.log(json);

		if (JSON.stringify(json) === '{}') return;

		if (json.lines !== undefined) {
			// console.log(json.device, json.lines.map(line => line.text).join('\n'))
		}
		if (lastSendTime < json.time) {
			update(json.lines);
		}
		lastJson = json;

		var carets = document.querySelectorAll('.caret');
		if (json.carets !== undefined) {
			json.carets.forEach(function (c) {
				var existed = false;
				carets.forEach(function (caretElem) {
					var deviceName = caretElem.getAttribute('device-name');
					if (deviceName === c.device) {
						// move
						existed = true;
						moveCarets(caretElem, c.start);
					}
				});
				if (!existed) {
					// add
					var newDevice = document.createElement('span');
					newDevice.classList.add('device-name');
					newDevice.textContent = c.device;
					var newFlag = document.createElement('div');
					newFlag.classList.add('flag');
					newFlag.appendChild(newDevice);
					var newCaret = document.createElement('div');
					newCaret.classList.add('caret');
					newCaret.setAttribute('device-name', c.device);
					newCaret.appendChild(newFlag);
					moveCarets(newCaret, c.start);
					document.querySelector('.container').appendChild(newCaret);
				}
			});
		}
	});
}, 400);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(2);
exports.setImmediate = setImmediate;
exports.clearImmediate = clearImmediate;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3), __webpack_require__(4)))

/***/ }),
/* 3 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 4 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var getCaretCoordinates = function getCaretCoordinates(element, position) {
	var properties = ['boxSizing', 'width', // on Chrome and IE, exclude the scrollbar, so the mirror div wraps exactly as the textarea does
	'height', 'overflowX', 'overflowY', // copy the scrollbar for IE

	'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',

	// https://developer.mozilla.org/en-US/docs/Web/CSS/font
	'fontStyle', 'fontVariant', 'fontWeight', 'fontStretch', 'fontSize', 'lineHeight', 'fontFamily', 'textAlign', 'textTransform', 'textIndent', 'textDecoration', // might not make a difference, but better be safe

	'letterSpacing', 'wordSpacing'];

	var isFirefox = !(window.mozInnerScreenX == null);
	var mirrorDiv, computed, style;

	// mirrored div
	mirrorDiv = document.getElementById(element.nodeName + '--mirror-div');
	if (!mirrorDiv) {
		mirrorDiv = document.createElement('div');
		mirrorDiv.id = element.nodeName + '--mirror-div';
		document.body.appendChild(mirrorDiv);
	}

	style = mirrorDiv.style;
	computed = getComputedStyle(element);

	// default textarea styles
	style.whiteSpace = 'pre-wrap';
	if (element.nodeName !== 'INPUT') style.wordWrap = 'break-word'; // only for textarea-s

	// position off-screen
	style.position = 'absolute'; // required to return coordinates properly
	style.top = element.offsetTop + parseInt(computed.borderTopWidth) + 'px';
	style.left = "400px";
	style.visibility = 'hidden'; // not 'display: none' because we want rendering

	// transfer the element's properties to the div
	properties.forEach(function (prop) {
		style[prop] = computed[prop];
	});

	if (isFirefox) {
		style.width = parseInt(computed.width) - 2 + 'px'; // Firefox adds 2 pixels to the padding - https://bugzilla.mozilla.org/show_bug.cgi?id=753662
		// Firefox lies about the overflow property for textareas: https://bugzilla.mozilla.org/show_bug.cgi?id=984275
		if (element.scrollHeight > parseInt(computed.height)) style.overflowY = 'scroll';
	} else {
		style.overflow = 'hidden'; // for Chrome to not render a scrollbar; IE keeps overflowY = 'scroll'
	}

	mirrorDiv.textContent = element.value.substring(0, position);
	// the second special handling for input type="text" vs textarea: spaces need to be replaced with non-breaking spaces - http://stackoverflow.com/a/13402035/1269037
	if (element.nodeName === 'INPUT') mirrorDiv.textContent = mirrorDiv.textContent.replace(/\s/g, '\xA0');

	var span = document.createElement('span');
	// Wrapping must be replicated *exactly*, including when a long word gets
	// onto the next line, with whitespace at the end of the line before (#7).
	// The  *only* reliable way to do that is to copy the *entire* rest of the
	// textarea's content into the <span> created at the caret position.
	// for inputs, just '.' would be enough, but why bother?
	span.textContent = element.value.substring(position) || '.'; // || because a completely empty faux span doesn't render at all
	span.style.backgroundColor = "lightgrey";
	mirrorDiv.appendChild(span);

	var coordinates = {
		top: span.offsetTop + parseInt(computed['borderTopWidth']),
		left: span.offsetLeft + parseInt(computed['borderLeftWidth'])
	};

	return coordinates;
};

exports.default = getCaretCoordinates;

/***/ })
/******/ ]);