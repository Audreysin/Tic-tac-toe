/*
Purpose: Tic tac toe game program for 2 players allowing the players to make moves, undo moves,
         reset the grid and start a new game
*/

var player_x = null;
var player_o = null;
let play_with_computer = false;
let ai;
let human;

var grid = 
[[" "," "," "],
[" "," "," "],
[" "," "," "]];

const x = "X";
const o = "O";
var currentPlayer = x;

// moveHistory: Stack array of arrays of positions in the grid that has been modified
var moveHistory = [];

function getName() {
	player_x = document.getElementById("X").value;
	player_o = document.getElementById("O").value;
	
	if (player_x === "") {
		player_x = "X";
	}
	
	if (player_o === "") {
		player_o = "O";
	}
	document.getElementById("homeScreen").style.display = "none";
	document.getElementById("gameScreen").style.display = "block";
	document.getElementById("playerX").innerHTML = player_x;
	document.getElementById("playerO").innerHTML = player_o;
	document.getElementById("player").innerHTML = player_x;
	document.getElementById("Xscore").innerHTML = 0;
	document.getElementById("Oscore").innerHTML = 0;
}

function startGame() {
	
	play_with_computer = true;
	player_x = document.getElementById("X").value;
	player_o = document.getElementById("O").value;
	if (player_x === "") {
		player_x = "Computer";
		if(player_o === "") {
			player_o = "Human";
		}
		ai = x;
		human = o;
	} else {
		player_o = "Computer";
		ai = o;
		human = x;
	}
	document.getElementById("homeScreen").style.display = "none";
	document.getElementById("gameScreen").style.display = "block";
	document.getElementById("playerX").innerHTML = player_x;
	document.getElementById("playerO").innerHTML = player_o;
	document.getElementById("player").innerHTML = player_x;
	document.getElementById("Xscore").innerHTML = 0;
	document.getElementById("Oscore").innerHTML = 0;
	if (currentPlayer === ai && play_with_computer) {
		aiMove();
	}
}

function makeMove(row, column) {
	(grid[row])[column] = currentPlayer;
	var position = ("r"+(row+1).toString()+"c"+(column+1)).toString();
	document.getElementById(position).innerHTML = currentPlayer;
	moveHistory.unshift([row,column]);
	let cell = document.getElementById(position);
	let counter = 0;
	let blinkColor = {
		"X": "red",
		"O": "green"
	};
	let blinker = setInterval(function() { 
			cell.style.color = (cell.style.color == 'black' ? blinkColor[currentPlayer] : 'black');
			counter++;
			if (counter >= 6) {
				cell.style.color = 'black';
				clearInterval(blinker);
			}
		}, 300);
}

function victoryProcedure() {
	score = parseInt(document.getElementById(currentPlayer+"score").innerHTML, 10) + 1;
	document.getElementById(currentPlayer+"score").innerHTML = score;
	let winnerName = null;
	if (currentPlayer === "X") {
		winnerName = player_x;
	} else if (currentPlayer === "O") {
		winnerName = player_o;
	} else {
		winnerName = "Unknown";
	}
	document.getElementById("message").innerHTML = "Congratulation " + winnerName + "!";
	document.getElementById("message").style.display = "block";
	setTimeout(
		function () {
			document.getElementById("message").style.display = "none";
			reset();
		}, 3000);
}

function tieProcedure(){
	document.getElementById("message").innerHTML = "It's a tie! Game being reset...";
	document.getElementById("message").style.display = "block";
	setTimeout(
		function () {
			document.getElementById("message").style.display = "none";
			reset();
		}, 3000);
}

let scores = {
	"ai": 10,
	"human": -10,
	"tie": 0
};

function bestMove() {
	let bestScore = -Infinity;
	let move = null;
	for (let row = 0; row < 3; row++) {
	  for (let col = 0; col < 3; col++) {
		// Is the spot available?
		if (grid[row][col] === " ") {
		  grid[row][col] = ai;
		  let score = minimax(grid, false);
		  grid[row][col] = " ";
		  if (score > bestScore) {
			bestScore = score;
			move = [row, col];
		  }
		}
	  }
	}
	if (move === null) {
		alert("The board is full!");
	}
	return move;
}

function getWinner(isMaximizing) {
	if (winnerCheck()) {
		if (isMaximizing) {
			return "human";
		} else {
			return "ai";
		}
	} else if (isGridFull()) {
		return "tie";
	} else {
		return null;
	}
}

function minimax(board, isMaximizing) {
	let result = getWinner(isMaximizing);
	if (result !== null) {
	  return scores[result];
	}

	if (isMaximizing) {
		let bestScore = -Infinity;
		for (let i = 0; i < 3; i++) {
		  for (let j = 0; j < 3; j++) {
			// Is the spot available?
			if (board[i][j] === ' ') {
			  board[i][j] = ai;
			  let score = minimax(board, false);
			  board[i][j] = ' ';
			  bestScore = Math.max(score, bestScore);
			}
		  }
		}
		return bestScore;
	} else {
		let bestScore = Infinity;
		for (let i = 0; i < 3; i++) {
		  for (let j = 0; j < 3; j++) {
			// Is the spot available?
			if (board[i][j] === ' ') {
			  board[i][j] = human;
			  let score = minimax(board, true);
			  board[i][j] = ' ';
			  bestScore = Math.min(score, bestScore);
			}
		  }
		}
		return bestScore;
	}
}

