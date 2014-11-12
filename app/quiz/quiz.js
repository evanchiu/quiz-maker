'use strict';

angular.module('app.quiz', ['ngRoute', 'app.parser'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/quiz/:quiz?', {
    templateUrl: 'quiz/quiz.html',
    controller: 'QuizCtrl'
  });
}])
.controller('QuizCtrl',
  ['$scope', '$rootScope', '$routeParams', '$localStorage',
    '$location', 'parser',
    function($scope, $rootScope, $routeParams, $localStorage,
      $location, parser) {
      // Initialize local storage
      $scope.storage = $localStorage.$default({
        quizzes: []
      })
      $rootScope.quizzes = $scope.storage.quizzes;
      $rootScope.currentPath = $location.path();

      // Make sure this is routed to a particular quiz
      if (!$routeParams.hasOwnProperty('quiz')) {
        $location.path('/quiz/' + $scope.storage.quizzes.length);
        return;
      } else {
        if ($routeParams.quiz >= $scope.storage.quizzes.length) {
          $scope.storage.quizzes.push({
            name: 'Quiz ' + $routeParams.quiz,
            questions: []
          });
        }
        $scope.quiz = $scope.storage.quizzes[$routeParams.quiz];
      }

      // Initialize
      $rootScope.selectCount = 0;

      // Watch for changes to the input, update the questions
      $scope.$watch('inputText', function(newValue, oldValue) {
        if (newValue) {
          parser.parseTestBank(newValue, $scope.quiz.questions);
          $scope.inputText = '';
        }
      });

      // Deep Watch for changes to the questions, update the output and count
      $scope.$watch('quiz.questions', function(newValue, oldValue) {
        if (newValue) {
          parseQuestions(newValue);
        }
      }, true);

      $scope.$watch('quiz.name', function(newValue, oldValue) {
        if (newValue) {
          $rootScope.downloadName = getDownloadName(newValue);
        }
      });

      var getDownloadName = function(name) {
        return name.replace(/[^a-zA-Z0-9]/g, '_');
      };
      $rootScope.downloadName = getDownloadName($scope.quiz.name);

      // Parse the questions to update selected count and export url
      var parseQuestions = function(questions) {
        // Tabbify for output text
        var outputText = '';
        $rootScope.selectCount = 0;
        for (var i = 0; i < questions.length; i++) {
          var question = questions[i];
          if (question.selected) {
            outputText += parser.makeTabby(question) + '\n';
            $rootScope.selectCount++;
          }
        }
        // Generate export url, tips from Stack Overflow:
        // http://stackoverflow.com/questions/16342659/directive-to-create-adownload-button
        var blob = new Blob([outputText], {type: 'text/plain'});
        $rootScope.exportUrl = URL.createObjectURL(blob);
      };
      parseQuestions($scope.quiz.questions);

      // Toggles for selecting/editing
      $scope.select = function(question) {
        question.selected = !question.selected;
      };
      $scope.edit = function(question) {
        question.edit = !question.edit;
      };
      $scope.editTitle = function() {
        $scope.titleEdit = !$scope.titleEdit;
      };

      // Fill the star when the question is selected
      $scope.selectedGlyph = function(question) {
        return (question.selected) ? 'glyphicon-star' : 'glyphicon-star-empty';
      };

      // Set the choice style based on the correctness
      $scope.choiceStyle = function(choice) {
        return (choice.correct) ? 'correct' : 'incorrect';
      };

      // Set the question style based on the selection
      $scope.questionStyle = function(question) {
        return (question.selected) ? 'select' : 'unselected';
      };

      // View and edit style hide when it's not their turn
      $scope.viewStyle = function(question) {
        return (question.edit) ? 'hidden' : '';
      };
      $scope.editStyle = function(question) {
        return (question.edit) ? '' : 'hidden';
      };
      $scope.viewTitleStyle = function() {
        return ($scope.titleEdit) ? 'hidden' : '';
      };
      $scope.editTitleStyle = function() {
        return ($scope.titleEdit) ? '' : 'hidden';
      };
      $scope.inputStyle = function() {
        return ($scope.quiz.questions.length == 0) ? '' : 'hidden';
      };
      $scope.questionsStyle = function() {
        return ($scope.quiz.questions.length == 0) ? 'hidden' : '';
      };

      // Style for active step
      $scope.stepActive = function(step) {
        var active = false;
        if (step == 1 && $scope.quiz.questions.length == 0) {
          active = true;
        } else if (step == 3 && $rootScope.selectCount > 0) {
          active = true;
        } else if (step == 2 && $scope.quiz.questions.length > 0
          && $rootScope.selectCount == 0) {
          active = true;
        }
        return (active) ? 'active' : '';
      }
    }
  ]
);
