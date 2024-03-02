enum Value {
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
    Ace, // goofy enum end
    // 12 is a cool number
}

enum Suit {
    Club,
    Hearts,
    Spade,
    Diamond,
}

enum Comp {
    Smaller,
    Greater,
    Equal,
}

class Card {
    constructor(
        public v: Value,
        public s: Suit
    ) {}

    compare(c: Card): Comp {
        if(this.v > c.v) return Comp.Greater;
        if(this.v < c.v) return Comp.Smaller;
        return Comp.Equal;
    }
}

type Money = number // Pink Floyd reference
let no_card: undefined = undefined; // new Card(Value.invalid, Suit.invalid);

class Player {
    constructor(
        public readonly cards: [Card, Card]
    ) {}

    balance = 0;
    bet = 0;

    increaseBet(bet: Money) {
        this.bet += bet;
        this.balance -= bet;
    }
}

class Hand {
    c = [no_card, no_card, no_card, no_card, no_card];
}

// Why do you need this?
// We can just generate random cards on the fly, without a full deck.
// This just engages card counting.
const FULL_DECK = new Array<Card>();
for(let value = Value.Two; value < Value.Ace; value++)
    for(let suit = Suit.Club; suit < Suit.Diamond; suit++)
        FULL_DECK.push(new Card(value, suit));

class Stack {
    d: Card[] = [];

    constructor() { // inits full shuffled deck
        let temp_deck = FULL_DECK;
        for(let i = 51; i >= 0; i--) {
            let ix = Math.floor(Math.random() * (i + 1));
            this.d.push(temp_deck[ix]);
            temp_deck.splice(ix, 1);
        }
    }
}