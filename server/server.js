const express = require('express');
const bodyParser = require('body-parser');
// ========= Import in the randomNumber module
const randomNumber = require('./randomNumber');
const app = express();
const PORT = 5000;
// This must be added before GET & POST routes.
app.use(bodyParser.urlencoded({ extended: true }));

// Serve up static files (HTML, CSS, Client JS)
app.use(express.static('server/public'));

//Declare global variables
let guessArray = [];
let whoWins = {
  xai: false,
  connor: false,
  xaiHigher: false,
  connorHigher: false,
  guessCount: 0,
};

let minNumber = 0;
let maxNumber = 0;
// let myNumber = randomNumber(1, 25).toString();
let myNumber = 0;

// GET & POST Routes go here

app.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});

app.post('/randomNumber', (req, res) => {
  minNumber = req.body.minNumber;
  maxNumber = req.body.maxNumber;
  myNumber = randomNumber(minNumber, maxNumber).toString();
  // // console.log('Sending Random Number:', myNumber);
  // res.send(myNumber);
  res.sendStatus(201);
});

app.get('/number', (req, res) => {
  console.log('myNumber', myNumber);
  console.log('generated random number', myNumber);
  res.send(myNumber);
});

app.get('/restart', (req, res) => {
  myNumber = randomNumber(1, 25).toString();
  console.log('Sending New Random Number:', myNumber);
  whoWins.xai = false;
  whoWins.connor = false;
  whoWins.xaiHigher = false;
  whoWins.connorHigher = false;
  whoWins.guessCount = 0;
  guessArray = [];
  console.log('whoWins objet after restart', whoWins);
  res.send(myNumber);
});

app.post('/number', (req, res) => {
  console.log('Inside of guess POST request', req.body);

  let guess = req.body;
  guessArray.push(guess);

  console.log('guessArray in here:', guessArray);
  whoWins.guessCount = guessArray.length;
  console.log('guessCount....', whoWins.guessCount);
  res.sendStatus(201);
});

app.get('/result', (req, res) => {
  let confirm = 'confirmed!';
  let currentGuess = guessArray[guessArray.length - 1];
  console.log('current guess.....', currentGuess);

  myNumber = Number(myNumber);
  currentGuess.xai = Number(currentGuess.xai);
  currentGuess.connor = Number(currentGuess.connor);

  console.log('myNumber', myNumber);
  console.log('currentGuess.xai', currentGuess.xai);
  console.log('currentGuess.connor', currentGuess.connor);

  // =============
  if (currentGuess.xai === myNumber) {
    whoWins.xai = true;
  }

  if (currentGuess.connor === myNumber) {
    whoWins.connor = true;
  }

  if (currentGuess.xai > myNumber) {
    whoWins.xaiHigher = true;
    whoWins.xai = false;
  }

  if (currentGuess.connor > myNumber) {
    whoWins.connorHigher = true;
    whoWins.connor = false;
  }

  if (currentGuess.xai < myNumber) {
    whoWins.xaiHigher = false;
    whoWins.xai = false;
  }

  if (currentGuess.connor < myNumber) {
    whoWins.connorHigher = false;
    whoWins.connor = false;
  }

  console.log('whoWins', whoWins);

  res.send(whoWins);

  // ===============

  //   if(currentGuess.xai === myNumber && currentGuess.connor === myNumber){
  //     console.log('Connor Guess', currentGuess.connor, 'Xai Guess', currentGuess.xai, 'Real Number', myNumber);
  //     whoWins.xai = true;
  //     whoWins.connor = true;
  //     whoWins.xaiHigher = false;
  //     whoWins.connorHigher = false;

  //      console.log('Xai & Connor win', myNumber, currentGuess.xai, currentGuess.connor, whoWins);
  //     res.send(whoWins);
  //   }

  //   else if(currentGuess.connor === myNumber && currentGuess.xai !== myNumber){
  //     console.log('Connor Guess', currentGuess.connor, 'Xai Guess', currentGuess.xai, 'Real Number', myNumber);
  //     whoWins.connor = true;
  //     whoWins.xai = false;
  //     whoWins.connorHigher = false;

  //     if (currentGuess.xai > myNumber) {
  //       whoWins.xaiHigher = true;
  //     }
  //     if (currentGuess.xai < myNumber) {
  //       whoWins.xaiHigher = false;
  //     }
  //     console.log('Connor wins', myNumber, currentGuess.connor, currentGuess.xai, whoWins);
  //     res.send(whoWins)
  //   }

  //   else if(currentGuess.xai === myNumber && currentGuess.connor !== myNumber){
  //     console.log('Connor Guess', currentGuess.connor, 'Xai Guess', currentGuess.xai, 'Real Number', myNumber);
  //     whoWins.xai = true;
  //     whoWins.connor = false;
  //     whoWins.xaiHigher = false;

  //     if (currentGuess.connor > myNumber) {
  //       whoWins.connorHigher = true;
  //     }
  //     if (currentGuess.connor < myNumber) {
  //       whoWins.connorHigher = false;
  //     }

  //    console.log('Xai wins', myNumber, currentGuess.connor, currentGuess.xai, whoWins);
  //     res.send(whoWins);
  //   }

  //   else {
  //     console.log('Connor Guess', currentGuess.connor, 'Xai Guess', currentGuess.xai, 'Real Number', myNumber);
  //     console.log('connor and xai lost');
  //     whoWins.xai = false;
  //     whoWins.connor = false;

  //     if (currentGuess.xai > myNumber) {
  //       whoWins.xaiHigher = true;
  //     }
  //     if (currentGuess.xai < myNumber) {
  //       whoWins.xaiHigher = false;
  //     }
  //     if (currentGuess.connor > myNumber) {
  //       whoWins.connorHigher = true;
  //     }
  //     if (currentGuess.connor < myNumber ) {
  //       whoWins.connorHigher = false;
  //     }
  //     console.log('Nobody wins', whoWins);
  //     res.send(whoWins);
  //   }
});

// =========== Moved this logic to the module
// function randomNumber(min, max) {
//   return Math.floor(Math.random() * (1 + max - min) + min);
// }
