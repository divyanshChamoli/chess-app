import { Square } from "react-chessboard/dist/chessboard/types";

export const getAdjacentSquares = (square: Square): string[] => {
    const file = square.charAt(0); // 'e' for 'e4'
    const rank = parseInt(square.charAt(1)); // '4' for 'e4'
  
    const adjacentSquares: string[] = [];
    
    const fileShifts = [-1, 0, 1];
    const rankShifts = [-1, 0, 1];
  
    for (let f of fileShifts) {
      for (let r of rankShifts) {
        if (f === 0 && r === 0) continue;
  
        const newFile = String.fromCharCode(file.charCodeAt(0) + f);
        const newRank = rank + r;
  
        if (newFile >= 'a' && newFile <= 'h' && newRank >= 1 && newRank <= 8) {
          adjacentSquares.push(newFile + newRank);
        }
      }
    }
  
    return adjacentSquares;
  };

  export function isOpponentsTurn(moveCount: number, color: "white" | "black" | undefined){
    if (
      (moveCount % 2 === 0 && color === "black") ||
      (moveCount % 2 === 1 && color === "white")
    ) {
      return true;
    }
  }
