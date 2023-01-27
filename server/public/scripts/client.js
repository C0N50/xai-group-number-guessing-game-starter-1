$(document).ready(handleReady);

//declare global variables
let myNumber = 0;
let resultObject = {};
let minNumber = ''
let maxNumber = ''
function handleReady() {
  console.log('jquery is loaded!');
  $('#firstScreen').show()
  $('#secondScreen').hide()


  $('#guessForm').on('submit', submitGuess);
  $('.result').on('click', '#resetBtn', restartGame);


  $('#startBtn').on('click',function (){

    minNumber = $('#minNumber').val()
    maxNumber = $('#maxNumber').val()
    if(minNumber && maxNumber){
      createRandomNumber(minNumber, maxNumber);
    }else{
      alert('must provide a  minNumber and max number')

    }

  })


  // getNumber();
}

function createRandomNumber(minNumber, maxNumber) {

  let data = {
    minNumber,
    maxNumber
  }

  response = $.ajax({
    method: 'POST', 
    url: '/randomNumber',
    data,
  }).then((response) => {
    console.log('response', response)

    if(response === 'Created'){
      getNumber()
    }

    // myNumber = response;
    // console.log ('Received Random Number', myNumber);
  });
}

function getNumber() {
  response = $.ajax({
    method: 'GET', 
    url: '/number',
  }).then((response) => {
    console.log('response', response)
    myNumber = response;
    console.log ('Received Random Number', myNumber);
    $('#firstScreen').hide()
    $('#secondScreen').show()
    console.log('minNumber', minNumber)
    console.log('maxNumber', maxNumber)
    $('#minSpan').text(minNumber)
    $('#maxSpan').text(maxNumber)
    //
  });
}



function getResult() {
  response = $.ajax({
    method: 'GET',
    url: '/result',
  }).then((response) => {
    console.log('result get response');
    let result = response;
    resultObject = response;
    console.log('result is', result);

    if (result.connor && result.xai) {
      console.log('Connor And Xai Win!');
    } else if (result.connor) {
      console.log('Connor Wins!');
    } else if (result.xai) {
      console.log('xai Wins!');
    }
    render();
  });
}

function submitGuess(event) {
  event.preventDefault();

  newGuess = {
    connor: $('#connor').val(),
    xai: $('#xai').val(),
  };

  console.log('Guess Object to Send', newGuess);
  // //make sure both fields are populated before sending.
  // if (newGuess[0].guess && newGuess[1].guess) {
  //   console.log('Guesses ready!');
  // }
  // else{
  //   console.log('Please both guess together!');
  // }

  $.ajax({
    method: 'POST',
    url: '/number',
    data: newGuess,
  }).then((response) => {
    console.log('Sending Guess!');

    if (response === 'Created') {
      console.log('response Created');
      getResult();

      // render();
    }
  });
}

function restartGame() {
  $('.connor-guess').empty();
  $('.xai-guess').empty();
  $('.result-message').empty();
  $('.round').empty();
  $('#connor').val('');
  $('#xai').val('');

  console.log('In restartGame');
  response = $.ajax({
    method: 'GET',
    url: '/restart',
  }).then((response) => {
    myNumber = response;
    console.log('New Random Number');

    $('#firstScreen').show()
    $('#secondScreen').hide()

  });
}

