var TILE_SIZE = 64;
var TILE_PADDING = 8;

var canvas = document.getElementById('c');
var scoreCounter = document.getElementById('score');
var restartButton = document.getElementById('restart');
var ctx = canvas.getContext('2d');

// off-screen canvas for tile prerendering
var osc = document.createElement('canvas');
osc.width = 4 * TILE_SIZE;
osc.height = TILE_SIZE;

var canvasW = canvas.width;
var canvasH = canvas.height;
var boardW = Math.floor(canvasW / TILE_SIZE);
var boardH = Math.floor(canvasH / TILE_SIZE);

var clickable = true;
var score = 0;
var board = [];

function resetBoard() {
  score = 0;
  clickable = true;
  scoreCounter.innerHTML = score;

  for (var i = 0; i < boardW * boardH; ++i) {
    board[i] = 1 + Math.floor(Math.random() * 4);
  }
}

function prerenderTiles() {
  var ctx = osc.getContext('2d');
  ctx.lineWidth = 3;
  ctx.lineJoin = 'bevel';
  var colors = [
    'mediumslateblue',
    'cornflowerblue',
    'darkslateblue',
    'royalblue'
  ];

  for (var color = 0; color < 4; ++color) {
    ctx.strokeStyle = colors[color];
    ctx.fillStyle = 'rgba(127, 127, 255, 0.1)';
    ctx.save(); {
      ctx.translate(color * TILE_SIZE, 0);
      if (color > 1) ctx.translate(0, TILE_SIZE);
      if (color && color < 3) ctx.translate(TILE_SIZE, 0);
      ctx.rotate(color * Math.PI / 2);

      ctx.beginPath();
      ctx.moveTo(TILE_PADDING, TILE_PADDING);
      ctx.lineTo(TILE_SIZE - TILE_PADDING, 1.5 * TILE_PADDING);
      ctx.lineTo(TILE_SIZE - TILE_PADDING, TILE_SIZE / 2);
      ctx.lineTo(TILE_SIZE / 2, TILE_SIZE - TILE_PADDING);
      ctx.lineTo(1.5 * TILE_PADDING, TILE_SIZE - TILE_PADDING);
      ctx.closePath();
      ctx.stroke();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(1.5 * TILE_PADDING, TILE_SIZE - TILE_PADDING);
      ctx.lineTo(3 * TILE_PADDING, TILE_SIZE - 3 * TILE_PADDING);
      ctx.lineTo(TILE_PADDING, TILE_PADDING);
      ctx.lineTo(TILE_SIZE - 3 * TILE_PADDING, 3 * TILE_PADDING);
      ctx.lineTo(TILE_SIZE - TILE_PADDING, 1.5 * TILE_PADDING);
      ctx.moveTo(TILE_SIZE - TILE_PADDING, TILE_SIZE / 2);
      ctx.lineTo(TILE_SIZE - 3 * TILE_PADDING, 3 * TILE_PADDING);
      ctx.lineTo(TILE_SIZE * 0.75 - TILE_PADDING / 2, TILE_SIZE * 0.75 - TILE_PADDING / 2);
      ctx.lineTo(3 * TILE_PADDING, TILE_SIZE - 3 * TILE_PADDING);
      ctx.lineTo(TILE_SIZE / 2, TILE_SIZE - TILE_PADDING);
      ctx.moveTo(TILE_SIZE - 3 * TILE_PADDING, 3 * TILE_PADDING);
      ctx.lineTo(3 * TILE_PADDING, TILE_SIZE - 3 * TILE_PADDING);
      ctx.stroke();
    }
    ctx.restore();
  }
}

function drawTile(x, y, color) {
  if (!color) return;
  ctx.drawImage(osc, (color - 1) * TILE_SIZE, 0, TILE_SIZE, TILE_SIZE, x, y, TILE_SIZE, TILE_SIZE);
}

function drawBoard() {
  ctx.clearRect(0, 0, canvasW, canvasH);
  for (var i = 0; i < boardW; ++i) {
    for (var j = 0; j < boardH; ++j) {
      drawTile(i * TILE_SIZE, j * TILE_SIZE, board[j * boardW + i]);
    }
  }

  window.requestAnimationFrame(drawBoard);  
}

function handleClick(e) {
  var rect = canvas.getBoundingClientRect();
  var scaleX = canvasW / rect.width / TILE_SIZE;
  var scaleY = canvasH / rect.height / TILE_SIZE;
  var i = Math.floor((e.clientX - rect.left) * scaleX);
  var j = Math.floor((e.clientY - rect.top) * scaleY);
  if (clickable) floodRemove(i, j);
}

function shouldRemove(i, j, color, removed) {
  if (i < 0 || i >= boardW) return false;
  if (j < 0 || j >= boardH) return false;
  if (board[j * boardW + i] !== color) return false;
  return removed.indexOf(j * boardW + i) < 0;
}

function swapTiles(a, b) {
  var tmp = board[a];
  board[a] = board[b];
  board[b] = tmp;
}

function swapColumns(a, b) {
  for (var j = 0; j < boardH; ++j) {
    swapTiles(j * boardW + a, j * boardW + b);
  }
}

function compactColumn(i) {
  var sum = 0;
  for (var j = boardH - 1; j > 0; --j) {
    for (var k = 0; k < j; ++k) {
      if (board[k * boardW + i] && !board[(k + 1) * boardW + i]) {
        swapTiles(k * boardW + i, (k + 1) * boardW + i);
      }
    }
    sum += !!board[j * boardW + i];
  }
  return sum + !!board[i];
}

function compactColumns() {
  var columnSums = [];
  for (var i = 0; i < boardW; ++i) {
    columnSums.push(compactColumn(i));
  }
  
  for (var i = boardW - 1; i > 0; --i) {
    for (var k = 0; k < i; ++k) {
      if (!columnSums[k] && columnSums[k + 1]) {
        columnSums[k] = columnSums[k + 1];
        columnSums[k + 1] = 0;
        swapColumns(k, k + 1);
      }
    }
  }
}

function floodRemove(i, j) {
  var color = board[j * boardW + i];
  if (!color) return;
  
  var q = [[i, j]];
  var rq = [j * boardW + i];
  
  while (q.length) {
    var currentTile = q.shift();
    var ci = currentTile[0];
    var cj = currentTile[1];
    if (shouldRemove(ci - 1, cj, color, rq)) {
      q.push([ci - 1, cj]);
      rq.push(cj * boardW + ci - 1);
    }
    if (shouldRemove(ci + 1, cj, color, rq)) {
      q.push([ci + 1, cj]);
      rq.push(cj * boardW + ci + 1);
    }
    if (shouldRemove(ci, cj - 1, color, rq)) {
      q.push([ci, cj - 1]);
      rq.push((cj - 1) * boardW + ci);
    }
    if (shouldRemove(ci, cj + 1, color, rq)) {
      q.push([ci, cj + 1]);
      rq.push((cj + 1) * boardW + ci);
    }
  }
  
  if (rq.length <= 2) return;
  
  var scoreStep = rq.length - 2;
  
  clickable = false;
  (function removeTile() {
    if (rq.length) {
      var idx = rq.shift();
      score += scoreStep;
      scoreCounter.innerHTML = score;
      board[idx] = 0;
      setTimeout(removeTile, 50);
    } else {
      compactColumns();
      clickable = true;
    }
  })();
}

prerenderTiles();
resetBoard();

canvas.addEventListener('click', handleClick);
restartButton.addEventListener('click', resetBoard);
window.requestAnimationFrame(drawBoard);