##ng-vkThread 
Angular plugin, which allows you to execute a function in a separate thread.

**Function can be:**

- Regular functions
- Object's methods
- Functions with dependencies
- Functions with context
- Anonymous functions

Plugin is built on HTML5 "Web Worker" technology.

- It is very compact: 1.8k minified / 4.0k development
- Doesn't have any dependecies.

**Basic usage:**

- integrate plugun in your project:
```html
<script src="../vkthread/vkthread.min.js" type="text/javascript"></script>
```
```javascript
var app = angular.module('myApp',['ng-vkThread']);

app.controller('ExampleController', ['$scope', 'vkThread',
  function($scope, vkThread){

  var vkThread = vkThread();

  . . .
}
```
- create function
```javascript
/* function to execute in a thread */
function foo(n, m){ 
	return n + m;
}
```

- execute this function in a thread
```javascript
/* create an object, which you pass to vkThread as an argument*/
var param = {
      fn: foo      // <-- function to execute
      args: [1, 2] // <-- arguments for this function
    };

/* run thread */
vkThread.exec(param).then(
   function (data) {
       console.log(data);  // <-- thread returns 3 
    },
    function(err) {
        alert(err);  // <-- thread returns error message
    }

);
```

######Documentation & Examples: ( http://www.eslinstructor.net/ng-vkthread/demo/ )


