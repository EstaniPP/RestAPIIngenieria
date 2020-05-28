function validatetime(inputText){
    var dateformat = /^(0[0-9]|1[0-9]|2[0-4]):([0-5][0-9]):([0-5][0-9])$/;
    if(inputText.match(dateformat)){
        return true;
    }else{
        return false;
    }
}

module.exports = validatetime;