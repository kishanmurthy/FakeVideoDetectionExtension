const BASE_URL = 'http://127.0.0.1:5000'

const check_request = (request_id)=>{
    let url =  BASE_URL + '/get_status?request_id=' + request_id
    console.log(url)
    console.log("Checking request status")
    fetch(url, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        console.log("Success in ajax popup:", data)
        if (data['status'] != "COMPLETED"){
            console.log("Waiting for request to complete");

            if(data['status'] == "DOWNLOADING")
            {
                chrome.runtime.sendMessage({event: 'status_downloading'})
            }
            else if(data['status'] == "DOWNLOADED")
            {
                chrome.runtime.sendMessage({event: 'status_downloaded'})
            }
            setTimeout(check_request, 5000, request_id);
        }
        else{            
            console.log("Request completed");
            
            document.getElementById('status-text-downloading').hidden = true
            document.getElementById('status-text-downloaded').hidden = true
            document.getElementById('status-text-complete').hidden = false

            chrome.storage.local.set({'result': data['result']})

            chrome.runtime.sendMessage({event: 'status_complete'})
            get_result(request_id)
        }
    })
    .catch(error => console.error(error));

}


const get_result = (request_id)=>{
    let url =  BASE_URL + '/get_result?request_id=' + request_id
    console.log(url)
    fetch(url, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        
        
    }
    )
    .catch(error => console.error(error));
}

const send_request = (youtube_url)=>{
    chrome.storage.local.set({'youtube_url': youtube_url, 'request_id': null, 'result':null})
    
    let url =  BASE_URL + '/detect_authenticity'
    let data = {url: youtube_url}
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
         chrome.storage.local.set({'youtube_url': youtube_url, 'request_id': data['request_id']})
         chrome.storage.local.get(function(result){console.log(result)})
         check_request(data['request_id'])
     })
     .catch(error => console.error(error));
} 
export { check_request, get_result, send_request }

