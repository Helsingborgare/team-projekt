// controller.js
var app = angular.module('App');
app.controller('FirstController', ['$scope', '$firebaseAuth', function ($scope, $firebaseAuth) {
    $firebaseAuth().$onAuthStateChanged(function (user) {
        console.log(user);
        if (user) {
            $scope.user = user;
        } else {
            $scope.user = null;
        }
    })


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












