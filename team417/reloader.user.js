// ==UserScript==
// @name         Team 417 appear.in channel reloader
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Reload Team 417 appear.in channel to recover it in case of crashing
// @author       dpet
// @match        https://appear.in/june2.0*
// @grant        none
// @updateURL   https://raw.githubusercontent.com/domaspe/userscripts/master/team417/reloader.meta.js
// @downloadURL https://raw.githubusercontent.com/domaspe/userscripts/master/team417/reloader.user.js
// ==/UserScript==

var url = 'https://appear.in/june2.0';
var interval = 60 * 60 * 1000; // 60min

/**
 * This part is responsible for setting the reload timetout
 */
setTimeout(function() {
    window.open(url, '_blank');
    window.close();
}, interval);

/**
 * This part is responsible for clicking on full screen button
 */
var checkStarted = setInterval(function() {
    if (!document.querySelector('.connection-attempt.wrapper') && document.querySelector('.video-stream-container')) {
        clearInterval(checkStarted);

        var teamNameNode = document.querySelectorAll('.user-settings-info-text')[0];
        if (!teamNameNode) {
            return;
        }

        var teamName = teamNameNode.innerText;
        var button = Array.from(document.querySelectorAll('p[ng-show="module.user.displayName"]'))
            .filter(function (item) { return item.innerText !== teamName; })[0]
            .parentElement
            .parentElement
            .querySelector('video-toolbar-button[action="module.toggleSuperSize()"] button.active');

        button.click();
    }
 }, 100);
