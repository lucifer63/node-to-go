/* jshint node: true */
var macfromip = exports;

var cp = require('child_process');

var MACADDRESS_LENGTH = 17;

macfromip.getMacInWin32 = function(ipAddress, callback){
    
    var ls = cp.exec('ping  ' + ipAddress + ' -n 1',
      function(error, stdout, stderr) {
        if (error !== null) {
          callback('exec error: ' + error);
        }
        if (stderr !== null && stderr !== '') {
          callback('stderr: ' + stderr);
        }

        var ls2 = cp.exec('arp -a',
          function(error2, stdout2, stderr2) {
            if (error2 !== null) {
              callback('exec error: ' + error2);
            }
            if (stderr2 !== null && stderr2 !== '') {
              callback('stderr: ' + stderr2);
            }

            stdout2 = (stdout2.substring(stdout2.indexOf(ipAddress) + 22)).substring(MACADDRESS_LENGTH, 0);
            callback(stdout2);
          });
      });
};

macfromip.getMac = function(ipAddress,callback) {
    macfromip.getMacInWin32(ipAddress,function(result) {
        console.log(ipAddress +' : '+ result);
    });
};

macfromip.getARP = function(callback) {
    cp.exec('chcp 437');
    var ls = cp.exec( 'FOR /L %i in (1,1,43) do @ping 192.168.1.%i -n 1 -w 2000 | find \"Reply\"' , 
        function(error, stdout, stderr) {
            if (stderr !== null && stderr !== '') {
                callback('stderr: ' + stderr);
            }
            var arr = stdout.split(/\r\n/g),obj = {};
            arr.pop();
            arr = arr.filter(function(el){return el.indexOf('unreachable') == -1;});
            arr.forEach(function(el,i) {arr[i] = el.substring(el.indexOf('from')+5,el.indexOf(':'));});
            callback(arr);
        });
};
