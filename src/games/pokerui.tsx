import {Game} from "../games";
import {ActionType, Card, PokerTable, Probability} from "./pokerframe";
import {insertBoxArray, insertBoxAsString, insertBoxToString} from "aena/glue";
import {Box, JSX} from "aena";
import {Button, MoneyBetter} from "../components";

const SUIT_MAP = ["clubs", "hearts", "spades", "diamonds", "none"];
const RANK_MAP = ["none", "error", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king", "ace"];
const HAND_MAP = ["", "High Card", "One Pair", "Two Pair", "Three of a Kind", "Straight", "Flush", "Full House", "Four of a Kind", "Straight Flush", "Royal Flush"];
const LOCAL_PLAYER = 0;

export enum Tab{
    None,
    Setup,
    Game,
    Action,
    Raise
}

let input = new Box(Tab.None)
let finished = false
export const Poker: Game = ({balance}) => {
    let tab = new Box(Tab.Setup)
    let bots = new Box(1)
    let game = new PokerTable
    game.addPlayers(1)
    let currentBet = new Box(25)
    const locked = new Box(false)
    let modify = (type: "add" | "subtract", amount: number) => {
        if (type === "add" && currentBet.value + amount <= balance.value) currentBet.value += amount
        if (type === "subtract" && currentBet.value - amount >= 25) currentBet.value -= amount
    }
    return (
        <>
            <div class={tab.derive<string>((tab) => (tab === Tab.Game ? "hidden" : "") + " text-center")}>
                <p class={"text-2xl"}>Welcome to Poker!</p>
                <p>Select your game settings below:</p>

                <div class={"flex gap-2 justify-center m-auto mt-5"}>
                    <p class={"p-1.5"}>Number of Opponents:</p>
                    <div class={"rounded-xl bg-black bg-opacity-20"}>
                        <Button class={"bg-opacity-0 hover:bg-white/20"} onclick={() => {
                            if (bots.value > 1) bots.value--
                        }}>-</Button>
                        {insertBoxAsString(bots)}
                        <Button class={"bg-opacity-0 hover:bg-white/20"} onclick={() => bots.value++}>+</Button>
                    </div>
                </div>

                <Button class={"mt-5 bg-lime/30 hover:bg-white/20"}
                        onclick={() => {game.init(bots.value, balance); tab.value = Tab.Game; game.start()}}>Start</Button>

            </div>
            <div class={tab.derive<string>((tab) => tab === Tab.Setup ? "hidden" : "")}>
                <Button class={"mr-auto ml-5 bg-opacity-0"} onclick={() => {game.fullReset(); tab.value = Tab.Setup}}>Back</Button>
                <div class={"flex gap-5 justify-center mb-10"}>
                    {insertBoxArray(game.info, (cash) => formatInformation(cash, game))}
                </div>
                {CommunityCards(game)}
                {PlayerCards(game)}

                <div class={input.derive<string>((input) => (input === Tab.Action ? "" : "hidden") + " flex gap-6 m-auto justify-center")}>
                    <Button class={"border transition hover:bg-white/20 border-white/30"} onclick={() => {input.value = Tab.None; game.action.value = [ActionType.Check, 0]; finished = true}}>Check</Button>
                    <Button class={"border transition hover:bg-white/20 border-white/30"} onclick={() => {input.value = Tab.None; game.action.value = [ActionType.Fold, 0]; finished = true}}>Fold</Button>
                    <Button class={"border transition hover:bg-white/20 border-white/30"} onclick={() => input.value = Tab.Raise}>Raise</Button>
                </div>
                <div class={input.derive<string>((input) => input === Tab.Raise ? "" : " hidden")}>
                    <div class={"flex p-4 justify-center"}>
                        <div class={"ml-auto"}>
                            <MoneyBetter locked={locked} amount={currentBet} max={balance} min={25}
                                         class={"m-auto w-full flex h-4 mb-6 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"}></MoneyBetter>

                            <div class={"flex justify-around"}>
                                <Button class={"border transition hover:bg-white/20 border-white/30"} onclick={() => input.value = Tab.Action}>Back</Button>
                                <Button class={"border transition hover:bg-white/20 border-white/30"} onclick={() => currentBet.value = 25}>min</Button>
                                <Button class={"border transition hover:bg-white/20 border-white/30"} onclick={() => currentBet.value = Math.round(1 / 4 * balance.value)}>1/4</Button>
                                <Button class={"border transition hover:bg-white/20 border-white/30"} onclick={() => currentBet.value = Math.round(1 / 2 * balance.value)}>1/2</Button>
                                <Button class={"border transition hover:bg-white/20 border-white/30"} onclick={() => currentBet.value = Math.round(3 / 4 * balance.value)}>3/4</Button>
                                <Button class={"border transition hover:bg-white/20 border-white/30"} onclick={() => currentBet.value = 1 * balance.value}>All in</Button>
                            </div>
                        </div>
                        <div class={"rounded-xl bg-white/20 ml-5 mt-6 mb-auto mr-auto"}>
                            <Button class={"bg-opacity-0 hover:bg-white/20"} onclick={() => modify("subtract", 25)}>-</Button>
                            {insertBoxAsString(currentBet)}$
                            <Button class={"bg-opacity-0 hover:bg-white/20"} onclick={() => modify("add", 25)}>+</Button>
                            <div>
                                <Button class={"bg-lime/20 hover:bg-white/20 w-full"} onclick={() => {input.value = Tab.None; game.action.value = [ActionType.Raise, currentBet.value]; currentBet.value = 25; finished = true}}>Confirm</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class={game.result.derive<string>((r) => (r ? "" : "hidden") + " m-auto")}>
                <Button class={"border transition hover:bg-white/20 border-white/30 p-2"} onclick={() => game.result.value = false}>Next Round</Button>
            </div>
        </>
    );
};


function formatProbability(p: number) {
    let round = Math.round(100 * p)
    if (!round && p) return "<0.5"
    return round.toString()
}

function formatInformation(cash: number[], game: PokerTable){
    return(
        <div>
            <div
                class={game.player[cash[1]!]!.has_folded.derive<string>((f) => (f ? "bg-[#a3a3a3]/50" : "bg-red/50") + " rounded-md text-center p-2")}>
                <p>{cash[0]!}$</p>
            </div>
            <div class={game.result.derive<string>((r) => r ? "" : "hidden")}>
                <div class={"flex gap-2"}>
                    {insertBoxArray(game.player[cash[1]!]!.card, card =>
                        <img
                            src={`/noble-gambling/Cards/${RANK_MAP[card.rank]}_of_${SUIT_MAP[card.suit]}.png`}
                            alt=""
                            width={75}
                            height={52}
                        />
                    )}
                </div>
                <div class={"text-center"}>
                    <p>{insertBoxToString(game.player[cash[1]!]!.hand.rank, rank => HAND_MAP[rank]!)}</p>
                </div>
            </div>
            <div class={game.result.derive<string>((r) => (!r ? "" : "hidden") + " flex gap-2")}>
                {UICard(new Card(0, 4), game)}
                {UICard(new Card(0, 4), game)}
            </div>
            <div
                class={game.current_player_id.derive<string>((cur) => ((cur == cash[1]! ? "" : "hidden") + " rounded-md text-center"))}>
                <p class={`${game.action.value[0]! == ActionType.Raise ? "" : "hidden"}`}>Raise: {game.action.value[1]!}$</p>
                <p class={`${game.action.value[0]! == ActionType.Check ? "" : "hidden"}`}>Check</p>
                <p class={`${game.action.value[0]! == ActionType.Fold ? "" : "hidden"}`}>Fold</p>
            </div>
        </div>
    )
}

export async function promptAction() {
    input.value = Tab.Action
    while (true) {
        await new Promise(resolve => setTimeout(resolve, 100)) // ugh
        if (finished) {
            finished = false
            return
        }
    }
}

function stats(prob: Probability): JSX.Element {
    return (
        <>
            <div class={"rounded-md bg-white p-4 ml-4 mt-4 mb-auto text-black text-lg"}>
                <div class={"flex gap-8"}>
                    <div>
                        <p class={"font-bold"}>Odds</p>
                        <p>High Card</p>
                        <p>One Pair</p>
                        <p>Two Pair</p>
                        <p>Three Kind</p>
                        <p>Straight</p>
                        <p>Flush</p>
                        <p>Full House</p>
                        <p>Four Kind</p>
                        <p>Straight Flush</p>
                        <p>Royal Flush</p>
                    </div>
                    <div>
                        <p>You</p>
                        {insertBoxArray(prob.relative_us, (n) => <p>{formatProbability(n)}%</p>)}
                    </div>
                    <div>
                        <p>Enemy</p>
                        {insertBoxArray(prob.relative_them, (n) => <p>{formatProbability(n)}%</p>)}
                    </div>
                </div>
            </div>
        </>
    )
}

function UICard(card: Card, game: PokerTable): JSX.Element {
    return (
        <img
            src={`/noble-gambling/Cards/${RANK_MAP[card.rank]}_of_${SUIT_MAP[card.suit]}.png`}
            alt=""
            width={75}
            height={52}
            class={game.player[LOCAL_PLAYER]!.hand.cards.derive<string>((cards) => cards.some((c) => c.rank == card.rank && c.suit == card.suit) ? "shadow-[0px_0px_10px_5px_rgba(255,255,0,0.3)]" : ""
             + (card.rank == 0 ? "opacity-60" : ""))}
        />
    );
}

function CommunityCards(game: PokerTable): JSX.Element {
    return (
        <div class={`flex gap-6 p-6 pb-16 justify-center`}>
            {insertBoxArray(game.mid, card => UICard(card, game))}
        </div>
    )
}

function PlayerCards(game: PokerTable): JSX.Element {
    return (
        <>
            <div class={`p-6`}>
                <div class={"justify-center flex gap-6"}>
                    {insertBoxArray(game.player[LOCAL_PLAYER]!.card, card => UICard(card, game))}
                </div>
                <div class={"text-center mt-4"}>
                    <p>{insertBoxToString(game.player[LOCAL_PLAYER]!.hand.rank, rank => HAND_MAP[rank]!)}</p>
                </div>
            </div>
        </>
    )
}