function aiMove() {
	const nextAIMove = bestMove();
	makeMove(nextAIMove[0], nextAIMove[1]);
	if (winnerCheck()) {
		victoryProcedure();
		// No change in current player
	} else {
		switchPlayer();
		if (isGridFull()) {
			tieProcedure();
		}
	}
}

// newMove (row,column) If the move is valid (i.e. if position (row, column) is empty),
//.         inserts "X" or "O" in the grid, updates the grid on the webpage and checks for winner.
//		    If there is a winner, the score of the winner is updated on the webpage and 
//			the grid is reset for a new game. Otherwise, currentPlayer is updated to the next player.
//			If the grid is full, the grid is reset for a new game.
//			If the move is invalid, a message is displayed
// requires: 0 <= row <= 2
// 			 0 <= column <= 2
// side-effects: Mutates the global variables grid, currentPlayer, moveHistory
function newMove(row,column) {
	if ((grid[row])[column] === " ") {
		makeMove(row, column);
		if (winnerCheck()) {
			victoryProcedure();
			// No change in current player
		} else {
			switchPlayer();
			if (isGridFull()) {
				tieProcedure();
				return
			}
			if (play_with_computer) {
				setTimeout(function() {aiMove()}, 2000);
			}
		}
	} else {
		document.getElementById("message").innerHTML = "This move is invalid. Try again!";
		document.getElementById("message").style.display = "block";
		setTimeout(function () {document.getElementById("message").style.display = "none"}, 1000);
	}
}

//switchPlayer() Changes currentPlayer from x to o or vice versa
//.              Updates the document element
//				 If currentPlayer is not x or o, an alert message is displayed	
// side-effect: Mutates currentPlayer

function switchPlayer(){
	if (currentPlayer === x) {
		currentPlayer = o;
		document.getElementById("player").innerHTML = player_o;
	} else if (currentPlayer === o) {
		currentPlayer = x;
		document.getElementById("player").innerHTML = player_x;
	} else {
		alert("Something is wrong with the player!");
	}
}

// winnerCheck() Returns True if there is a winner. Otherwise, returns False
function winnerCheck() {
	var winner = null;
	for (i = 0; i <= 2; i++) {
		// checks the ith row
		if (((grid[i])[0] !== " ") &&
		 (((grid[i])[0] === (grid[i])[1]) &&
		  (grid[i])[1] === (grid[i])[2])) {
			winner = (grid[i])[0];
			break;
		}
		// checks the ith column
		if (((grid[0])[i] !== " ") &&
		 (((grid[0])[i] === (grid[1])[i]) &&
		  ((grid[1])[i] === (grid[2])[i]))) {
			winner = (grid[0])[i];
			break;
		}
		// checks diagonal entries if i = 1 and the "middle square" is not empty
		if ((i === 1) && ((grid[1])[1] !== " ")) {
			var middlePiece = (grid[1])[1]
			if ((((grid[0])[0] === middlePiece) &&
			 ((grid[2])[2] == middlePiece)) || 
				(((grid[0])[2] === middlePiece) &&
					((grid[2])[0] == middlePiece)))
				winner = middlePiece;
		}
	}
	if (winner === null) {
		return false;
	} else {
		return true;
	}
}


// undo() Undoes the last move by removing the last item added to the grid and the player whose turn it is to play
//.       If there is no previous move, a message is displayed on the webpage
// side-effect: Mutates global variables moveHistory, currentPlayer		  
function undo() {
	if (moveHistory.length >= 1) {
		var lastMove = moveHistory.shift();
		var row = lastMove[0];
		var column = lastMove[1];
		(grid[row])[column] = " ";
		gridUpdater();
		switchPlayer();
		if (play_with_computer && currentPlayer === ai) {
			undo();
		}
	} else {
		document.getElementById("message").innerHTML = "No previous move";
		document.getElementById("message").style.display = "block";
		setTimeout(function () {document.getElementById("message").style.display = "none"}, 2000);
		if (play_with_computer && currentPlayer === ai) {
			aiMove();
		}
	}
}

// reset() Resets the grid to an empty grid and clears the history of move stack
// side-effects: Mutates the global variables grid, moveHistory
function reset() {
	for (row = 0; row <= 2; row++){
		for (col = 0; col <= 2; col++) {
			(grid[row])[col] = " ";
		}
	}
	gridUpdater();
	while (moveHistory.length > 0) {
		moveHistory.shift();
	}
	if (play_with_computer && currentPlayer===ai) {
		aiMove();

	}
}

// isGridFull() Returns true if grid is "full". Otherwise, returns false
function isGridFull() {
	for (let row = 0; row <= 2; row++){
		for (let col = 0; col <= 2; col++) {
			if ((grid[row])[col] === " ") {
				return false;
			}
		}
	}
	return true;
}

// gridUpdate() Updates the html grid based on the variable grid
function gridUpdater() {
	for (row = 0; row <= 2; row++){
		for (col = 0; col <= 2; col++) {
			var position = "r"+(row+1).toString()+"c"+(col+1).toString();
			document.getElementById(position).innerHTML = (grid[row])[col];
		}
	}
}

function newGame() {
	player_x = null;
	player_o = null;
	currentPlayer = x;
	play_with_computer = false;
	ai = null;
	human = null;
	reset();
	document.getElementById("homeScreen").style.display = "block";
	document.getElementById("gameScreen").style.display = "none";
}