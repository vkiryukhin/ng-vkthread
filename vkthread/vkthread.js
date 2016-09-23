/**
* ng-vkThread is angular plugin to execute javascript function(s) in a thread.
*
* https://github.com/vkiryukhin/ng-vkthread
* http://www.eslinstructor.net/ng-vkthread/demo/
*
* @version: 2.5.0
* The MIT License (MIT)
*
* @author: Vadim Kiryukhin ( vkiryukhin @ gmail.com )
*
* Copyright (c) 2016 Vadim Kiryukhin
*/

/* jshint maxlen:false */

(function (angular) {
 'use strict';
    /**
     * This is a fragment of JSONfn plugin ( https://github.com/vkiryukhin/jsonfn )
     * JSONfn extends JSON.stringify() functionality and makes possible to stringify
     * objects with functions and regexp.
     */
 	var JSONfn = {
	    stringify:function (obj) {
	      return JSON.stringify(obj, function (key, value) {
	        var fnBody;
	      if (value instanceof Function || typeof value === 'function') {
	
	        fnBody = value.toString();
	
	        if (fnBody.length < 8 || fnBody.substring(0, 8) !== 'function') { //this is ES6 Arrow Function
	          return '_NuFrRa_' + fnBody;
	        }
	        return fnBody;
	      }
	      if (value instanceof RegExp) {
	        return '_PxEgEr_' + value;
	      }
	      return value;
	      });
	    }
	  };

    var workerJs = '(function(){var JSONfn={parse:function(str,date2obj){var iso8061=date2obj?/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/:false;return JSON.parse(str,function(key,value){var prefix,func,fnArgs,fnBody;if(typeof value!=="string")return value;if(value.length<8)return value;prefix=value.substring(0,8);if(iso8061&&value.match(iso8061))return new Date(value);if(prefix==="function")return eval("("+value+")");if(prefix==="_PxEgEr_")return eval(value.slice(8));if(prefix==="_NuFrRa_"){func=value.slice(8).trim().split("=>");fnArgs=func[0].trim();fnBody=func[1].trim();if(fnArgs.indexOf("(")<0)fnArgs="("+fnArgs+")";if(fnBody.indexOf("{")<0)fnBody="{ return "+fnBody+"}";return eval("("+"function"+fnArgs+fnBody+")")}return value})}};onmessage=function(e){var obj=JSONfn.parse(e.data,true),cntx=obj.context||self;if(obj.importFiles)importScripts.apply(null,obj.importFiles);if(typeof obj.fn==="function")if(typeof Promise!=="undefined")Promise.resolve(obj.fn.apply(cntx,obj.args)).then(function(data){postMessage(data)})["catch"](function(reason){postMessage(reason)});else postMessage(obj.fn.apply(cntx,obj.args));else postMessage(self[obj.fn].apply(cntx,obj.args))};function vkhttp(cfg){var body=cfg.body?JSON.stringify(cfg.body):null,contentType=cfg.contentType||"application/json",method=cfg.method?cfg.method.toUpperCase():"GET",xhr=new XMLHttpRequest,ret;xhr.onload=function(){if(xhr.status>=200&&xhr.status<300)ret=xhr.responseText;else ret="Error: "+xhr.status+xhr.statusText};xhr.onerror=function(data){ret=xhr.status+xhr.statusText};xhr.open(method,cfg.url,false);if(method==="POST")xhr.setRequestHeader("Content-Type",contentType);xhr.send(body);return ret}})();';
    var workerBlob = new Blob([workerJs], {type: 'application/javascript'});
    /**
     * Angular Provider function
     */
    var VkthreadProvider = function(){

        this.$get = function($q){

            var VkThread = function(){
                this.version = '2.5.0';
                this.getVersion = function(){
                    return this.version;
                };
            };

          /**
           *   Execute function in a thread.
           *
           *    @param -- object;
           *
           *    @param object has following attributes
           *
           *      @fn          - function to execute                (mandatory)
           *      @args        - array of arguments for @fn          (optional)
           *      @context     - object which will be 'this' for @fn (optional)
           *      @importFiles - array of strings                    (optional)
           *                     each string is a path to a file, which @fn depends on.
           */
            VkThread.prototype.exec = function(param){
                var worker = new Worker(window.URL.createObjectURL(workerBlob)),
                    dfr = $q.defer();

                worker.onmessage = function (oEvent) {
                    dfr.resolve(oEvent.data);
                    worker.terminate();
                };

                worker.onerror = function(error) {
                    dfr.reject(new Error('Worker error: ' + error.message));
                    worker.terminate();
                };

                worker.postMessage(JSONfn.stringify(param));
                return dfr.promise;
            };

          /**
           *   Execute multiple functions, each in a separate threads.
           *
           *    @args  -- array of @param objects (described above);
           */
            VkThread.prototype.execAll = function(args, cb){

                var promises = [];

                for(var ix=0; ix<args.length; ix++){
                  promises.push( this.exec(args[ix]));
                }

                return $q.all(promises).then(
                  function(values){
                    return values;
                  }
                );
            };

            var vkThread = function() {
               return new VkThread();
            };

         return vkThread;
      };
  };
  angular.module('ng-vkThread', [])
         .provider('vkThread', VkthreadProvider);
})( angular );
