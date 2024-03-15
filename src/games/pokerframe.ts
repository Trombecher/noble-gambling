// types

import {Box, BoxArray} from "aena";
import {promptAction} from "./pokerui";

export enum Rank{
    Zero,
    One,
    Two,
    Three,
    Four,
    Five,
    Six,
    Seven,
    Eight,
    Nine,
    Ten,
    Jack,
    Queen,
    King,
    Ace
}
// value array offset
let vao = 2

export enum Suit{
    Clubs,
    Hearts,
    Spades,
    Diamonds,
    None
}
let NUM_SUITS = 4

export enum HandType{
    None,
    High,
    One_Pair,
    Two_Pair,
    Three_Kind,
    Straight,
    Flush,
    Full_House,
    Four_Kind,
    Straight_Flush,
    Royal_Flush,
}

export enum RevealType{
    Flop,
    Turn,
    River
}

enum Comp{
    Smaller,
    Greater,
    Equal
}

export class Card{
    rank: Rank;
    suit: Suit;

    constructor(v: Rank, s:Suit){
        this.rank = v
        this.suit = s
    }
}

function compareFunction(c1: Card, c2: Card){
    if (c1.rank > c2.rank) return -1
    if (c1.rank < c2.rank) return 1
    return 0
}

// handles everything around hands
// constructor() takes any amount of cards as input and finds the best hand among them
// along with the hand rank it also finds the relevant values for tiebreakers
export class Hand{
    tiebreakers: Rank[] = [];
    cards = new Box(new Array<Card>)
    rank = new Box(HandType.None)


    private input: Card[] = []
    private suit_count: number[] = [0, 0, 0, 0]
    private val_count: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    private flush_suit_vals: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

    private fillFlushSuit(suit: Suit){
        for (let card of this.input)
            if (card.suit == suit) this.flush_suit_vals[card.rank - vao]++
    }
    private countProperties(){
        for (let card of this.input){
            this.val_count[card.rank - vao]++
            this.suit_count[card.suit]++
        }
    }
    // returns highest card in hand
    // excludes such of any value given in 'exclude'
    private highestCard(exclude: Rank[]): Rank{
        for (let v = Rank.Ace; v >= Rank.Two; v--)
            if (this.val_count[v - vao]! && !exclude.includes(v)) return v
        return Rank.Zero
    }

    private hasKind(n: number): Rank{
        for (let v = Rank.Ace; v >= Rank.Two; v--)
            if (this.val_count[v - vao]! == n) return v
        return Rank.Zero
    }
    private hasTwoPair(): Rank[]{
        let list: Rank[] = []
        for (let v = Rank.Ace; v >= Rank.Two; v--)
            if (this.val_count[v - vao]! == 2) list.push(v)
        
        if (list.length < 2) list = [Rank.Zero]
        return list
    }
    private isStraight(t: HandType = HandType.Straight): Rank{
        let count = (t == HandType.Flush) ? this.flush_suit_vals : this.val_count

        // finds if a straight with starting index 'i' exists
        // allows wraps from ace to two - no around-the-corner-straights
        let callback = (i: number): boolean => {
            let j = i + 5
            for (;i < j; i++)
                if (!count[i % 13]!) return false
            return true
        }
        // straights are generally ranked by their highest value cards
        for (let v = Rank.Ten; v >= Rank.Two; v--)       // the rest
            if (callback(v - vao)) return v
        if (callback(Rank.Ace - vao)) return Rank.One
        
        return Rank.Zero
    }
    private isFlush(): Suit{
        for (let s = Suit.Clubs; s < NUM_SUITS; s++)
            if (this.suit_count[s]! >= 5){
                this.fillFlushSuit(s)
                return s + 1
            }
        return 0
    }
    private isRoyal(): boolean{
        for (let v = Rank.Ten; v <= Rank.Ace; v++)
            if (!this.flush_suit_vals[v - vao]!) return false
        return true
    }

