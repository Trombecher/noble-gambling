import {Box, JSX, ReadonlyBox} from "aena";
import {Roulette} from "./games/roulette";
import {Poker} from "./games/poker";
import {insertBox} from "aena/glue";

export const GAME_MAP: readonly (readonly [string, Game])[] = [
    ["Roulette", Roulette],
    // ["Slots", Slots],
    ["Poker", Poker]
];

export type Game = (props: {
    balance: Box<number>,
    name: string
}) => JSX.Element;

export type Pair = typeof GAME_MAP[number];

export type GameName = Pair[0];

export function GameSelect({currentGame}: {currentGame: Box<Pair | undefined>}) {
    return (
        <main class={`flex flex-wrap justify-center gap-6`}>
            {GAME_MAP.map((pair) => (
                <button
                    onclick={() => currentGame.value = pair}
                    class={"block relative rounded-3xl overflow-hidden transition hover:brightness-75"}
                >
                    <img
                        width={450}
                        height={300}
                        src={`/${pair[0].toLowerCase()}.webp`}
                        alt={""}
                    />
                    <div
                        class={"absolute bottom-0 left-0 p-6 text-3xl bg-gradient-to-b from-shade-950/0 to-shade-950 text-shade-50 w-full text-left"}>{pair[0]}</div>
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
    currentGame: ReadonlyBox<Pair | undefined>,
    balance: Box<number>
}) {
    return insertBox(currentGame, game => game ? (
        <div class={"mx-auto flex flex-col max-w-screen-sm w-full mb-32"}>
            <h1 class={"text-2xl text-shade-50"}>{game[0]}</h1>
            {game[1]({balance, name: game[0]})}
        </div>
    ) : "");
}