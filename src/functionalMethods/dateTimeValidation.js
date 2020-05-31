function validateDateTime(inputText){
    var dateformat = /^\d{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01]) (0[0-9]|1[0-9]|2[0-3]):(0[0-9]|[1-5][0-9]):(0[0-9]|[1-5][0-9])$/;
    // Match the date format through regular expression
    if(inputText.match(dateformat)){
        var opera2 = inputText.split('-');
        lopera2 = opera2.length;
        var pdate = inputText.split('-');
        var dd = parseInt(pdate[2]);
        var mm  = parseInt(pdate[1]);
        var yy = parseInt(pdate[0]);
        var ListofDays = [31,28,31,30,31,30,31,31,30,31,30,31];
        if (mm==1 || mm>2)
        {
            if (dd>ListofDays[mm-1]){
                return false;
            }
        }
        if (mm==2){
            var lyear = false;
            if ( (!(yy % 4) && yy % 100) || !(yy % 400)){
                lyear = true;
            }
            if ((lyear==false) && (dd>=29)){
                return false;
            }
            if ((lyear==true) && (dd>29)) {
                return false;
            }
        }
        return true;
    }else{
        return false;
    }
}

module.exports = validateDateTime; 