    compare(other: Hand): Comp{
        if (this.rank.value > other.rank.value) return Comp.Greater
        if (this.rank.value < other.rank.value) return Comp.Smaller

        for (let i = 0; i < this.tiebreakers.length; i++){
            if (this.tiebreakers[i]! > other.tiebreakers[i]!) return Comp.Greater
            if (this.tiebreakers[i]! < other.tiebreakers[i]!) return Comp.Smaller
        }
        return Comp.Equal
    }

    update(input: Card[]){
        if (!input.length) return
        this.tiebreakers = []
        this.input = [...input]
        this.suit_count = [0, 0, 0, 0]
        this.val_count = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        this.flush_suit_vals = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        this.countProperties()

        let fl = this.isFlush()
        let str = this.isStraight()
        let sfl = this.isStraight(HandType.Flush)
        let k4 = this.hasKind(4)
        let k3 = this.hasKind(3)
        let k2 = this.hasKind(2)
        let p2 = this.hasTwoPair()

        // pushes all values in 'exclude' and those of the 'n' next highest ranking cards into the tiebreakers
        let pushTiebreakers = (n: number, exclude: Rank[]) => {
            if (exclude.length) this.tiebreakers.push(...exclude)

            for (let i = 0; i < n; i++) {
                let next = this.highestCard(exclude)
                this.tiebreakers.push(next)
                exclude.push(next)
            }
        }

        if (fl && this.isRoyal()){ 
            this.rank.value = HandType.Royal_Flush
            this.cards.value = [new Card(Rank.Ace, fl - 1), new Card(Rank.Jack, fl - 1), new Card(Rank.King, fl - 1), new Card(Rank.Queen, fl - 1), new Card(Rank.Ten, fl - 1)]
        }
        else if (fl && sfl){
            this.rank.value = HandType.Straight_Flush
            this.tiebreakers.push(sfl)
            let no1 = (sfl == 1) ? Rank.Ace : sfl
            this.cards.value = [new Card(no1, fl - 1), new Card(sfl + 1, fl - 1), new Card(sfl + 2, fl - 1), new Card(sfl + 3, fl - 1), new Card(sfl + 4, fl - 1)]
        }
        else if (k4){
            this.rank.value = HandType.Four_Kind
            pushTiebreakers(1, [k4])
            this.cards.value = [...input.filter((card) => card.rank == k4)]
        }
        else if (k3 && k2){
            this.rank.value = HandType.Full_House
            pushTiebreakers(0, [k3, k2])
            this.cards.value = [...input.filter((card) => card.rank == k3 || card.rank == k2)]
        }
        else if(fl){
            this.rank.value = HandType.Flush
            this.val_count = this.flush_suit_vals
            pushTiebreakers(5, [])
            let col = input.filter((card) => card.suit == fl - 1)
            col.sort(compareFunction)
            this.cards.value = [col[0]!, col[1]!, col[2]!, col[3]!, col[4]!]
        }
        else if (str){
            this.rank.value = HandType.Straight
            this.tiebreakers.push(str)
            let a = this.input.filter((c) => (str <= c.rank) && (c.rank <= str + 4))
            if (str == Rank.One) a.push(this.input.find((c) => c.rank == Rank.Ace) as Card)
            a = a.filter((item, pos)=> a.findIndex((c) => c.rank == item.rank) == pos)
            this.cards.value = [...a]
        }
        else if (k3){
            this.rank.value = HandType.Three_Kind
            pushTiebreakers(2, [k3])
            this.cards.value = [...input.filter((card) => card.rank == k3)]
        }
        else if (p2[0]){
            this.rank.value = HandType.Two_Pair
            pushTiebreakers(1, p2)
            this.cards.value = [...input.filter((card) => card.rank == p2[0] || card.rank == p2[1])]
        }
        else if (k2){
            this.rank.value = HandType.One_Pair
            pushTiebreakers(3, [k2])
            this.cards.value = [...input.filter((card) => card.rank == k2)]
        }
        else{
            this.rank.value = HandType.High
            pushTiebreakers(5, [])
            this.cards.value = [input.sort(compareFunction)[0]!]
        }
    }
}

