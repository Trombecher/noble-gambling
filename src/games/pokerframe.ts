enum Value{
    None,
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
    Ace, // goofy enum end
}

enum Suit{
    Clubs,
    Hearts,
    Spades,
    Diamonds,
    None,
}

enum Comp{
    Smaller,
    Greater,
    Equal,
}

class Card{
    v: Value;
    s: Suit;

    constructor(v: Value, s: Suit){
        this.v = v;
        this.s = s;
    }

    print(){
        console.log(Value[this.v] + " of " + Suit[this.s])
    }
}

type Money = number // Pink Floyd reference
let no_card = new Card(Value.None, Suit.None)

class Player{
    c = [no_card, no_card];
    h = new Hand;

    print(){
        for (let i = 0; i < 2; i++){
            this.c[i].print()
        }
    }

    countTypes(m: Card[]): number[]{
        let list = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        list[this.c[0].v - 2]++
        list[this.c[1].v - 2]++
        for (let i = 0; i < m.length; i++){
            list[m[i].v - 2]++
        }
        return list
    }

    countTypesOf(m: Card[], s: Suit): number[]{
        let list = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

        for (let i = 0; i < 2; i++){
            if (this.c[i].s == s) list[this.c[i].v - 2]++
        }
        for (let i = 0; i < m.length; i++){
            if (m[i].s == s) list[m[i].v - 2]++
        }
        return list
    }

    countSuits(m: Card[]): number[]{
        let list = [0, 0, 0, 0]
        list[this.c[0].s]++
        list[this.c[1].s]++
        for (let i = 0; i < m.length; i++){
            list[m[i].s]++
        }

        return list
    }

    getHand(m: Card[]){
        let suits = this.countSuits(m)
        let types = this.countTypes(m)

        let fl = flush(suits)
        let str = straight(types)
        let k4 = kind(types, 4)
        let k3 = kind(types, 3)
        let k2 = kind(types, 2)
        let p2 = two_pair(types)

        if (fl && royal(types)){
            this.h.t = HandT.Royal_Flush
        }
        else if (fl && str){
            this.h.t = HandT.Straight_Flush
            this.h.c[0] = new Card(str, 4)
        }
        else if (k4){
            this.h.t = HandT.Four_Kind
            this.h.c[0] = new Card(k4, 4)
            this.h.c[1] = new Card(getHighest(types, [k4]), 4)
        }
        else if (k3 && k2){
            this.h.t = HandT.Full_House
            this.h.c[0] = new Card(k3, 4) // triplet ranks first
            this.h.c[1] = new Card(k2, 4)
        }
        else if (fl){
            this.h.t = HandT.Flush
            let flush_types = this.countTypesOf(m, fl - 1)
            this.h.c[0] = new Card(getHighest(flush_types, []), 4)
            this.h.c[1] = new Card(getHighest(flush_types, [this.h.c[0].v]), 4)
            this.h.c[2] = new Card(getHighest(flush_types, [this.h.c[0].v, this.h.c[1].v]), 4)
            this.h.c[3] = new Card(getHighest(flush_types, [this.h.c[0].v, this.h.c[1].v, this.h.c[2].v]), 4)
            this.h.c[4] = new Card(getHighest(flush_types, [this.h.c[0].v, this.h.c[1].v, this.h.c[2].v, this.h.c[3].v]), 4)
        }
        else if (str){
            this.h.t = HandT.Straight
            this.h.c[0] = new Card(str, 4)
        }
        else if (k3){
            this.h.t = HandT.Three_Kind
            this.h.c[0] = new Card(k3, 4)
            this.h.c[1] = new Card(getHighest(types, [k3]), 4)
            this.h.c[2] = new Card(getHighest(types, [k3, this.h.c[1].v]), 4)
        }
        else if (p2[0]){
            this.h.t = HandT.Two_Pair
            this.h.c[0] = new Card(p2[0], 4)
            this.h.c[1] = new Card(p2[1], 4)
            this.h.c[2] = new Card(getHighest(types, [p2[0], p2[1]]), 4)
        }
        else if (k2){
            this.h.t = HandT.One_Pair
            this.h.c[0] = new Card(k2, 4)
            this.h.c[1] = new Card(getHighest(types, [k2]), 4)
            this.h.c[2] = new Card(getHighest(types, [k2, this.h.c[1].v]), 4)
            this.h.c[3] = new Card(getHighest(types, [k2, this.h.c[1].v, this.h.c[2].v]), 4)
        }
        else {
            this.h.t = HandT.High
            this.h.c[0] = new Card(getHighest(types, []), 4)
            this.h.c[1] = new Card(getHighest(types, [this.h.c[0].v]), 4)
            this.h.c[2] = new Card(getHighest(types, [this.h.c[0].v, this.h.c[1].v]), 4)
            this.h.c[3] = new Card(getHighest(types, [this.h.c[0].v, this.h.c[1].v, this.h.c[2].v]), 4)
            this.h.c[4] = new Card(getHighest(types, [this.h.c[0].v, this.h.c[1].v, this.h.c[2].v, this.h.c[3].v]), 4)
        }
    }
}

