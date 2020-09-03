chrome.runtime.onMessage.addListener(function (msg) {
    const imagedata = msg;
    sending(imagedata);
    console.log(msg);
  });

  function sending(imagedata){
    console.log("no popup");
    console.log(imagedata);
        let views = chrome.extension.getViews({ type: "popup" });
        if(views.length > 0){
            chrome.runtime.sendMessage(imagedata);
        } else {
            setTimeout(function(){sending(imagedata)}, 3000)
        }
}