import Spinner from "./Spinner";

interface GameStatusProps {
    search : boolean | undefined,
    startGame(): void,
    moveCount: number,
    color : "black" | "white" | undefined
}

function GameStatus({search , startGame, moveCount, color}: GameStatusProps) {
  return (
    <div className="md:w-1/2 min-h-40 bg-customGray-200 flex justify-center items-center gap-10">
      <div className="flex flex-col justify-evenly items-center w-4/5 h-4/5">
        {/* Conditional rendering for 3 states 
      1) No match is requested search=undefined
      2) Match requested but waiting for opponent to accept search=true
      3) Match accepted search=false */}
        {search === undefined ? (
          <button
            className="text-white text-xl font-bold bg-customBlue-100 hover:bg-customBlue-200 px-16 py-4 rounded-lg"
            onClick={startGame}
          >
            Play
          </button>
        ) : search === true ? (
          <div className="flex justify-center items-center gap-4">
            <Spinner />
            <p className="text-white ">Searching for opponents...</p>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center gap-2">
            <p className="text-white text-2xl font-bold">The Game Begins!</p>
            <p className="text-white text-lg font-bold">You are {color}</p>
            {moveCount % 2 === 0 ? (
              <p className="text-white text-lg font-bold">It's white's turn</p>
            ) : (
              <p className="text-white text-lg font-bold">It's black's turn</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default GameStatus;
