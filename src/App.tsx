import {Box, addListenerRecursively} from "aena";
import {insertBoxAsText, insertBoxToString} from "aena/glue";
import {CurrentGame, GAME_MAP, GameSelect} from "./games";

export default function App() {
    const url = new URL(location.href);
    const balance = new Box(+(url.searchParams.get("balance") || 1000));
    const currentPair = new Box(GAME_MAP.find(
        ([name]) => name === url.searchParams.get("game")));

    addListenerRecursively({balance, currentPair}, () => {
        url.searchParams.set("balance", String(balance.value));

        if(currentPair.value) url.searchParams.set("game", currentPair.value[0]);
        else url.searchParams.delete("game");

        history.pushState(null, "", url);
    });

    return (
        <>
            <header class={"z-50 sticky top-0 flex p-4 w-full select-none bg-gradient-to-t from-green/30 to-green backdrop-blur-2xl backdrop:saturate-200"}>
                <button
                    onclick={() => currentPair.value = undefined}
                    class={"mr-auto text-shade-50 text-3xl"}
                >Noble Gambling</button>
                <div>${insertBoxAsText(balance)}</div>
            </header>
            <CurrentGame currentGame={currentPair} balance={balance}/>
            <h1 class={"mx-auto mb-6 font-semibold text-2xl text-shade-50 mt-12"}>{insertBoxToString(currentPair, pair => pair ? "More Games" : "")}</h1>
            <GameSelect currentGame={currentPair}/>
            <footer class={"py-6 mx-auto mt-auto"}>Copyright &copy; {new Date().getFullYear()} Robin, Niklas und Tobias</footer>
        </>
    );
}