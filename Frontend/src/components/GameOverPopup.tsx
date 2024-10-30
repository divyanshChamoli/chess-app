import { Trophy } from "lucide-react";

interface GameOverPopupProps{
    outcome: string,
    method: string
}

export default function GameOverPopup({outcome, method } : GameOverPopupProps) {
  return (
    <div className="bg-customGray-200 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-20 w-48 rounded-lg shadow-md shadow-black ">
      <div className="flex justify-center gap-4 rounded-md p-4 h-1/3">
        {outcome === "You Won" && <Trophy color="yellow" size={40} />}
        <div>
          <h2 className="text-lg text-white font-bold">{outcome}!</h2>
          <p className="text-xs text-zinc-400">by {method}</p>
        </div>
      </div>

      {/* DONT DELETE, Add rematch functionality later */}
      {/* <div className="flex flex-col justify-start items-center gap-4 h-2/3 p-4">
        <div className="text-white text-sm">Good game, Rematch?</div>
        <button className="text-white text-md py-2 w-full font-bold bg-customBlue-100 hover:bg-customBlue-200 rounded-lg">
            Rematch
        </button>
      </div> */}
    </div>
  );
}
