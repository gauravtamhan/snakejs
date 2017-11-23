/*
 * Game Logic Script for Snake JS
 */

var score;
var timer;

$(document).ready(function() {

  var minutesLabel = document.getElementById("minutes");
  var secondsLabel = document.getElementById("seconds");
  var totalSeconds;


  function setTime() {
    if (!paused) {
      secondsLabel.innerHTML = pad(totalSeconds % 60);
      minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
      ++totalSeconds;
    }
  }

  function pad(val) {
    var valString = val + "";
    if (valString.length < 2) {
      return "0" + valString;
    } else {
      return valString;
    }
  }

  //Canvas stuff
  var canvas = $("#canvas")[0];
  var ctx = canvas.getContext("2d");
  var w = 600;
  var h = 600;

  var gameIsActive;
  var numberOfTimesPaused = 0;
  var paused = false;
  //Lets save the cell width in a variable for easy control
  var cw = 20;
  var d;
  var snake_dir;
  var food;


  //Lets create the snake now
  var snake_array; //an array of cells to make up the snake

  function ready() {
    ctx.fillStyle = "#333";
    ctx.fillRect(0, 0, w, h);
    gameIsActive = false;
    checkHighScore();
  }

  $("#back").click(function() {
    gameIsActive = false;
    numberOfTimesPaused = 0;
    paused = false;
    clearInterval(game_loop);
    clearInterval(timer);
    ctx.fillStyle = "#333";
    ctx.fillRect(0, 0, w, h);
    animateOut();
  })

  function gameOver() {
    // ctx.fillStyle = "#333333";
    // ctx.fillRect(0, 0, w, h);
    $("#canvas").hide();
    $("#game-data>h1").text("You Lose!");
    $("#game-data>h4").text("Press Enter to play again");
    $("#game-data").show();
    gameIsActive = false;
    clearInterval(game_loop);
    clearInterval(timer);
  }

  ready();

  function init() {
    gameIsActive = true;
    totalSeconds = 0;
    setTime();
    timer = setInterval(setTime, 1000);

    d = "right"; //default direction
    create_snake();
    create_food(); //Now we can see the food particle
    //finally lets display the score
    score = 0;

    //Lets move the snake now using a timer which will trigger the paint function
    //every 60ms
    if (typeof game_loop != "undefined") clearInterval(game_loop);
    game_loop = setInterval(paint, 88); // 88

  }


  function create_snake() {
    var length = 3; //Length of the snake
    snake_array = []; //Empty array to start with
    for (var i = length - 1; i >= 0; i--) {
      //This will create a horizontal snake starting from the top left
      snake_array.push({
        x: i,
        y: 1
      });
    }
  }

  //Lets create the food now
  function create_food() {
    var fx = Math.round(Math.random() * (w - cw) / cw);
    var fy = Math.round(Math.random() * (h - cw) / cw);
    if (check_collision(fx, fy, snake_array)) {
      fx = Math.round(Math.random() * (w - cw) / cw);
      fy = Math.round(Math.random() * (h - cw) / cw);
    }

    food = {
      x: fx,
      y: fy,
    };
    //This will create a cell with x/y between 0-44
    //Because there are 45(450/10) positions accross the rows and columns
  }

  //Lets paint the snake now
  function paint() {
    if (!paused) {
      //To avoid the snake trail we need to paint the BG on every frame
      //Lets paint the canvas now
      ctx.fillStyle = "#333";
      ctx.fillRect(0, 0, w, h);
      // ctx.strokeStyle = "white";
      // ctx.strokeRect(0, 0, w, h);

      //The movement code for the snake to come here.
      //The logic is simple
      //Pop out the tail cell and place it infront of the head cell
      snake_dir = d;
      var nx = snake_array[0].x;
      var ny = snake_array[0].y;
      //These were the position of the head cell.
      //We will increment it to get the new head position
      //Lets add proper direction based movement now
      if (d == "right") nx++;
      else if (d == "left") nx--;
      else if (d == "up") ny--;
      else if (d == "down") ny++;

      //Lets add the game over clauses now
      //This will restart the game if the snake hits the wall
      //Lets add the code for body collision
      //Now if the head of the snake bumps into its body, the game will restart
      if (mode == "classic") {
        if (nx == -1 || nx == w / cw || ny == -1 || ny == h / cw || check_collision(nx, ny, snake_array)) {
          //end game
          gameOver();
          //Lets organize the code a bit now.
          return;
        }
      } else {
        if (check_collision(nx, ny, snake_array)) {
          gameOver();
          return;
        } else if (nx == -1) {
          nx = w / cw - 1;
        } else if (nx == w /cw) {
          nx = 0;
        } else if (ny == -1) {
          ny = h / cw - 1;
        } else if (ny == h / cw) {
          ny = 0;
        }
      }



      //Lets write the code to make the snake eat the food
      //The logic is simple
      //If the new head position matches with that of the food,
      //Create a new head instead of moving the tail
      if (nx == food.x && ny == food.y) {
        var tail = {
          x: nx,
          y: ny
        };
        score++;
        //Create new food
        create_food();
      } else {
        var tail = snake_array.pop(); //pops out the last cell
        tail.x = nx;
        tail.y = ny;
      }
      //The snake can now eat the food.

      snake_array.unshift(tail); //puts back the tail as the first cell

      for (var i = 0; i < snake_array.length; i++) {
        var c = snake_array[i];
        // console.log(snake_array[i]);
        //Lets paint 10px wide cells
        paint_cell(c.x, c.y, 'white');
      }
      // console.log('end frame')
      //Lets paint the food
      paint_cell(food.x, food.y, '#cd006c');

      //Lets display the score
      update_high_score(score);
      $('#score').html(score);
      // var score_text = "Score: " + score;
      // ctx.fillText(score_text, 5, h-5);
    }
  }

  function checkHighScore() {
    if (localStorage["highscore"]) {
      $("#high_score").text(localStorage["highscore"]);
    } else {
      $("#high_score").text(0);
    }
  }

  function update_high_score(s) {
    if (localStorage["highscore"]) {
      $("#high_score").text(localStorage["highscore"]);
      if (localStorage["highscore"] < s) {
        localStorage["highscore"] = s;
      }
    } else {
      localStorage["highscore"] = s;
    }
  }

  //Lets first create a generic function to paint cells
  function paint_cell(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * cw, y * cw, cw, cw);
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.strokeRect(x * cw, y * cw, cw, cw);
  }

  function check_collision(x, y, array) {
    //This function will check if the provided x/y coordinates exist
    //in an array of cells or not
    for (var i = 0; i < array.length; i++) {
      if (array[i].x == x && array[i].y == y)
        return true;
    }
    return false;
  }

  //Lets add the keyboard controls now

  $(document).keydown(function(e) {
    var key = e.which;

    // console.log(e.which);

    if (gameIsActive) {
      if (key == "37" && snake_dir != "right") d = "left";
      else if (key == "38" && snake_dir != "down") d = "up";
      else if (key == "39" && snake_dir != "left") d = "right";
      else if (key == "40" && snake_dir != "up") d = "down";
      // console.log("Direction is currently: " + snake_dir)
    }

    if (!gameIsActive && key == 13) { // Enter
      $("#game-data").hide();
      $("#canvas").show();
      init();
    }

    if (key == "32" && gameIsActive) {
      numberOfTimesPaused++;
      if (numberOfTimesPaused % 2 == 1) { // odd
        paused = true;
      } else {
        paused = false;
      }
    }

  }) // end keydown function


}) // end document.ready
