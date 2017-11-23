/*
 * Animation Script for Snake JS
 */

var color_gradients = [
 {
   "name": "blue-purple",
   "gradient": "linear-gradient(135deg, #2791da 0%, #2791da 16%, #e36fad 100%)",
   "buttonText": "rgb(122, 130, 198)",
 },
 {
   "name": "salmon-pink",
   "gradient": "linear-gradient(135deg, #ed864c 0%, #e36fad 100%)",
   "buttonText": "rgb(231, 121, 131)",
 },
 {
   "name": "orange-yellow",
   "gradient": "linear-gradient(135deg, #ed864c 0%, #efb02b 100%)",
   "buttonText": "#ed864c",
 }
];

var instruction_arr = [
  {
    "mode": "classic",
    "text": "Collect fruit to score points. Game ends when snake collides with the wall or into itself."
  },
  {
    "mode": "arcade",
    "text": "Collect as many fruit as you can. There's nothing stopping you, not even walls! Game ends when snake collides into itself."
  }
];

var mode;

$(document).ready(function() {

  $(function() {
    $('[data-toggle="tooltip"]').tooltip();
  });

  setGradients();
  setScreenHeight();
  document.getElementsByTagName("Body")[0].onresize = function() {setScreenHeight()};


  $("#classic").click(function() {
    animateIn();
    mode = "classic";
    printInstructions(mode);

    setUp();
  })

  $("#arcade").click(function() {
    animateIn();
    mode = "arcade";
    printInstructions(mode);

    setUp();
  })




}) // END: document.ready

function setUp() {
  $("#canvas").hide();
  $("#game-data").show();
  $("#game-data>h1").text("Get Ready");
  $("#game-data>h4").text("Press Enter to begin");
  $('#score').html(0);
  $('#minutes').html("--");
  $('#seconds').html("--");
}

function animateIn() {
  // $(".game-box").hide();
  // $(".splashscreen").slideUp();
  // $(".content").show();
  // setTimeout(function() {
  //   $(".game-box").fadeIn(300);
  // }, 600);

  // no delay
  $(".splashscreen").slideUp();
  $(".content").show();
}

function animateOut() {
  // $(".game-box").fadeOut(200);
  // setTimeout(function() {
  //   $(".splashscreen").slideDown();
  //   $(".content").fadeOut(600);
  // }, 500);

  // no delay
  $(".splashscreen").slideDown();
  $(".content").fadeOut(600);
}

function printInstructions(mode) {
  var text;
  var m;

  for (var i = 0; i < instruction_arr.length; i++) {
    if (mode == instruction_arr[i]["mode"]) {
      text = instruction_arr[i]["text"];
      m = instruction_arr[i]["mode"];
    }
  }
  $("#instructions").html("<span>" + m + ": </span>" + text);
}

function setGradients() {
  var r = Math.floor(Math.random() * color_gradients.length);
  var obj = color_gradients[r];
  $(".splashscreen").css({"background": obj['gradient']});
  $(".mdl-button--raised").css({"color": obj['buttonText']});
  $(".mdl-button--fab").css({"background": obj['gradient']});
}

function setScreenHeight() {
  var window_height = $(window).height()
  $(".splashscreen").css({"height": window_height + "px"})
  $(".content").css({"height": window_height + "px"})

  $(".game-box").css({"height": window_height + "px"})
  $(".info-box").css({"height": window_height + "px"})
}
