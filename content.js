function likeDefaultfn(){
const likeDefault = new MaterialLiker({
  like_when : "timed",
  disabled: false,
})
likeDefault.init();
}



let old_url = '';
let mutationObserver = new MutationObserver( mutations => {
    mutations.forEach( (_) => {
            if (location.href != old_url) {
                old_url = location.href;
                console.log('URL was changed');
                setTimeout(()=>{likeDefaultfn()},1000);
            }
    });
});

mutationObserver.observe(document.documentElement, {childList: true, subtree: true});

