window.onload = function() {
  // if url is based on IP - it should be correct uri, e.g. http://192.168.1.11/
  window.list_base = document.location.origin + '/list'; 
  window.root = document.querySelector('ul.Container');
      
  var rootExists = 0;

  window.join = function(obj,t1,t2) {
    var result = [], t1 = t1 || '=', t2 = t2 || '&';
    for (attr in obj) {
        result.push(attr+t1+obj[attr]);
    }
    return result.join(t2);
  };
  window.getXmlHttp = function() {
    var xmlhttp;
    try {
      xmlhttp = new ActiveXObject('Msxml2.XMLHTTP');
    } catch (e) {
      try {
        xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
      } catch (E) {
        xmlhttp = false;
      }
    }
    if (!xmlhttp && typeof XMLHttpRequest != 'undefined') {
      xmlhttp = new XMLHttpRequest();
    }
    return xmlhttp;
  }

  window.query = function(args) {
    if (!args) {
      var args = 0;
    }
    var url = args.url || '',
        options = (typeof args.options == 'object') ? '?' + join(args.options) : '',
        xhr = getXmlHttp();
        
    xhr.open('GET',url + options, true);
    var timeout = setTimeout( function(){ 
      xhr.abort();
      console.log('Query canceled due to timeout');
    }, 10000);

    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        window.clearTimeout(timeout);
        if (xhr.status == 200) {
          try {
            result = JSON.parse(xhr.responseText).result;
            if (typeof args.cb == 'function') 
              args.cb(args.target,result);
            else {
              console.log('Loading finished, no callback passed, so nothing to be done with results.');
            }
          } catch (e) {
            console.log('Failed to parse xhr.ResponseText. Incorrect response format? ',xhr.responseText);
          }
        } else if (xhr.status == 404) {
          console.log(xhr.responseURL + ' is not found!');
        } else {
          console.log('Request to ' + xhr.responseURL + ' has failed! Error code: ' + xhr.status);
        }
      }
    };
    xhr.send(null);
  }

  window.makeList = function (target,data) {
    if (data.length > 0) {
      var arr = data, result = '';
      for (i=0;i<arr.length;i++) {
        result += '<li data-code=\"' + arr[i].code + '\" id=\"' + arr[i].id + '\" class=\"Node ' + ((i==arr.length-1) ? 'IsLast ' : '') + ((rootExists) ? '' : 'IsRoot ') + 'ExpandClosed \"><div class=\"Expand\"></div><div class=\"Content\">'+arr[i].name+ ((arr[i].description.length>1) ? '<div class=\"Description\">'+arr[i].description+'</div>' : '') + '</div><ul class=\"Container\"></ul></li>';
      }
      target.innerHTML = result;
      
      if (rootExists) {
        target.parentElement.addEventListener('click', function() {
          var children = target.querySelectorAll('ul.Container > li');
          for (j=0;j<children.length;j++) {
            loadChildrenOf(children[j]);
          }
          this.removeEventListener('click',arguments.callee,false);
        })
      }
    } else {
      console.log('No data passed');
    }
  }

  window.loadChildrenOf = function (target) {
    query({
      url : list_base,
      options: { parent: target.getAttribute('id') },
      cb : makeList,
      target: target.querySelector('ul.Container')
    })
  }

  window.init = function() {
    query({
      url: list_base,
      cb: function() {
        makeList.apply(null,arguments);
        for (i=0;i<root.childNodes.length;i++) {
          loadChildrenOf(root.childNodes[i]);
        }
        rootExists = 1;
      },
      target: root
    })

    root.addEventListener('click', function() {
      tree_toggle(arguments[0])
    })
  } 
  init();
}












