'use strict';

angular.module('app.home', ['ngRoute', 'app.parser'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'home/home.html',
    controller: 'HomeCtrl'
  });
}])
.controller('HomeCtrl',
  ['$scope', '$rootScope', '$location', '$localStorage',
    function($scope, $rootScope, $location, $localStorage) {
      // Initialize
      $scope.storage = $localStorage.$default({
        quizzes: []
      });
      $rootScope.quizzes = $scope.storage.quizzes;
      $rootScope.currentPath = $location.path();
      $rootScope.selectCount = 0;
    }
  ]
);
