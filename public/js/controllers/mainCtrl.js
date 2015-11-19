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
    $scope.prefixes = ['s1'];
    $scope.reply = null;
    $scope.sessionReplies = [];
    $scope.parsedYear = 1960;
    $scope.realYear = '';
    // Timer to prevent spamclicking of questions
    $scope.qTimer = false;

    /**
     * Function called when going to the next question
     */
    $scope.answer = function () {
        // Check if the qTimer is false, to prevent spam-clicking without waiting for the application to handle everything
        if(!$scope.qTimer && !$scope.questComplete) {
            $scope.qTimer = true;

            // If an answer is selected, store the answer in the $scope.reply variable
            if ($scope.selectedAnswer) {
                $scope.reply = {
                    'residence': hashId,
                    'question': $scope.questions[$scope.q].id,
                    'answers': [
                        {
                            'answer': $scope.selectedAnswer['id'],
                            'input': $scope.realYear
                        }
                    ],
                    'unknown': false
                };
                $scope.selectedIndex = -1;
                
                // If NO answer is selected, select the first answer by default
            } else {

                if(!$scope.realYear && $scope.questions[$scope.q].type == 'slider') {
                    $scope.realYear = '1960';
                }
                
                $scope.reply = {
                    'residence': hashId,
                    'question': $scope.questions[$scope.q].id,
                    'answers': [
                        {
                            'answer': $scope.questions[$scope.q].answers[0]['id'],
                            'input': $scope.realYear
                        }
                    ],
                    'unknown': true
                };

                $scope.realYear = '';
                // default
                $scope.select($scope.questions[$scope.q], $scope.questions[$scope.q].answers[0]);

            }
            $scope.selectedAnswer = null;

            // Send the answer to the database, reset timer after this query is completed
            $http.post(api + 'residences/reply', $scope.reply)
                .success(function (data, status, headers, config) {
                    // console.log(data);
                    // console.log($scope.questions[$scope.q]);
                    $scope.qTimer = false;
                })
                .error(function (data, status, headers, config) {
                    console.error(data);
                    $scope.qTimer = false;
                });

            if ($scope.q < $scope.questions.length - 1) {
                $scope.questComplete = false;
                $scope.q++;
            } else {
                $scope.questComplete = true;
            }
        }
    };

    /**
     * Function called when going back 1 question
     */
    $scope.toPreviousQuestion = function () {
        if ($scope.q >= $scope.questions.length - 1 && $scope.questComplete) {
            $scope.questComplete = false;
        } else {
            if ($scope.q > 0) {
                $scope.q--;
            }
        }
    };
    
    /**
     * Function called to construct the image URLs used for decorating the answer buttons, and the house.
     */
    $scope.getImageUrl = function (index) {
        var str = 'assets/';
        
        if($scope.questions[$scope.q].answers[0].image == 'y') {
            
            if ($scope.questions[$scope.q].title.length < 2) {
                angular.forEach($scope.prefixes, function (val, key) {
                    if (key <= $scope.q) {
                        str += val;
                    }
                });
                return str + $scope.questions[$scope.q].title + (index + 1) + ".svg";
                
            } else {
                
                if ($scope.questions[$scope.q].title == 'solar') {
                    return str + 's1f1r1-' + $scope.questions[$scope.q].title + '1.svg';
                } else {
                    return str + 's1-' + $scope.questions[$scope.q].title + '.svg';
                }
            }
        }
    };

    /**
     * Function called when selecting an answer.
     * This will also update the prefixes which are needed to build the house.
     */
    $scope.select = function (question, answer) {
        if(question.type != 'slider') {
            $scope.selectedIndex = (answer['id'] - question['answers'][0]['id']);
            $scope.selectedAnswer = answer;
            $scope.sessionReplies[$scope.q] = $scope.selectedIndex;
          
            if(answer.image == 'y') {
               
                var newPrefix = '';

                if ($scope.questions[$scope.q].title.length > 2) {
                    newPrefix += '-';
                }

                newPrefix += $scope.questions[$scope.q].title + ($scope.selectedIndex + 1);

                $scope.prefixes[$scope.q + 1] = newPrefix;
            }
        }
    }

    /**
     * Function called when finishing the questionnaire, and redirect to Tips page
     */
    $scope.finish = function (link) {
        $window.location.href = link;
    };

    /**
     * Function called when sliding the year slider (not used anymore)
     */
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