export class Player{
    card = new BoxArray<Card>
    cash: Money = 1000
    bet: Money = 0
    hand: Hand = new Hand
    has_folded = new Box(false)
    is_all_in = false
    bot = new Bot(this)

    updateHand(mid: Card[]){
        let input = [...mid, ...this.card]
        this.hand.update(input)
    }
}

type Deck = Card[]
type Money = number


let full_deck: Deck = [
    new Card(2, 0), new Card(3, 0), new Card(4, 0), new Card(5, 0), new Card(6, 0), new Card(7, 0), new Card(8, 0), new Card(9, 0), new Card(10, 0),
    new Card(11, 0), new Card(12, 0), new Card(13, 0), new Card(14, 0),
    new Card(2, 1), new Card(3, 1), new Card(4, 1), new Card(5, 1), new Card(6, 1), new Card(7, 1), new Card(8, 1), new Card(9, 1), new Card(10, 1),
    new Card(11, 1), new Card(12, 1), new Card(13, 1), new Card(14, 1),
    new Card(2, 2), new Card(3, 2), new Card(4, 2), new Card(5, 2), new Card(6, 2), new Card(7, 2), new Card(8, 2), new Card(9, 2), new Card(10, 2),
    new Card(11, 2), new Card(12, 2), new Card(13, 2), new Card(14, 2),
    new Card(2, 3), new Card(3, 3), new Card(4, 3), new Card(5, 3), new Card(6, 3), new Card(7, 3), new Card(8, 3), new Card(9, 3), new Card(10, 3),
    new Card(11, 3), new Card(12, 3), new Card(13, 3), new Card(14, 3)
]

function shuffledDeck(): Deck{
    let deck: Deck = []
    let temp_deck = Object.assign([], full_deck)
    for (let i = 51; i >= 0; i--){
        let ix = Math.floor(Math.random() * (i + 1))
        deck.push(temp_deck[ix]!)
        temp_deck.splice(ix, 1)
    }
    return deck
}

export enum ActionType{
    Check,
    Raise,
    Fold
}

export class PokerTable {
    player: Player[] = []
    mid: BoxArray<Card> = new BoxArray
    pot: Money = 0
    to_match: Money = 0
    blind: Money = 25
    dealer_id = 0
    current_player_id = new Box(0)
    private last_to_raise = 0
    deck = shuffledDeck()
    action = new Box([3, 0])
    info = new BoxArray<number[]>
    balance = new Box(0)
    result = new Box(false)

    private current_player() {
        return this.player[this.current_player_id.value]!
    }

    reset() {
        this.pot = 0
        this.to_match = 0
        this.last_to_raise = 0
        this.mid.splice(0, this.mid.length)
        this.deck = shuffledDeck()
        this.dealer_id = (this.dealer_id + 1) % this.player.length
        this.current_player_id.value = this.dealer_id
        for (let p of this.player) {
            p.card.splice(0, p.card.length)
            p.bet = 0
            p.has_folded.value = false
            p.is_all_in = false
            p.hand.update([])
        }
    }

    private setBet(amount: Money) {
        this.current_player().bet += amount
        this.current_player().cash -= amount
        if (!this.current_player_id.value) this.balance.value -= amount
        this.pot += amount
        // update pot and show players their new net worth and bet \\
    }

    private check() {
        let increase = this.to_match - this.current_player().bet
        if (increase >= this.current_player().cash) this.allIn()
        else this.setBet(increase)
    }

    private raise(amount: Money, check_all_in: boolean = true) { // minimum allowed raise should be the amount of a big blind (2 * blind)
        if (check_all_in && amount == this.current_player().cash) this.allIn()
        else {
            this.setBet(amount)
            this.to_match = this.current_player().bet
            this.last_to_raise = this.current_player_id.value
        }
    }

    private fold() {
        this.current_player().has_folded.value = true
    }

    private allIn() {
        this.current_player().is_all_in = true
        this.raise(this.current_player().cash, false)
    }

    act(action: ActionType, amount: Money = 0) {
        if (action == ActionType.Check) this.check()
        else if (action == ActionType.Raise) this.raise(amount)
        else if (action == ActionType.Fold) this.fold()
    }

