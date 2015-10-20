'use strict';

var app = angular.module('app', ['ngResource', 'ngStorage'], function($interpolateProvider) {
  $interpolateProvider.startSymbol('<%');
  $interpolateProvider.endSymbol('%>');
});
app.controller('MainCtrl', ['$scope', '$http', '$resource', '$localStorage', '$window', function($scope, $http, $resource, $localStorage, $window) {

  // You will have to change this url to the url of the api
  var api = 'http://localhost:82/plong/public/api/';

  var residence = localStorage.getItem('residence');
  console.log(residence);

  $http.post(api + 'residences', residence)
  .success(function(data, status, headers, config) {
    residence = data.residence;
    console.log(residence);
  })
  .error(function(data, status, headers, config) {
    console.error(data);
  });

  // Instanciate local storage
  // $scope.store = $localStorage;

  // Get questions from api
  var Question = $resource(api + 'questions');
  $scope.questions = Question.query();

  // Get residence from api
  // Development hashid is filled in
  // var Residence = $resource(api + 'residences/4g3j5b80j8ed061');
  // $scope.residence = Residence.query();
  // console.log($scope.residence);

  var hashId = '4g3j5b80j8ed061';
  // current selected question
  $scope.q = 0;
  $scope.questComplete = false;

  $scope.selectedIndex = null;
  $scope.selectedAnswer = null;
  $scope.prefixes = ["s1"];
  $scope.reply = null;
  $scope.sessionReplies = [];

  $scope.answer = function () {

    if ($scope.selectedAnswer) {
      $scope.reply = {
        "residence": hashId,
        "question": $scope.questions[$scope.q].id,
        "answers": [
          {
            "answer": $scope.selectedAnswer['id'],
            "input": null
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
            "answer": null,
            "input": null
          }
        ],
        "unknown": true
      };
      // default
      $scope.select($scope.questions[$scope.q], $scope.questions[$scope.q].answers[0]);
    }

      console.log( $scope.sessionReplies);
      console.log("DURIDUM2");
      console.log($scope.reply);


    $http.post(api + 'residences/reply', $scope.reply)
    .success(function(data, status, headers, config) {
      console.log(data);
    })
    .error(function(data, status, headers, config) {
      console.error(data);
    });
    if ($scope.q < $scope.questions.length-1) {
      $scope.questComplete = false;
      $scope.q++;
    } else {
        $scope.questComplete = true;
    }
  };

  $scope.toPreviousQuestion = function()
  {
    if($scope.q >= $scope.questions.length-1 && $scope.questComplete) {
        $scope.questComplete = false;
    } else {
        if($scope.q > 0)
        {
            $scope.q--;
        }
    }
  };

  $scope.getImageUrl = function(index) {
    var str = "assets/";
    if($scope.questions[$scope.q].title.length < 2) {
      angular.forEach($scope.prefixes, function (val, key) {
        if(key <= $scope.q) {
          str += val;
        }
      });
      return str + $scope.questions[$scope.q].title + (index + 1) + ".svg";
    }
    else {
      if($scope.questions[$scope.q].title == 'solar'){
        return str + "s1f1r1-" + $scope.questions[$scope.q].title + "1.svg";
      } else {
        return str + "s1-" + $scope.questions[$scope.q].title + ".svg";
      }
    }
  };

  $scope.select = function(question, answer){
    $scope.selectedIndex = (answer['id'] - question['answers'][0]['id']);
    $scope.selectedAnswer = answer;
    $scope.sessionReplies[$scope.q] = $scope.selectedIndex;

    var newPrefix = "";
    if($scope.questions[$scope.q].title.length > 2) {
      newPrefix += "-";
    }
    newPrefix += $scope.questions[$scope.q].title + ($scope.selectedIndex + 1);
    if($scope.prefixes.length > $scope.q) {
      $scope.prefixes[$scope.q + 1] = newPrefix;
    }
    else {
      $scope.prefixes.push(newPrefix);
    }
  }

    $scope.finish = function(link)
    {
        $window.location.href = link;
    };

}
]);

app.directive('building', function()
{
  return {
    restrict: "A",
    scope: {
      'prefixes': '='
    },
    link: function(scope, element, attr)
    {
      scope.$watch(function() {
        return scope.prefixes;
      },
      function(newVal, oldVal) {
        if(newVal) {
          var str = "";
          element.html("");
          angular.forEach(newVal, function (val, key) {
            if(val.length < 3) {
              str += val;
              element.append('<img src="assets/' + str + '.svg" />');
            }
            else {
              if(val.indexOf('solar') > -1) {
                element.append('<img src="assets/s1f1r1-'+ str + '1.svg" />');
              } else {
                element.append('<img src="assets/s1' + val + '.svg" />');
              }
            }
          });
        }
      }, true);

    }
  };
});
