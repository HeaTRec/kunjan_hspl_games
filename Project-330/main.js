var squaresX = 4,
    squaresY = 4;

var board, freeX, freeY, movedX, movedY, imgPointer;

var images = [
  'https://i.ibb.co/wzfTKq9/1.png',
  'https://i.ibb.co/tQYKW6q/2.png',
  'https://i.ibb.co/jMXDMsM/3.png',
  'https://i.ibb.co/zVVBjB6/4.png',
  'https://i.ibb.co/J52dYGZ/5.png'
];

updateMaxwidth();
createBoard();
newGame();

function updateMaxwidth() {
  var maxW = Math.min($(window).width(), $(window).height());
  $(".content").css("max-width", maxW + "px");
}

$(window).resize(function(){
  updateMaxwidth();
});

var imgPointerRefresh = 1;
function newGame() {
  shuffleBoard();
  drawBoard();
  imgPointer = Math.floor(Math.random()*images.length);
  imgPointerRefresh = imgPointer;
  $(".board").css("background-image", "none");
  $(".board .i").css("background-image", "url('" + images[imgPointer] + "')");
  $(".board").removeClass("solved");
}

function refreshGame() {
  shuffleBoard();
  drawBoard();
  $(".board").css("background-image", "none");
  $(".board .i").css("background-image", "url('" + images[imgPointerRefresh] + "')");
  $(".board").removeClass("solved");
}

$(".board").on("click", "div", function(){
  var $el = $(this);
  var num = $el.data("tile");
  moveClicked(num);
});

$(".btn-start").on("click", function(e){
  e.preventDefault();
  var num = +$element.val()
  
  $(".nav").css("display", "block");
  $(".go-home").css("display", "block");
  $(".board").css("display", "block");
  $(".main").css("display", "none");
  squaresX = num;
  squaresY = num;
  createBoard();
  newGame();
  runTimer();
});

$('.refresh').on("click", function(e){
  e.preventDefault();
  var num = +$element.val()
  ClearСlock();
  squaresX = num;
  squaresY = num;
  createBoard();
  refreshGame();
  runTimer();
});

$('.go-home').on("click", function(e){
  e.preventDefault();
  ClearСlock();
  $(".board").css("display", "none");
  $(".nav").css("display", "none");
  $(".go-home").css("display", "none");
  $(".main").css("display", "block");
  $('#idClock').html('00:00:00');
});

$(document).keydown(function(e) {
  switch(e.keyCode) {
    case 39: moveTile(4); updateTile(); break; // right
    case 37: moveTile(3); updateTile(); break; // left
    case 40: moveTile(2); updateTile(); break; // down
    case 38: moveTile(1); updateTile(); break; // up
  }
  if (isSolved()) {
    showSolved();
  }
});

function showSolved(){
  setTimeout(function(){
    $(".board").addClass("solved");
    $(".board").css("background-image", "url('" + images[imgPointer] + "')");
    ClearСlock();
  }, 500);
}

////////////////////////////////////////////////
function runTimer() {
  var beginTime = new Date();
  
  clocktimer  = setInterval(function() {
    var delta = new Date() - beginTime;
    var hours = Math.floor(delta/3600000);

    delta = delta - hours*3600000;
    var mins = Math.floor( delta/60000 );

    delta = delta - mins*60000;
    var secs = Math.floor( delta/1000 );

    delta = delta - secs*1000;
    var ms = delta;

    var str = format(hours, 2)+ ":" + format(mins, 2) + ":" + format(secs, 2)

    $('#idClock').html(str)
  }, 1000);
}

function ClearСlock() {
  clearTimeout(clocktimer);
}

function format(num, maxNumbers) {
  var numStr = num + '';
  while(numStr.length < maxNumbers) {
    numStr = '0' + numStr;
  }

  return numStr;
}

////////////////////////////////////////////////

