'use strict';

app.controller('MainCtrl', ['$scope', '$http', '$resource', '$localStorage', '$window', function($scope, $http, $resource, $localStorage, $window) {
    var api = app.api;
    var residence = localStorage.getItem('residence');
    var hashId;
    var Residence;

    // Get residence from api
    $http.post(api + 'residences', residence)
        .success(function (data, status, headers, config) {
            residence = data.residence;
            hashId = residence['hashid'];
            localStorage.setItem('hash', hashId);
            Residence = $resource(api + 'residences/' + hashId);
            $scope.residence = Residence.query();
        })
        .error(function (data, status, headers, config) {
            console.error(data);
        });

    // Get questions from api
    var Question = $resource(api + 'questions');
    $scope.questions = Question.query();

    // current selected question
    $scope.q = 0;
    $scope.questComplete = false;

    $scope.selectedIndex = null;
    $scope.selectedAnswer = null;
    $scope.prefixes = ["s1"];
    $scope.reply = null;
    $scope.sessionReplies = [];
    $scope.parsedYear = 1960;
    $scope.realYear = '';

    $scope.answer = function () {
        if ($scope.selectedAnswer) {
            $scope.reply = {
                "residence": hashId,
                "question": $scope.questions[$scope.q].id,
                "answers": [
                    {
                        "answer": $scope.selectedAnswer['id'],
                        "input": $scope.realYear
                    }
                ],
                "unknown": false
            };
            $scope.selectedIndex = -1;
        } else {
            $scope.reply = {
                "residence": hashId,
                "question": $scope.questions[$scope.q].id,
                "answers": [
                    {
                        "answer": $scope.questions[$scope.q].answers[0]['id'],
                        "input": $scope.realYear
                    }
                ],
                "unknown": true
            };
            // default
           // $scope.select($scope.questions[$scope.q], $scope.questions[$scope.q].answers[0]);
        }
        $scope.selectedAnswer = null;

        $http.post(api + 'residences/reply', $scope.reply)
            .success(function (data, status, headers, config) {
                console.log(data);
                console.log($scope.questions[$scope.q]);
            })
            .error(function (data, status, headers, config) {
                console.error(data);
            });
        if ($scope.q < $scope.questions.length - 1) {
            $scope.questComplete = false;
            $scope.q++;
        } else {
            $scope.questComplete = true;
        }
    };

    $scope.toPreviousQuestion = function () {
        if ($scope.q >= $scope.questions.length - 1 && $scope.questComplete) {
            $scope.questComplete = false;
        } else {
            if ($scope.q > 0) {
                $scope.q--;
            }
        }
    };

    $scope.getImageUrl = function (index) {
        var str = "assets/";
        if ($scope.questions[$scope.q].title.length < 2) {
            angular.forEach($scope.prefixes, function (val, key) {
                if (key <= $scope.q) {
                    str += val;
                }
            });
            return str + $scope.questions[$scope.q].title + (index + 1) + ".svg";
        }
        else {
            if ($scope.questions[$scope.q].title == 'solar') {
                return str + "s1f1r1-" + $scope.questions[$scope.q].title + "1.svg";
            } else {
                return str + "s1-" + $scope.questions[$scope.q].title + ".svg";
            }
        }
    };

    $scope.select = function (question, answer) {
        $scope.selectedIndex = (answer['id'] - question['answers'][0]['id']);
        $scope.selectedAnswer = answer;
        $scope.sessionReplies[$scope.q] = $scope.selectedIndex;

        var newPrefix = "";

        if ($scope.questions[$scope.q].title.length > 2) {
            newPrefix += "-";
        }

        newPrefix += $scope.questions[$scope.q].title + ($scope.selectedIndex + 1);
        if ($scope.prefixes.length > $scope.q) {
            $scope.prefixes[$scope.q + 1] = newPrefix;
        } else {
            $scope.prefixes.push(newPrefix);
        }
    }

    $scope.finish = function (link) {
        $window.location.href = link;
    };

    $scope.setYear = function (a) {
        $scope.realYear = a.v;
        if (a.v <= 1920) {
            $scope.parsedYear = 'Voor 1920';
        } else if (a.v <= 2005) {
            $scope.parsedYear = a.v;
        } else {
            $scope.parsedYear = 'Na 2006'
        }
    }
}]);