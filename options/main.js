/* global chrome */
/* eslint-disable no-console */

const channelList = {
  none: 'Choose a channel',
  'html-css': 'HTML &amp; CSS',
  javascript: 'JavaScript',
  php: 'PHP',
  ruby: 'Ruby',
  mobile: 'Mobile',
  'design-ux': 'Design &amp; UX',
  entrepreneur: 'Entrepreneur',
  web: 'Web',
  wordpress: 'WordPress',
  java: 'Java',
};

function renderChannelOptions() {
  chrome.storage.sync.get(['sitepointChannel'], (items) => {
    const currentChannel = items.sitepointChannel;
    const options = Object.keys(channelList).map((slug) => {
      const isSelected = (slug === currentChannel) ? 'selected' : '';
      return `<option value="${slug}" ${isSelected}>${channelList[slug]}</option>`;
    });
    document
      .querySelector('#sitepointChannel')
      .innerHTML = options.join('\n');
  });
}

function populateCheckBoxes() {
  ['clean-up-ui', 'infinite-scroll'].forEach((id) => {
    chrome.storage.sync.get(id, (obj) => {
      if (!Object.entries(obj).length) return;

      const [selector, checkedValue] = Object.entries(obj)[0];
      document.getElementById(selector).checked = checkedValue;
    });
  });
}

// DOM elements
const channelSelect = document.querySelector('#sitepointChannel');
const checkBoxes = document.querySelectorAll('input[type="checkbox"]');

// Event listeners
channelSelect.addEventListener('change', function channelSelectOnChange() {
  const sitepointChannel = this.value;

  chrome.storage.sync.set({ sitepointChannel }, () => {
    console.log(`Channel: ${sitepointChannel}`);
  });
});

checkBoxes.forEach((cb) => {
  cb.addEventListener('change', function handleCheckBoxChange() {
    const key = this.id;
    const value = this.checked;

    chrome.storage.sync.set({ [key]: value }, () => {
      console.log(`${key}: ${value}`);
    });
  });
});

// When infinite scroll is toggled, we need to send a message to the background script
// to tell it to add/remove the chrome.webRequest.onBeforeRequest listener
// https://developer.chrome.com/extensions/storage#examples
chrome.storage.onChanged.addListener((changes) => {
  const [key] = Object.keys(changes);

  if (key === 'infinite-scroll') {
    chrome.runtime.sendMessage({ message: 'TOGGLE-INFINITE-SCROLL' }, (response) => {
      console.log(response.message);
    });
  }
});

// Kick everything off
renderChannelOptions();
populateCheckBoxes();
