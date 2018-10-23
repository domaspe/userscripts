// ==UserScript==
// @name         Team 417 appear.in channel reloader
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  Reload Team 417 appear.in channel to recover it in case of crashing
// @author       dpet
// @match        https://appear.in/june2.0*
// @grant        none
// @updateURL   https://raw.githubusercontent.com/domaspe/userscripts/master/team417/reloader.meta.js
// @downloadURL https://raw.githubusercontent.com/domaspe/userscripts/master/team417/reloader.user.js
// ==/UserScript==

var url = "https://appear.in/june2.0";
var interval = 120 * 60 * 1000; // 120min

/**
 * This part is responsible for setting the reload timetout
 */
setTimeout(function() {
  window.open(url, "_blank");
  window.close();
}, interval);

/**
 * This part is responsible for clicking on full screen button
 * Finds the last connected client and enlarges the screen
 */
var checkStarted = setInterval(function() {
  if (
    !document.querySelector(".connection-attempt.wrapper") &&
    document.querySelector(".video-stream-container")
  ) {
    clearInterval(checkStarted);

    // Try to expand last item every 15s
    function expand() {
      const allClients = document.querySelectorAll(
        'div[ng-repeat="client in clients | clientFilter:RoomState.localClient"]'
      );
      const lastClient = allClients[allClients.length - 1];

      const button = lastClient.querySelector(
        'video-toolbar-button[action="module.toggleSuperSize()"] button.active'
      );
      if (button) {
        button.click();
      }
    }

    setInterval(expand, 1000 * 15);
    expand();
  }
}, 100);
