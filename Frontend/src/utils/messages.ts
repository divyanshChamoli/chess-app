
export const INIT_GAME= "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";
export const ADDITIONAL = "additional"
export const BOMBED_SQUARES = "bombed_squares"
export const CHECK = "check"
export const CAPTURE = "capture"
export const CASTLE = "castle"
export const CHECKMATE = "checkmate"
export const STANDARD = "standard_chess"
export const ATOMIC = "atomic_chess"

export const GAME_OVER_METHOD = {
    CHECKMATE: "Checkmate",
    STALEMATE: "Stalemate",
    INSUFFICIENT_MATERIAL : "Insufficient Material",
    THREE_FOLD_REPETITION: "Three Fold Repetition",
    RESIGNATION: "Resignation",
    TIMEOUT: "Timeout",
    DETONATION: "Detonation",
    ABANDONMENT: "Abandonment"
}