app.factory('github', ['$http', function($http){  
    var getUser = function(username){
      return $http.get("https://api.github.com/users/"+username)
      //return $http.get("person.json")
                  .then(function(response){
                    return response.data;
                  });
    };
    
    var getRepos = function(user){
        return  $http.get(user.repos_url)
        //return  $http.get("repos.json")
         .then(function(response){
            return response.data;
          });

    };
    
    return {
      getUser: getUser,
      getRepos: getRepos
    };
}]);
  
