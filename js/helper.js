var helper = exports;

helper.test = function(f,k,q) {
    var a = [], sum = 0;
    k = k || 50;
    for (i=0;i<k;i++) {
        var start = Date.now();
        f();
        a.push(Date.now() - start);
    }
    a.map(function(el){ sum+=el; });
    console.log('\nf() was executed ' + k + ' times');
    console.log('\nAverage time is ' + sum/a.length);
    console.log('\nTotal time is ' + sum);
};
helper.wrap = function(wrapper,attributes,text) { 
    if (typeof attributes === 'object') {
        string = '';
        for (var i in attributes) { string += ' ' + i + ((attributes[i].length === 0) ? '' : '=\"' + attributes[i] + '\"'); }
        attributes = string;
    }
    else { text = attributes; attributes = ''; }
    return '<' + wrapper + attributes + '>\n' + ((text) ? text + '\n</' + wrapper + '>\n' : ''); 
};
helper.getTime = function() {
    var now      = new Date(),
        year     = now.getFullYear(),
        month    = now.getMonth()+1,
        day      = now.getDate(),
        hour     = now.getHours(),
        minute   = now.getMinutes(),
        second   = now.getSeconds(),
        datetime = '';
    if(month.toString().length == 1) { month = '0'+month; }
    if(day.toString().length == 1) { day = '0'+day; }   
    if(hour.toString().length == 1) { hour = '0'+hour; }
    if(minute.toString().length == 1) { minute = '0'+minute; }
    if(second.toString().length == 1) { second = '0'+second; }   
    datetime = year+'/'+month+'/'+day+' '+hour+':'+minute+':'+second;   
    return datetime;
};
helper.log = function() { 
    var arr = Array.prototype.slice.call(arguments), result = [], arg, i, l = arr.length;

    for ( i = 0; i < l; i++ ) {
        arg = arr[i];
        result.push(typeof arg === 'object' ? JSON.stringify(arg) : arg);
    }

    console.log(helper.getTime() + ': ' + result); 
};