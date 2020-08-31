let options, like;

chrome.runtime.onMessage.addListener(
    function(message) {
        options = message;
        like = new MaterialLiker(options);
        // store options in content script
        chrome.storage.local.set(options);

        like.init();
    }
)

chrome.storage.local.get(options, (data) => {
    options = data;
});

// Reloads the MaterialLiker whenever the user goes to another Video..
let old_url = '';
let mutationObserver = new MutationObserver( mutations => {
    mutations.forEach( mutation => {
            if (location.href != old_url) {
                //  URL Changed
                old_url = location.href;
                setTimeout(()=>{
                    if(!options) 
                    options = { disabled: true}
                    like = new MaterialLiker(options);
                    like.init();
                },3000);
            }
    });
});

mutationObserver.observe(document.documentElement, {childList: true, subtree: true});

