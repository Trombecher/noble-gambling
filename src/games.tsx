import {Box, JSX} from "aena";
import {Roulette} from "./games/roulette";
import {Poker} from "./games/pokerui";
import {insertBox} from "aena/glue";
import {Slots} from "./games/slots";

export const GAME_MAP = [
    ["Roulette", Roulette],
    ["Slots", Slots],
    ["Poker", Poker]
] as const;

export type Game = (props: {
    balance: Box<number>,
    name: string
}) => JSX.Element;

export type Pair = typeof GAME_MAP[number];

export function GameSelect({currentGame}: {currentGame: Box<Pair | undefined>}) {
    return (
        <main class={`flex flex-wrap justify-center gap-6 p-6`}>
            {GAME_MAP.map((pair) => (
                <button
                    onclick={() => currentGame.value = pair}
                    class={currentGame.derive(currentPair => `${currentPair === pair ? "hidden" : ""} block relative rounded-3xl overflow-hidden transition-all shadow-black hover:shadow-xl hover:scale-110`)}
                >
                    <img
                        width={450}
                        height={300}
                        src={`/noble-gambling/${pair[0].toLowerCase()}.webp`}
                        alt={""}
                    />
                    <div
                        class={"absolute bottom-0 left-0 p-6 text-3xl bg-gradient-to-b from-black/0 to-black w-full text-left"}>{pair[0]}</div>
                </button>
            ))}
        </main>
    )
}

/**
 * Displays the current game.
 */
export function CurrentGame({
    currentGame,
    balance
}: {
    currentGame: Readonly<Box<Pair | undefined>>,
    balance: Box<number>
}) {
    return insertBox(currentGame, game =>
        game && game[1]({balance, name: game[0]}));
}