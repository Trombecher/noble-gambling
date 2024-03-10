import {Game} from "../games";
import {Card, PokerTable, Probability, RevealType} from "./pokerframe";
import {insertBoxArray, insertBoxToString} from "aena/glue";
import {JSX} from "aena";
import {Button} from "../components";

const SUIT_MAP = ["clubs", "hearts", "spades", "diamonds"];
const RANK_MAP = ["error", "error", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king", "ace"];
const HAND_MAP = ["none", "High Card", "One Pair", "Two Pair", "Three of a Kind", "Straight", "Flush", "Full House", "Four of a Kind", "Straight Flush", "Royal Flush"];
const LOCAL_PLAYER = 0;

export const Poker: Game = () => {
    let game = new PokerTable
    game.addPlayers(1)
    game.distribute()
    game.revealMid(RevealType.Flop);
    game.player[LOCAL_PLAYER]!.updateHand(game.mid)
    let prob = new Probability()
    prob.run(game.mid, game.player[LOCAL_PLAYER]!.card)
    return (
        <>
            <div class={"justify center"}>
                {CommunityCards(game)}
                <div class={"flex ml-auto justify-center gap-16"}>
                    {unknownCards()}
                    {PlayerCards(game, prob)}
                </div>
            </div>
            <div class={"justify-center m-auto"}>
                <Button onclick={() => {
                    game.reset();
                    game.distribute();
                    game.revealMid(RevealType.Flop);
                    game.player[LOCAL_PLAYER]!.updateHand(game.mid);
                    prob.winP(game.mid, game.player[LOCAL_PLAYER]!.card)
                    prob.run(game.mid, game.player[LOCAL_PLAYER]!.card)
                }}>Reload</Button>
            </div>
            <div class={"justify-center rounded-xl bg-white m-auto p-4 mt-3 text-black text-lg"}>
                {stats(prob)}
            </div>
        </>
    );
};

function stats(prob: Probability): JSX.Element{
    return (
        <>
            <p>{insertBoxToString(prob.expect_us, (n) => (Math.round(100 * n) / 100).toString())}</p>
            <p>{insertBoxToString(prob.expect_them, (n) => (Math.round(100 * n) / 100).toString())}</p>
            <div class={"flex gap-2"}>
                {insertBoxArray(prob.relative_us, (n) => <p>{Math.round(10000 * n) / 100}</p>)}
            </div>
            <div class={"flex gap-2"}>
                {insertBoxArray(prob.relative_them, (n) => <p>{Math.round(10000 * n) / 100}</p>)}
            </div>
        </>
)
}

function unknownCards(): JSX.Element{
    return (
        <div class={"flex gap-6 p-6 items-start"}>
            <img
                src={`/noble-gambling/Cards/back.png`}
                alt=""
                width={75}
                height={52}
            />
            <img
                src={`/noble-gambling/Cards/back.png`}
                alt=""
                width={75}
                height={52}
            />
        </div>
    )
}

function UICard(card: Card, game: PokerTable): JSX.Element {
    return (
        <img
            src={`/noble-gambling/Cards/${RANK_MAP[card.rank]}_of_${SUIT_MAP[card.suit]}.png`}
            alt=""
            width={75}
            height={52}
            class={game.player[LOCAL_PLAYER]!.hand.cards.derive<string>((cards) => cards.some((c) => c.rank == card.rank && c.suit == card.suit) ? "shadow-[0px_0px_10px_5px_rgba(255,255,0,0.3)]" : "")}
        />
    );
}

function CommunityCards(game: PokerTable): JSX.Element {
    return (
        <div class={`flex gap-6 p-6 pb-16 justify-center`}>
            {insertBoxArray(game.mid, card => UICard(card, game))}
            <img
                src={`/noble-gambling/Cards/back.png`}
                alt=""
                width={75}
                height={52}
                class={"opacity-60"}
            />
            <img
                src={`/noble-gambling/Cards/back.png`}
                alt=""
                width={75}
                height={52}
                class={"opacity-60"}
            />
        </div>
    )
}

function PlayerCards(game: PokerTable, prob: Probability): JSX.Element {
    return (
        <>
            <div class={`p-6`}>
                <div class={"justify-center flex gap-6"}>
                    {insertBoxArray(game.player[LOCAL_PLAYER]!.card, card => UICard(card, game))}
                </div>
                <div class={"text-center mt-4"}>
                    <p>{insertBoxToString(game.player[LOCAL_PLAYER]!.hand.rank, rank => HAND_MAP[rank]!)}</p>
                    <p>{insertBoxToString(prob.winning_prob, prob => (Math.round(10000 * prob) / 100).toString())}%</p>
                    <p>{insertBoxToString(prob.tie_prob, prob => (Math.round(10000 * prob) / 100).toString())}%</p>
                </div>
            </div>
        </>
    )
}
