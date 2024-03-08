import {Game} from "../games";
import {PokerTable, HandType} from "./pokerframe";
import {insertBoxArray, insertBoxToString} from "aena/glue";
import {JSX} from "aena";

const SUIT_MAP = ["clubs", "hearts", "spades", "diamonds"]
const RANK_MAP = ["error", "error", "2", "3", "4", "5", "6", "7", "8", "9", "10",
                            "jack", "queen", "king", "ace"]
const LOCAL_PLAYER = 0

export const Poker: Game = () => {
    let game = new PokerTable
    game.addPlayers(1)
    game.distribute()
    game.revealAll()
    game.player[0]!.updateHand([])
    return (
        <>
            {CommunityCards(game)}
            {PlayerCards(game, LOCAL_PLAYER)}
            <div class={"justify-center ml-auto"}>
                <div>{insertBoxToString(game.player[LOCAL_PLAYER]!.hand.rank, (rank) => HandType[rank])}</div>
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

function PlayerCards(game: PokerTable, n: number): JSX.Element{
    return (
        <div class={`flex flex-wrap gap-6 ml-auto p-6 justify-center`}>
            {insertBoxArray(game.player[n]!.card, (card) => (
                <img src={`/noble-gambling/Cards/${RANK_MAP[card.rank]}_of_${SUIT_MAP[card.suit]}.png`} alt=""
                     width="75" style="wrap" class={""}/>
            ))}
        </div>
    )
}
function CommunityCards(game: PokerTable): JSX.Element{
    return (
        <div class={`flex flex-wrap gap-6 p-6 pb-16 justify-center`}>
            {insertBoxArray(game.mid, (card) => (
                <img src={`/noble-gambling/Cards/${RANK_MAP[card.rank]}_of_${SUIT_MAP[card.suit]}.png`} alt=""
                     width="75" style="wrap" class={""}/>
            ))}
        </div>
    )
}