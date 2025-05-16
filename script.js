var turn = 0; // 0 for O, 1 for X
const o_img = "images/o.png"; // Matches your specified file name for 'O'
const x_img = "images/x.png"; // Matches your specified file name for 'X'
var o_moves = [];
var x_moves = [];
var gameOver = false; // Flag to disable clicks after game ends
var win_set = [[1,2,3], [4,5,6], [7,8,9], [1,4,7], [2,5,8], [3,6,9], [1,5,9], [3,5,7]];

function changeTurn() {
    turn = (turn + 1) % 2;
    console.log("turn = " + turn + "\n");
    console.log("O : " + o_moves + "x_moves : " + x_moves + "\n");
    if (turn == 0) {
        document.querySelector(".turn_display").innerHTML = "O's turn";
        document.body.style.cursor = "url('images/p1.cur'), auto"; // Set cursor for O's turn
    } else {
        document.querySelector(".turn_display").innerHTML = "X's turn";
        document.body.style.cursor = "url('images/p2.cur'), auto"; // Set cursor for X's turn
    }
}

function addImage(button) {
    if (button.innerHTML.trim() !== "" && button.querySelector('img')) {
        console.log("This box is already played.");
        return false;
    }
    let image = document.createElement("img");
    image.style.width = "85px";
    image.style.height = "85px";
    if (turn == 0) {
        image.src = o_img;
    } else {
        image.src = x_img;
    }
    button.appendChild(image);
    button.classList.add('played'); // Mark as played for cursor/styling
    return true;
}

function checkWinner(moves) {
    for (let combo of win_set) {
        if (combo.every(num => moves.includes(num))) {
            return combo; // Return the winning combination (e.g., [1, 2, 3])
        }
    }
    return null; // No winner
}

function highlightWinningSet(winningSet, player) {
    const highlightColor = player === "O" ? "rgba(0, 255, 0, 0.3)" : "rgba(255, 0, 0, 0.3)";
    winningSet.forEach(cellNumber => {
        const cell = document.getElementById("b" + cellNumber);
        if (cell) {
            cell.style.backgroundColor = highlightColor;
        }
    });
}

function endGame(text) {
    alert(text);
    gameOver = true; // Disable further clicks
    document.body.classList.add('game-over'); // Optional: for cursor or styling
}

function reset() {
    for (let i = 1; i <= 9; i++) {
        const element = document.getElementById("b" + i);
        if (element) {
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
            element.style.backgroundColor = "rgb(243, 226, 131)"; // Reset highlight
            element.classList.remove('played');
        }
    }
    x_moves = [];
    o_moves = [];
    turn = 0;
    gameOver = false; // Re-enable clicks
    document.querySelector(".turn_display").innerHTML = "O's turn";
    document.body.classList.remove('game-over', 'x-turn');
    document.body.classList.add('o-turn');
    document.body.style.cursor = "url('images/p1.cur'), auto"; // Reset cursor to O's turn
    console.log("X moves = " + x_moves + ", O moves = " + o_moves + ", turn = " + turn);
}

function handleClick(event) {
    if (gameOver) return; // Prevent clicks after game ends
    let button = event.target.closest('.box');
    let box_id = button.id;
    let box_id_number = parseInt(box_id.replace("b", ""));
    if (turn == 0) {
        o_moves.push(box_id_number);
    } else {
        x_moves.push(box_id_number);
    }
    if (addImage(button)) {
        changeTurn();
    }
    let winningSetO = checkWinner(o_moves);
    if (winningSetO) {
        document.querySelector(".turn_display").innerHTML = "O WINS!";
        highlightWinningSet(winningSetO, "O"); // Highlight winning cells for O
        endGame("O WINS!");
        return;
    }
    let winningSetX = checkWinner(x_moves);
    if (winningSetX) {
        document.querySelector(".turn_display").innerHTML = "X WINS!";
        highlightWinningSet(winningSetX, "X"); // Highlight winning cells for X
        endGame("X WINS!");
        return;
    }
    if (x_moves.length + o_moves.length == 9) {
        endGame("DRAW!");
        return;
    }
}

// Attach event listeners to all buttons with IDs b1 to b9
for (var i = 1; i <= 9; i++) {
    document.getElementById("b" + i).addEventListener("click", handleClick);
}

document.getElementById("reset_button").addEventListener("click", reset);
