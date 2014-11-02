'use strict';

angular.module('app.parser', [])
.factory('parser', [function() {
  return {
    parseTestBank: function(text, questions) {
      var lines = text.split(/\r\n|\r|\n/);
      for (var i = 0; i + 5 < lines.length; i += 6) {
        // Make a new question if necessary, grab it
        if (questions.length <= i / 6) {
          questions.push({});
        }
        var question = questions[i/6];

        // Parse the question text
        var match = lines[i].match(/\t(.*?)$/);
        question.question = match[1];

        // Make sure the choices array exists
        if (!question.hasOwnProperty('choices')) {
          question.choices = [];
        }

        // Parse Choices
        for (var j = 1; j < 5; j++) {
          match = lines[i+j].match(/\t(.*?)$/);
          // Grab existing choice or make a new one
          if (question.choices.length <= j-1) {
            question.choices.push({});
          }
          var choice = question.choices[j-1];

          // Fill in choice
          choice.text = match[1];
          choice.correct = false;
        }

        // Parse answer
        match = lines[i+5].match(/Ans:  ([abcd])/);
        var correctIndex = match[1].charCodeAt(0) - 'a'.charCodeAt(0);
        question.choices[correctIndex].correct = true;
      }
    },

    makeTabby: function(question) {
      var delim = '\t';
      var output = 'MC' + delim + question.question + delim;
      for (var i = 0; i < 4; i++) {
        output += question.choices[i].text + delim;
        if (question.choices[i].correct) {
          output += 'correct' + delim;
        } else {
          output += 'incorrect' + delim;
        }
      }
      return output;
    }
  };
}]);
