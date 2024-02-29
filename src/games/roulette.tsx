import {Box} from "aena";
import {Game} from "../App";
import {insertBoxToString} from "aena/glue";
import {Button, MoneyBetter} from "../components";

enum Color {
    Black = "Black",
    Red = "Red"
}

export const Roulette: Game = ({balance}) => {
    const result = new Box<Color | undefined>(undefined);

    const bet = new Box(0);
    const color = new Box<Color>(Color.Red);
    const locked = new Box(false);

    return (
        <>
            <div>Result {insertBoxToString(result, color => color || "")}</div>
            <div class={"flex gap-4 my-4"}>
                <button
                    class={color.derive(color => `${
                        color === Color.Red ? "outline-offset-4 outline outline-shade-50" : ""
                    } rounded-full bg-[#A00] w-full block`)}
                    onclick={() => color.value = Color.Red}
                >Red</button>
                <button
                    class={color.derive(color => `${
                        color === Color.Black ? "outline outline-offset-4 outline-shade-50" : ""
                    } rounded-full bg-[#000] w-full block`)}
                    onclick={() => color.value = Color.Black}
                >Black</button>
            </div>
            <MoneyBetter
                max={balance}
                amount={bet}
                locked={locked}
            />
            <Button onclick={() => {
                result.value = Math.random() > .5 ? Color.Red : Color.Black;
                balance.value += color.value === result.value ? bet.value : -bet.value;
            }}>Gamble
            </Button>
        </>
    );
};