
  app.controller('ExampleController', ['$scope','github', 'examples','$q','vkThread',
    function($scope, github, examples, $q, vkThread){

  var thread = vkThread();


  $scope.onClickTab = function(page) {

    switch(page){
      case 'arguments':
        $scope.activeTab = 'html/arguments.html';
        $scope.activeTabName = 'arguments';
        break;
      case 'context':
        $scope.activeTab = 'html/context.html';
        $scope.activeTabName = 'context';
        break;
      case 'dependency':
        $scope.activeTab = 'html/dependency.html';
        $scope.activeTabName = 'dependency';
        break;
      case 'external':
        $scope.activeTab = 'html/external.html';
        $scope.activeTabName = 'external';
        break;
      case 'multithreading':
        $scope.activeTab = 'html/multithreading.html';
        $scope.activeTabName = 'multithreading';
        break;
      default:
        $scope.activeTab = 'html/arguments.html';
        $scope.activeTabName = 'arguments';
    }

    $scope.search($scope.username);

  };

  $scope.activeTabName = 'arguments';

  $scope.activeTab = 'html/arguments.html';


var onRepos = function(data){
    $scope.repos = data;
  };

  var onError = function(reason){
    $scope.error = "coudn't find user";
  };

  var onComplete = function(data){
    $scope.user = data;
    github.getRepos($scope.user)
                 .then(onRepos, onError);
 };

$scope.search = function(username){
    github.getUser(username)
                 .then(onComplete, onError);
  };


  function search(){

      var deferred = $q.defer();

      var userData = github.getUser($scope.username)
                           .then(
                              function(data){
                                return github.getRepos(data);
                              }
                           ).then(
                              function(data){
                                $scope.repos = data;
                                deferred.resolve();
                              },
                              function(err){
                                onError(err);
                              }
                          );

      return deferred.promise;
  }


  $scope.username = 'vkiryukhin';
  $scope.repoSortOrder = '-stargazers_count';
  $scope.search($scope.username);
  $scope.sortOrderNameDir = '';

  search();

function runWithArgs(){
  search().then(
      function(){_runWithArgs()}
    );
}

function _runWithArgs(){
    var param = {
          fn: examples.twoArgs,
          args: [$scope.repos,
                  { good:'Good Job!',
                    excellent:'Excellent Job!'
                  }
                ]
      };

  thread.exec(param).then(
       function (data) {
           $scope.repos = data;
        },
        function(err) {
            alert(err);
        }
   );
}

function runWithDependency(){
  search().then(
      function(){_runWithDependency()}
    );
}

function _runWithDependency(){

  var param = {
    fn:examples.withDependency,
    args: [ $scope.repos],
    importFiles:['https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js']
  };

  thread.exec(param).then(
       function (data) {
           $scope.repos = data;
        },
        function(err) {
            alert(err);
        }
   );
}

function runWithContext(){
  search().then(
      function(){_runWithContext()}
    );
}

function _runWithContext(){

  function Foo(arr){
      this.myArr = arr;
      this.getFirst = function(){
        function compare(a,b){
          return b.stargazers_count - a.stargazers_count;
        }
        return this.myArr.sort(compare).slice(1,4);
      };
    }


  var foo = new Foo($scope.repos);

  var param = {
    fn:foo.getFirst,
    context:foo
  };

  thread.exec(param).then(
       function (data) {
           $scope.repos = data;
        },
        function(err) {
            alert(err);
        }
   );
}

function runMultiThread(){
  var param1 = {
          fn: examples.basicAjax,
          args: [{url: 'https://api.github.com/users/angular/repos'}]
  			

      },
      param2 = {
          fn: examples.basicAjax,
          args: [{url: 'https://api.github.com/users/vkiryukhin/repos'}]

      }

  thread.execAll([param1,param2]).then(
      function (data) {
        $scope.repos = data[0].concat(data[1]);
      },
      function(err) {
        alert(err);
      }
  );

}

function runFromExternal(){
  search().then(
      function(){_runFromExternal()}
    );
}

function _runFromExternal(){
  var param = {
    fn:'makeNamesUpper',
    args: [ $scope.repos],
    importFiles:['http://localhost/projects/app/ng-vkthread/demo/js/lib/my_utils.js']
  };

  thread.exec(param).then(
       function (data) {
          $scope.repos = data;
        },
        function(err) {
            alert(err);
        }
   );
}

  $scope.runWithArgs = runWithArgs;
  $scope.runWithDependency = runWithDependency;
  $scope.runWithContext = runWithContext;
  $scope.runMultiThread = runMultiThread;
  $scope.runFromExternal = runFromExternal;


}]);
