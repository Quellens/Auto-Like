function likeDefaultfn(){
const likeDefault = new MaterialLiker({
  like_when : "timed",
  disabled: false,
})
likeDefault.init();
}


chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
       console.log(message); 
    }
);

// Reloads the MaterialLiker whenever the user goes to another Video..
let old_url = '';
let mutationObserver = new MutationObserver( mutations => {
    mutations.forEach( (_) => {
            if (location.href != old_url) {
                old_url = location.href;
                setTimeout(()=>{likeDefaultfn()},1000);
            }
    });
});

mutationObserver.observe(document.documentElement, {childList: true, subtree: true});

