process.chdir(__dirname); 

var http = require("http"),
    fs = require('fs'),
    async = require('./js/async.js'),
    arp = require('./js/arp.js'),
    h = require('./js/helper.js');

// this way to decide from what user the query is received, is obviously too simple and shouldn't be used at all
// it was chosen temporary, until i have an opportunity to use DD WRT, which is capable of sending information
// about all LAN users in JSON.
//
// arp.js is hardcoded to scan a certain IP range for the same reason
var users = {
        '192.168.1.11' : 'admin'
    }, 
    mimeTypes = {
        'js'  : 'text/javascript',
        'css' : 'text/css',
        'html': 'text/html',
        'gif' : 'image/gif',
        'jpeg': 'image/jpeg',
        'jpg' : 'image/jpeg',
        'png' : 'image/png',
        'ico' : 'image/x-icon',
        'rar' : 'application/octet-stream',
        'zip' : 'application/octet-stream'
    };

function getUserInfoFrom(request) {
    var ip, index, user;

    if (request.connection.remoteAddress) {
        ip = request.connection.remoteAddress;
        index = ip.lastIndexOf(':');
        if (index !== -1) {
            ip = ip.substr(index+1);
        } 
    } else {
        ip = request.headers['X-Forwarded-For'].split(',')[0];
    }
    user = {    
        name: users[ip] || 'anonym',
        ip: ip,
        agent: request.headers['user-agent']
    };
    return user;
}

var onRequest = function(request,response) {

    /*
    todo - if length of user.ip == 1 then server is called by THIS machine
    else find out is it called by THIS machine, and if not - serve normally
    */

    var user = getUserInfoFrom(request), 
        main = function() {
            var userHtml = '', userCss = '';
            var init = function(callback) {
                response.writeHead(200,{ "Content-Type": "text/html; charset=utf-8" });
                h.log('Request received from '+user.name+' ('+user.ip+') using \"' + user.agent + '\"');
                var html = function(cb) { 
                    fs.readFile('.\\html\\'+ ((user.name == 'anonym')? 'default.html' : user.name+'.html'),'utf8',function(err,data) {
                        if (err) throw err;
                        userHtml += data;
                        cb(null);
                    });
                };
                var css = function(cb) { 
                    fs.readFile('.\\css\\default.css','utf8',function(err,data) {
                        if (err) throw err;
                        userCss += data;
                        cb(null);
                    });
                };

                userHtml += "<div><p>SAME RESULT HERE (())</p></div>";
                async.parallel([html,css],function(err){
                    if (err) throw err;
                    callback(null);
                });
            },
            write = function(callback) {
                response.write(
                '<!DOCTYPE html>\n'+ 
                h.wrap('html',{lang:'en'},
                    h.wrap('head',
                        h.wrap('meta',{charset:"utf-8"})+
                        h.wrap('meta',{content:'IE=edge','http-equiv':'X-UA-Compatible'})+
                        h.wrap('meta',{content:'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',name:'viewport'})+
                        h.wrap('meta',{content:'Just a little web page, Node.js',name:'description'})+
                        h.wrap('meta',{content:'lazalu68@gmail.com',name:'author'})+
                        h.wrap('title','Homepage')+
                        h.wrap('style',userCss)
                    )+
                    h.wrap('body',{id:'main'},
                        userHtml
                    )
                ));
                callback(null);
            };
            async.series([init,write], function(err) {
                if (err) throw err;
                response.end();
                h.log('Request processed succesfully');
            });
        }, list = function() {
            var rand = Math.ceil(Math.random()*10), result = [], i;

            // that's just what i need - global 'last_number' with a lifespan of a server uptime
            if (typeof last_number === 'undefined') last_number = 1;

            for ( i = 0; i < rand; i++ ) {
                last_number++;
                result.push({
                    name: 'test name #' + last_number,
                    description: 'here is the description of article #' + last_number,
                    code: rand,
                    id: last_number
                });
            }

            response.write(JSON.stringify({ 'result': result }));
            response.end();
            h.log('List info has been served succesfully');
        }, mime, url = request.url.substr(1).split('/').filter(String), 
        last_url_part = url[url.length-1], url_f_extension, url_options, url_destination, index;

    // parsing url, extracting every possible info - url structure, destination, file extension, options
    if (url.length) {
        index = last_url_part.lastIndexOf('?');
        if (index !== -1) {
            url_destination = last_url_part.substring(0, index);
            url_options = {};
            last_url_part.substring(index + 1).split('&').forEach( function(el) {   
                var temp = el.split('=');
                url_options[temp[0]] = temp[1] || true;
            } );
            index = url_destination.lastIndexOf('.');
            if (index !== -1) {
                url_f_extension = url_destination.substring(index + 1);
            } 
        } else {
            url_destination = last_url_part;
            index = url_destination.lastIndexOf('.');
            if (index !== -1) {
                url_f_extension = url_destination.substring(index + 1);
            }
        }    
    }

    // making decision on what to serve according to url - file or page
    if (url_f_extension) {
        mime = mimeTypes[url_f_extension];
        if (request.headers.referer) { browser = ' (browser inititated request, referer: \"' + request.headers.referer + '\")';} else { browser = '';}
        h.log('User '+user.name+' ('+user.ip+') has requested the file: \".' + request.url + '\"' + browser); 
        if (mime) { 
            fs.readFile('.' + request.url,function(err,file) {
                if (err) {
                    response.writeHead(404,{ "Content-Type": mime });
                    h.log('\"' + request.url + '\": there\'s no such file.' + browser);
                    if (mime.split('/')[0] == 'image') {
                        var b64string = 'iVBORw0KGgoAAAANSUhEUgAAADoAAAANCAYAAAD4xH09AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAADRSURBVEhL5VZBDoMwDIM9gTO7jf8/iOPO8AUmIxmFLGkj0cFEe0EkTWo7rqCd+tfSVLBaEO3e462pzs+heVzNECBSK5eP4r+caA5oKbdt1tXK8QAvDoAyJwEhLut1juQQT/XnGR4WKZLVC3nGdxNF0FLQi7NRVHUKoPul+uuJy71Wnc6z/pB1qVape5SzcSQPLBaeQ0Q50QiAs/ZwotplIaKeSl6cd8u6f6z5hQukw76w4Tt6l6W58B3P0ETPsl2Jc6RjpH2r+TNaiZZQ8t97fAD44l4XVFBbIgAAAABJRU5ErkJggg==';
                        response.end(new Buffer(b64string,'base64'),'binary');
                    } else {
                        response.end('404 No such file');
                    }
                } else {
                    response.writeHead(200, {'Content-Type': mime });
                    response.end(file,'binary');
                    h.log('User '+user.name+' ('+user.ip+') has downloaded the file \".' + request.url + '\" successfully' + browser);
                }
            });
        } else {
            response.writeHead(200,{ "Content-Type": 'text/plain'}); 
            response.end('Sorry, access is forbidden to this file type: \".' + url_f_extension + '\"');
            h.log('User '+user.name+' ('+user.ip+') has been prevented from downloading file of this type: \"'+request.url+'\"' + browser); 
        }
    } else { 
        if (url.length === 1 && url_destination === 'list') {
            list();
        } else {
            main();
        }
    }
};

server = http.createServer(onRequest).listen(80);
h.log("Server has started");

arp.getARP(function(res) { h.log(JSON.stringify(res)); });