import React, { useState, useEffect } from "react";
import GameGrid from "./GameGrid.js";

function Game() {
   const [moves, setMoves] = useState(new Array(9).fill(""));
   const [turn, setTurn] = useState("X");
   const [winner, setWinner] = useState(null); // Track the winner or tie state

   function checkWinner(moves) {
      const winPatterns = [
         [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
         [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
         [0, 4, 8], [2, 4, 6]             // Diagonals
      ];

      for (let pattern of winPatterns) {
         const [a, b, c] = pattern;
         if (moves[a] && moves[a] === moves[b] && moves[a] === moves[c]) {
            return moves[a]; // Return "X" or "O" as the winner
         }
      }

      // Check for a tie
      if (moves.every(move => move !== "")) {
         return "Tie";
      }

      return null; // No winner or tie yet
   }

   function gridClick(whichSquare) {
      if (winner || moves[whichSquare] !== "" || turn === "O") return; // Ignore clicks if game is over, square is taken, or it's not the player's turn

      const movesCopy = [...moves];
      movesCopy[whichSquare] = turn;
      setMoves(movesCopy);

      const currentWinner = checkWinner(movesCopy);
      if (currentWinner) {
         setWinner(currentWinner); // Set the winner if found
      } else {
         // Alternate turns
         setTurn("O");
      }
   }

   function newGame() {
      setMoves(new Array(9).fill(""));
      setTurn("X");
      setWinner(null);
   }

   // Computer makes a random "O" move
   function computerMove(moves) {
      const emptySquares = moves
         .map((move, index) => (move === "" ? index : null))
         .filter(index => index !== null);

      // Simple AI to pick a random available square
      if (emptySquares.length > 0) {
         const randomIndex = Math.floor(Math.random() * emptySquares.length);
         moves[emptySquares[randomIndex]] = "O";
      }

      return moves;
   }

   // Handle computer's turn
   useEffect(() => {
      if (turn === "O" && !winner) {
         setTimeout(() => {
            const movesCopy = [...moves];
            const updatedMoves = computerMove(movesCopy);
            setMoves(updatedMoves);

            const currentWinner = checkWinner(updatedMoves);
            if (currentWinner) {
               setWinner(currentWinner); // Set the winner if computer wins
            } else {
               setTurn("X"); // Pass turn back to player
            }
         }, 500); // Add a slight delay for better UX
      }
   }, [turn, moves, winner]);

   return (
      <>
         <h1>Tic-Tac-Toe</h1>
         <GameGrid moves={moves} click={gridClick} />
         {winner ? (
            <p>
               <strong>{winner === "Tie" ? "It's a Tie!" : `${winner} Wins!`}</strong>
            </p>
         ) : (
            <p>
               Turn: <strong className={turn}>{turn}</strong>
            </p>
         )}
         <p>
            <button onClick={newGame}>New Game</button>
         </p>
      </>
   );
}

export default Game;
