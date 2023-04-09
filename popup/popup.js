const send_button = document.getElementById('send-button');
const youtube_url = document.getElementById('youtube-url');
const BASE_URL = 'http://127.0.0.1:5000'


send_button.onclick = ()=> {
    console.log("You clicked the button!");
    chrome.storage.local.set({'youtube_url': youtube_url.value, 'request_id': null})
    
   url =  BASE_URL + '/detect_authenticity'
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
        console.log("Success in ajax popup:", data)
        chrome.storage.local.set({'youtube_url': youtube_url.value, 'request_id': data['request_id']})
        chrome.runtime.sendMessage({event: 'check_request'})
        let value = Math.random()
        if (value%2 == 0){
            chrome.action.setIcon({ path: "nfake32.png" });
        } else {
            chrome.action.setIcon({ path: "fake32.png" });
        }
    })
    .catch(error => console.error(error));
};


chrome.storage.local.get(['youtube_url'], (result)=>{
    if (result.youtube_url)
    {
        youtube_url.value = result.youtube_url
    }
});

