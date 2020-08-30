let cache = {
    likeButton : null,
    dislikeButton: null
}

class MaterialLiker {
    constructor(options) {
      this.options = options;
      this.init = this.init.bind(this);
      this.reset = this.reset.bind(this);
      this.attemptLike = this.attemptLike.bind(this);
    }


    reset() {
      cache = {};
    }


    stop(){
      this.init = null;
    }

    waitForButtons(callback) {
        let likebutton = document.querySelector('ytd-video-primary-info-renderer g path[d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z"]');
        let dislikeButton = document.querySelector( 'ytd-video-primary-info-renderer g path[d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v1.91l.01.01L1 14c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"]');
        
          if (likebutton && dislikeButton) {
              // Find and store closest buttons
              cache.likeButton = likebutton.closest('yt-icon-button');
              cache.dislikeButton = dislikeButton.closest('yt-icon-button');
        console.log('...buttons ready');
        callback();
          }
      else {
        setTimeout(() => this.waitForButtons(callback), 1000);
      }
    }

    waitForVideo(callback) {
      this.video = document.querySelector('.video-stream');
      // Does the video exist?
      if (this.video) {
        callback();
          }
      else {
        setTimeout(() => this.waitForVideo(callback), 1000);
      }
    }
  
    isVideoRated() {
      return (
        (
          cache.likeButton.classList.contains('style-default-active') &&
          !cache.likeButton.classList.contains('size-default')
        ) ||
        cache.dislikeButton.classList.contains('style-default-active')
      );
    }
  
    attemptLike() {
  
      this.waitForButtons(() => {
        if (this.isVideoRated()) {
          console.log('video already rated');
          return;
        }
  
        cache.likeButton.click();
        console.log('like button clicked');
      });
    }
  
    init() {
    
      if (this.options.disabled || !document.querySelector('ytd-app[is-watch-page]')) {
        return;
      }
      console.log('liker initialized');  
      this.reset();
      
      if(this.options.listOfChannelnames.length > 0) {
        console.log(this.options.listOfChannelnames);
        if(!this.options.listOfChannelnames.some(channelname => channelname == document.querySelector(".yt-formatted-string").innerText)){
          return;
        }
      } else {
        return;
      }
    
      switch (this.options.like_when) {

        case 'timed':
          return this.waitForVideo(() => {
            const { video } = this;
            const onVideoTimeUpdate = e => {
              // Are we 5 seconds in or at the end of the video?
              if (video.currentTime >= 5|| video.currentTime >= video.duration) {
                this.attemptLike();
                video.removeEventListener('timeupdate', onVideoTimeUpdate);
              }
            }
            video.addEventListener('timeupdate', onVideoTimeUpdate);
          });
         break;

        case 'percent':
          return this.waitForVideo(() => {
            const { video } = this;
            const onVideoTimeUpdate = e => {
              // Are we more than 50% through the video?
              if (video.currentTime / video.duration >= 0.5) {
                this.attemptLike();
                video.removeEventListener('timeupdate', onVideoTimeUpdate);
              }
            }
            video.addEventListener('timeupdate', onVideoTimeUpdate);
          });
         break;

        case 'instantly':
          return this.attemptLike();
          break;
      }
    }
  }