enum HandT{
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

class Hand{
    c = [no_card, no_card, no_card, no_card, no_card];
    t = HandT.None

    printT(){
        console.log(HandT[this.t])
        console.log("")
    }
    printC(){
        for (let i = 0; i < 5; i++){
            this.c[i].print()
        }
        console.log("")
    }
}

// scam
const full_deck = [
    new Card(2, 0), new Card(3, 0), new Card(4, 0), new Card(5, 0), new Card(6, 0), new Card(7, 0), new Card(8, 0), new Card(9, 0), new Card(10, 0),
    new Card(11, 0), new Card(12, 0), new Card(13, 0), new Card(14, 0),
    new Card(2, 1), new Card(3, 1), new Card(4, 1), new Card(5, 1), new Card(6, 1), new Card(7, 1), new Card(8, 1), new Card(9, 1), new Card(10, 1),
    new Card(11, 1), new Card(12, 1), new Card(13, 1), new Card(14, 1),
    new Card(2, 2), new Card(3, 2), new Card(4, 2), new Card(5, 2), new Card(6, 2), new Card(7, 2), new Card(8, 2), new Card(9, 2), new Card(10, 2),
    new Card(11, 2), new Card(12, 2), new Card(13, 2), new Card(14, 2),
    new Card(2, 3), new Card(3, 3), new Card(4, 3), new Card(5, 3), new Card(6, 3), new Card(7, 3), new Card(8, 3), new Card(9, 3), new Card(10, 3),
    new Card(11, 3), new Card(12, 3), new Card(13, 3), new Card(14, 3)
]

class Deck{
    d: Card[] = [];

    constructor(){ // inits full shuffled deck
        let temp_deck = Object.assign([], full_deck)
        for (let i = 51; i >= 0; i--){
            let ix = Math.floor(Math.random() * (i + 1))
            this.d.push(temp_deck[ix])
            temp_deck.splice(ix, 1)
        }
        // stupid ass language
    }
}

function flush(s: number[]): number{
    for (let i = 0; i < 5; i++){
        if (s[i] >= 5) return i + 1
    }
    return 0
}

function straight(s: number[]): Value{
    for (let i = 0; i < 8; i++){
        if (s[i] && s[i + 1] && s[i + 2] && s[i + 3] && s[i + 4]) {
            return i + 6
        }
    }
    return Value.None
}

function royal(s: number[]): boolean{
    if (s[8] && s[9] && s[10] && s[11] && s[12]){
        return true
    }
    return false
}

function kind(s: number[], n: number): number{
    for (let i = 0; i < 13; i++){
        if (s[i] == n) return i + 2
    }
    return 0
}

function two_pair(s: number[]): number[]{
    let list = []
    for (let i = 12; i >= 0; i--){
        if (s[i] == 2) list.push(i + 2)
    }
    if (list.length < 2) list = [0]
    return list
}

function getHighest(l: number[], e: Value[]): Value{
    for (let i = 12; i >= 0; i--){
        if (l[i] && !e.filter(x => x == (i + 2)).length){
            return i + 2
        }
    }
    return Value.None
}

class GameHandler{
    players: Player[] = []
    mid: Card[] = []
    cards = new Deck

    // returns true if h1 is better than h2 
    compareHands(i1: number, i2: number): Comp{
        let h1 = this.players[i1].h
        let h2 = this.players[i2].h

        if (h1.t == h2.t){
            for (let i = 0; i < 5; i++){
                if (h1.c[i].v > h2.c[i].v) return Comp.Greater
                if (h1.c[i].v < h2.c[i].v) return Comp.Smaller
            }
            return Comp.Equal
        }
        
        if (h1.t > h2.t) return Comp.Greater
        return Comp.Smaller
    }

