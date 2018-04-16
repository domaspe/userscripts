// ==UserScript==
// @name         Team 417 appear.in channel reloader
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Reload Team 417 appear.in channel to recover it in case of crashing
// @author       dpet
// @match        https://appear.in/june2.0*
// @grant        none
// @updateURL   https://raw.githubusercontent.com/domaspe/userscripts/master/team417/reloader.meta.js
// @downloadURL https://raw.githubusercontent.com/domaspe/userscripts/master/team417/reloader.user.js
// ==/UserScript==

var url = 'https://appear.in/june2.0';
var interval = 30 * 60 * 1000; // 30min

setTimeout(function() {
    window.open(url, '_blank');
    window.close();
}, interval);