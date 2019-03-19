// ==UserScript==
// @name         Team 417 appear.in channel reloader
// @namespace    http://tampermonkey.net/
// @version      0.14
// @description  Reload Team 417 appear.in channel to recover it in case of crashing
// @author       dpet
// @match        https://appear.in/june2.0
// @match        https://appear.in/cardigans
// @grant        none
// @updateURL   https://raw.githubusercontent.com/domaspe/userscripts/master/team417/reloader.meta.js
// @downloadURL https://raw.githubusercontent.com/domaspe/userscripts/master/team417/reloader.user.js
// ==/UserScript==

var interval = 60 * 60 * 1000; // 30min

function getCameraName() {
  if (location.href.indexOf('june2.0') >= 0) {
    return 'asd';
  } else if (location.href.indexOf('cardigans') >= 0) {
    return 'asd';
  }

  return null;
}

function setOptionBasedOnLabel(select, label) {
  for (var i = 0; i < select.options.length; i++) {
    if (select.options[i].label.indexOf(label) >= 0) {
      select.selectedIndex = i;
      break;
    }
  }
}

function switchCamera() {
  const cameraName = getCameraName();
  if (!cameraName) {
    return;
  }

  const optionsButton = document.querySelector('.jstest-cam-mic');
  if (!optionsButton) {
    return;
  }

  optionsButton.click();

  setTimeout(function() {
    const cameraInputSelector = document.querySelector(
      'select[name="cameraInputSelector"]'
    );

    var currentCameraName =
      cameraInputSelector.options[cameraInputSelector.selectedIndex].label;

    if (currentCameraName.indexOf(cameraName) < 0) {
      setOptionBasedOnLabel(cameraInputSelector, cameraName);
      const saveButton = document.querySelector('.save-button');
      saveButton.click();
    }
  }, 500);
}

function resizeLastStreamerWindow() {
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

/**
 * This part is responsible for setting the reload timetout
 */
setTimeout(function() {
  window.open(location.href, '_blank');
  window.close();
}, interval);

/**
 * This part is responsible for clicking on full screen button
 * Finds the last connected client and enlarges the screen
 */
var checkStarted = setInterval(function() {
  if (
    !document.querySelector('.connection-attempt.wrapper') &&
    document.querySelector('.video-stream-container')
  ) {
    clearInterval(checkStarted);

    switchCamera();
    resizeLastStreamerWindow();
  }
}, 100);
