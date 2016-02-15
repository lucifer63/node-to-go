var helper = exports;

helper.test = function(f,k,q) {
    var k = k || 50, a = [], sum = 0;
    for (i=0;i<k;i++) {
        var start = Date.now();
        f();
        a.push(Date.now() - start);
    }
    a.map(function(el){sum+=el});
    console.log('\nf() was executed ' + k + ' times');
    console.log('\nAverage time is ' + sum/a.length);
    console.log('\nTotal time is ' + sum);
}
helper.wrap = function(wrapper,attributes,text) { 
    if (typeof attributes == 'object') {
        string = '';
        for (var i in attributes) { string += ' ' + i + ((attributes[i].length == 0) ? '' : '=\"' + attributes[i] + '\"'); }
        attributes = string;
    }
    else { text = attributes; attributes = ''; }
    return '<' + wrapper + attributes + '>\n' + ((text) ? text + '\n</' + wrapper + '>\n' : ''); 
}
helper.getTime = function() {
    var now     = new Date(); 
    var year    = now.getFullYear();
    var month   = now.getMonth()+1; 
    var day     = now.getDate();
    var hour    = now.getHours();
    var minute  = now.getMinutes();
    var second  = now.getSeconds(); 
    if(month.toString().length == 1) { var month = '0'+month; }
    if(day.toString().length == 1) { var day = '0'+day; }   
    if(hour.toString().length == 1) { var hour = '0'+hour; }
    if(minute.toString().length == 1) { var minute = '0'+minute; }
    if(second.toString().length == 1) { var second = '0'+second; }   
    var datetime = year+'/'+month+'/'+day+' '+hour+':'+minute+':'+second;   
    return datetime;
}
helper.log = function() { 
    var arr = Array.prototype.slice.call(arguments), result = [], arg, i, l = arr.length;

    for ( i = 0; i < l; i++ ) {
        arg = arr[i];
        result.push(typeof arg === 'object' ? JSON.stringify(arg) : arg);
    }

    console.log(helper.getTime() + ': ' + result); 
}