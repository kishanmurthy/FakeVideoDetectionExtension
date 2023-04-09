const BASE_URL = 'http://127.0.0.1:5000'

const check_request = (request_id)=>{
    let url =  BASE_URL + '/get_status?request_id=' + request_id
    console.log(url)
    fetch(url, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        console.log("Success in ajax popup:", data)
        if (data['status'] != "COMPLETED"){
            console.log("Waiting for request to complete");
            setTimeout(check_request, 5000, request_id);
        }
        else{            
            console.log("Request completed");
            chrome.storage.local.set({'request_id': null})
        }
    })
    .catch(error => console.error(error));

}

export { check_request };

