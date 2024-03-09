export default function Req(url, method, body, auth=undefined){
    let h = {
        "Content-Type": "application/json"
    }
    if(auth){
        h["Authorization"] = `Bearer ${auth}`
    }
    return fetch(url, { method : method, headers: h, body : JSON.stringify(body)});
}