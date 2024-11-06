import { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import { fen, makeSquare, Move, parseSquare } from "chessops";
import { Piece, Square } from "react-chessboard/dist/chessboard/types";
import { Atomic } from "chessops/variant";
import { makeFen } from "chessops/fen";
import { useSocket } from "../hooks/useSocket";
import { INIT_GAME, MOVE, GAME_OVER } from "../utils/messages";
import GameOverPopup from "../components/GameOverPopup";
import GameStatus from "../components/GameStatus";

function AtomicChess() {
  const socket = useSocket();
  const [game] = useState(Atomic.default());
  const [gamefen, setGamefen] = useState(fen.INITIAL_FEN);
  const [color, setColor] = useState<"white" | "black">();
  const [result, setResult] = useState<{
    outcome: string;
    method: string;
  } | null>(null);
  const [search, setSearch] = useState<boolean | undefined>(undefined);
  const [moveCount, setMoveCount] = useState(0);
  const [validMoves, setValidMoves] = useState<Square[]>([]);

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case INIT_GAME:
          setColor(data.payload);
          setSearch(false);
          break;
        case MOVE:
          const move = data.payload.move;
          const fen = data.payload.fen;
          //already validated move comes from backend
          game.play(move);
          setMoveCount((cnt) => cnt + 1);
          setGamefen(fen);
          break;
        case GAME_OVER:
          let outcome = "";
          if (data.payload.draw === true) {
            outcome = "Draw";
          } else if (data.payload.winner === color) {
            outcome = "You Won";
          } else {
            outcome = "You Lost";
          }
          setResult({
            outcome: outcome,
            method: data.payload.method,
          });
          console.log(data.payload);
          break;
      }
    };
  }, [socket, color]);

  if (!socket) {
    return <div>Connecting...</div>;
  }

  const onDrop = (sourceSquare: Square, targetSquare: Square) => {
    const move: Move = {
      from: parseSquare(sourceSquare),
      to: parseSquare(targetSquare),
    };
    if (game.isLegal(move)) {
      //set fen so that user sees fast UI updates, verify moves again on backend
      //NOTE: Dont do game.play(move) here as it breaks things, do this only when backend broadcasts message to both players
      setGamefen(makeFen(game.toSetup()));
      socket.send(
        JSON.stringify({
          type: MOVE,
          move: move,
        })
      );
      setValidMoves([])
      return true;
    } else {
      return false;
    }
  };

  const pieceClick = (piece: Piece, square: Square) => {
    //If not players turn => dont show them opponents valid moves 
    if(moveCount%2 === 0 && color === "black" || moveCount%2 === 1 && color === "white"){
      return
      piece //npm run build requires using it
    }
    setValidMoves([]);
    const pieceValidMoves = game.dests(parseSquare(square));
    for (let move of pieceValidMoves) {
      setValidMoves((currMoves) => [...currMoves, makeSquare(move)]);
    }
  };

  const getValidMoveStyles = () => {
    const styles: any = {};
    validMoves.forEach((square) => {
      styles[square] = {
        outline: `3px solid #06FF00`,
        outlineOffset: "-3px",
      };
    });
    return styles;
  };

  const startGame = () => {
    socket.send(
      JSON.stringify({
        type: INIT_GAME,
      })
    );
    setSearch(true);
  };

  return (
    <div className="h-screen w-screen bg-customGray-100 flex justify-center items-center">
      <div className="flex flex-col md:flex-row justify-center md:w-3/5 w-full p-1">
        <div className="md:w-1/2 relative">
          <Chessboard
            id={"BasicBoard"}
            position={gamefen}
            onPieceDrop={onDrop}
            onPieceClick={pieceClick}
            customDarkSquareStyle={{ backgroundColor: "#4B7399" }}
            customLightSquareStyle={{ backgroundColor: "#EAE9D2" }}
            customSquareStyles={getValidMoveStyles()}
            autoPromoteToQueen={true}
            boardOrientation={color}
          />
          {result && (
            <GameOverPopup method={result.method} outcome={result.outcome} />
          )}
        </div>
        <GameStatus
          color={color}
          startGame={startGame}
          moveCount={moveCount}
          search={search}
        />
      </div>
    </div>
  );
}

export default AtomicChess;