function moveClicked(num) {
  // if num is on the row or col of freeXY
  var tileX = 0, tileY = 0, found = false;
  var moves = 0;
  
  for (var y=0; y<squaresY; y++) {
    if (board[y][freeX] == num) {
      tileX = freeX;
      tileY = y;
      found = true;
      // move up or down
      moves = tileY - freeY;
      if (moves > 0) {
        for (var i=0; i<moves; i++) {
          moveTile(1);
          //drawBoard();
          updateTile();
        }
      } else {
        moves = Math.abs(moves);
        for (var i=0; i<moves; i++) {
          moveTile(2);
          //drawBoard();
          updateTile();
        }
      }
      break;
    }
  }
  if (!found) {
    for (var x=0; x<squaresX; x++) {
      if (board[freeY][x] == num) {
        tileX = x;
        tileY = freeY;
        found = true;
        // move left or right
        moves = tileX - freeX;
        if (moves > 0) {
          for (var i=0; i<moves; i++) {
            moveTile(3);
            //drawBoard();
            updateTile();
          }
        } else {
          moves = Math.abs(moves);
          for (var i=0; i<moves; i++) {
            moveTile(4);
            //drawBoard();
            updateTile();
          }
        }
        break;
      }
    }
  }
  if (found && isSolved()) {
    showSolved();
  }

}

function isSolved() {
  // first check if free tile is on the correct spot
  if (freeX != squaresX-1 || freeY != squaresY -1) {
    return false;
  }
  
  var num = 0;
  for (var y=0; y<squaresY; y++) {
    for (var x=0; x<squaresX; x++) {
      if (++num < (squaresY * squaresX)) {
        if (board[y][x] != num) {
          return false;
        }
      }
    }
  }
  return true;
}

function shuffleBoard() {
  // shuffle properly based on number of tiles
  var moves = squaresX * 500;
  for (var i=0; i<moves; i++) {
    moveTile(0);
  }
  moveTile(2);moveTile(2);moveTile(2);
  moveTile(2);moveTile(2);moveTile(2);
  moveTile(2);moveTile(2);moveTile(2);
  moveTile(4);moveTile(4);moveTile(4);
  moveTile(4);moveTile(4);moveTile(4);
  moveTile(4);moveTile(4);moveTile(4);
}

function moveTile(dir) {
  if (dir == 0) {
    dir = Math.floor(Math.random()*4) + 1;
    if (dir == 2 && freeY == 0) {
      dir = 1;
    } else if (dir == 1 && freeY == squaresY - 1) {
      dir = 2;
    } else if (dir == 4 && freeX == 0) {
      dir = 3;
    } else if (dir == 3 && freeX == squaresX - 1) {
      dir = 4;
    }
  }
  switch(dir){
    case 1: // up
      if (freeY < squaresY-1) {
        board[freeY][freeX] = board[freeY+1][freeX];
        movedY = freeY;
        movedX = freeX;
        freeY ++;
        board[freeY][freeX] = 0;
      }
      break;
    case 2: // down
      if (freeY > 0) {
        board[freeY][freeX] = board[freeY-1][freeX];
        movedY = freeY;
        movedX = freeX;
        freeY --;
        board[freeY][freeX] = 0;
      }
      break;
    case 3: // left
      if (freeX < squaresX-1) {
        board[freeY][freeX] = board[freeY][freeX+1];
        movedY = freeY;
        movedX = freeX;
        freeX ++;
        board[freeY][freeX] = 0;
      }
      break;
    case 4: // right
      if (freeX > 0) {
        board[freeY][freeX] = board[freeY][freeX-1];
        movedY = freeY;
        movedX = freeX;
        freeX --;
        board[freeY][freeX] = 0;
      }
      break;
  }  
}

