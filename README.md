# Auto Like (Youtube)

 This chrome extension auto-clicks the Like button based on the youtubers you´ve listed.

/*
GET https://www.googleapis.com/youtube/v3/channels?part=snippet&forUsername={CHANNEL}&key={YOUR_API_KEY}

get the URL with response.items[0].snippet.thumbnails.default.url 
*/

# TO DO
* [x] Get Like Button
* [x] add Pop-Up Input
* [x] make connection popup to Content
* [x] get dislike button
* [x] Get channelname (succeded sucessfully)
* [x] Make backend work
* [x] Disable and Enable Liker
* [ ] Refactor It!
* [ ] Make Standard Channelimages
* [ ] Take image URL from content script and embed it to popup script
* [ ] LEARN ABOUT GET


## Installation

1. Clone this repository.
2. Head over to Chrome Extensions (usually "[chrome://extensions](chrome://extensions)" in the address bar) and turn "Developer Mode" on the top left.
3. Click "Load unpack" and select the destination as the "src" folder of this cloned repository.
