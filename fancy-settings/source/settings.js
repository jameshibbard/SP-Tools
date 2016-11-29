let apiKey, secretToken;

const channelList = {
  'none': 'Choose a channel',
  'html-css': 'HTML &amp; CSS',
  'javascript': 'JavaScript',
  'php': 'PHP',
  'ruby': 'Ruby',
  'mobile': 'Mobile',
  'design-ux':  'Design &amp; UX',
  'entrepreneur': 'Entrepreneur',
  'web': 'Web',
  'wordpress': 'WordPress',
  'java': 'Java',
};

function fetchParselyCreds(){
  chrome.storage.sync.get(['parselyAPIKey', 'parselySecret'], function(items) {
    $("#api-key-status").text(items.parselyAPIKey);
    $("#secret-token-status").text(items.parselySecret);
  });
}

function renderChannelOptions() {
  chrome.storage.sync.get(['sitepointChannel'], function(items) {
    const currentChannel = items.sitepointChannel;
    const options = Object.keys(channelList).map(slug => {
      let isSelected = (slug === currentChannel) ? 'selected' : '';
      return `<option value="${slug}" ${isSelected}>${channelList[slug]}</option>`;
    });
    document
      .querySelector('#sitepointChannel')
      .innerHTML = options.join('\n');
  });
}

$("button").on("click", function(){
  const elem = $(this).prev().get(0);
  const key = elem.id;
  const val = elem.value;

  chrome.storage.sync.set({ [key] : val }, function(items) {
    console.log("Settings saved");
  });

  fetchParselyCreds();
});

$("#sitepointChannel").change(function() {
  const sitepointChannel = this.value;
  chrome.storage.sync.set({ sitepointChannel }, function() {
    console.log("Channel settings saved");
  });
});

renderChannelOptions();
fetchParselyCreds();
