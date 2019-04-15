// ==UserScript==
// @name  Appear.in channel reloader for my LT-DK team
// @namespace http://tampermonkey.net/
// @version 0.19
// @description Reload appear.in channel after the period of time to keep the connection alive
// @author  dpet
// @match https://appear.in/june2.0
// @match https://appear.in/cardigans
// @grant GM.setValue
// @grant GM.getValue
// @updateURL https://raw.githubusercontent.com/domaspe/userscripts/master/lt-dk-team/reloader.meta.js
// @downloadURL https://raw.githubusercontent.com/domaspe/userscripts/master/lt-dk-team/reloader.user.js
// ==/UserScript==

const interval = 60 * 60 * 1000; // 60min
const STORE_COUNTRY_KEY = 'AppearInReloader_Country';

function getCountry() {
  return GM.getValue(STORE_COUNTRY_KEY, '').then(
    country =>
      country ||
      fetch('https://ipapi.co/json')
        .then(response => response.json())
        .then(response => response.country) // returns LT / DK
        .catch(err => {
          console.error('Failed to retrieve location', err);
          return '';
        })
        .then(fetchedCountry => {
          GM.setValue(STORE_COUNTRY_KEY, fetchedCountry);
          return fetchedCountry;
        })
  );
}

function getCameraName(country) {
  if (country === 'LT') {
    if (location.href.indexOf('june2.0') >= 0) {
      return 'hd pro webcam';
    } else if (location.href.indexOf('cardigans') >= 0) {
      return 'hd pro webcam'; // 'logitech webcam';
    }
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

function switchCamera(country) {
  const cameraName = getCameraName(country);
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
    const saveButton = document.querySelector('.save-button');

    if (cameraInputSelector.options.length < 2) {
      saveButton.click();
      return;
    }

    const selectedCameraName =
      cameraInputSelector.options[cameraInputSelector.selectedIndex].label;

    if (selectedCameraName.indexOf(cameraName) < 0) {
      setOptionBasedOnLabel(cameraInputSelector, cameraName);

      setTimeout(() => {
        saveButton.click();
      }, 2000);
    }
  }, 1000);
}

function enlargeLastParticipantWindow() {
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
getCountry().then(country => {
  const checkStarted = setInterval(() => {
    if (
      !document.querySelector('.connection-attempt.wrapper') &&
      document.querySelector('.video-stream-container')
    ) {
      clearInterval(checkStarted);

      switchCamera(country);
      enlargeLastParticipantWindow();
    }
  }, 100);
});
