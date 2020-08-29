# Auto Like (Youtube)

 This chrome extension auto-clicks the Like button based on the youtubers you´ve listed.


GET https://www.googleapis.com/youtube/v3/channels?part=snippet&forUsername={CHANNEL}&key={YOUR_API_KEY}

get the URL with response.items[0].snippet.thumbnails.default.url 


# TO DO
* [*] Get Like Button
* [*] add Pop-Up Input
* [*] make connection popup to Content
* [*] get dislike button
* [ ] Get Youtuber
* [ ] LEARN ABOUT GET
* [ ]


## Installation

1. Clone this repository.
2. Head over to Chrome Extensions (usually "[chrome://extensions](chrome://extensions)" in the address bar) and turn "Developer Mode" on the top left.
3. Click "Load unpack" and select the destination as the "src" folder of this cloned repository.
