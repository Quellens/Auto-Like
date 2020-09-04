// The popup MUST BE active otherwise it will not receive a message
chrome.runtime.onMessage.addListener(function (imagedata) {
    sending(imagedata);
});

function sending(imagedata){
    let views = chrome.extension.getViews({ type: "popup" });
    if(views.length > 0){
        chrome.runtime.sendMessage(imagedata);
    } else {
     setTimeout(function() {sending(imagedata)}, 3000)
    }
}