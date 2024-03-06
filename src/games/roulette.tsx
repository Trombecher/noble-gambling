import {Box} from "aena";
import {Button, MoneyBetter} from "../components";
import {Game} from "../games";

type Bet = "Even" | "Odd" | number | "Red" | "Black";

type Color = "Red" | "Black";

const NUMBERS = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];

export const Roulette: Game = ({balance}) => {
    const bet = new Box(0);
    const selectedColor = new Box<Color>("Red");
    const locked = new Box(false);

    const [wheel, spin] = Wheel();

    return (
        <>
            <div class={"w-full"}>
                {wheel}
                <div class={""}></div>
            </div>
            <div class={"flex gap-4 my-4"}>
                {(["Red", "Black"] as const).map(color => (
                    <button
                        class={selectedColor.derive(selectedColor => `${
                            selectedColor === color ? "outline-offset-4 outline outline-shade-50 " : ""
                        }rounded-full w-full block`)}
                        onclick={() => selectedColor.value = color}
                    >{color}</button>
                ))}
            </div>
            <MoneyBetter
                max={balance}
                amount={bet}
                locked={locked}
            />
            <Button
                disabled={locked}
                onclick={async () => {
                    let result = Math.round(Math.random() * 36);
                    locked.value = true;
                    await spin(result);
                    locked.value = false;
                }}
            >Gamble
            </Button>
        </>
    );
};

function Wheel() {
    let g: SVGElement;
    const wheel = (
        <svg
            viewBox={"0 0 64 64"}
            class={"w-full"}
        >
            <g
                class={"transition [transform-origin:center] ease-out"}
                ref={x => {
                    g = x;
                    g.style.transitionDuration = "10s";
                }}
            >
                <mask id={"m"}>
                    <circle cx={32} cy={32} r={32} fill={"#ffffff"}/>
                    <circle cx={32} cy={32} r={24} fill={"#000"}/>
                </mask>
                <circle
                    cx={32}
                    cy={32}
                    r={24}
                    class={"fill-brown"}
                />
                <g mask={"url(#m)"}>
                    {NUMBERS.map((value, index) => (
                        <>
                            <path
                                d={"M32 32L34.789 63.8782A32 32 0 0 1 29.211 63.8782"}
                                transform={`rotate(${index / NUMBERS.length * 360} 32 32)`}
                                class={value === 0 ? "fill-lime" : isRed(index) ? "fill-red" : "fill-shade-950"}
                            />
                            <text
                                x={31}
                                y={62}
                                class={"fill-shade-50 text-[3px]"}
                                transform={`rotate(${index / NUMBERS.length * 360} 32 32)`}
                            >{value}</text>
                        </>
                    ))}
                </g>
            </g>
        </svg>
    );

    async function spinTo(target: number) {
        g.style.transform = `rotate(-${target * 10 + 360 * 5}deg)`;
        await new Promise(res => setTimeout(res, 10000))
        g.style.transitionDuration = "0s";
        g.style.transform = `rotate(-${target * 10}deg)`;
        await new Promise(res => setTimeout(res, 100));
        g.style.transitionDuration = "10s";
    }

    return [wheel, spinTo] as const;
}

function isRed(index: number) {
    return index % 2 === 1;
}