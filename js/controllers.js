// controller.js
var app = angular.module('App');
app.controller('FirstController', ['$scope', '$firebaseAuth', '$http', 'Upload', function ($scope, $firebaseAuth, $http, Upload) {
    $firebaseAuth().$onAuthStateChanged(function (user) {
        console.log(user);
        if (user) {
            $scope.user = user;
        } else {
            $scope.user = null;
        }
    });
    $scope.weather = function () {
        var url = 'https://api.apixu.com/v1/current.json?key=f1555b46f3954e54b2a71106182404&q=Helsingborg';
        $http.get(url)
            .then(function (data) {
                // eftersom vad vi får tillbaka är i data array måste vi skriva så här 
                $scope.data = data.data;
                console.log(data.data);
                $scope.location = data.data.location.name;
                $scope.description = data.data.current.condition.text;
                $scope.image = data.data.current.condition.icon;
                $scope.temp_c = data.data.current.temp_c;
            });
    };

    $scope.weather();

    $scope.upload = function (file) {   
        console.log(file);  
        alert('it works');
        var firebaseRef = firebase.database().ref('users');
       
    
        firebaseRef.child("UserImg").set(file);
        
        var user = firebase.auth().currentUser;
        console.log(user);
        
   

        user.updateProfile({
            photoURL: file
       })
       .then(function (s) {
        console.log(s);
        alert('updated profile');
        
        
       })
       .catch(function (err) {
           console.log(err);
           
       });

    };

    

}]);

app.controller('SignUpController', ['$scope', '$location', '$firebaseAuth', function ($scope, $location, $firebaseAuth) {

    $scope.signUp = function (user) {
        console.log(user);
        $firebaseAuth().$createUserWithEmailAndPassword(user.email, user.password)
            .then(function (fireUser) {
                if (fireUser) {


                    var theUser = firebase.auth().currentUser;
                    theUser.updateProfile({
                        displayName: user.username

                    }).then(function () {

                        //om det är ok

                    }).catch(function (err) {
                        console.log(err);

                    });
                    firebase.database().ref('/users/' + fireUser.uid).set({
                        username: user.username

                    });

                    $location.path('/');

                }

            })
            .catch(function (err) {
                $scope.error = err.message;
            });

    };


}]);
app.controller('LoginController', ['$scope', '$location', '$firebaseAuth', function ($scope, $location, $firebaseAuth) {
    $scope.login = function (user) {
        $firebaseAuth().$signInWithEmailAndPassword(user.email, user.password)
            .then(function (user) {
                $location.path('/')
            })
            .catch(function (err) {
                $scope.error = err.message;
            });

    };

}]);

app.controller('AuthCtrl', ['$scope', '$location', '$firebaseAuth', function ($scope, $location, $firebaseAuth) {
    $firebaseAuth().$onAuthStateChanged(function (user) {


        if (user) {
            $scope.user = user;
        } else {
            $scope.user = null;
        }


    });
    $scope.signOut = function () {
        $firebaseAuth().$signOut();
        $location.path('/');
    };

}]);


app.controller('eventCtrl', ['$scope', '$http', function ($scope, $http) {

    $http.get("https://api.helsingborg.se/event/json/wp/v2/event/").then(function (events) {
        $scope.events = events.data;

        console.log(events);

    });
}]);

//image
app.controller('UploadController', function ($scope, fileReader) {
    $scope.imageSrc = "";

    $scope.$on("fileProgress", function (e, progress) {
        $scope.progress = progress.loaded / progress.total;
    });
});




app.directive("ngFileSelect", function (fileReader, $timeout) {
    return {
        scope: {
            ngModel: '='
        },
        link: function ($scope, el) {
            function getFile(file) {
                fileReader.readAsDataUrl(file, $scope)
                    .then(function (result) {
                        $timeout(function () {
                            $scope.ngModel = result;
                        });
                    });
            }

            el.bind("change", function (e) {
                var file = (e.srcElement || e.target).files[0];
                getFile(file);
            });
        }
    };
});

app.factory("fileReader", function ($q, $log) {
    var onLoad = function (reader, deferred, scope) {
        return function () {
            scope.$apply(function () {
                deferred.resolve(reader.result);
            });
        };
    };

    var onError = function (reader, deferred, scope) {
        return function () {
            scope.$apply(function () {
                deferred.reject(reader.result);
            });
        };
    };

    var onProgress = function (reader, scope) {
        return function (event) {
            scope.$broadcast("fileProgress", {
                total: event.total,
                loaded: event.loaded
            });
        };
    };

    var getReader = function (deferred, scope) {
        var reader = new FileReader();
        reader.onload = onLoad(reader, deferred, scope);
        reader.onerror = onError(reader, deferred, scope);
        reader.onprogress = onProgress(reader, scope);
        return reader;
    };

    var readAsDataURL = function (file, scope) {
        var deferred = $q.defer();

        var reader = getReader(deferred, scope);
        reader.readAsDataURL(file);

        return deferred.promise;
    };

    return {
        readAsDataUrl: readAsDataURL
    };
});










