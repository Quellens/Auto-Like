console.log("popup");
const submitButton = document.getElementById("submit");
const inputButton = document.getElementById("youtuber");
const table = document.querySelector("table");
const errorElement = document.querySelector("#error");
let options;
let channelname, listOfChannelnames = [];

let like_when = "timed";

inputButton.addEventListener("keydown",(e)=>{
  if(e.key == "Enter"){
    channelname = inputButton.value;
    createRow(channelname);
  }
});

function createRow(input){
   if (input == "" || undefined || null) return;
   let list = Array.prototype.filter.call(table.children, element => element.tagName != "TBODY")
   let isDuplicate = false;
   list.forEach((row) => {
      Array.prototype.forEach.call(row.children, (child, index)=>{
          if(index % 2 == 1){
            if(child.innerText == input){
                createErrorMessage( input+" is already on the list!");
                isDuplicate = true;
            } 
          }
      } )
   });
  if(isDuplicate) return;

 const row = document.createElement("tr");
  table.appendChild(row);
 const td1 = document.createElement("td");
 const td2 = document.createElement("td");
 const removeButton = document.createElement("button");
  td1.innerText = input[0];
  td2.innerText = input;
  removeButton.innerHTML = "❌";
  row.appendChild(td1);
  row.appendChild(td2);
  row.appendChild(removeButton);

  removeButton.addEventListener("click", ()=>{
    row.remove();
    listOfChannelnames.pop();
  })
  listOfChannelnames.push(input);

}

function createErrorMessage(str) {
  errorElement.style.opacity = 1;
  errorElement.innerText = str;
  setTimeout(()=>{ errorElement.classList.add("fadeout");
  errorElement.style.opacity = 0;          
}, 3000);
}

function sendRequest(){
  options = { 
    listOfChannelnames,
    like_when,
    disabled: false,
 }
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, options);
  }
);
 chrome.storage.local.set(options);
}


submitButton.addEventListener("click", sendRequest);

//Like when? 
const afterSeconds = document.getElementById("when1");
const after50Percent = document.getElementById("when2");
const instandly = document.getElementById("when3");
[after50Percent, afterSeconds, instandly].forEach(option => {
   option.addEventListener("click", (e)=>{
     switch (option.id) {
       case "when1": like_when = "timed";;
       break;
       case "when2": like_when = "percent";
       break;
       case "when3": like_when = "instandly";
       break;
     }
   })

})


chrome.storage.local.get( options, (data)=>{
  if(data.listOfChannelnames){
    data.listOfChannelnames.forEach(channelname => {
      createRow(channelname);
    })
  }

  if(data.like_when){
    switch (data.like_when){
      case "percent": after50Percent.checked = true;
      break;
      case "instandly": instandly.checked = true;
      break;
      default: afterSeconds.checked = true;
      break; 
    }
  }
  

});

