import { Box, addListenerRecursively } from "aena";
import { insertBoxAsText } from "aena/glue";

export default function App() {
    const url = new URL(location.href);
    const balance = new Box(+(url.searchParams.get("balance") || 0));

    addListenerRecursively({ balance }, () => {
        url.searchParams.set("balance", String(balance.value));
        history.pushState(null, "", url);
    });

    return (
        <>
            <header class={"flex p-4 w-full"}>
                <h1 class={"mr-auto font-fancy text-shade-50"}>Noble Gambling</h1>
                <div>${insertBoxAsText(balance)}</div>
            </header>
            <main class={"flex flex-wrap justify-center gap-6 "}>
                <button class="p">
                    <img width="400" height="225" src="https://images.prismic.io/desplaines-rushstreetgaming/3ea58fe4-f291-4e9b-9750-2c6cbd38a2ab_04659_BOD-Photos_Poker-Room-01_1280x720_v1_220413.jpg?auto=compress,format" alt="" />
                </button>
                <button class="b">
                    <img class={"w-[400] h-[225px]"} width="400" height="225" src="https://www.vismara.it/wp-content/uploads/2017/01/luxury_blackjack_table1.jpg" alt="" />
                </button>
                <button class="r">
                    <img width="400" height="225" src="https://homburg1.de/wp-content/uploads/2022/03/Roulette-Casino-Gluecksspiel.jpg" alt="" />
                </button>
            </main>
        </>
    );
}