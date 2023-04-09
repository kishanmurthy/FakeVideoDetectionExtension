import { check_request, send_request } from './api/api.js';

const update_url = (url)=>{
    if(url)
    {
        if(url.includes("youtube.com") && (url.includes("watch?v=") || url.includes("shorts/"))){
            console.log("Updating url");
            chrome.storage.local.get(['youtube_url','status'], (result)=>{
                console.log(result);
                
                if (result.youtube_url != url)
                {
                    chrome.storage.local.set({'youtube_url': url, 'request_id': null, 'status': null})
                    
                }
            
                if (result.status == 'ready' || result.status == 'complete' || result.status == null || result.status == undefined)
                {
                    send_request(url);
                } 

            });
        }
    }
}


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    update_url(tab.url);
});

chrome.tabs.onCreated.addListener(function(tab) {         
    let url = tab.url;
    update_url(url);
});


chrome.tabs.onActivated.addListener(function(activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function(tab) {
        let url = tab.url;
        update_url(url);
    });
});


chrome.runtime.onMessage.addListener(data => {
    switch(data.event){
        case 'check_request':
            console.log("Checking request!");
            chrome.storage.local.get(['request_id'], (result)=>{
                console.log(result);
                if (result.request_id)
                {
                    console.log("Fetching stastus of Request id" + result.request_id);
                    check_request(result.request_id);
                }
            });
            break;
        default: 
            break;

    }
});

