const update_url = (url)=>{
    //console.log("You url is: " + url);
    if(url)
    {
        //console.log("InYou url is: " + url);
        if(url.includes("youtube.com") && (url.includes("watch?v=") || url.includes("shorts/"))){
            chrome.storage.local.set({'youtube_url': url})
        
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