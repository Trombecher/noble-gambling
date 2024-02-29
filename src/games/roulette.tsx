import { Box } from "aena";
import { Game } from "../App"
import { insertBoxToString } from "aena/glue";

enum Color {
    Black = "Black",
    Red = "Red"
}

export const Roulette: Game = ({balance}) => {
    const result = new Box<Color | undefined>(undefined);

    return (
        <>
            <div>Result {insertBoxToString(result, color => color || "")}</div>
            <button></button>
            <button onclick={() => {
                result.value = Math.random() > .5 ? Color.Red : Color.Black
            }}>Gamble</button>
        </>
    )
}