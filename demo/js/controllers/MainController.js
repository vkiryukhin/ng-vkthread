

angular.module('myApp')
       .controller('MainController',['$scope',
  function($scope){


  $scope.activeTab = 'html/overview.html';
  $scope.activeTabMenu = 'overview';

  $scope.onClickTab = function(page) {

    switch(page){
      case 'api':
        $scope.activeTab = 'html/api.html';
        $scope.activeTabMenu = 'api';
        break;
      case 'examples':
        $scope.activeTab = 'html/examples.html';
        $scope.activeTabMenu = 'examples';
        break;
      default:
        $scope.activeTab = 'html/overview.html';
        $scope.activeTabMenu = 'overview';
    }

  };
$scope.colorIt = function(){Rainbow.color();};


}]);
