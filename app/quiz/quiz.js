'use strict';

angular.module('app.quiz', ['ngRoute', 'app.parser'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/quiz', {
    templateUrl: 'quiz/quiz.html',
    controller: 'QuizCtrl'
  });
}])
.controller('QuizCtrl',
  ['$scope', '$rootScope', '$routeParams', 'parser',
    function($scope, $rootScope, $routeParams, parser) {
      // Initialize
      $scope.questions = [];
      $rootScope.selectCount = 0;

      // Watch for changes to the input, update the questions
      $scope.$watch('inputText', function(newValue, oldValue) {
        if (newValue) {
          parser.parseTestBank(newValue, $scope.questions);
        }
      });

      // Deep Watch for changes to the questions, update the output and count
      $scope.$watch('questions', function(newValue, oldValue) {
        if (newValue) {
          // Tabbify for output text
          $scope.outputText = '';
          $scope.selectCount = 0;
          $rootScope.selectCount = 0;
          for (var i = 0; i < $scope.questions.length; i++) {
            var question = $scope.questions[i];
            if (question.selected) {
              $scope.outputText += parser.makeTabby(question) + '\n';
              $rootScope.selectCount++;
            }
          }
        }
      }, true);

      // Set the choice style based on the correctness
      $scope.choiceStyle = function(choice) {
        return (choice.correct) ? 'correct' : 'incorrect';
      };

      // Set the question style based on the selection
      $scope.questionStyle = function(question) {
        return (question.selected) ? 'select' : 'unselected';
      };
    }
  ]
);
