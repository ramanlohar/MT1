function lcg (key){
    let value = localStorage.getItem(key);
    return value;
}

function lcs (key,value){
    localStorage.setItem(key,value);
}

function redirect (value){
    window.location.href = value;
}

