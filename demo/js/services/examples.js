
app.factory('examples', ['$http', function($http){



  function basicAjax(url) {

    var httpRequest = new XMLHttpRequest(),
        result;

    httpRequest.onreadystatechange = function(){
      if (httpRequest.readyState === 4) {
        if (httpRequest.status === 200) {
          result = JSON.parse(httpRequest.responseText);
        } else {
          result = 'There was a problem with the request.';
        }
      }
    };

    // IMPORTANT: ajax must perform the operation synchronously
    // (the 3-rd arg is false); as ajax is executed in a thread, it's OK.
    httpRequest.open('GET', url, false);
    httpRequest.send();

    function compare(a,b){
      return b.stargazers_count - a.stargazers_count
    }

    return result.sort(compare).slice(0,5);
  }


  function oneArg(arr){

    function isGreateFifty(value){
        return value.stargazers_count > 20;
    }

    return arr.filter(isGreateFifty);
  }

  function twoArgs(arr, msgs){

    function isGreateFifty(value){
        return value.stargazers_count > 50;
    }

    function msg(obj){
      obj.language = obj.stargazers_count > 70 ? msgs.excellent : msgs.good;
      return obj;
    }

    return arr.filter(isGreateFifty).map(msg);
  }

  function withDependency(arr){
      var ret = [];

      function compare(a,b){
        return b.stargazers_count - a.stargazers_count
      }

      arr.sort(compare)
      ret.push(_.first(arr));
      ret.push(_.last(arr));
      return ret;
  }

  return {
      basicAjax: basicAjax,
      twoArgs: twoArgs,
      withDependency:withDependency
    };
  }]);

