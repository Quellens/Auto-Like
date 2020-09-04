// get all the elements..
const inputElement = document.getElementById("youtuber");
const table = document.querySelector("table");
const msgElement = document.getElementById("msg");
const option1 = document.getElementById("option1");
const option2 = document.getElementById("option2");
const option3 = document.getElementById("option3");
const switcher = document.querySelector(".switch");
const switchcheck = document.getElementById("check");
const para = document.getElementById("disable_enable");

let options; // options will be { like_when, disabled, listOfChannelnames and images}
let  listOfChannelnames = [], like_when, disabled, images;

inputElement.addEventListener("keydown",(e)=>{
  if(e.key == "Enter"){
    createRow( inputElement.value);
    inputElement.value = "";
    save();
  }
});

// this is building the page by getting the saved options
chrome.storage.local.get(options, (data) => {

  if(data.images) {
    images = data.images;
    console.log(data);
  }

  if(data.listOfChannelnames){
    data.listOfChannelnames.forEach(channelname => {
      createRow(channelname, data.images[channelname.toLowerCase().trim()]);
    });
  }

  if(data.like_when){
    like_when = data.like_when;

    switch (data.like_when){
      case "percent": option2.checked = true;
      break;
      case "instandly": option3.checked = true;
      break;
      default: option1.checked = true;
      break; 
    }
  }
  
    disabled = data.disabled;
    if(!disabled){
      switchcheck.checked = true;
      para.innerText = "Disable Liker";
    } else {
      switchcheck.checked = false;
      para.innerText = "Enable Liker";
    }

});


//this recieves the image source
chrome.runtime.onMessage.addListener(function (request) {
  if(request != null) {
    chrome.storage.local.get( options, (data) => {
      if(!data.images) data.images = {};
      for(let name in request){
      if(!data.images[name])
      data.images[name] = request[name];
      };
      images = data.images;
      save();
    })
  }
 });

function createRow(input, imagedata) {
   if (input == "" || undefined || null) return;

   let list = Array.prototype.filter.call(table.children, element => element.tagName != "TBODY");
   let isDuplicate = false;
   //checks if the channel is already on the list
   list.forEach((row) => {
      Array.prototype.forEach.call(row.children, (child, index)=>{
          if(index % 2 == 1){
            if(child.innerText == input){
                createMessage( input+" is already on the list!", "red");
                isDuplicate = true;
            } 
          }
      } )
   });

  if(isDuplicate) return;

  // create the row 
 const row = document.createElement("tr");
  table.appendChild(row);
 const td1 = document.createElement("td");
 const td2 = document.createElement("td");
 const removeButton = document.createElement("button");

 //get image if its not undefined
 if(imagedata) {
 let result = document.createElement("img");
 result.setAttribute("width", 20); result.setAttribute("height", 20);
 result.setAttribute("src",imagedata.src);
 td1.appendChild(result);
 } else {
  td1.innerText = input[0];
 }

  td2.innerText = input;
  removeButton.innerText = "❌";
  row.appendChild(td1);
  row.appendChild(td2);
  row.appendChild(removeButton);
 
  //make removeButton work
  removeButton.addEventListener("click", ()=>{
    row.remove();
    //remove it from the array
    listOfChannelnames = listOfChannelnames.filter(name => name != removeButton.parentElement.children[1].innerText);
    images[removeButton.parentElement.children[1].innerText.toLowerCase().trim()] = null;
    save();
  });

  listOfChannelnames.push(input);
}

// this sets the like_when variable right
[option1,option2,option3].forEach(option => {
  option.addEventListener("click", (e)=>{
    switch (option.id) {
      case "option1": like_when = "timed";;
      break;
      case "option2": like_when = "percent";
      break;
      case "option3": like_when = "instandly";
      break;
    }
    save();
  })
})

function createMessage(str, color) {
  msgElement.style.opacity = 1;
  msgElement.innerText = str;
  msgElement.style.color = color;
  setTimeout(()=>{ msgElement.classList.add("fadeout");
  msgElement.style.opacity = 0;          
}, 3000);
}

switcher.addEventListener("change", () => {
  if(switchcheck.checked){
    disabled = false;
    para.innerText = "Disable Liker";
  }
 
  if(switchcheck.checked == false){
    disabled = true;
    para.innerText = "Enable Liker";
  }
   sendRequest();
})

function sendRequest(){
   save();
   chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
   chrome.tabs.sendMessage(tabs[0].id, options);
   });
}

document.getElementById("submit").addEventListener("click", sendRequest);

function save(){
  if(disabled == undefined) disabled = false;
  if(like_when == undefined) like_when = "timed";

  options = { 
    listOfChannelnames,
    like_when,
    disabled,
    images
  };

  chrome.storage.local.set(options);
}

setTimeout( () => {
 createMessage("Don't forget to submit!", "green")
},20000);
msgElement.style.opacity = 0;