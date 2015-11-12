'use strict';

app.controller('TipCtrl', ['$scope', '$http', '$resource', '$localStorage', '$window', function($scope, $http, $resource, $localStorage, $window) {
    var api = app.api;
    var residence = localStorage.getItem('residence');
    var hashId = localStorage.getItem('hash');
    $scope.hashId = hashId;
    $scope.tips = [];
    $scope.answers = [];
    $scope.loading = true;
    $scope.error = false;
    $scope.score = {};

    // If we have a residence in localstorage, load the answers and generate personalized tips
    if(hashId != null) {
        // Get residence from api
        $http.get(api + 'residences/answers/' + hashId)
            .success(function(data, status, headers, config) {
                $scope.answers = data[0];
                $scope.loading = false;
                $scope.error = false;

                calculateScore(data[0]);

                console.log(data);
            })
            .error(function(data, status, headers, config) {
                $scope.loading = false;
                $scope.error = true;
                console.error(data);
            });

    } else { // If we don't have a residence, show general tips?

    }


    function calculateScore(d) {
        var totaal = 0;
        for(var i = 0; i < d.replies.length; i++) {
            if(d.replies[i].real_answers[0].input) {
                // Do stuff to calculate year score
                var y = d.replies[i].real_answers[0].input;
                var scor = 0;

                if(y <= 1920) {
                    scor = 1;
                } else if (y <= 1945) {
                    scor = 2;
                } else if (y <= 1970) {
                    scor = 3;
                } else if (y <= 1985) {
                    scor = 4;
                } else if (y <= 1995) {
                    scor = 5;
                } else if (y <= 2005) {
                    scor = 6;
                } else {
                    scor = 7;
                }

                d.replies[i].real_answers[0].answer.weight = scor;

                totaal += scor;

            } else {
                totaal += d.replies[i].real_answers[0].answer.weight;
            }

            // Define colours for the tips boxes on the tips page.
            var w = d.replies[i].real_answers[0].answer.weight;
            var x = d.replies[i].real_answers[0];
            if(w <= 1) {
                x.colour = 'panel-danger';
            } else if(w <= 3) {
                x.colour = 'panel-warning'
            } else {
                x.colour = 'panel-success'
            }
        }
        // Summation of all the answer weights, on which we will base our enery label calculations on
        $scope.score.totaal = totaal;

        if($scope.score.totaal <= 6 ) {
            $scope.score.label = 'G';
        } else if($scope.score.totaal <= 8) {
            $scope.score.label = 'F';
        } else if($scope.score.totaal <= 10) {
            $scope.score.label = 'E';
        } else if($scope.score.totaal <= 12) {
            $scope.score.label = 'D';
        } else if($scope.score.totaal <= 14) {
            $scope.score.label = 'C';
        } else if($scope.score.totaal <= 16) {
            $scope.score.label = 'B';
        } else {
            $scope.score.label = 'A';
        }
    }

}]);