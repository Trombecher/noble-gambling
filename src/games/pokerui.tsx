import {Game} from "../games";
import {PokerTable, HandType} from "./pokerframe";
import {insertBoxArray, insertBoxToString} from "aena/glue";

const SUIT_MAP = ["clubs", "hearts", "spades", "diamonds"]
const RANK_MAP = ["error", "error", "2", "3", "4", "5", "6", "7", "8", "9", "10",
                            "jack", "queen", "king", "ace"]

export const Poker: Game = () => {
    let game = new PokerTable
    game.addPlayers(1)
    game.distribute()
    game.player[0]!.updateHand([])
    return (
        <>
            <div class={`flex flex-wrap justify-center gap-6`}>
                {insertBoxArray(game.player[0]!.card, (card) => (
                    <img src={"/Cards/"    + RANK_MAP[card.rank] + "_of_" + SUIT_MAP[card.suit] + ".png"} alt="card1" width="100" style="wrap"/>
                ))}
            </div>
            <div class={"justify-center"}>
                <button onclick={() => {
                    game.reset();
                    game.distribute(); game.player[0]!.updateHand([])}}>Next</button>
                <div>Your Hand: {insertBoxToString(game.player[0]!.hand.rank, rank => HandType[rank])}</div>
            </div>
        </>
    );
}
