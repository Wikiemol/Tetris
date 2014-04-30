addEventListener('load', Main, false);

function Main() {
	Main.canvas = document.getElementById('can');	
	Main.ctx = Main.canvas.getContext('2d');

	//the size of each tile
	Main.tileSize = 20;

	//next is the next tetromino to be dropped
	//current is the current tetromino being controlled by the player
	Main.next;
	Main.current;

	Main.width = 10;
	Main.height = 22;

	//the tile matrix for the game
	Main.matrix = [];

	for (var i = 0; i < Main.height; i++) {
		Main.matrix[i] = [];
		for (var j = 0; j < Main.width; j++)
			Main.matrix[i][j] = 0; 
	}


	//Making the tetris pieces
	Main.pieces = [];

	Main.pieces[0] = new TiledTemplate("#ff6600", 
				      [[1, 1, 1],
				       [1, 0, 0]]);

	Main.pieces[1] = new TiledTemplate("#0066ff", 
				      [[1, 1, 1],
				       [0, 0, 1]]);

	Main.pieces[2] = new TiledTemplate("#bb00bb", //he he
				      [[0, 1, 0],
				       [1, 1, 1]]);

	Main.pieces[3] = new TiledTemplate("#ffff00", 
				      [[1, 1],
				       [1, 1]]);

	Main.pieces[4] = new TiledTemplate("#00ff11", 
				      [[1, 1, 0],
				       [0, 1, 1]]);

	Main.pieces[5] = new TiledTemplate("#ff0000", 
				      [[0, 1, 1],
				       [1, 1, 0]]);

	Main.pieces[6] = new TiledTemplate("#888888", 
				      [[1, 1, 1, 1]]);
	
	//the number of times the loop will run until the tetromino moves down
	Main.maxSpeed = 30;
	Main.speed = Main.maxSpeed;
	Main.counter = 0;
	//number of lines cleared
	Main.lines = 0;
	//score
	Main.score = 0;

	Main.paused = false;

	addEventListener('keydown', Main.keyDownHandler, false);
	addEventListener('keyup', Main.keyUpHandler, false);

	//filling next and current
	Main.makeTetromino();
	Main.makeTetromino(); //not war

	//starting main game loop
	Main.loop();
	Main.interval = setInterval(Main.loop, 33);
}

Main.loop = function() {
	if (Main.current.landed) {
		for (var i = 0; i < Main.current.array.length; i++) {
			for (var j = 0; j < Main.current.array[i].length; j++) {
				if (Main.current.array[i][j] == 1)
					Main.matrix[Main.current.y + i][Main.current.x + j] = Main.current.color;
			}
		}
		Main.makeTetromino();
	} else {
		if (Main.counter == Main.speed - 1) {
			if (!Main.collideDown())
				Main.current.y += 1;

		}


		Main.counter = (Main.counter + 1) % Main.speed
	}

	if (Main.current.x + Main.current.width > Main.width)
		Main.current.x -= Main.current.x + Main.current.width - Main.width;

	if (Main.current.y + Main.current.height > Main.height)
		Main.current.y -= Main.current.y + Main.current.height - Main.height;



	

	Main.draw();

	Main.collectPoints();
}

Main.keyUpHandler = function(e) {
	if (e.keyCode == 40)
		Main.speed = Main.maxSpeed;
}

Main.keyDownHandler = function(e) {
	if (!Main.paused) {
		if (e.keyCode == 37 && !Main.collideLeft()) //left
			Main.current.x--;

		if (e.keyCode == 39 && !Main.collideRight()) //right
			Main.current.x++;
		
		if (e.keyCode == 38 || e.keyCode == 88) { //up or x
			Main.current.clockwise();
			for (var i = 0; i < Main.current.height; i++) {
				for (var j = 0; j < Main.current.width; j++) {
					if (Main.current.array[i][j] == 1 && Main.matrix[Main.current.y + i][Main.current.x + j] != 0) {
						Main.current.counterClockwise();
						break;
					}
				}
			}
		}
		
		if (e.keyCode == 90) { //z
			Main.current.counterClockwise();
			for (var i = 0; i < Main.current.height; i++) {
				for (var j = 0; j < Main.current.width; j++) {
					if (Main.current.array[i][j] == 1 && Main.matrix[Main.current.y + i][Main.current.x + j] != 0) {
						Main.current.clockwise();
						break;
					}
				}
			}
		}

		if (e.keyCode == 40) //down
			Main.speed = 1;
	}
	
	if (e.keyCode == 32) {
		if (Main.paused)
			Main.play();
		else
			Main.pause();
	}
}

