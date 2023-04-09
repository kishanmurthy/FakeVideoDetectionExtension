const send_button = document.getElementById('send-button');
const youtube_url = document.getElementById('youtube-url');

send_button.onclick = ()=> {
    console.log("You clicked the button!");
    chrome.storage.local.set({'youtube_url': youtube_url.value})
    url = 'http://127.0.0.1:5000/detect_authenticity'
    data = {url: youtube_url.value}

    fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data => {
        chrome.storage.local.set({'youtube_url': youtube_url.value, 'request_id': data['request_id']})
      })
      .catch(error => console.error(error));
};


chrome.storage.local.get(['youtube_url'], (result)=>{
    if (result.youtube_url)
    {
        youtube_url.value = result.youtube_url;
    }
});