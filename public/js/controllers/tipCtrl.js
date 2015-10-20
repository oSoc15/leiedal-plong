'use strict';

app.controller('TipCtrl', ['$scope', '$http', '$resource', '$localStorage', '$window', function($scope, $http, $resource, $localStorage, $window) {
    var api = app.api;
    var residence = localStorage.getItem('residence');
    var hashId = localStorage.getItem('hash');
    var tips;

    // If we have a residence in localstorage, load the answers and generate personalized tips
    if(hashId != null) {
        // Get residence from api
        $http.get(api + 'residences/answers/' + hashId)
            .success(function(data, status, headers, config) {
                tips = data;
                console.log(data);
            })
            .error(function(data, status, headers, config) {
                console.error(data);
            });

    } else { // If we don't have a residence, show general tips?

    }

}]);