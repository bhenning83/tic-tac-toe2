const GameBoard = (function() {
  let board = ["", "", "", "", "", "", "", "", ""];

  //Cache DOM
  squares = document.querySelectorAll(".square");

  function render() {
    for (i = 0; i < squares.length; i++) {
      squares[i].innerText = board[i];
    }
  }

  return {render, board, squares};
})();

const Player = (marker) => {
  winning_combos = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  let playLog = [];
  
  function checkForWinner() {
    winner = []
    winning_combos.map(combo => { //Iterates through winning combos
      results = [];
      combo.map(x => {
        if (playLog.includes(x)) results.push(x)
      }); 
      if (results.length == 3) winner.push(results); //If all three numbers in winning combo are in player's play
    });
    return winner
  }

  return {checkForWinner, playLog, marker}
};


const Game = (function() {
  config = {};

  //Cache DOM
  winnerBox = document.querySelector(".winner-box");  
  //Turns HTML collection into array
  squares = Array.prototype.slice.call( GameBoard.squares );

  function startGame() {
    squares.forEach(square => {
      square.addEventListener("click", playTurn) //adds listner to each square in grid
    });
    setConfig();
  }
  
  function setConfig() {
    player1 = Player("X")
    player2 = Player("O")
    config = {player1, player2, currentPlayer: player1}
  }

  function playTurn() {
    player = config.currentPlayer; 
    console.log(player)
    makePlay.bind(this)(); //binds selected square
    combo = player.checkForWinner();
    if (combo.length == 1) {
      announceWinner(combo, player);//so checkForWinner is run on correct player
      endGame();
    }
  }
  
  function makePlay() {
    //returns id number of square
    id = Number(this.id.slice(-1));
    
    //prevents play in already taken square
    if (GameBoard.board[id] === "") { 
      GameBoard.board[id] = config.currentPlayer.marker;
      config.currentPlayer.playLog.push(id);
      GameBoard.render();
      changePlayer();
    }
  }

  function changePlayer() {
      config.currentPlayer == config.player1 ?
      config.currentPlayer = config.player2 :
      config.currentPlayer = config.player1;
  }

  function announceWinner(combo, player) {
    winnerBox.innerText = `${player.marker} is the winner!`
  }

  function endGame() {
    squares.forEach(square => {
      square.removeEventListener("click", playTurn)
    });
  }

  return {startGame}
})();

Game.startGame();