function setup(){
  chrome.runtime.onMessage.addListener(
      function(message, sender, sendResponse) {
          console.log(message);
         const like = new MaterialLiker(message);
         if(!message.disabled)
         like.init();
       //  defaultLike.stop();
    }
)
  const defaultLike = new MaterialLiker({
    like_when: "timed",
    disabled: false,  
  });
  defaultLike.init();
}

// Reloads the MaterialLiker whenever the user goes to another Video..
let old_url = '';
let mutationObserver = new MutationObserver( mutations => {
    mutations.forEach( (_) => {
            if (location.href != old_url) {
                old_url = location.href;
                setTimeout(()=>{setup()},1000);
            }
    });
});

mutationObserver.observe(document.documentElement, {childList: true, subtree: true});

