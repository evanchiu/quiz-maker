# QuizMaker
A simple website to help Jessi make quizzes! Yay!

## Design Plan
Write in Angular, store everything in the local data store

### Data
Quiz
* Original text - copy/pasted from publisher's quizbank
* Parsed questions - parsed straight from original text
  * Question text
  * Choices
  * Indication of correct answer
  * Indicate whether this is in the quiz or not

### Pages
* Home Page
* Quiz Page
  * Original Text Entry
  * Parsed Questions - possibly with an edit button

QuizMaker is based on [angular-seed](https://github.com/angular/angular-seed):

## Todo
* ~~Add saving to local data store~~
* ~~Convert fancy ' and " to simple ones~~
* ~~Add an export option, to save as .txt~~
* ~~No more editing the input: input once, then edit questions directly~~
  * ~~Use two divs: one for show, one for edit, which flip visibility~~
* ~~Homepage/Separate pages per quiz~~
* ~~Controls (download) in top right~~
* ~~Three steps per quiz:~~
  * ~~Input data (paste into textarea)~~
  * ~~Select and edit questions (hit clear to go back)~~
  * ~~Download~~
* Clean, unique theme