Main.draw = function() {
	Main.ctx.clearRect(0, 0, 500, 500);

	for (var i = 0; i < Main.matrix.length; i++) {
		for (var j = 0; j < Main.matrix[i].length; j++) {
			if (Main.matrix[i][j] != 0) {
				Main.ctx.fillStyle = Main.matrix[i][j];
				Main.ctx.fillRect(j*Main.tileSize, i*Main.tileSize, Main.tileSize, Main.tileSize);
			}
		}
	}


	for (var i = 0; i < Main.current.array.length; i++) {
		for (var j = 0; j < Main.current.array[i].length; j++) {

			if (Main.current.array[i][j] == 1) {
				Main.ctx.fillStyle = Main.current.color;
				Main.ctx.fillRect((Main.current.x + j) * Main.tileSize, 
					  	  (Main.current.y + i) * Main.tileSize, 
					  	  Main.tileSize, Main.tileSize);
			}

		}
	}
}

Main.collideDown = function() {
	if (Main.current.y + Main.current.height == Main.height) {
		Main.current.landed = true;
		return true;
	}

	for (var i = 0; i < Main.current.height; i++) {
		for (var j = 0; j < Main.current.width; j++) {
			if (Main.current.array[i][j] == 1 && 
			    Main.matrix[Main.current.y + i + 1][Main.current.x + j] != 0) {
				Main.current.landed = true;
				return true;

			}
		}
	}
	return false;
}

Main.collideLeft = function() {
	if (Main.current.x == 0)
		return true;

	for (var i = 0; i < Main.current.height; i++) {
		for (var j = 0; j < Main.current.width; j++) {
			if (Main.current.array[i][j] == 1 && Main.matrix[Main.current.y + i][Main.current.x + j - 1] != 0)
				return true;
		}
	}
	return false;
}

Main.collideRight = function() {
	if (Main.current.x + Main.current.width == Main.width)
		return true;

	for (var i = 0; i < Main.current.array.length; i++) {
		for (var j = 0; j < Main.current.array[i].length; j++) {
			if (Main.current.array[i][j] == 1 && Main.matrix[Main.current.y + i][Main.current.x + j + 1] != 0)
				return true;
		}
	}
	return false;
}

Main.pause = function() {
	clearInterval(Main.interval);	
	Main.paused = true;
}

Main.play = function() {
	Main.interval = setInterval(Main.loop, 33);
	Main.paused = false;
}

Main.deleteRow = function(row) {
	var previous = [];
	var i;
	for (i = 0; i < Main.width; i++)
		previous[i] = 0;

	for (i = 0; i < Main.height; i++) {
		var temp = Main.matrix[i];
		Main.matrix[i] = previous;
		previous = temp;

		if (i == row)
			break;
	}
}

//deletes all rows that go all the way across
Main.collectPoints = function() {

	for (var i = 0; i < Main.height; i++) {
		var rowComplete = true;

		for (var j = 0; j < Main.width; j++) {
			if (Main.matrix[i][j] == 0) {
				j = Main.width;
				rowComplete = false;
			}
		}

		if (rowComplete) {
			Main.deleteRow(i);
			Main.lines++;
			if (Main.lines % 2 == 0) {
				Main.maxSpeed--;
				Main.speed = Main.maxSpeed;
			}	
			console.log(Main.lines);

		}
	}

}

Main.makeTetromino = function() { 
	Main.current = Main.next;
	var piece = Math.round(Math.random() * 6);
	Main.next = new Tetromino(Main.pieces[piece], 0, 0);
}
