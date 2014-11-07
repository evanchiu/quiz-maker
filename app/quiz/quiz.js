'use strict';

angular.module('app.quiz', ['ngRoute', 'app.parser'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/quiz', {
    templateUrl: 'quiz/quiz.html',
    controller: 'QuizCtrl'
  });
}])
.controller('QuizCtrl',
  ['$scope', '$rootScope', '$routeParams', '$localStorage', 'parser',
    function($scope, $rootScope, $routeParams, $localStorage, parser) {
      // Initialize
      $scope.storage = $localStorage.$default({
        inputText: '',
        questions: []
      })
      $rootScope.selectCount = 0;
      $scope.downloadName = 'quiz.txt';

      // Watch for changes to the input, update the questions
      $scope.$watch('storage.inputText', function(newValue, oldValue) {
        if (newValue) {
          parser.parseTestBank(newValue, $scope.storage.questions);
        }
      });

      // Deep Watch for changes to the questions, update the output and count
      $scope.$watch('storage.questions', function(newValue, oldValue) {
        if (newValue) {
          // Tabbify for output text
          var outputText = '';
          $rootScope.selectCount = 0;
          for (var i = 0; i < $scope.storage.questions.length; i++) {
            var question = $scope.storage.questions[i];
            if (question.selected) {
              outputText += parser.makeTabby(question) + '\n';
              $rootScope.selectCount++;
            }
          }

          // Generate export url, tips from Stack Overflow:
          // http://stackoverflow.com/questions/16342659/directive-to-create-adownload-button
          var blob = new Blob([outputText], {type: 'text/plain'});
          $scope.exportUrl = URL.createObjectURL(blob);
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
