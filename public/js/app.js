'use strict';

/**
 * Base angular module ('app')
 * Only contains a directive to build the house image as seen in the questionnaire
 */
var api = 'api/';

var app = angular.module('app', ['ngResource', 'ngStorage'], function($interpolateProvider) {
    $interpolateProvider.startSymbol('<%');
    $interpolateProvider.endSymbol('%>');

    app.api = api;
});

app.directive('building', function()
{
  return {
    restrict: 'A',
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
          var str = '';
          element.html('');
          angular.forEach(newVal, function (val, key) {
            if(val.length < 3) {
              str += val;
              element.append('<img src="assets/' + str + '.svg" />');
            } else {
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
