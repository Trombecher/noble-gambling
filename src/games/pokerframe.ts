// types

import {Box, BoxArray} from "aena";

export enum Rank{
    Zero,
    Two = 2,
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
    Royal_Flush_______________,
}

enum RevealType{
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

// handles everything around hands
// constructor() takes any amount of cards as input and finds the best hand among them
// along with the hand rank it also finds the relevant values for tiebreakers
class Hand{
    tiebreakers: Rank[] = [];
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
        // allows wraps from ace to two
        let callback = (i: number): boolean => {
            let j = i + 5
            for (;i < j; i++)
                if (!count[i % 13]!) return false
            return true
        }
        // straights are generally ranked by their highest value cards
        if (callback(Rank.Ten - vao)) return Rank.Ace + 1 // best straight is royal
        for (let v = Rank.Jack; v <= Rank.Ace; v++)       // then all others containing an ace 
            if (callback(v - vao)) return v
        for (let v = Rank.Nine; v >= Rank.Two; v--)       // the rest
            if (callback(v - vao)) return v
        
        return Rank.Zero
    }
    private isFlush(): boolean{
        for (let s = Suit.Clubs; s < NUM_SUITS; s++)
            if (this.suit_count[s]! >= 5){
                this.fillFlushSuit(s)
                return true
            }
        return false
    }
    private isRoyal(): boolean{
        for (let v = Rank.Ten; v <= Rank.Ace; v++)
            if (!this.flush_suit_vals[v - vao]!) return false
        return true
    }

    compare(other: Hand): Comp{
        if (this.rank > other.rank) return Comp.Greater
        if (this.rank < other.rank) return Comp.Smaller

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

            for (let i = 0; i < n; i++){
                let next = this.highestCard(exclude)
                this.tiebreakers.push(next)
                exclude.push(next)
            }
        }

        if (fl && this.isRoyal()){ 
            this.rank.value = HandType.Royal_Flush_______________
        }
        else if (fl && sfl){
            this.rank.value = HandType.Straight_Flush
            this.tiebreakers.push(sfl)
        }
        else if (k4){
            this.rank.value = HandType.Four_Kind
            pushTiebreakers(1, [k4])
        }
        else if (k3 && k2){
            this.rank.value = HandType.Full_House
            pushTiebreakers(0, [k3, k2])
        }
        else if(fl){
            this.rank.value = HandType.Flush
            this.val_count = this.flush_suit_vals
            pushTiebreakers(5, [])
        }
        else if (str){
            this.rank.value = HandType.Straight
            this.tiebreakers.push(str)
        }
        else if (k3){
            this.rank.value = HandType.Three_Kind
            pushTiebreakers(2, [k3])
        }
        else if (p2[0]){
            this.rank.value = HandType.Two_Pair
            pushTiebreakers(1, p2)
        }
        else if (k2){
            this.rank.value = HandType.One_Pair
            pushTiebreakers(3, [k2])
        }
        else{
            this.rank.value = HandType.High
            pushTiebreakers(5, [])
        }
    }
}

export class Player{
    card: BoxArray<Card> = new BoxArray<Card>()
    cash: Money = 0
    bet: Money = 0
    hand: Hand = new Hand
    has_folded = false
    is_all_in = false

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

enum ActionType{
    Check,
    Raise,
    Fold,
    All_In
}
class Action{
    kind: ActionType
    amount: Money

    constructor(k: ActionType, a: Money = 0){
        this.kind = k
        this.amount = a
    }
}

export class PokerTable{
    player: Player[] = []
    mid: BoxArray<Card> = new BoxArray
    pot: Money = 0
    to_match: Money = 0
    blind: Money = 25
    dealer_id = 0
    private current_player_id = 0
    private last_to_raise = 0
    private deck = shuffledDeck()

    private current_player(){
        return this.player[this.current_player_id]!
    }
    reset(){
        this.pot = 0
        this.to_match = 0
        this.last_to_raise = 0
        this.mid.splice(0, this.mid.length)
        this.deck = shuffledDeck()
        this.dealer_id = (this.dealer_id + 1) % this.player.length
        this.current_player_id = this.dealer_id
        for (let p of this.player){
            p.card.splice(0, p.card.length)
            p.bet = 0
            p.has_folded = false
            p.is_all_in = false
            p.hand.update([])
        }
    }
    private setBet(amount: Money){
        this.current_player().bet += amount
        this.current_player().cash -= amount
        this.pot += amount
        // update pot and show players their new net worth and bet \\
    }

