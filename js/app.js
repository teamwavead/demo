var app = angular.module('demo', []);

app.config(function ($routeProvider) {
  $routeProvider
  .when('/map', {
  templateUrl:'map.html'
  })
  .when('/ad', {
    templateUrl:'mac.html'  
  })
  .when('/game', {
    templateUrl:'game.html'  
  })
  .when('/trailler', {
    templateUrl:'trailler.html'  
  })
  .when('/macys', {
    templateUrl:'macys.html'  
  })
  .otherwise({
    templateUrl:'dashboard.html'
  });
});

app.controller('MainCtrl', function($scope, $rootScope, $location) {
  $scope.go = function(path,direction) {
      if(direction == 'top' || direction == 'bottom') {
        path = '/dashboard';
      } else if(path=='ad') {
        $scope.nextPage = '/macys';
      } else if(path=='/macys') {
        $scope.nextPage = 'ad';
      } else {
        $scope.nextPage = '/dashboard';
      }
      $scope.direction = direction;
      //$scope.addMov(direction);
      $location.path(path);
  };
  $scope.movs = [];
  
  /**var fb = new Firebase('https://boiling-fire-1817.firebaseio.com');
  fb.on('value', function(snapshot) {
    $scope.movs = [];
    snapshot.forEach(function(childSnapshot) {
      var childData = childSnapshot.val();
      $scope.movs.push({direction:childData.direction});                       
    });
  });
  
  $scope.addMov = function (dir) {
    $scope.movs.push({direction:dir});
    fb.push({direction:dir});
  };
  **/
  
});



