import {Box} from "aena";
import {Button, MoneyBetter} from "../components";
import {Game} from "../games";
import {insertBox} from "aena/glue";

type Bet = "Even" | "Odd" | number | "Red" | "Black";

const NUMBERS = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];

export const Roulette: Game = ({balance}) => {
    const moneyBet = new Box(0);
    balance.addListener(balance => moneyBet.value > balance && (moneyBet.value = balance))
    const bet = new Box<Bet>("Red");
    const locked = new Box(false);
    const won = new Box<boolean | undefined>(undefined);
    const [wheel, spin] = Wheel(bet, locked);

    return (
        <>
            <div class={"select-none mx-auto w-full max-w-screen-md flex"}>
                {wheel}
            </div>
            <svg class={"self-center mt-3"} viewBox={"0 0 16 8"} width={"64"}>
                <path
                    d={"M2 7L8 1L14 7"}
                    class={"fill-none stroke-[1.5] stroke-white"}
                    stroke-linecap={"round"}
                    stroke-linejoin={"round"}
                />
            </svg>
            {insertBox(won, won => won && (
                <h2 class={"text-8xl"}>{won ? "Won" : "Lost"}</h2>
            ))}
            <h2 class={"text-2xl mb-6 self-center mt-8"}>Bet on a number or below:</h2>
            <div class={"w-40 h-40 grid grid-cols-2 gap-2 mb-4 self-center"}>
                {([
                    "Red",
                    "Black",
                    "Even",
                    "Odd"
                ] satisfies Bet[]).map(xBet => (
                    <SelectBet
                        currentBet={bet}
                        bet={xBet}
                        locked={locked}
                    />
                ))}
            </div>
            <div class={"mx-auto flex gap-2 items-center"}>
                <MoneyBetter
                    max={balance}
                    amount={moneyBet}
                    locked={locked}
                />
                <Button
                    disabled={locked}
                    onclick={async () => {
                        // Pick random result
                        const result = Math.floor(Math.random() * NUMBERS.length);

                        // Lock the inputs
                        locked.value = true;

                        // Wait for spin end
                        await spin(result);

                        // Manage balance
                        if(bet.value === result) {
                            balance.value += moneyBet.value * 36;
                            won.value = true;
                        } else if(bet.value === 0) {
                            balance.value -= moneyBet.value;
                            won.value = false;
                        } else if((bet.value === "Even" && NUMBERS[result]! % 2 === 0)
                            || (bet.value === "Odd" && NUMBERS[result]! % 2 === 1)
                            || (bet.value === "Red" && isRed(result))
                            || (bet.value === "Black" && !isRed(result))) {
                            balance.value += moneyBet.value;
                            won.value = true;
                        } else {
                            balance.value -= moneyBet.value;
                            won.value = false;
                        }

                        // Display win/lose message for 3s
                        await new Promise(resolve => setTimeout(resolve, 2000));

                        // Unlock UI inputs
                        locked.value = false;

                        // Clear win status
                        won.value = undefined;
                    }}
                >Spin
                </Button>
            </div>
        </>
    );
};

function SelectBet({
    currentBet,
    bet,
    locked
}: {
    currentBet: Box<Bet>,
    bet: Bet,
    locked: Box<boolean>,
}) {
    return (
        <button
            class={currentBet.derive(currentBet => `${
                currentBet === bet ? "bg-white/50 border-white" : "hover:bg-white/20 border-white/30"
            } rounded-full flex justify-center items-center border transition`)}
            onclick={() => currentBet.value = bet}
            disabled={locked}
        >{bet}</button>
    );
}

const SPIN_DURATION = 5;

function Wheel(
    currentBet: Box<Bet>,
    locked: Box<boolean>,
) {
    let g: SVGElement;
    const wheel = (
        <svg viewBox={"0 0 64 64"} class={"fill-none w-full h-full"}>
            <g
                class={"transition [transform-origin:center] ease-out"}
                ref={x => {
                    g = x;
                    g.style.transitionDuration = `${SPIN_DURATION}s`;
                }}
            >
                <mask id={"m"}>
                    <circle cx={32} cy={32} r={32} fill={"#ffffff"}/>
                    <circle cx={32} cy={32} r={24} fill={"#000"}/>
                </mask>
                <circle cx={32} cy={32} r={32} class={"fill-brown"}/>
                <g mask={"url(#m)"}>
                    {NUMBERS.map((value, index) => (
                        <g
                            onclick={() => !locked.value && (currentBet.value = value)}
                            class={"cursor-pointer"}
                        >
                            <path
                                d={"M32 32L34.789 63.8782A32 32 0 0 1 29.211 63.8782"}
                                transform={`rotate(${index / NUMBERS.length * 360} 32 32)`}
                                class={currentBet.derive(bet => `${
                                    value === 0 ? "fill-lime" : isRed(index) ? "fill-red" : "fill-black"
                                } ${
                                    bet === value ? "brightness-[5]" : "hover:brightness-[2]"
                                }`)}
                            />
                            <text
                                x={31}
                                y={62}
                                class={"fill-white text-[3px]"}
                                transform={`rotate(${index / NUMBERS.length * 360} 32 32)`}
                            >{value}</text>
                        </g>
                    ))}
                </g>
            </g>
        </svg>
    );

    async function spinTo(target: number) {
        g.style.transform = `rotate(-${target / NUMBERS.length * 360 + 360 * 5}deg)`;
        await new Promise(res => setTimeout(res, SPIN_DURATION * 1000))
        g.style.transitionDuration = "0s";
        g.style.transform = `rotate(-${target / NUMBERS.length * 360}deg)`;
        await new Promise(res => setTimeout(res, 100));
        g.style.transitionDuration = `${SPIN_DURATION}s`;
    }

    return [wheel, spinTo] as const;
}

function isRed(index: number) {
    return index % 2 === 1;
}