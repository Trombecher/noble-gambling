import { Box, JSX, addListenerRecursively } from "aena";
import { insertBox, insertBoxAsText } from "aena/glue";
import { Roulette } from "./games/roulette";

export type Game = (props: {balance: Box<number>}) => JSX.Element;

export default function App() {
    const url = new URL(location.href);
    const balance = new Box(+(url.searchParams.get("balance") || 0));
    const game = new Box<undefined | Function>(undefined);

    addListenerRecursively({ balance }, () => {
        url.searchParams.set("balance", String(balance.value));
        history.pushState(null, "", url);
    });

    return (
        <>
            <header class={"flex p-4 w-full"}>
                <h1 class={"mr-auto text-shade-50 text-3xl"}>Noble Gambling</h1>
                <div>${insertBoxAsText(balance)}</div>
            </header>
            {insertBox(game, game => game ? (
            <>
                <h1>{game.name}</h1>
                {game({balance})}
            </>
            ) : "")}
            
            <main class={"flex flex-wrap justify-center gap-6 "}>
                <button class="Slots">
                    <img width="400" height="225" src="/Slots.jpg" alt="" />
                </button>
                <button class="Roulette" onclick={() => game.value = Roulette}>
                    <img width="400" height="225" src="/Roulette.jpg" alt="" />
                </button>
                <button class="Poker">
                    <img  width="400" height="225" src="/Poker.jpg" alt="" />
                </button>
            </main>
        </>
    );
}