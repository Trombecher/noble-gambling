import {Box, JSX, addListenerRecursively} from "aena";
import {insertBox, insertBoxAsText} from "aena/glue";
import {Roulette} from "./games/roulette";
import {Poker} from "./games/poker";

export type Game = (props: {balance: Box<number>}) => JSX.Element;

export default function App() {
    const url = new URL(location.href);
    const balance = new Box(+(url.searchParams.get("balance") || 1000));

    const currentGame = new Box<undefined | Function>(undefined);

    addListenerRecursively({balance}, () => {
        url.searchParams.set("balance", String(balance.value));
        history.pushState(null, "", url);
    });

    return (
        <>
            <header class={"relative flex p-4 w-full select-none"}>
                <a href={"/"} class={"mr-auto text-shade-50 text-3xl"}>Noble Gambling</a>
                <div>${insertBoxAsText(balance)}</div>
            </header>
            {insertBox(currentGame, game => game ? (
                <div class={"mx-auto flex flex-col max-w-screen-sm w-full"}>
                    <h1 class={"text-2xl text-shade-50"}>{game.name}</h1>
                    {game({balance})}
                </div>
            ) : "")}
            <main class={currentGame.derive(game => `${game ? "hidden " : ""}flex flex-wrap justify-center gap-6`)}>
                {[Roulette, Poker].map(game => (
                    <button
                        onclick={() => currentGame.value = game}
                        class={"block relative rounded-3xl overflow-hidden transition hover:brightness-75"}
                    >
                        <img
                            width={450}
                            height={300}
                            src={`/${game.name.toLowerCase()}.webp`}
                            alt={""}
                        />
                        <div class={"absolute bottom-0 left-0 p-6 text-3xl bg-gradient-to-b from-shade-950/0 to-shade-950 text-shade-50 w-full text-left"}>{game.name}</div>
                    </button>
                ))}
            </main>
        </>
    );
}

/*

<button class="Slots">
    <img width="400" height="225" src="/Slots.jpg" alt=""/>
</button>
<button class="Roulette" onclick={() => game.value = Roulette}>
    <img width="400" height="225" src="/Roulette.jpg" alt=""/>
</button>
<button class="Poker">
    <img width="400" height="225" src="/Poker.jpg" alt=""/>
</button>

*/