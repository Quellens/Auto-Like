class MaterialLiker {
    constructor(options) {
      this.options = options;
      this.init = this.init.bind(this);
      this.attemptLike = this.attemptLike.bind(this);
      this.waitForChannelname = this.waitForChannelname.bind(this);
      this.channelname = null;
      this.likeButton = null;
      this.dislikeButton = null;
    }


    waitForButtons(callback) {
        let likebutton = document.querySelector('ytd-video-primary-info-renderer g path[d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z"]');
        let dislikeButton = document.querySelector( 'ytd-video-primary-info-renderer g path[d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v1.91l.01.01L1 14c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"]');
        
          if (likebutton && dislikeButton) {
              // Find and store closest buttons
              this.likeButton = likebutton.closest('yt-icon-button');
              this.dislikeButton = dislikeButton.closest('yt-icon-button');
    
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


    waitForChannelname(callback) {
      const channelnameElement = document.querySelector("#upload-info > #channel-name > div > div > #text > a");
     
      if(channelnameElement){
        this.channelname = channelnameElement.innerText.toLowerCase().trim();
        if(this.channelname)
        callback();
      }
      else {
        setTimeout(() => this.waitForChannelname(callback), 1000);
      }
    }
  
    isVideoRated() {
      return (
        (
          this.likeButton.classList.contains('style-default-active') &&
          !this.likeButton.classList.contains('size-default')
        ) ||
        this.dislikeButton.classList.contains('style-default-active')
      );
    }
  
    attemptLike() {
  
      this.waitForButtons(() => {
        if (this.isVideoRated()) {
          console.log('video already rated');
          return;
        }
  
        this.likeButton.click();
        console.log('like button clicked');
      });
    }

    
    sendImageUrl(){
      if(options.listOfChannelnames.some(channelname => channelname.toLowerCase().trim() == this.channelname)) {
          const image = document.querySelector(" a > #avatar > img");
          if(image && image.src != "") {
            // get Image Url and send it to the backgroundscript => popupscript (when its active)
          console.log("sending..");
          chrome.runtime.sendMessage(
          {
            [this.channelname] : {
            src: image.src
            }
          });
          } else {
            // .bind(this) is very !important because without this == window and this.channelname not found
            console.log("nextTry");
            setTimeout(this.sendImageUrl.bind(this), 1000);
          }
        }

       
    }
  
    init() {
      //this prevents the liker from running if settings are changed and submitted.
      chrome.runtime.onMessage.addListener( () => {
          this.options.disabled = true;
          // on the runtime this.options.disabled is checked
        }
      );

      if(this.options.listOfChannelnames.length > 0) {
        this.waitForChannelname(() => {
          if(!this.options.listOfChannelnames.some(channelname => channelname.toLowerCase().trim() ==  this.channelname)) {
            this.options.disabled = true;
          }
        });
      } else {
        this.options.disabled = true;
      };
      //stop the method from running
      if (this.options.disabled || !document.querySelector('ytd-app[is-watch-page]')) {
        return;
      }
    
  
      this.sendImageUrl();
      console.log('liker initialized');
      console.log(this.options);  
    //liker initialized and ready to go..
      switch (this.options.like_when) {

        case 'timed':
          return this.waitForVideo(() => {
            const { video } = this;
            const onVideoTimeUpdate = e => {
              if(this.options.disabled) return;
              // Are we 5 seconds in the video?
              if (video.currentTime >= 5) {
                this.attemptLike();
                video.removeEventListener('timeupdate', onVideoTimeUpdate);
              }
            }
            video.addEventListener('timeupdate', onVideoTimeUpdate);
          });

        case 'percent':
          return this.waitForVideo(() => {
            const { video } = this;
            const onVideoTimeUpdate = e => {
              if(this.options.disabled) return;
              // Are we more than 50% through the video?
              if (video.currentTime / video.duration >= 0.5) {
                this.attemptLike();
                video.removeEventListener('timeupdate', onVideoTimeUpdate);
              }
            }
            video.addEventListener('timeupdate', onVideoTimeUpdate);
          });

        case 'instandly': this.attemptLike();
         break;
      }

    }
  }
