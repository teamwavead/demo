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

$(document).ready(function () {
  Kinect.connect("http://localhost", 8181);
  engagedUser = null;

  sensor = Kinect.sensor(Kinect.DEFAULT_SENSOR_NAME, function (sensorToConfig, isConnected) {
                if (isConnected) {
                    // Determine what is the engagement state upon connection
                    sensorToConfig.getConfig(function (data) {
                        var engagedUserId = findEngagedUser(data[Kinect.INTERACTION_STREAM_NAME].userStates);

                        updateUserState(true, engagedUserId, sensorToConfig);
                    });
                } else {
                    updateUserState(false, engagedUser, sensorToConfig);
                }
            });


  // Get the id of the engaged user, if present, or null if there is no engaged user
  function findEngagedUser(userStates) {
      var engagedUserId = null;

      for (var i = 0; i < userStates.length; ++i) {
          var entry = userStates[i];
          if (entry.userState == "engaged") {
              engagedUserId = entry.id;
              break;
          }
      }
      console.log("engagedUserId")
      console.log(engagedUserId);

      return engagedUserId;
  };
  var delayedConfigTimeoutId = null;
            function updateUserState(newIsSensorConnected, newEngagedUser, sensorToConfig) {
                var hasEngagedUser = engagedUser != null;
                var newHasEngagedUser = newEngagedUser != null;

                // If there's a pending configuration change when state changes again, cancel previous timeout
                if (delayedConfigTimeoutId != null) {
                    clearTimeout(delayedConfigTimeoutId);
                    delayedConfigTimeoutId = null;
                }

                if ((isSensorConnected != newIsSensorConnected) || (engagedUser != newEngagedUser)) {
                    if (newIsSensorConnected) {

                        var immediateConfig = {};
                        var delayedConfig = {};
                        immediateConfig[Kinect.INTERACTION_STREAM_NAME] = { "enabled": true };
                        immediateConfig[Kinect.USERVIEWER_STREAM_NAME] = { "resolution": streamImageResolution };
                        immediateConfig[Kinect.BACKGROUNDREMOVAL_STREAM_NAME] = { "resolution": streamImageResolution };

                        setCursorVisibility(newHasEngagedUser);
                        setCanvasVisibility(userViewerCanvasElement, !newHasEngagedUser);
                        setCanvasVisibility(backgroundRemovalCanvasElement, newHasEngagedUser);

                        if (newHasEngagedUser) {
                            immediateConfig[Kinect.BACKGROUNDREMOVAL_STREAM_NAME].enabled = true;
                            immediateConfig[Kinect.BACKGROUNDREMOVAL_STREAM_NAME].trackingId = newEngagedUser;

                            delayedConfig[Kinect.USERVIEWER_STREAM_NAME] = { "enabled": false };
                        } else {
                            immediateConfig[Kinect.USERVIEWER_STREAM_NAME].enabled = true;

                            if (hasEngagedUser) {
                                delayedConfig[Kinect.BACKGROUNDREMOVAL_STREAM_NAME] = { "enabled": false };
                            }
                        }

                        // Perform immediate configuration
                        sensorToConfig.postConfig(immediateConfig, configError);

                        // schedule delayed configuration for 2 seconds later
                        if (!isEmptyObject(delayedConfig)) {
                            delayedConfigTimeoutId = setTimeout(function () {
                                sensorToConfig.postConfig(delayedConfig, configError);
                                delayedConfigTimeoutId = null;
                            }, 2000);
                        }
                    } else {
                        setCursorVisibility(false);
                        setCanvasVisibility(userViewerCanvasElement, false);
                        setCanvasVisibility(backgroundRemovalCanvasElement, false);
                    }
                }

                isSensorConnected = newIsSensorConnected;
                engagedUser = newEngagedUser;

                resetHidePanelTimeout();
            };

});



