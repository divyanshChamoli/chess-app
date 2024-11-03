import { useNavigate } from "react-router-dom";

function PlayChess() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen bg-customGray-100 flex justify-center items-center">
      <div className="flex flex-col md:flex-row justify-center md:w-3/5 w-full p-1">
        <div className="md:w-1/2 relative">
          <img src="./chessboard.png" alt="chessboard" />
        </div>
        <div className="md:w-1/2 min-h-40 bg-customGray-200 flex justify-center items-center gap-10">
          <div className="flex flex-col justify-evenly items-center w-4/5 h-4/5">
            <button
              className="text-white text-xl font-bold bg-customBlue-100 hover:bg-customBlue-200 px-16 py-4 rounded-lg"
              onClick={() => navigate("/chess")}
            >
              Chess
            </button>
            <button
              className="text-white text-xl font-bold bg-customBlue-100 hover:bg-customBlue-200 px-16 py-4 rounded-lg"
              onClick={() => navigate("/atomic")}
            >
              Atomic Chess
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayChess;