function render() {
  $('.connor-guess').empty();
  $('.xai-guess').empty();
  $('.result-message').empty();
  $('.round').empty();

  console.log('in render', resultObject);

  $('.round').append(`<p>Round ${resultObject.guessCount}</p>`);

  // ============================

  $('.connor-guess').append(`<p>${newGuess.connor}</p>`);
  $('.xai-guess').append(`<p>${newGuess.xai}</p>`);

  //  word that will display if win
  let connorName = '';
  let xaiName = '';
  let and = '';
  let displayWinner = '';

  //  checking if xai && connor ===  win; the add the 'words'
  if (resultObject.connor && resultObject.xai) {
    and = 'and';
    displayWinner = 'win';
  }

  // if connor guess incorrect --> then check if/else statement
  if(!resultObject.connor){
    if (resultObject.connorHigher) {
      $('.connor-guess').append(`<p>Connor Guessed too HIGH!</p>`);
    } else {
      $('.connor-guess').append(`<p>Connor Guessed too LOW!</p>`);
    }
  }

   // if xai guess incorrect --> then check if/else statement
  if(!resultObject.xai){
    if (resultObject.xaiHigher) {
      $('.xai-guess').append(`<p>Xai Guessed too HIGH!</p>`);
    } else {
      $('.xai-guess').append(`<p>Xai Guessed too LOW!</p>`);
    }
  }

   // if BOTH are incorrect 
  if (!resultObject.connor && !resultObject.xai) {
    and = 'No one win. So sad....';
    displayWinner = '';
  }

  //  check if connor wins
  if (resultObject.connor) {
    connorName = 'Connor';
    displayWinner = 'win';
  }

  // check if xai wins
  if (resultObject.xai) {
    xaiName = 'Xai';
    displayWinner = 'win';
  }
// display msg = variables that holds the message to display
  let message = `${connorName} ${and} ${xaiName} ${displayWinner}`;

  // here is what being displayed on the DOM
  $('.result-message').append(
    `<p class='win-message'>${message}</p>
    <button id="resetBtn">Reset</button>`
  );





  // ===================

  // if(resultObject.xai === true && resultObject.connor === true){
  //  $('.result-message').append(
  //   `<p class='win-message'>Connor and Xai win!</p>
  //   <button id="resetBtn">Reset</button>`
  //   );

  //   $('.connor-guess').append(
  //     `<p>${newGuess.connor}</p>`
  //   );

  //   $('.xai-guess').append(
  //     `<p>${newGuess.xai}</p>`
  //   );
  // }

  // if(resultObject.xai === true && resultObject.connor === false){
  //   $('.result-message').append(
  //     `<p class = 'win-message'>Xai wins!</p>
  //     <button id="resetBtn">Reset</button>`);

  //    $('.connor-guess').append(
  //      `<p>${newGuess.connor}</p>`
  //    );

  //    $('.xai-guess').append(
  //     `<p>${newGuess.xai}</p>`
  //   );

  //    if(resultObject.connorHigher) {
  //     $('.connor-guess').append(
  //       `<p>Connor Guessed too HIGH!</p>`
  //     );
  //    }
  //    else {
  //     $('.connor-guess').append(
  //       `<p>Connor Guessed too LOW!</p>`
  //     );
  //    }
  //  }

  //  if(resultObject.xai === false && resultObject.connor === true){
  //   $('.result-message').append(
  //     `<p class = 'win-message'>Connor wins!</p>
  //     <button id="resetBtn">Reset</button>`);

  //    $('.connor-guess').append(
  //      `<p>${newGuess.connor}</p>`
  //    );

  //    $('.xai-guess').append(
  //     `<p>${newGuess.xai}</p>`
  //   );

  //    if(resultObject.xaiHigher) {
  //     $('.xai-guess').append(
  //       `<p>Xai Guessed too HIGH!</p>`
  //     );
  //    }
  //    else {
  //     $('.xai-guess').append(
  //       `<p>Xai Guessed too LOW!</p>`
  //     );
  //    }
  //  }

  // if (resultObject.xai === false && resultObject.connor === false) {
  //   $('.connor-guess').append(`<p>${newGuess.connor}</p>`);

  //   $('.xai-guess').append(`<p>${newGuess.xai}</p>`);

  //   if (resultObject.connorHigher) {
  //     $('.connor-guess').append(`<p>Connor Guessed too HIGH!</p>`);
  //   } else {
  //     $('.connor-guess').append(`<p>Connor Guessed too LOW!</p>`);
  //   }

  //   if (resultObject.xaiHigher) {
  //     $('.xai-guess').append(`<p>Xai Guessed too HIGH!</p>`);
  //   } else {
  //     $('.xai-guess').append(`<p>Xai Guessed too LOW!</p>`);
  //   }
  // }

  $('#connor').val('');
  $('#xai').val('');
}
