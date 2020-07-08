(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";console.log("Hey again!");

},{}],2:[function(require,module,exports){
"use strict";module.exports=42;

},{}],3:[function(require,module,exports){
"use strict";var math=require(4),camelo=require(5),foo=require(2);console.log(math.square(2,4)),console.log($("#my-id")),console.log(camelo("hey there"));

},{"2":2,"4":4,"5":5}],4:[function(require,module,exports){
"use strict";module.exports={sum:function(t,u){return t+u},multiply:function(t,u){return t*u},square:function(t){return this.multiply(t,t)},subtract:function(t,u){return t-u}};

},{}],5:[function(require,module,exports){
"use strict";var ucFirstArray=require(7),reEscape=require(6),DEFAULT_SPLIT=/[^a-zA-Z0-9]/g;function camelo(r,e,a){e=e||DEFAULT_SPLIT;var i=null;return Array.isArray(e)?e=new RegExp(e.map(reEscape).join("|"),"g"):"boolean"==typeof e&&(a=e,e=DEFAULT_SPLIT),i=r.split(e),a?ucFirstArray(i).join(""):i[0]+ucFirstArray(i.slice(1)).join("")}module.exports=camelo;

},{"6":6,"7":7}],6:[function(require,module,exports){
"use strict";function RegexEscape(e){return e.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&")}RegexEscape.proto=function(){return RegExp.escape=RegexEscape,RegexEscape},module.exports=RegexEscape;

},{}],7:[function(require,module,exports){
"use strict";var ucFirst=require(8);function ucFirstArray(r){return r.map(ucFirst)}module.exports=ucFirstArray;

},{"8":8}],8:[function(require,module,exports){
"use strict";module.exports=function(s){return s.substr(0,1).toUpperCase()+s.substring(1)};

},{}]},{},[3,1]);
