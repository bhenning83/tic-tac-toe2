const Gameboard = (function() {
  let board = ["X", "O", "X", "O", "X", "O", "X", "O","X"];

  //cache DOM
  let boardContainer = document.querySelector("#board-container");

  function createBoard() {
    for (i = 0; i < board.length; i++) {
      let square = document.createElement('li');
      square.setAttribute("id", `square-${i}`);
      square.setAttribute("class", "square");
      boardContainer.appendChild(square)
    }
    render();
  }
  
  function render() {
    let squares = Gameboard.boardContainer.getElementsByTagName("li");
    squares = Array.prototype.slice.call( squares )
    console.log(squares)
    for (i = 0; i < board.length; i++) {
      squares[i].innerText = board[i];
    }
  }

  return {
    createBoard,
    render,
    boardContainer,
    board
  };
})();

const Player = (symbol) => {

  //cache DOM
  let squares = Gameboard.boardContainer.getElementsByTagName("li");
  squares = Array.prototype.slice.call( squares )

  //bind events
  squares.forEach(square => {
    square.addEventListener("click", playTurn)
  })

  function playTurn() {
    id = Number(this.id.slice(-1)); //returns id number
    Gameboard.board[id] = symbol;
    console.log(symbol)
    console.log(Gameboard.board)
    Gameboard.render();
  }

  return {
    playTurn
  }
};

const GamePlay = (function() {

})();
Gameboard.createBoard()
const b = Player("B");