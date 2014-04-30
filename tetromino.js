//color is the color of the tile
//array is a 2darray containing the place of the tiles

function TiledTemplate(color, array) {
	this.color = color;
	this.array = array;
}

//x and y are top left corner position
function Tetromino(template, x, y) {
	this.color = template.color;
	this.array = template.array;
	this.x = x;
	this.y = y;
	this.width = this.array[0].length;
	this.height = this.array.length;
	this.landed = false;
}

//rotates the tetromino array clockwise
Tetromino.prototype.clockwise = function() {
	this.diagonalFlip();
	this.horizontalFlip();
}

Tetromino.prototype.diagonalFlip = function() {
	var temp = this.array.slice(0, this.array.length);
	this.array = [];
	
	for (var j = 0; j < temp[0].length; j++) { //columns
		this.array[j] = [];
		var rowString = "";

		for (var i = 0; i < temp.length; i++) { //rows
			this.array[j][i] = 0;
		}

	}

	for (var i = 0; i < temp.length; i++) { //rows

		for (var j = 0; j < temp[i].length; j++) { //columns
			this.array[j][i] = temp[i][j];
		}
		
	}

	temp = this.width;
	this.width = this.height;
	this.height = temp;
}

Tetromino.prototype.horizontalFlip = function() {
	for (var i = 0; i < this.array.length; i++) {
		for (var j = 0; j < this.array[i].length / 2; j++) {
			var temp = this.array[i][j];
			this.array[i][j] = this.array[i][this.array[i].length - 1 - j];
			this.array[i][this.array[i].length - 1 - j] = temp;
		}
	}
}

Tetromino.prototype.verticalFlip = function() {
	for (var i = 0; i < this.array.length / 2; i++) {
		var temp = this.array[i];
		this.array[i] = this.array[this.array.length - 1 - i];
		this.array[this.array.length - 1 - i] = temp;
	}
}

//rotates the tetromino array counter clockwise
Tetromino.prototype.counterClockwise = function() {
	this.diagonalFlip();
	this.verticalFlip();
}
