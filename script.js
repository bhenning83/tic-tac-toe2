const GameBoard = (function() {
  let board = ["X", "O", "X", "O", "X", "O", "X", "O","X"];

  //cache DOM
  squares = document.querySelectorAll(".square");

  function render() {
    for (i = 0; i < squares.length; i++) {
      squares[i].innerText = board[i];
    }
  }

  return {
    render,
    board,
    squares
  };
})();

const Player = (marker) => {

  squares = Array.prototype.slice.call( GameBoard.squares ); //turns HTML collection into array

  //bind events
  squares.forEach(square => {
    square.addEventListener("click", playTurn)
  })

  function playTurn() {
    id = Number(this.id.slice(-1)); //returns id number
    GameBoard.board[id] = marker;
    GameBoard.render();
  }

  return {
    playTurn
  }
};
const GamePlay = (function() {

})();


GameBoard.render();
const b = Player("B");