
document.addEventListener("DOMContentLoaded", function() {
  
    var c = document.getElementById("board");
    var ctx = c.getContext("2d");
    c.width = 400;
    c.height = 400;
  
    var map = [
      [4,9,12,8],
      [6,15,3,11],
      [7,0,1,10],
      [13,14,2,5]
    ];
    
    var winMap = [
      [1,2,3,4],
      [5,6,7,8],
      [9,10,11,12],
      [13,14,15,0]
    ];
  
    var tileMap = [];
  
    var tile = {
    width : 100,
    height : 100
    };
  
    var pos = {
      x : 0,
      y : 0,
      textx : 45,
      texty : 55
    };
  
    var drawTile = function(){
      ctx.fillStyle = '#EB5E55';
      ctx.shadowColor = '#000';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 2;
      ctx.fillRect(pos.x + 5,pos.y + 5,tile.width-10,tile.height-10);
      ctx.shadowColor = "transparent";
      ctx.fillStyle = '#FFFFFF';
      ctx.font = "20px Arial";
      //adjust center for larger numbers
      if(map[i][j] >= 10){
        ctx.fillText(map[i][j], pos.textx -2 , pos.texty);
      }else{
        ctx.fillText(map[i][j], pos.textx + 2 , pos.texty);
      }
    };
  
    var buildBoard = function(){
      for(i = 0; i < map.length; i++){
  
        tileMap[i] = [];
  
        for(j = 0; j < map[i].length; j++){
          var currentTile = {
              tileName : map[i][j],
              x : pos.x,
              y : pos.y,
              width : 100,
              height : 100,
              tileIndex : j
            };
  
          if(map[i][j] !== 0){
            //create our numbered box
            drawTile();
            //push box id and cords to tilemap array
            tileMap[i].push(currentTile);
  
          }else{
            //create our zero box
            tileMap[i].push(currentTile);
          }
          pos.textx += 100;
          pos.x += 100;
        }
        pos.x = 0;
        pos.textx = 43;
        pos.texty += 100; 
        pos.y += 100;
      }
    };
  
    //get mouse position
    function getPosition(event){
      
      var x = event.x;
      var y = event.y;
      x -= c.offsetLeft;
      y -= c.offsetTop;
  
      //Check to see which box we are in
      for(var i = 0; i < tileMap.length; i++){
        for(var j = 0; j < tileMap[i].length; j++){
          if(y > tileMap[i][j].y && y < tileMap[i][j].y + tileMap[i][j].height &&
            x > tileMap[i][j].x && x < tileMap[i][j].x + tileMap[i][j].width){
                checkMove(tileMap[i][j].tileName, tileMap[i][j].tileIndex);
             }
        }
      }
    }
  
  
    // detect if move is possible
    var checkMove = function(item, itemIndex){
      //check column for zero and clicked box
      var checkColumn = function(){
        var zeroIndex = null;
        //check for zero
        for(var x = 0; x < map.length; x++){
            zeroIndex = map[x].indexOf(0);
          if(zeroIndex > -1){
            zeroIndex = zeroIndex;
            break;
          }
        }
        if(zeroIndex === itemIndex){
          //create a new array with column values
          var tempArr = [];
          for(var i = 0; i < map.length; i++){
            tempArr.push(map[i][zeroIndex]);
          }
          //keep track of our clicked item and zero
          var zero = tempArr.indexOf(0);
          var selectedItem = tempArr.indexOf(item);
  
          //sort our tempArray
          if (selectedItem >= tempArr.length) {
            var k = selectedItem - tempArr.length;
            while ((k--) + 1) {
              map[i].push(undefined);
            }
          }
          tempArr.splice(selectedItem, 0, tempArr.splice(zero, 1)[0]);
  
          //update our map with the correct values for the column
          for(var l = 0; l < map.length; l++){
            map[l][zeroIndex] = tempArr[l];
          }
        }
      };
  
  
      //check row for zero and clicked box
      var checkRow = function(){
        for(var i = 0; i< map.length; i++){
          var itemIndex = map[i].indexOf(item);
          var zeroIndex = map[i].indexOf(0);
          //if zero and clicked box are present in same row
          if(itemIndex > -1 && zeroIndex > -1){
            //reorder row
            if (itemIndex >= map[i].length) {
              var k = itemIndex - map[i].length;
              while ((k--) + 1) {
                map[i].push(undefined);
              }
            }
            map[i].splice(itemIndex, 0, map[i].splice(zeroIndex, 1)[0]);
          }
        }
      };
  
      checkColumn();
      checkRow();
  
      clear();
    };
  
    var clear = function(){
      ctx.clearRect(0, 0, 400, 400);
      pos = {
        x : 0,
        y : 0,
        textx : 46,
        texty : 55
      };
      buildBoard();
      checkWin();
    };
  
    var checkWin = function(){
      var allMatch = true;
      for(var i = 0; i < winMap.length; i++){
        for(var j = 0; j < winMap[i].length; j++){
          if(map[i][j] !== winMap[i][j]){
            allMatch = false;
          }
        }    
      }
      if(allMatch){
        var winMessage = document.querySelector('.win');
        winMessage.classList.remove('hide');
        winMessage.classList.add('fall');
      }
    }
  
    buildBoard();
    c.addEventListener("mousedown", getPosition, false);
  });