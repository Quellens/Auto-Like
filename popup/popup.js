// get all the elements..
const inputElement = document.getElementById('youtuber');
const table = document.querySelector('table');
const msgElement = document.querySelector('#msg');
const option1 = document.getElementById('option1');
const option2 = document.getElementById('option2');
const option3 = document.getElementById('option3');
const switcher = document.querySelector('.switch');
const switchcheck = document.getElementById('check');
const para = document.getElementById('disable_enable');

let options; let like_when; let disabled; let images;
let listOfChannelnames = [];

inputElement.addEventListener('keydown', (e) => {
  if (e.key == 'Enter') {
    createRow(inputElement.value);
    inputElement.value = '';
    save();
  }
});

// this is building the page by getting the saved options
chrome.storage.local.get(options, (data) => {
  if (data.images) {
    images = data.images;
  }

  if (data.listOfChannelnames) {
    data.listOfChannelnames.forEach((channelname) => {
      createRow(channelname, data.images[channelname.toLowerCase().trim()]);
    });
  }

  if (data.like_when) {
    like_when = data.like_when;

    switch (data.like_when) {
      case 'percent': option2.checked = true;
        break;
      case 'instandly': option3.checked = true;
        break;
      default: option1.checked = true;
        break;
    }
  }

  disabled = data.disabled;
  if (!disabled) {
    switchcheck.checked = true;
    para.innerText = 'Disable Liker';
  } else {
    switchcheck.checked = false;
    para.innerText = 'Enable Liker';
  }
});


// this recieves the image source
chrome.runtime.onMessage.addListener((request) => {
  if (request != null) {
    chrome.storage.local.get(options, (data) => {
      if (!data.images) data.images = {};
      for (const name in request) {
        if (!data.images[name]) data.images[name] = request[name];
      }
      images = data.images;
      save();
    });
  }
});

function createRow(channelName, imagedata) {
  if (!channelName || (typeof channelName === 'string' && !channelName.trim())) return;

  if (listOfChannelnames.map(name=> name.toLowerCase().trim()).includes(channelName.toLowerCase().trim())){
    createMessage( channelName+" is already on the list!", "red");
    return;
  }

  listOfChannelnames.push(channelName);

  // create the row
  const row = table.insertRow();
  const td1 = row.insertCell();
  const td2 = row.insertCell();
  const removeButton = document.createElement('button');

  // get image if its not undefined
  if (imagedata) {
    const img = document.createElement('img');
    img.setAttribute('width', 20);
    img.setAttribute('height', 20);
    img.setAttribute('src', imagedata.src);
    td1.appendChild(img);
  } else {
    [td1.innerText] = channelName;
  }

  td2.innerText = channelName;
  removeButton.innerText = '❌';
  row.appendChild(removeButton);

  // make removeButton work
  removeButton.addEventListener('click', () => {
    row.remove();
    // remove it from the array
    listOfChannelnames = listOfChannelnames.filter((name) => name !== channelName);
    delete images[channelName];
    save();
  });

}

// this sets the like_when variable right
[option1, option2, option3].forEach((option) => {
  option.addEventListener('click', (e) => {
    switch (option.id) {
      case 'option1': like_when = 'timed';
        break;
      case 'option2': like_when = 'percent';
        break;
      case 'option3': like_when = 'instandly';
        break;
    }
    save();
  });
});

function createMessage(str, color) {
  msgElement.style.opacity = 1;
  msgElement.innerText = str;
  msgElement.style.color = color;
  setTimeout(() => {
    msgElement.classList.add('fadeout');
    msgElement.style.opacity = 0;
  }, 3000);
}

switcher.addEventListener('change', () => {
  if (switchcheck.checked) {
    disabled = false;
    para.innerText = 'Disable Liker';
  }

  if (switchcheck.checked == false) {
    disabled = true;
    para.innerText = 'Enable Liker';
  }
  sendRequest();
});

function sendRequest() {
  save();
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, options);
  });
}

document.getElementById('submit').addEventListener('click', sendRequest);

function save() {
  if (disabled == undefined) disabled = false;
  if (like_when == undefined) like_when = 'timed';

  options = {
    listOfChannelnames,
    like_when,
    disabled,
    images,
  };

  chrome.storage.local.set(options);
}

setTimeout(() => {
  createMessage("Don't forget to submit!", 'green');
}, 20000);
msgElement.style.opacity = 0;