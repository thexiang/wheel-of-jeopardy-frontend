let qadata
  //get data
  function webData(){
    var url = 'https://jhu-se-api-container.azurewebsites.net/get_qas'
    $.get(url,output)
  }

  //display result
  function output(data){
    qadata = data
  }


  $("#start-game").click(function(){
    isSpined = false
    $("#spin_button").attr("src","img/spin_on.png");
    $("#start-game").hide()
    $("#select-set").hide()
    webData()
    }
  )



      //$("#select-set").hide()
    //$("#game-board").hide()
      $("#choose-category").hide()
      $('#right-button').hide()
      $('#wrong-button').hide()
      $('#show-answer').hide()
      $('#use-token').hide()
      $('#not-use-token').hide()

    let categoryChoice
    const qCategories = ['Geography','new History','Religion','Solar System','Sports and Entertainment','Science ']
    let qCategory
    let spins = 0
    let isSpined = true
    let isSelected = false
    let playerTurn = 1

    let qid



    let playerInfo ={
          round1:{
            player1: {
              score: 0,
              token: 0
            },
            player2:{
              score: 0,
              token: 0
              }
            }
       ,
          round2:{
            player1: {
              score: 0,
              token: 0
            },
            player2:{
              score: 0,
              token: 0
              }
            }
    }

    let tmpScore = 0
    let tmpAnswer



		let wheelitems = [
                   {'fillStyle' : '#ee1c24', 'text' : 'Geography','textFontSize' : 12},
                   {'fillStyle' : '#3cb878', 'text' : 'new History' ,'textFontSize' : 12},
                   {'fillStyle' : '#f6989d', 'text' : 'Religion','textFontSize' : 12},
                   {'fillStyle' : '#00aef0', 'text' : 'Solar System', 'textFontSize' : 10},
                   {'fillStyle' : '#f26522', 'text' : 'Sports and Entertainment','textFontSize' : 8},
                   {'fillStyle' : '#000000', 'text' : 'DOUBLE YOUR SCORE', 'textFontSize' : 8 , 'textFillStyle' : '#ffffff'},
                   {'fillStyle' : '#f26522', 'text' : 'Science','textFontSize' : 10},
                   {'fillStyle' : '#3cb878', 'text' : 'OPPONENT CHOISE' , 'textFontSize' : 9},
                   {'fillStyle' : '#000000', 'text' : 'BANKRUPT', 'textFontSize' : 16, 'textFillStyle' : '#ffffff'},
                   {'fillStyle' : '#fff200', 'text' : 'PLAYER CHOISE' , 'textFontSize' : 10},
                   {'fillStyle' : '#00aef0', 'text' : 'LOSE TURN' , 'textFontSize' : 10},
                   {'fillStyle' : '#ffffff', 'text' : 'FREE TURN', 'textFontSize' : 10}
                ]


            // Create new wheel object specifying the parameters at creation time.
            let theWheel = new Winwheel({
                'outerRadius'     : 212,        // Set outer radius so wheel fits inside the background.
                'innerRadius'     : 75,         // Make wheel hollow so segments don't go all way to center.
                'textFontSize'    : 24,         // Set default font size for the segments.
                'textOrientation' : 'vertical', // Make text vertial so goes down from the outside of wheel.
                'textAlignment'   : 'outer',    // Align text to outside of wheel.
                'numSegments'     : 12,         // Specify number of segments.
                'segments'        :             // Define segments including colour and text.
                 wheelitems,
                'animation' :           // Specify the animation to use.
                {
                    'type'     : 'spinToStop',
                    'duration' : 5,    // Duration in seconds.
                    'spins'    : 3,     // Default number of complete spins.
                    'callbackFinished' : handleWheel,
                    'callbackSound'    : playSound,   // Function to call when the tick sound is to be triggered.
                    'soundTrigger'     : 'pin'        // Specify pins are to trigger the sound, the other option is 'segment'.
                },
                'pins' :				// Turn pins on.
                {
                    'number'     : 12,
                    'fillStyle'  : 'silver',
                    'outerRadius': 4,
                }
            });

            // Loads the tick audio sound in to an audio object.
            let audio = new Audio("tick.mp3");

            // This function is called when the sound is to be played.
            function playSound()
            {
                // Stop and rewind the sound if it already happens to be playing.
                audio.pause();
                audio.currentTime = 0;

                // Play the sound.
                audio.play();
            }

            // -------------------------------------------------------
            // Click handler for spin button.
            // -------------------------------------------------------
            function startSpin()
            {
                   if(!isSpined){
                   isSpined = true
                   $("#spin_button").attr("src","img/spin_off.png");
                   theWheel.rotationAngle = 0;     // Re-set the wheel angle to 0 degrees.
                   theWheel.animation.spins = 10;
                   colorColumn(qCategory,"#000")
                   qCategory = ''

                   spins = spins + 1
                   $('#spin-num').html("<b>Spins #: " + spins + "</b>")
                 // Begin the spin animation by calling startAnimation on the wheel object.
                    theWheel.startAnimation();
                  }
            }

            // -------------------------------------------------------
            // Called when the spin animation has finished by the callback feature of the wheel because I specified callback in the parameters.
            // -------------------------------------------------------
            function handleWheel(indicatedSegment)
            {
              //if it's one of Categories
               if(qCategories.includes(indicatedSegment.text)){
                colorColumn(indicatedSegment.text, "#F00")
                qCategory = indicatedSegment.text
                isSelected = false
                display('#answer-display',"choose a question from " + indicatedSegment.text)

               }
                else if (indicatedSegment.text == 'BANKRUPT') {
                    bankrupt()
                }
                else if (indicatedSegment.text == 'DOUBLE YOUR SCORE') {
                    doubleScore()
                }
                else if (indicatedSegment.text == 'LOSE TURN') {
                    loseTurn()
                }
                else if (indicatedSegment.text == 'FREE TURN') {
                    freeTurn()
                }
                else if (indicatedSegment.text == 'PLAYER CHOISE') {
                    playerChoise()
                }
                else if (indicatedSegment.text == 'OPPONENT CHOISE') {
                    opponentChoise()
                } else {
                    alert("You have won " + indicatedSegment.text);
                }
            }


            function colorColumn(col, color){
                columnTh = $("table th:contains('" + col  +"')"); // Find the heading with the text
                columnIndex = columnTh.index() + 1; // Get the index & increment by 1 to match nth-child indexing
                $('table tr td:nth-child(' + columnIndex + ')').css("color", color); // Set all the elements with that index in a tr red
                columnTh.css("color", color); // Set the heading red too!
            }

            function playerChoise(){
              $('#answer-display').html("Choose a category for yourself")
              $("#choose-category").show()
            }

            function opponentChoise(){
                $('#answer-display').html("Please let your opponent choose a category for you")
                $("#choose-category").show()
            }

            function freeTurn(){
              swithPlayerTurn('free')
            }

            function loseTurn(){
              // if(playerInfo["round1"]["player1"].token!=0){
              //     display('#answer-display',"Use Token for another Spin? you have " + playerInfo["round1"]["player1"].token + " remaining")
              //     $('#use-token').show()
              //     $('#not-use-token').show()
              //   }
              // else{swithPlayerTurn('lose')}

              swithPlayerTurn('lose')
            }

            function doubleScore(){
              swithPlayerTurn('*')
            }

            function bankrupt(){
              swithPlayerTurn('zero')
            }

            function swithPlayerTurn(operation){
              if(playerTurn == 1){
                opponentid = 2
               }
               else if (playerTurn == 2) {
                 opponentid = 1
               }
                  switch(operation){
                  case '*':
                    playerInfo["round1"]["player" + playerTurn].score *=  2
                    break
                  case '+':
                    playerInfo["round1"]["player" + playerTurn].score += tmpScore
                    break
                  case '-':
                    playerInfo["round1"]["player" + playerTurn].score -= tmpScore
                    break
                  case 'zero':
                    playerInfo["round1"]["player" + playerTurn].score = 0
                    break
                  case 'lose':
                    break
                  case 'free':
                    playerInfo["round1"]["player" + playerTurn].token += 1
                    display("#player"+ playerTurn + "-token", "Player" + playerTurn + "Token# " + playerInfo["round1"]["player" + playerTurn].token)
                    break
                }
                  displayPlayerScore(playerTurn,1)
                  playerTurn = opponentid
                  display('#player-turn',"Player " + playerTurn)
                  display('#question-display',"Player " + playerTurn + "'s turn")
                  display('#answer-display',"Spin Wheel")


                  isSpined = false
                  $("#spin_button").attr("src","img/spin_on.png");
            }




            //correct answer
            function handleRightWrong(op){
              $('#right-button').hide()
              $('#wrong-button').hide()

              colorColumn(qCategory,"#000")
              swithPlayerTurn(op)

              display('#answer-display',"Spin Wheel")
            }



            //display player scores
            function displayPlayerScore(playerNum, RoundNum){
              if(playerNum==1 && RoundNum==1){
                  display('#p1r1',"Player1 Round1 Score: " + playerInfo["round1"]["player1"].score)
              }
              else if(playerNum==2 && RoundNum==1){
                 display('#p2r1',"Player2 Round1 Score: " + playerInfo["round1"]["player2"].score)
              }
              else if(playerNum==1 && RoundNum==2){
                $('#p1r2').html("Player1 Round2 Score: " + playerInfo["round2"]["player1"].score)
              }
              else if(playerNum==2 && RoundNum==2){
                $('#p2r2').html("Player2 Round2 Score: " + playerInfo["round2"]["player2"].score)
              }
            }

            function display(id, text){
              $(id).fadeOut(300, function() { $(id).text(text).fadeIn(300);})
            }



