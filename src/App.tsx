import {Box} from "aena";
import {insertBoxAsText, insertBoxToString} from "aena/glue";
import {CurrentGame, GAME_MAP, GameSelect} from "./games";

/**
 * Code is bad but it works.
 */
function createState() {
    const balance = new Box(localStorage["balance"] || 1000);
    balance.addListener(balance => localStorage["balance"] = balance);

    function getPair(name: string | null | undefined) {
        return GAME_MAP.find(([n]) => n === name);
    }

    let url = new URL(location.href);
    const currentPair = new Box(getPair(url.searchParams.get("game")));

    let poppedState = false;

    currentPair.addListener(pair => {
        if(poppedState) {
            poppedState = false;
            return;
        }

        if(pair) url.searchParams.set("game", pair[0]);
        else url.searchParams.delete("game");

        history.pushState(null, "", url);
    });

    window.onpopstate = () => {
        poppedState = true;
        url = new URL(location.href);
        currentPair.value = getPair(url.searchParams.get("game"));
    };

    return {balance, currentPair};
}

export default function App() {
    const {balance, currentPair} = createState();

    return (
        <>
            <header
                class={"z-50 sticky top-0 gap-4 flex p-4 w-full select-none bg-gradient-to-t from-green/30 to-green backdrop-blur-2xl backdrop:saturate-200"}>
                <button
                    onclick={() => currentPair.value = undefined}
                    class={"text-3xl"}
                >Noble Gambling
                </button>
                <h2 class={"text-3xl text-white/50"}>{insertBoxToString(currentPair, pair => pair ? pair[0] : "")}</h2>
                <button
                    class={"ml-auto text-xl"}
                    title={"Reset balance"}
                    onclick={() => {if (balance.value == 0) balance.value = 1000}}
                >${insertBoxAsText(balance)}</button>
            </header>
            <CurrentGame currentGame={currentPair} balance={balance}/>
            <GameSelect currentGame={currentPair}/>
            <footer class={"py-6 mx-auto mt-auto"}>Copyright &copy; {new Date().getFullYear()} Robin, Niklas und
                Tobias
            </footer>
        </>
    );
}