    // gets next player
    // considers wraps
    // returns false if the betting round is over
    private nextPlayer(): boolean {
        do {
            this.current_player_id.value = (this.current_player_id.value + 1) % this.player.length
            if (this.current_player_id.value == this.last_to_raise) return false
        } while (this.current_player().has_folded.value || this.current_player().is_all_in)

        return true
    }

    private updateHands() {
        for (let players of this.player)
            players.updateHand(this.mid)

        // show each player what their current best hand looks like? \\
    }

    // returns true if all players except one have folded or are all in
    private async betRound(): Promise<boolean> {
        this.updateHands()
        do {
            if (this.current_player_id.value == 0) {
                await promptAction()
                this.act(this.action.value[0]!, this.action.value[1]!)
            }
            else {
                this.action.value = this.current_player().bot.prompt(this.mid, this.to_match)
                this.act(this.action.value[0]!, this.action.value[1]!)
                this.info.splice(this.current_player_id.value - 1, 1, [this.current_player().cash, this.current_player_id.value])
                await new Promise(resolve => setTimeout(resolve, 1000))
            }   // prompt bot
        } while (this.nextPlayer())

        let not_in = this.player.filter((player) => !player.has_folded.value && !player.is_all_in)
        return not_in.length <= 1;

    }

    fullReset(){
        this.player.splice(1, this.player.length - 1)
        this.info.splice(0, this.info.length)
        this.reset()
    }

    distribute() {
        for (let p of this.player) {
            p.card.push(this.deck.pop() as Card)
            p.card.push(this.deck.pop() as Card)
        }
        for (let i = 0; i < 5; i++)
            this.mid.push(new Card(0, 4))

        this.updateHands()

        // show players their cards \\
    }

    revealMid(stage: RevealType) {
        if (stage == RevealType.Flop) {
            this.mid.splice(0, this.mid.length)
            for (let i = 0; i < 3; i++)
                this.mid.push(this.deck.pop() as Card)
            this.mid.push(new Card(0, 4), new Card(0, 4))
        }
        else{
            if (stage == RevealType.Turn) this.mid.splice(3, 1, this.deck.pop() as Card)
            else this.mid.splice(4, 1, this.deck.pop() as Card)
        }

        // show community cards to players \\
    }

    revealAll() {
        for (let i = 0; i < 5; i++)
            this.mid.push(this.deck.pop() as Card)
    }

    private wrapUp() {
        // if all players except one have folded before all community cards have been shown
        // this shows the remaining cards and updates player hands
        if (this.mid.length < 5) {
            for (let i = 0; i < 5 - this.mid.length; i++)
                this.mid.push(this.deck.pop() as Card)

            this.updateHands()
        }

        let not_folded = this.player.filter((player) => !player.has_folded.value)
        let winners = [not_folded[0]]
        not_folded.splice(0, 1)
        for (let player of not_folded) {
            let res = player.hand.compare(winners[0]!.hand)
            if (res == Comp.Greater) winners = [player]
            else if (res == Comp.Equal) winners.push(player)
        }

        for (let winner of winners) // splits pot equally among winners (no side pots etc.)
            winner!.cash += this.pot / winners.length

        // show players their new net worth \\
    }

    private setBlinds() {
        this.current_player_id.value -= 2
        this.raise(this.blind)
        this.nextPlayer()
        this.raise(2 * this.blind)
        this.nextPlayer()
    }

    // Runs one full game, decides on the winners and pays out
    async start() {
        this.reset()
        this.distribute()       // distributes cards to the players (pre-flop)
        // this.setBlinds()
        if (!await this.betRound().then((v) => {return v})) {  // runs the first round of betting
            // runs three betting rounds
            for (let stage = RevealType.Flop; stage <= RevealType.River; stage++) {
                this.revealMid(stage)   // in stages - reveals the community cards (flop, turn, river)
                if (await this.betRound().then((v) => {return v})) break
            }
        }

        this.wrapUp()
        this.result.value = true
    }