    private check(){
        let increase = this.to_match - this.current_player().bet
        this.setBet(increase)
    }
    private raise(amount: Money){ // minimum allowed raise should be the amount of a big blind (2 * blind)
        this.setBet(amount)
        this.to_match = this.current_player().bet
        this.last_to_raise = this.current_player_id
    }
    private fold(){
        this.current_player().has_folded = true
    }
    private allIn(){
        this.current_player().is_all_in = true
        this.raise(this.current_player().cash)
    }
    private act(action: Action){
        if      (action.kind == ActionType.Check)   this.check()
        else if (action.kind == ActionType.Raise)   this.raise(action.amount)
        else if (action.kind == ActionType.Fold)    this.fold()
        else if (action.kind == ActionType.All_In)  this.allIn()
    }

    // gets next player
    // considers wraps
    // returns false if the betting round is over
    private nextPlayer(): boolean{
        do{
            this.current_player_id = (this.current_player_id + 1) % this.player.length
            if (this.current_player_id == this.last_to_raise) return false
        }while(this.current_player().has_folded || this.current_player().is_all_in)

        return true
    }

    private updateHands(){
        for (let players of this.player)
            players.updateHand(this.mid)
            
        // show each player what their current best hand looks like? \\
    }
    // returns true if all players except one have folded or are all in
    private betRound(): boolean{
        this.updateHands()
        do{
            this.act(wait_for_action()) // let the player choose their action \\
        }while(this.nextPlayer())

        let not_in = this.player.filter((player) => !player.has_folded && !player.is_all_in)
        return not_in.length <= 1;

    }
    distribute(){
        for (let p of this.player){
            p.card.push(this.deck.pop() as Card)
            p.card.push(this.deck.pop() as Card)
        }

        // show players their cards \\
    }
    private revealMid(stage: RevealType){
        if (stage == RevealType.Flop){
            for (let i = 0; i < 3; i++)
                this.mid.push(this.deck.pop() as Card)
        }
        else this.mid.push(this.deck.pop() as Card)

        // show community cards to players \\
    }

    revealAll(){
        for (let i = 0; i < 5; i++)
            this.mid.push(this.deck.pop() as Card)
    }

    private wrapUp(){
        // if all players except one have folded before all community cards have been shown
        // this shows the remaining cards and updates player hands
        if (this.mid.length < 5){
            for (let i = 0; i < 5 - this.mid.length; i++)
                this.mid.push(this.deck.pop() as Card)

            this.updateHands()
        }

        let not_folded = this.player.filter((player) => !player.has_folded)
        let winners = [not_folded[0]]
        not_folded.splice(0, 1)
        for (let player of not_folded){
            let res = player.hand.compare(winners[0]!.hand)
            if      (res == Comp.Greater)   winners = [player]
            else if (res == Comp.Equal)     winners.push(player)
        }

        for (let winner of winners) // splits pot equally among winners (no side pots etc.)
            winner!.cash += this.pot / winners.length

        // show players their new net worth \\
    }
    private setBlinds(){
        this.current_player_id -= 2
        this.raise(this.blind)
        this.nextPlayer()
        this.raise(2 * this.blind)
        this.nextPlayer()
    }

    // Runs one full game, decides on the winners and pays out
    start(){
        this.distribute()       // distributes cards to the players (pre-flop)
        this.setBlinds()        
        if (!this.betRound())   // runs the first round of betting

            // runs three betting rounds
            for (let stage = RevealType.Flop; stage <= RevealType.River; stage++){
                this.revealMid(stage)   // in stages - reveals the community cards (flop, turn, river)
                if (this.betRound()) break
            }

        this.wrapUp()
        this.reset()
    }

    addPlayers(n: number){
        for (let i = 0; i < n; i++)
            this.player.push(new Player)
    }
    giveAll(amount: Money){
        for (let p of this.player)
            p.cash += amount
    }
}



function wait_for_action(): Action{
    return new Action(ActionType.Raise, 200)
}
