var app = angular.module('demo', []);

app.config(function ($routeProvider) {
  $routeProvider
  .when('/iphone', {
  templateUrl:'iphone.html'
  })
  .when('/map', {
  templateUrl:'map.html'
  })
  .when('/weather', {
  templateUrl:'weather.html'
  })
  .otherwise({
    templateUrl:'coke.html'
  });
});

app.controller('MainCtrl', function($scope, $rootScope, $location) {
  window.MY_SCOPE = $scope;
  $scope.go = function(path,direction) {
	  //alert(path + ' ' + direction);
      $scope.direction = direction;
      $location.path(path);
  };
  
  $scope.onKeyPress = function ($event) {
      var keyPressed = getKeyboardKeyPressed($event);
      if (keyPressed == 38) {
			showMenu(false);
			return false;
	  } else if (keyPressed == 40) {
			showMenu(true);
			return false;
	  } else if (keyPressed == 37) {
		  	showMenu(false);
		  	goLeft('iphone');
			return false;
	  } else if (keyPressed == 39) {
		  	showMenu(false);
		  	goRight('coke');
			return false;
	  }
  };
  
  var goLeft = function (page) {
	  $scope.go(page, 'left');
  };
  
  var goRight = function (page) {
	  $scope.go(page, 'right');
  };
  
  var getKeyboardKeyPressed = function (keyEvent)
  {
    return  keyEvent.keyCode;
  };
  
  $scope.onMouseDown = function ($event) {
	showMenu(true);
	return false;
	  
  };
  
  
});



