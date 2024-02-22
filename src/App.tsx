import { Box, addListenerRecursively } from "aena";
import { insertBoxAsText } from "aena/glue";

export default function App() {
    const url = new URL(location.href);
    const balance = new Box(+(url.searchParams.get("balance") || 0));

    addListenerRecursively({balance}, () => {
        url.searchParams.set("balance", String(balance.value));
        history.pushState(null, "", url);
    });

    return (
        <>
            <header class={"flex p-4"}>
                <h1 class={"mr-auto font-fancy text-shade-50"}>Noble Gambling</h1>
                <div>${insertBoxAsText(balance)}</div>
            </header>
            <main class={""}>
                <div class={"p-4 bg-shade-50"}>yososo</div>
                <section>
                    <Games/>
                </section>
            </main>
        </>
    );
}

function Games() {
    return [].map(Game);
}

function Game() {
    return (
        <div>Game</div>
    );
}