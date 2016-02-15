/* jshint node: true */
'use strict';

var macfromip = exports;

var cp = require('child_process');
var os = require('os');

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

            var offset = 22 - ipAddress.length;

            stdout2 = (stdout2.substring(stdout2.indexOf(ipAddress) + (ipAddress.length + offset))).substring(MACADDRESS_LENGTH, 0);
            callback(stdout2);
          });
      });
};

macfromip.getMac = function(ipAddress,hostip,callback) {
  if (ipAddress != hostip) {
      switch(os.platform()){
          case 'win32':
              macfromip.getMacInWin32(ipAddress, function(mac){
                  callback(mac);
              });
          break;

          default:
              callback('Unsupported platform');
          break;
      }
  }
  else {
    cp.exec('getmac',
          function(error2, stdout2, stderr2) {
            if (error2 !== null) {
              callback('exec error: ' + error2);
            }
            if (stderr2 !== null && stderr2 !== '') {
              callback('stderr: ' + stderr2);
            }

            //var offset = 22 - ipAddress.length;

            //stdout2 = (stdout2.substring(stdout2.indexOf(ipAddress) + (ipAddress.length + offset))).substring(MACADDRESS_LENGTH, 0);
            //callback((stdout2.substring(stdout2.indexOf(ipAddress) + (ipAddress.length + offset))).substring(MACADDRESS_LENGTH, 0));
            //callback(stdout2.substr(stdout2.indexOf('-')-2,stdout2.indexOf('-')-2+MACADDRESS_LENGTH));
            callback(stdout2.substring(156,173));
          });
  }
};