    distribute(){
        for (let i = 0; i < this.players.length; i++){
            let ix = this.cards.d.length
            this.players[i].c = [this.cards.d[ix - 1], this.cards.d[ix - 2]]
            this.cards.d.pop()
            this.cards.d.pop()
        }

        for (let i = 0; i < 5; i++){
            this.mid.push(this.cards.d[this.cards.d.length - 1])
            this.cards.d.pop()
        }
    }

    getWinners(folded: number[]): number[]{
        let w = [0]

        for (let i = 0; i < this.players.length; i++){
            if (!folded.includes(i)){
                w = [i]
                this.players[i].getHand(this.mid)
                break
            }
        }

        for (let i = w[0] + 1; i < this.players.length; i++){
            if (!folded.includes(i)){
                this.players[i].getHand(this.mid)
                let comp = this.compareHands(i, w[0])
                if      (comp == Comp.Equal)    w.push(i)
                else if (comp == Comp.Greater)  w = [i]
            }
        }
        return w
    }

    startRound(){
        let deck = new Deck
        this.cards = deck
        this.distribute()
    }

    addPlayer(){
        this.players.push(new Player)
    }
    removePlayer(n: number){
        this.players.splice(n, 1)
    }

    constructor(n: number){
        for (let i = 0; i < n; i++){
            this.addPlayer()
        }
    }
}

enum Action{
    Check,
    Raise,
    Fold,
}

function input_function(): [Action, number]{
    return [Action.Check, 0]
}

class BetHandler{
    game: GameHandler

    pot: Money = 0
    to_match: Money = 0

    cash: Money[] = []
    bet: Money[] = []

    folded: number[] = []
    players: number
    current_player = 0
    last_to_raise = 0

    round(){
        this.game.startRound()

        for (let i = 0; i < 4; i++){
            this.betRound()
            // reveal cards (1, 2, 3), (4), (5)
        }

        this.concludeRound()
    }

    betRound(){
        this.current_player = 0
        this.last_to_raise = 0

        do{
            let action = input_function()
            if      (action[0] == Action.Fold)  this.fold()
            else if (action[0] == Action.Check) this.check()
            else if (action[0] == Action.Raise) this.raise(action[1])
            this.nextPlayer()
        }while(this.current_player != this.last_to_raise)
    }

    nextPlayer(){
        do{
            this.current_player++
            if (this.current_player >= this.players) this.current_player = 0
            if (!this.hasFolded()) break
        }while(true)
    }

    hasFolded(): boolean{
        return this.folded.includes(this.current_player)
    }

    raise(amount: Money){
        this.cash[this.current_player] -= amount
        this.bet[this.current_player] += amount
        this.to_match = this.bet[this.current_player]
        this.last_to_raise = this.current_player
    }

    check(){
        let amount = this.to_match - this.bet[this.current_player]
        this.cash[this.current_player] -= amount
        this.bet[this.current_player] += amount
    }

    fold(){
        this.folded.push(this.current_player)
    }

    addPlayer(){
        this.cash.push(0)
        this.bet.push(0)
        this.players++
        this.game.addPlayer()
    }
    removePlayer(n: number){
        // payout 
        this.cash.splice(n, 1)
        this.bet.splice(n, 1)
        this.players--
        this.game.removePlayer(n)
        // remember shifted player numbers!!!
    }
    
    concludeRound(){
        let winners = this.game.getWinners(this.folded)
        for (let i = 0; i < this.players; i++){
            this.bet[i] = 0
            if (winners.includes(i)) this.cash[i] += this.pot/winners.length
        }
        this.pot = 0
        this.to_match = 0
        this.folded = []
        // track stats?
    }

    addToAll(m: Money){
        for (let i = 0; i < this.players; i++){
            this.addToPlayer(i, m)
        }
    }
    addToPlayer(n: number, m: Money){
        this.cash[n] += m
    }

    constructor(n: number, starting_capital: number){
        this.players = n
        for (let i = 0; i < n; i++){
            this.bet.push(0)
            this.cash.push(0)
        }
        this.addToAll(starting_capital)
        this.game = new GameHandler(n)
    }
}

class Bot{
    p: Player
    mid: Card[] = []

    act(mid: Card[]){
        this.mid = mid
        this.p.getHand(mid)
        
    }

    getAllBetterHands(){

    }

    constructor(p: Player){
        this.p = p
    }
}

class Probability{
    royal_flush(){
        
    }
}
