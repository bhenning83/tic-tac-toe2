const GameBoard = (function() {
  let board = ["", "", "", "", "", "", "", "", ""];

  //Cache DOM
  const squares = document.querySelectorAll(".square");

  function render() {
    for (i = 0; i < squares.length; i++) {
      squares[i].innerText = board[i];
    }
  }

  return {render, board, squares};
})();

const Player = (marker, name) => {
  let playLog = [];
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

  function addPlay(id) {
    playLog.push(id);
  }

  function reset() {
    playLog = [];
  }

  return {name, checkForWinner, addPlay, marker, reset}
};


const Game = (function() {
  config = {};
  let p1name = "Player 1";
  let p2name = "Player 2";
  let counter = 0; //tracks plays to check for Cat

  //Cache DOM
  const p1 =           document.querySelector(".p1")
  const p2 =           document.querySelector(".p2")
  const form =         document.querySelector("form");
  const start =        document.querySelector(".start")
  const playAgain =    document.querySelector(".play-again");
  const announcement = document.querySelector(".announcement");  

  //Turns HTML collection into array
  playSquares = Array.prototype.slice.call( GameBoard.squares );

  //Bind Events
  start.addEventListener("click", startGame)
  playAgain.addEventListener("click", _restart);
  form.addEventListener("submit", (e) => {
    if (Object.keys(config).length === 0) {
      _setConfig(e); //if starting  a new game
    } else {
      _setNames(e); //if updating names during a game
    }
  });

  function startGame() {
    playSquares.forEach(square => {
      square.addEventListener("click", playTurn) //adds listner to each square in grid
      square.style.borderColor = "black";
      square.classList.add("active");
    });
    _setStartButton();
    _highlightPlayer();
    GameBoard.render();
  }

  function _setConfig(e) {
    e.preventDefault();
    player1 = Player("X", "");
    player2 = Player("O", "");
    config = {player1, player2, currentPlayer: player1};
    _setNames(e);
    start.style.display = "block";
  }

  function _setNames(e) {
    e.preventDefault();
    console.log(config)
    config.player1.name = form.p1Name.value || "Player 1";
    config.player2.name = form.p2Name.value || "Player 2";
    p1.innerText = config.player1.name;
    p2.innerText = config.player2.name;
  }

  function _setStartButton() {
    start.style.display = "none";
    announcement.style.display = "none";
    playAgain.style.display = "block";
    playAgain.innerText = "Reset";
  }

  function playTurn() {
    player = config.currentPlayer; 
    _makePlay.bind(this)(); //binds selected square
    combo = player.checkForWinner();
    _checkForCat(combo);
    if (combo) {
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
      config.currentPlayer.addPlay(id);
      _changePlayer();
      counter++;
    }
    GameBoard.render();
  }

  function _highlightPlayer() {
    if (config.currentPlayer == config.player1) {
      p1.style.fontWeight = "700";
      p2.style.fontWeight = "400";
    } else {
      p2.style.fontWeight = "700";
      p1.style.fontWeight = "400";
    }
  }

  function _changePlayer() {
      config.currentPlayer == config.player1 ?
      config.currentPlayer = config.player2 :
      config.currentPlayer = config.player1;
      _highlightPlayer();
  }

   //if all plays are made and final play wasn't a winner
   function _checkForCat(combo) {
    if ((counter == 9) && (combo == undefined)) {
      _endGame();
      _announceCat();
    }
  }

  function _announceCat() {
    GameBoard.squares.forEach(square => {
      square.classList.add("cat-game");
    })
    playAgain.innerText = "Play Again?";
    announcement.style.display = "block";
    announcement.innerText = "Cat game. Meow.";
  }

  function _announceWinner(combo, player) {
    playAgain.innerText = "Play Again?";
    announcement.style.display = "block";
    announcement.innerText = `${player.name} is the winner!`;
    _showWin(combo);
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
    config.player1.reset();
    config.player2.reset();
    counter = 0;
    for (i = 0; i < 9; i++) {
      GameBoard.board[i] = "";
      GameBoard.squares[i].classList.remove("winning-combo") //removes box shadow from winning combo
      GameBoard.squares[i].classList.remove("cat-game") //removes box shadow from cat game
    }
    startGame();
  }
})();