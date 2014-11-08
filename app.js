'use strict';

// Declare app level module which depends on views, and components
angular.module('app', [
  'ngRoute',
  'ngStorage',
  'app.quiz',
  'app.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/quiz'});
}]).
// Configure Angular's Compile Provider to treat blog as safe
// http://stackoverflow.com/questions/15606751/angular-changes-urls-to-unsafe-in-extension-page
config(['$compileProvider', function($compileProvider) {
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|blob):/);
}]);
