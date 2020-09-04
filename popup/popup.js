// get all the elements..
const submitButton = document.getElementById("submit");
const inputButton = document.getElementById("youtuber");
const table = document.querySelector("table");
const errorElement = document.querySelector("#error");
const option1 = document.getElementById("option1");
const option2 = document.getElementById("option2");
const option3 = document.getElementById("option3");
const switcher = document.querySelector(".switch");
const switchcheck = document.getElementById("check");
const para = document.getElementById("disable_enable");

let options; // options will be { like_when, disabled and listOfChannelnames, images}
let  listOfChannelnames = [], like_when, disabled, images;

inputButton.addEventListener("keydown",(e)=>{
  if(e.key == "Enter"){
    createRow( inputButton.value);
    inputButton.value = "";
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
    data.listOfChannelnames.sort().forEach(channelname => {
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

   let list = Array.prototype.filter.call(table.children, element => element.tagName != "TBODY")
   let isDuplicate = false;
   //checks if the input is already on the list
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

  // creating the row 
 const row = document.createElement("tr");
  table.appendChild(row);
 const td1 = document.createElement("td");
 const td2 = document.createElement("td");
 const removeButton = document.createElement("button");
 
 if(imagedata) {
 let result = document.createElement("img");
 result.setAttribute("width", 20); result.setAttribute("height", 20);
 result.setAttribute("src",imagedata.src);
 td1.appendChild(result);
 } else {
  td1.innerText = input[0];
 }

  td2.innerText = input;
  removeButton.innerHTML = "❌";
  row.appendChild(td1);
  row.appendChild(td2);
  row.appendChild(removeButton);
 
  //make removeButton work
  removeButton.addEventListener("click", ()=>{
    row.remove();
    //remove it from the array
    listOfChannelnames = listOfChannelnames.filter(name => name != removeButton.parentElement.children[1].innerText);
    save();
  })

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
  errorElement.style.opacity = 1;
  errorElement.innerText = str;
  errorElement.style.color = color;
  setTimeout(()=>{ errorElement.classList.add("fadeout");
  errorElement.style.opacity = 0;          
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

submitButton.addEventListener("click", sendRequest);

function save(){
  options = { 
    listOfChannelnames,
    like_when,
    disabled,
    images
  }
  if(Object.keys(options).length <= 1) chrome.storage.local.set({
    disabled: false,
    like_when: "timed"
  })
  chrome.storage.local.set(options);
}

setInterval( () => {
 createMessage("Don't forget to submit!", "green")
},20000);