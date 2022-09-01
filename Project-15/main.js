var s = c.width = c.height = 512
	,	ctx = c.getContext( '2d' );

var w = 33
	,	h = 33
	,	maze = []
	,	dirs = [
		{ x: -2, y: 0 },
		{ x: 0, y: -2 },
		{ x: 2, y: 0 },
		{ x: 0, y: 2 },
	]
	,	goal = {};

function genMaze(){
	maze.length = 0;
	for( var x = 0; x < w; ++x ){
		maze.push([]);
		for( var y = 0; y < h; ++y ){
			maze[x].push(0);
		}
	}
	
	var head = { x: 1, y: 1 }
		,	stack = []
		,	furthest = {
			stackLen: 0,
			cell: head
		};
	
	maze[1][1] = 1;
	
	do {
		var available = [
			{ x: head.x + dirs[0].x, y: head.y + dirs[0].y, i: 0 },
			{ x: head.x + dirs[1].x, y: head.y + dirs[1].y, i: 1 },
			{ x: head.x + dirs[2].x, y: head.y + dirs[2].y, i: 2 },
			{ x: head.x + dirs[3].x, y: head.y + dirs[3].y, i: 3 },
		].filter( function( coord ){
			return ( coord.x > 0 && coord.x < w && coord.y > 0 && coord.y < h &&
						 maze[coord.x][coord.y] === 0 );
		});
		
		if( available.length > 0 ){
			stack.push( head );
			var nextHead = available[ Math.random() * available.length |0 ];
			maze[(head.x + nextHead.x)/2][(head.y + nextHead.y)/2] = 1;
			head = nextHead;
			maze[head.x][head.y] = 1;
		} else {
			if( stack.length > furthest.stackLen ){
				furthest.stackLen = stack.length;
				furthest.cell = head;
			}
			stack.pop();
			head = stack[stack.length - 1];
		}
		
	} while( stack.length > 0 );
	
	goal = furthest.cell;
	//console.log( ('\n' + maze.join('\n')).replace(/,/g,'').replace(/1/g,' ') );
}

function renderMaze(){
	
	ctx.fillStyle = '#222';
	ctx.fillRect( 0, 0, s, s );
	
	var cellSize = Math.min( s / w, s / h );
	ctx.translate( s / 2 - w * cellSize / 2, s / 2 - h * cellSize / 2 );
	for( var x = 0; x < w; ++x ){
		for( var y = 0; y < h; ++y ){
			ctx.fillStyle = maze[x][y] ? '#eee' : '#000';
			ctx.fillRect( x * cellSize - .5, y * cellSize - .5, cellSize + 1, cellSize + 1 );
		}
	}
	
	ctx.fillStyle = '#495';
	ctx.fillRect( goal.x * cellSize + cellSize / 4, goal.y * cellSize + cellSize / 4, cellSize / 2, cellSize / 2 );
	ctx.fillStyle = '#945';
	ctx.fillRect( player.x * cellSize + cellSize / 4, player.y * cellSize + cellSize / 4, cellSize / 2, cellSize / 2 );
	ctx.translate( -(s / 2 - w * cellSize / 2), -(s / 2 - h * cellSize / 2));
}

var keys = [ 
	{ codes: [ 37, 72, 65 ], pressed: false }, // left
	{ codes: [ 38, 75, 87 ], pressed: false }, // up
	{ codes: [ 39, 76, 68 ], pressed: false }, // right
	{ codes: [ 40, 74, 83 ], pressed: false }  // down
];

var lastInput = Date.now()
	,	player = { x: 1, y: 1 };

function anim(){
	window.requestAnimationFrame( anim );
	
	keys.map( function( key, i ){
		if( key.pressed && Date.now() - lastInput > 20 ){
			var newX = player.x + dirs[i].x/2
				,	newY = player.y + dirs[i].y/2;
			
			if( maze[newX][newY] ){
				player.x = newX;
				player.y = newY;
				lastInput = Date.now();
				
				if( newX === goal.x && newY === goal.y ){
					win.classList.add( 'showing' );
				}
			}
		}
	})
	
	renderMaze();
}
genMaze();
anim();


window.addEventListener( 'keydown', function( e ){
	keys.map( function( key ){
		if( key.codes.indexOf( e.keyCode ) > -1 )
			key.pressed = true;
	});
});
window.addEventListener( 'keyup', function( e ){
	keys.map( function( key ){
		if( key.codes.indexOf( e.keyCode ) > -1 )
			key.pressed = false;
	});
});

beginButton.addEventListener( 'click', function(){
	w = +widthInput.value;
	h = +heightInput.value;
	win.classList.remove( 'showing' );
	player.x = player.y = 1;
	genMaze();
});