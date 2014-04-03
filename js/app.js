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
  streamImageWidth = 640;
var streamImageHeight = 480;
var streamImageResolution = streamImageWidth.toString() + "x" + streamImageHeight.toString();

var isSensorConnected = false;
var engagedUser = null;
var cursor = null;
var userViewerCanvasElement = null;
var backgroundRemovalCanvasElement = null;
  Kinect.connect("http://localhost", 8181);
  engagedUser = null;
              function configError(statusText, errorData) {
                console.log((errorData != null) ? JSON.stringify(errorData) : statusText);
            }
// Determine if the specified object has any properties or not
            function isEmptyObject(obj) {
                if (obj == null) {
                    return true;
                }

                var numProperties = 0;

                for (var prop in obj) {
                    if (obj.hasOwnProperty(prop)) {
                        ++numProperties;
                    }
                }

                return numProperties <= 0;
            }
            // property and function used to keep track of when the choose background control panel
            // should be hidden after an inactivity period
            var hidePanelTimeoutId = null;
            function resetHidePanelTimeout() {
                // First clear any previous timeout
                if (hidePanelTimeoutId != null) {
                    clearTimeout(hidePanelTimeoutId);
                    hidePanelTimeoutId = null;
                }

                if (!isSensorConnected || (engagedUser == null)) {
                    // if there is no engaged user or no sensor connected, we hide the choose background
                    // control panel after 10 seconds
                    hidePanelTimeoutId = setTimeout(function () {
                        //setChoosePanelVisibility(false);
                        hidePanelTimeoutId = null;
                    }, 10000);
                }
            }

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
                        console.log("connected");
                        // setCanvasVisibility(userViewerCanvasElement, false);
                        // setCanvasVisibility(backgroundRemovalCanvasElement, false);
                    }
                }

                isSensorConnected = newIsSensorConnected;
                engagedUser = newEngagedUser;

                resetHidePanelTimeout();
            };


            // Show or hide the cursor
            function setCursorVisibility(isVisible) {
                if (cursor == null) {
                    return;
                }

                if (isVisible) {
                    cursor.show();
                } else {
                    cursor.hide();
                }
            }

            // Show or hide a canvas element
            function setCanvasVisibility(canvasElement, isVisible) {
                if (canvasElement == null) {
                    return;
                }

                var canvasQuery = $(canvasElement);

                if (isVisible) {
                    if (!canvasQuery.hasClass("showing")) {
                        // Clear canvas before showing it
                        var canvasContext = canvasElement.getContext("2d");
                        canvasContext.clearRect(0, 0, streamImageWidth, streamImageHeight);
                    }

                    canvasQuery.addClass("showing");
                } else {
                    canvasQuery.removeClass("showing");
                }
            }



});



