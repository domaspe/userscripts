// ==UserScript==
// @name         Team 417 appear.in channel reloader
// @namespace    http://tampermonkey.net/
// @version      0.15
// @description  Reload Team 417 appear.in channel to recover it in case of crashing
// @author       dpet
// @match        https://appear.in/june2.0
// @match        https://appear.in/cardigans
// @grant        none
// @updateURL   https://raw.githubusercontent.com/domaspe/userscripts/master/team417/reloader.meta.js
// @downloadURL https://raw.githubusercontent.com/domaspe/userscripts/master/team417/reloader.user.js
// ==/UserScript==

const interval = 60 * 60 * 1000; // 60min

function getCameraName() {
  if (location.href.indexOf('june2.0') >= 0) {
    return 'hd pro webcam';
  } else if (location.href.indexOf('cardigans') >= 0) {
    return 'logitech webcam';
  }

  return null;
}

function setOptionBasedOnLabel(select, label) {
  for (let i = 0; i < select.options.length; i++) {
    console.log(i, select.options[i].label, label);
    if (
      select.options[i].label.toLowerCase().indexOf(label.toLowerCase()) >= 0
    ) {
      select.selectedIndex = i;
      select.dispatchEvent(new Event('change'));
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

  setTimeout(() => {
    const cameraInputSelector = document.querySelector(
      'select[name="cameraInputSelector"]'
    );

    const selectedCameraName =
      cameraInputSelector.options[cameraInputSelector.selectedIndex].label;

    if (selectedCameraName.indexOf(cameraName) < 0) {
      setOptionBasedOnLabel(cameraInputSelector, cameraName);
      const saveButton = document.querySelector('.save-button');
      setTimeout(() => {
        saveButton.click();
      }, 2000);
    }
  }, 1000);
}

function resizeLastStreamerWindow() {
  // Try to expand last item every 15s
  const expand = () => {
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
  };

  setInterval(expand, 1000 * 15);
  expand();
}

/**
 * This part is responsible for setting the reload timetout
 */
setTimeout(() => {
  window.open(location.href, '_blank');
  window.close();
}, interval);

/**
 * This part is responsible for clicking on full screen button
 * Finds the last connected client and enlarges the screen
 */
const checkStarted = setInterval(() => {
  if (
    !document.querySelector('.connection-attempt.wrapper') &&
    document.querySelector('.video-stream-container')
  ) {
    clearInterval(checkStarted);

    switchCamera();
    resizeLastStreamerWindow();
  }
}, 100);
