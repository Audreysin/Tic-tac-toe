/*
Purpose: Tic tac toe game program for 2 players allowing the players to make moves, undo moves,
         reset the grid and start a new game
*/

var player_x = null
var player_o = null

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
		(grid[row])[column] = currentPlayer;
		var position = ("r"+(row+1).toString()+"c"+(column+1)).toString();
		
		document.getElementById(position).innerHTML = currentPlayer;
		moveHistory.unshift([row,column]);

		var isWinner = winnerCheck();

		if (isWinner) {
			score = parseInt(document.getElementById(currentPlayer+"score").innerHTML, 10) + 1;
			document.getElementById(currentPlayer+"score").innerHTML = score;
			var winnerName = null;
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
			// No change in current player
		} else {
			switchPlayer();
			if (isGridFull()) {
				document.getElementById("message").innerHTML = "No more valid moves. Game being reset...";
				document.getElementById("message").style.display = "block";
				setTimeout(
					function () {
						document.getElementById("message").style.display = "none";
						reset();
					}, 3000);

			}
		}
		return
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
	} else {
		document.getElementById("message").innerHTML = "No previous move";
		document.getElementById("message").style.display = "block";
		setTimeout(function () {document.getElementById("message").style.display = "none"}, 2000);
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
}

// isGridFull() Returns true if grid is "full". Otherwise, returns false
function isGridFull() {
	for (row = 0; row <= 2; row++){
		for (col = 0; col <= 2; col++) {
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
	reset();
	document.getElementById("homeScreen").style.display = "block";
	document.getElementById("gameScreen").style.display = "none";
}

// ***********************************************************************************

<<<<<<< HEAD
/*
pseudocode
=======
// Further feature to be implemented: Allowing the user to play with the computer
/*
pseudocode for the algorithm to find the best next move for the computer
>>>>>>> c870881d34a4c42abe4bec760f2a40aec423da23

check if each row. column and diagonal if there are 2 identical symbols.
	if so, preferentially choose the one corresponding to the computer's.
 	return position of the empty spot for the computer to make next move

 Find all empty spots in the grid and add the entries to an array.
 Randomly choses one empty spot

 var item = array[Math.floor(Math.random()*array.length)];
*/
<<<<<<< HEAD

// let the user be x by default and the computer be o
=======
>>>>>>> c870881d34a4c42abe4bec760f2a40aec423da23