function drawBoard() {
  var $b = $(".board");
  $b.html("");
  var stepX = 100 / squaresX,
      stepY = 100 / squaresY;
  for (var y=0; y<squaresY; y++) {
    for (var x=0; x<squaresX; x++) {
      if (board[y][x] != 0) {
        // add tile according to the number of squares in x and y direction
        $b.append('<div data-tile="'+board[y][x]+'" class="s s'+board[y][x]+'" style="'
                  +'width: ' + (100/squaresX) + '%; '
                  +'padding-bottom: ' + (100/squaresY) + '%; '
                  +'top: ' + stepY*y+'%; '
                  +'left: ' + stepX*x +'%; '
                  +'"><div class="i" style="'
                  +'width: ' + (squaresX * 100) + '%; '
                  +'padding-bottom: ' + (squaresY * 100) + '%; '
                  +'top: ' + (Math.floor((board[y][x] - 1) / squaresX) * -100 ) + '%; '
                  +'left: ' + (((board[y][x] - 1) % squaresX) * -100) + '%; '
                  +'"></div>');
        /*
        
        [0] [1] [2] [3]           num = board[y][x]
    [0]  1   2   3   4            col = Math.floor(num/squaresX)
    [1]  5   6   7   8            row = ( num - 1 ) % squaresX
    [2]  9  10  11  12
    [3] 13  14  15
        
        */
      }
    }
  }
}

function updateTile() {
  // mp
  var stepX = 100 / squaresX,
      stepY = 100 / squaresY;
  $(".board .s" + board[movedY][movedX]).css("top", movedY*stepY + "%");
  $(".board .s" + board[movedY][movedX]).css("left", movedX*stepX + "%");
}

function createBoard() {
  board = [];
  var num = 1;
  for (var y=0; y<squaresY; y++) {
    var row = [];
    for (var x=0; x<squaresX; x++) {
      row.push(num++);
    }
    board.push(row);
  }
  freeX = squaresX-1;
  freeY = squaresY-1;
  board[freeY][freeX] = 0;
}

function debug(woot) {
  if (woot.constructor.toString().indexOf("Array") > -1) {
    debug("array(" + woot.length + ")");
    for (var i=0; i<woot.length; i++) {
      debug("&nbsp;&nbsp;" + i + " : " + woot[i]);
    }
  } else {
    $("#debug").append(woot + "<br />");
  }
}


// Стили с таблицы 
var $element = $('input[type="range"]');
var $tooltip = $('#range-tooltip');
var sliderStates = [
  {name: "low", tooltip: "Зеленый - это легкий уровень. <br>Если вы только начали играть, то начните с него.", range: _.range(2, 3) },
  {name: "med", tooltip: "Оранжевый - это средний уровень. <br>Он подходит для тех, кто уже играл, и зеленый уровень стал легким.", range: _.range(3, 5)},
  {name: "high", tooltip: "Красный - это очень сложный уровень. <br>Если вы уверены в своих силах, то можете попробовать увиличить количество клеточек на максимум.", range: _.range(5, 6) },
];
var currentState;
var $handle;

$element
  .rangeslider({
    polyfill: false,
    onInit: function() {
      $handle = $('.rangeslider__handle', this.$range);
      updateHandle($handle[0], this.value);
      updateState($handle[0], this.value);
    }
  })
  .on('input', function() {
    updateHandle($handle[0], this.value);
    checkState($handle[0], this.value);
    drowTable(this.value);
  });

// Update the value inside the slider handle
function updateHandle(el, val) {
  el.textContent = val;
}

// Check if the slider state has changed
function checkState(el, val) {
  // if the value does not fall in the range of the current state, update that shit.
  if (!_.contains(currentState.range, parseInt(val))) {
    updateState(el, val);
  }
}

// Change the state of the slider
function updateState(el, val) {
  for (var j = 0; j < sliderStates.length; j++){
    if (_.contains(sliderStates[j].range, parseInt(val))) {
      currentState = sliderStates[j];
      // updateSlider();
    }
  }
  // If the state is high, update the handle count to read 50+
  // if (currentState.name == "high") {
    // updateHandle($handle[0], "10");
  // }
  // Update handle color
  $handle
    .removeClass (function (index, css) {
    return (css.match (/(^|\s)js-\S+/g) ||   []).join(' ');
  })
    .addClass("js-" + currentState.name);
  // Update tooltip
  $tooltip.html(currentState.tooltip);
}

function drowTable(num) {
    var i = 0;
    var j = 0;

    $("table tr").removeClass('td-style')
    $("table td").removeClass('td-style')

    $('table tr').each(function(row){
      $(this).find('td').each(function(cell){
        if (row < num && cell < num ) {
          $(this).addClass('td-style');
        }
      });
    });

}
drowTable(3);