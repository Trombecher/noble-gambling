import {Game} from "../games";
import {Card, PokerTable} from "./pokerframe";
import {insertBoxArray, insertBoxToString} from "aena/glue";
import {JSX} from "aena";
import {Button} from "../components";

const SUIT_MAP = ["clubs", "hearts", "spades", "diamonds"];
const RANK_MAP = ["error", "error", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king", "ace"];
const HAND_MAP = ["none", "High Card", "One Pair", "Two Pair", "Three of a Kind", "Straight", "Flush", "Full House", "Four of a Kind", "Straight Flush", "Royal Flush"];
const LOCAL_PLAYER = 0;

export const Poker: Game = () => {
    let game = new PokerTable;
    game.addPlayers(1);
    game.distribute();
    game.revealAll();
    game.player[0]!.updateHand([]);
    return (
        <>
            <div class={"justify center"}>
                {CommunityCards(game)}
                {PlayerCards(game)}
            </div>
            <div class={"justify-center m-auto"}>
                <Button onclick={() => {
                    game.reset();
                    game.distribute();
                    game.revealAll();
                    game.player[LOCAL_PLAYER]!.updateHand(game.mid);
                }}>Reload</Button>
            </div>
        </>
    );
};

function UICard({card}: {card: Card}) {
    return (
        <img
            src={`/noble-gambling/Cards/${RANK_MAP[card.rank]}_of_${SUIT_MAP[card.suit]}.png`}
            alt=""
            width={75}
            height={52}
        />
    );
}

function CommunityCards(game: PokerTable): JSX.Element {
    return (
        <div class={`flex gap-6 p-6 pb-16 justify-center`}>
            {insertBoxArray(game.mid, card => <UICard card={card}/>)}
        </div>
    );
}

function PlayerCards(game: PokerTable): JSX.Element {
    return (
        <>
            <div class={`ml-auto p-6`}>
                <div class={"justify-center flex gap-6"}>
                    {insertBoxArray(game.player[LOCAL_PLAYER]!.card, card => <UICard card={card}/>)}
                </div>
                <div class={"text-center mt-4"}>{insertBoxToString(
                    game.player[LOCAL_PLAYER]!.hand.rank,
                    rank => HAND_MAP[rank]!
                )}</div>
            </div>
        </>
    );
}