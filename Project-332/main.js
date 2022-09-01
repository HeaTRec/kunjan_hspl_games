var squaresX = 4,
    squaresY = 4;

var board, freeX, freeY, movedX, movedY, imgPointer;

var images = [
  
  'https://www.whatsappimages.in/wp-content/uploads/2021/07/Top-HD-sad-quotes-for-whatsapp-status-in-hindi-Pics-Images-Download-Free.gif',

];

function getImage(){

}

updateMaxwidth();
createBoard();
newGame();

function updateMaxwidth() {
  var maxW = Math.min($(window).width(), $(window).height());
  $(".content").css("max-width", maxW + "px");
}

/*
setInterval(function(){
  moveTile(0);
  updateTile();
}, 10000);
*/

$(window).resize(function(){
  updateMaxwidth();
});

function newGame() {
  shuffleBoard();
  drawBoard();
  imgPointer = Math.floor(Math.random()*images.length);
  $(".board").css("background-image", "none");
  $(".board .i").css("background-image", "url('" + images[imgPointer] + "')");
  $(".board").removeClass("solved");
}

$(".board").on("click", "div", function(){
  var $el = $(this);
  var num = $el.data("tile");
  moveClicked(num);
});

$("a").on("click", function(e){
  e.preventDefault();
  var num = $(this).data("num");
  squaresX = num;
  squaresY = num;
  createBoard();
  newGame();
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
  }, 500);
}

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
  // movedX, movedY is the tile being moved. update top/left position
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
