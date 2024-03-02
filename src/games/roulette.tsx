import {Box} from "aena";
import {insertBoxToString} from "aena/glue";
import {Button, MoneyBetter} from "../components";
import {Game} from "../games";

type Color = "Red" | "Black";

export const Roulette: Game = ({balance}) => {
    const result = new Box<Color | undefined>(undefined);

    const bet = new Box(0);
    const selectedColor = new Box<Color>("Red");
    const locked = new Box(false);

    return (
        <>
            <div>Result {insertBoxToString(result, color => color || "")}</div>
            <div class={"flex gap-4 my-4"}>
                {([["Red", "#cc4a4a"], ["Black", "#000000"]] satisfies [Color, string][]).map(([color, hex]) => (
                    <button
                        class={selectedColor.derive(selectedColor => `${
                            selectedColor === color ? "outline-offset-4 outline outline-shade-50 " : ""
                        }rounded-full w-full block`)}
                        ref={button => button.style.backgroundColor = hex}
                        onclick={() => selectedColor.value = color}
                    >{color}</button>
                ))}
            </div>
            <MoneyBetter
                max={balance}
                amount={bet}
                locked={locked}
            />
            <Button onclick={() => {
                result.value = Math.random() > .5 ? "Red" : "Black";
                balance.value += selectedColor.value === result.value ? bet.value : -bet.value;
            }}>Gamble
            </Button>
        </>
    );
};

function RouletteWheel() {
    return (
        <svg viewBox={"0 0 64 64"} width={640} height={640}>
            <mask id={"m"}>
                <circle cx={32} cy={32} r={32} fill={"#ffffff"}/>
            </mask>
            <g mask={"url(#m)"}>
                <rect width={64} height={64}/>
            </g>
        </svg>
    )
}