import {Game} from "../games";
import {PokerTable} from "./pokerframe";
import {insertBoxArray, insertBoxToString} from "aena/glue";
import {JSX} from "aena";

const SUIT_MAP = ["clubs", "hearts", "spades", "diamonds"]
const RANK_MAP = ["error", "error", "2", "3", "4", "5", "6", "7", "8", "9", "10",
                            "jack", "queen", "king", "ace"]
const HAND_MAP = ["none", "High Card", "One Pair", "Two Pair", "Three of a Kind",
                            "Straight", "Flush", "Full House", "Four of a Kind", "Straight Flush", "Royal Flush"]
const LOCAL_PLAYER = 0

export const Poker: Game = () => {
    let game = new PokerTable
    game.addPlayers(1)
    game.distribute()
    game.revealAll()
    game.player[0]!.updateHand([])
    return (
        <>
            <div class={"justify center"}>
                {CommunityCards(game)}
                {PlayerCards(game, LOCAL_PLAYER)}
            </div>
            <div class={"justify-center m-auto"}>
                <button onclick={() => {
                    game.reset();
                    game.distribute();
                    game.revealAll()
                    game.player[LOCAL_PLAYER]!.updateHand(game.mid)
                }}>Reload
                </button>
            </div>
        </>
    );
}

function CommunityCards(game: PokerTable): JSX.Element{
    return (
        <div class={`flex gap-6 p-6 pb-16 justify-center`}>
            {insertBoxArray(game.mid, (card) => (
                <img src={`/noble-gambling/Cards/${RANK_MAP[card.rank]}_of_${SUIT_MAP[card.suit]}.png`} alt=""
                     width="75" style="wrap" class={""}/>
            ))}
        </div>
    )
}

function PlayerCards(game: PokerTable, n: number): JSX.Element{
    return (
        <>
            <div class={`ml-auto mr- p-6`}>
                <div class={"justify-center flex gap-6 "}>
                    {insertBoxArray(game.player[n]!.card, (card) => (
                        <img src={`/noble-gambling/Cards/${RANK_MAP[card.rank]}_of_${SUIT_MAP[card.suit]}.png`} alt=""
                             width="75" style="wrap" class={""}/>
                    ))}
                </div>
                <div class={"text-center pt-4"}>{insertBoxToString(game.player[LOCAL_PLAYER]!.hand.rank, (rank) => HAND_MAP[rank]!)}</div>
            </div>
        </>
    )
}
