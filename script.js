const GameBoard = (function() {
  let board = ["", "", "", "", "", "", "", "", ""];

  //Cache DOM
  squares = document.querySelectorAll(".square");

  function render() {
    for (i = 0; i < playSquares.length; i++) {
      playSquares[i].innerText = board[i];
    }
  }

  return {render, board, squares};
})();

const Player = (marker) => {
  winning_combos = [
    [0, 1, 2], 
    [3, 4, 5], 
    [6, 7, 8], 
    [0, 3, 6], 
    [1, 4, 7], 
    [2, 5, 8], 
    [0, 4, 8], 
    [2, 4, 6]
  ];
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
    return winner[0]
  }

  return {checkForWinner, playLog, marker}
};


const Game = (function() {
  config = {};
  let counter = 0; //tracks plays to check for Cat

  //Cache DOM
  winnerBox = document.querySelector(".winner-box");  
  announcement = document.querySelector(".announcement");
  playAgain = document.querySelector(".play-again")
  //Turns HTML collection into array
  playSquares = Array.prototype.slice.call( GameBoard.squares );

  //Bind Events
  playAgain.addEventListener("click", _restart)

  function startGame() {
    playSquares.forEach(square => {
      square.addEventListener("click", playTurn) //adds listner to each square in grid
    });
    _setConfig();
    winnerBox.style.display = "none"
    GameBoard.render();
  }

  function _setConfig() {
    player1 = Player("X")
    player2 = Player("O")
    config = {player1, player2, currentPlayer: player1}
  }

  function playTurn() {
    player = config.currentPlayer; 
    _makePlay.bind(this)(); //binds selected square
    combo = player.checkForWinner();
    _checkForCat();
    if (combo) {
      console.log('here')
      _announceWinner(combo, player);//so checkForWinner is run on correct player
      _endGame();
    }
  }
  
  function _makePlay() {
    //returns id number of square
    id = Number(this.id.slice(-1));
    
    //prevents play in already taken square
    if (GameBoard.board[id] === "") { 
      GameBoard.board[id] = config.currentPlayer.marker;
      config.currentPlayer.playLog.push(id);
      _changePlayer();
      counter++;
    }
    GameBoard.render();
  }

  function _changePlayer() {
      config.currentPlayer == config.player1 ?
      config.currentPlayer = config.player2 :
      config.currentPlayer = config.player1;
  }

   //if all plays are made and final play wasn't a winner
   function _checkForCat() {
    if ((counter == 9) && (config.currentPlayer.checkForWinner() === undefined)) {
      _announceCat();
    }
  }

  function _announceCat() {
    GameBoard.squares.forEach(square => {
      square.classList.add("cat-game")
    })
  }

  function _announceWinner(combo, player) {
    winnerBox.style.display = "block"
    announcement.innerText = `${player.marker} is the winner!`
    _showWin(combo)
  }

  //adds box shadow to winning combo
  function _showWin(combo) {
    combo.forEach(i => {
      GameBoard.squares[i].classList.add("winning-combo")
    })
  }

  //prevents further play once someone wins
  function _endGame() {
    playSquares.forEach(square => {
      square.removeEventListener("click", playTurn)
    });
  }

  function _restart() {
    config.player1.playLog = [];
    config.player2.playLog = [];
    counter = 0;
    for (i = 0; i < 9; i++) {
      GameBoard.board[i] = "";
      GameBoard.squares[i].classList.remove("winning-combo") //removes box shadow from winning combo
      GameBoard.squares[i].classList.remove("cat-game") //removes box shadow from cat game
    }
    startGame();
  }

  return {startGame}
})();

Game.startGame();