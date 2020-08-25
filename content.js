//if(window.location.host == "www.youtube.com" && window.location.href.contains("watch")) console.log("Hello Yt");
console.log("works..");

async function like() {
  console.log("Hello Yt");
  const likebutton = await document.querySelector(".style-scope .ytd-toggle-button-renderer");
  if (likebutton && window.location.host == "www.youtube.com" && window.location.href.includes("watch") && !document.querySelector(".style-scope .yt-icon-button").getAttribute("aria-pressed")) {
    const { activeElement } = document;
    likebutton.click();
    activeElement.focus();
  }
}

//like();

let compare = window.location.href;
setInterval( async function(){
 let href = window.location.href;
  if(compare != href){
    compare = href;
   setTimeout(()=>{like()},1000)
  }

},1000)

/*
new MutationObserver(like).observe(document.querySelector(".style-scope .ytd-toggle-button-renderer"), {
    childList: true,
    subtree: true,
  });
*/