//***********Click Events*******************//

//choose question
$('#jeopardy tr td').click(function(){
    qid = $(this).attr('id');
    let qCategoryCol = qid.substring(0,qid.indexOf('-'))

  // 1.each question can be only clicked once
  // 2.only allow to select one specific category from the wheel
  if($(document.getElementById(qid))[0].innerText != '' && qCategoryCol === qCategory && !isSelected){
    isSelected = true

    $('#answer-display').html("")
    $('#question-display').html(qadata.display[0][qid]["question"])
    tmpAnswer = qadata.display[0][qid]["answer"]
    tmpScore = parseInt($(document.getElementById(qid))[0].innerText,10)

    $(document.getElementById(qid)).html("") //after click on table cell, remove it
    $('#show-answer').show()

  }


});



            //player choise or opponent choise
            $( "#choose-category input" ).on('change', function() {
               categoryChoice = $('input[name=optradio]:checked', '#choose-category').val()
               colorColumn(categoryChoice, "#F00")
               qCategory = categoryChoice
               isSelected = false
               $(this).prop('checked', false);
               $("#choose-category").hide()
            });

            $('#right-button').click(function(){handleRightWrong('+')})
            $('#wrong-button').click(function(){handleRightWrong('-')})

            //after click show answer button, display answer
            $('#show-answer').click(function(){
                  $('#answer-display').html(tmpAnswer)
                  $('#show-answer').hide()
                  $('#right-button').show()
                  $('#wrong-button').show()
                })


                $(".dropdown-menu li a").click(function(){
                  $(".dropdown-menu li a").parents(".dropdown").find('.btn').html($(this).text() + ' <span class="caret"></span>');
                  $(".dropdown-menu li a").parents(".dropdown").find('.btn').val($(this).data('value'));
                });
