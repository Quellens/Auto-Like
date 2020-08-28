console.log("popup");
const submitButton = document.getElementById("submit");
const inputButton = document.getElementById("youtuber");
const table = document.querySelector("table");
const errorElement = document.querySelector("#error");

let channelname;

submitButton.addEventListener("click",()=>{
    channelname = inputButton.value;
    createRow(channelname);

})

function createRow(input){
   if (input == "" || undefined || null) return;
   let list = Array.prototype.filter.call(table.children, element => element.tagName != "TBODY")
   console.log(list);
   let isDuplicate = false;
   list.forEach((row) => {
      Array.prototype.forEach.call(row.children, (child, index)=>{
          if(index % 2 == 1){
            if(child.innerText == input){
               errorElement.style.opacity = 1;
                errorElement.innerText = "The youtuber is already on the list!";
                setTimeout(()=>{ errorElement.classList.add("fadeout");
                errorElement.style.opacity = 0;          
            }, 3000);
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
  td1.innerText = input[0];
  td2.innerText = input;
  row.appendChild(td1);
  row.appendChild(td2);
}



chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, 
      { //here you can send all data to content script
     
      });
    }
);