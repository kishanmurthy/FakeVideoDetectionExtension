const send_button = document.getElementById('send-button');
const youtube_url = document.getElementById('youtube-url');
const BASE_URL = 'http://127.0.0.1:5000'

document.getElementById('status-text-downloading').hidden = true
document.getElementById('status-text-downloaded').hidden = true
document.getElementById('status-text-complete').hidden = true

document.getElementById('result-summary-text').hidden = true
document.getElementById('result-video-text').hidden = true
document.getElementById('result-image-text').hidden = true
document.getElementById('result-audio-text').hidden = true

send_button.onclick = ()=> {
    console.log("You clicked the button!");
    chrome.storage.local.set({'youtube_url': youtube_url.value, 'request_id': null, 'result':null, 'status': 'ready'})
    
   url =  BASE_URL + '/detect_authenticity'
    data = {url: youtube_url.value}
    chrome.action.setIcon({ path: "../images/main32.png" });
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
        document.getElementById('status-text-downloading').hidden = false
        chrome.storage.local.set({'youtube_url': youtube_url.value, 'request_id': data['request_id'], 'status': 'downloading'})
        chrome.storage.local.get(function(result){console.log(result)})
        chrome.runtime.sendMessage({event: 'check_request'})
    })
    .catch(error => console.error(error));
};


chrome.storage.local.get(['youtube_url','status'], (result)=>{
    if (result.youtube_url)
    {
        youtube_url.value = result.youtube_url
    }
    update_status(result.status)
});



chrome.runtime.onMessage.addListener(data => {
    switch(data.event){
        case 'status_downloading':
            console.log(" Popup JS Status downloading")
            update_status('downloading')
            break;
        case 'status_downloaded':
            console.log(" Popup JS Status downloaded")
            update_status('downloaded')
            break;
        case 'status_complete':
            console.log(" Popup JS Status Complete")
            update_status('complete')
            update_result();
            break;
        default: 
            break;

    }
});



const update_status = (status)=>{
    switch(status){
        case 'downloading':
            console.log(" Popup JS Status downloading")
            document.getElementById('status-text-downloading').hidden = false
            document.getElementById('status-text-downloaded').hidden = true
            document.getElementById('status-text-complete').hidden = true
            break;
        case 'downloaded':
            console.log(" Popup JS Status downloaded")
            document.getElementById('status-text-downloading').hidden = true
            document.getElementById('status-text-downloaded').hidden = false
            document.getElementById('status-text-complete').hidden = true
            break;
        case 'complete':
            console.log(" Popup JS Status Complete")
            document.getElementById('status-text-downloading').hidden = true
            document.getElementById('status-text-downloaded').hidden = true
            document.getElementById('status-text-complete').hidden = false
            update_result();
            break;
        default: 
            break;

    }
}

const update_result = ()=>{
    chrome.storage.local.get(['result'], (result)=>{
        if (result.result)
        {
            document.getElementById('result-summary-text').innerHTML = result.result.summary
            document.getElementById('result-image-text').innerHTML = result.result.image
            document.getElementById('result-audio-text').innerHTML = result.result.audio
            document.getElementById('result-summary-text').hidden = false
            document.getElementById('result-image-text').hidden = false
            document.getElementById('result-audio-text').hidden = false
            chrome.action.setIcon({ path: "../images/main32.png" });
        }
    });
}
