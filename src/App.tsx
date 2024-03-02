import {Box, addListenerRecursively} from "aena";
import {insertBoxAsText} from "aena/glue";
import {CurrentGame, GAME_MAP, GameSelect} from "./games";

export default function App() {
    const url = new URL(location.href);
    const balance = new Box(+(url.searchParams.get("balance") || 1000));
    const currentGame = new Box(GAME_MAP.find(
        ([name]) => name === url.searchParams.get("game")));

    addListenerRecursively({balance, currentGame}, () => {
        url.searchParams.set("balance", String(balance.value));

        if(currentGame.value) url.searchParams.set("game", currentGame.value[0]);
        else url.searchParams.delete("game");

        history.pushState(null, "", url);
    });

    return (
        <>
            <header class={"relative flex p-4 w-full select-none"}>
                <button
                    onclick={() => currentGame.value = undefined}
                    class={"mr-auto text-shade-50 text-3xl"}
                >Noble Gambling</button>
                <div>${insertBoxAsText(balance)}</div>
            </header>
            <CurrentGame
                currentGame={currentGame}
                balance={balance}
            />
            <GameSelect
                currentGame={currentGame}
            />
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