    addPlayers(n: number) {
        for (let i = 0; i < n; i++) {
            this.player.push(new Player)
            this.info.push([1000, this.info.length])
        }
    }

    giveAll(amount: Money) {
        for (let p of this.player)
            p.cash += amount
    }

    init(bots: number, balance: Box<number>) {
        this.info.pop()
        this.addPlayers(bots)
        this.balance = balance
        this.player[0]!.cash = this.balance.value
    }
}

export class Probability{
    deck: Card[] = [...full_deck]
    relative_us = new BoxArray<number>
    relative_them = new BoxArray<number>
    winning_prob = new Box(0)
    tie_prob = new Box(0)

    private overall_us = 0
    private overall_them = 0
    private absolute_us = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    private absolute_them = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    private result = [0, 0]
    private hand = new Hand
    private testing_hand = new Hand

    private reduceDeck(us: Card[], mid: Card[]){
        this.deck = [...full_deck]
        for (let c of [...us, ...mid])
            this.deck = this.deck.filter((card) => card.rank != c.rank || card.suit != c.suit)
    }

    private resetShit(){
        this.overall_us = 0
        this.overall_them = 0
        this.absolute_us = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        this.absolute_them = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        this.result = [0, 0]
    }

    private enemyLayer(c: Card[], e: number[]){
        for (let i= 0; i < this.deck.length; i++){
            if (e.includes(i)) continue
            c.push(this.deck[i]!)
            for (let j = i + 1; j < this.deck.length; j+=6) {
                if (e.includes(j)) continue

                c.push(this.deck[j]!)
                this.testing_hand.update([...c])
                this.absolute_them[this.testing_hand.rank.value - 1]++
                let comp = this.hand.compare(this.testing_hand)
                if (comp == Comp.Equal) this.result[1]++
                if (comp == Comp.Greater) this.result[0]++
                this.overall_them++
                c.pop()

            }
            c.pop()
        }
    }

    private midLayer(i: number, n: number, c : Card[], us: Card[], e: number[]){
        for (let j = i; j < this.deck.length; j++){
            e.push(j)
            c.push(this.deck[j]!)
            if (n) this.midLayer(j + 1, n - 1, c, us, e)
            else{
                this.hand.update([...c, ...us])
                this.absolute_us[this.hand.rank.value - 1]++
                this.overall_us++

                this.enemyLayer(c, e)
                // this.pLayer3(c, e)
            }
            c.pop()
            e.pop()
        }
    }

    run(mid: Card[], us: Card[]){
        this.reduceDeck(us, mid)
        this.midLayer(0, 4 - mid.length, [...mid], us, [])
        this.winning_prob.value = this.result[0]! / this.overall_them
        this.tie_prob.value = this.result[1]! / this.overall_them
        this.relative_us.splice(0, this.relative_us.length)
        this.relative_them.splice(0, this.relative_them.length)
        for (let a of this.absolute_us) this.relative_us.push(a / this.overall_us)
        for (let a of this.absolute_them) this.relative_them.push(a / this.overall_them)
        this.resetShit()
    }
}

class Bot{
    player

    prompt(mid: Card[], match: Money): [ActionType, Money]{
        let _mid = mid.filter((card) => card.suit != 4)
        if (!_mid.length){
            if (match < 100 || match < this.player.cash * 0.05) return [ActionType.Check, 0]
            return [ActionType.Fold, 0]
        }

        let prob = new Probability
        prob.run(_mid, this.player.card)

        if (prob.winning_prob.value < 0.35) return [ActionType.Fold, 0]

        let check_cost = match - this.player.bet
        if (!check_cost) return [ActionType.Check, 0]

        let frac = Math.pow((prob.winning_prob.value - 0.55) / 0.45, 2)
        let amount = Math.round(frac * this.player.cash / 10) * 10

        if (check_cost > amount) return [ActionType.Fold, 0]
        if (amount == check_cost) return [ActionType.Check, 0]
        return [ActionType.Raise, amount] // possible up round error
    }

    constructor(player: Player) {
        this.player = player
    }
}
