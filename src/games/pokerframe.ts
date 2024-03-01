enum Value{
    invalid = 1,
    two,
    three,
    four,
    five,
    six,
    seven,
    eight,
    nine,
    ten,
    jack,
    queen,
    king,
    ace, // goofy enum end
}

enum Suit{
    invalid,
    clubs,
    hearts,
    spades,
    diamonds,
}

enum Comp{
    smaller,
    greater,
    equal,
}

class Card{
    v: Value;
    s: Suit;

    constructor(v: Value, s: Suit){
        this.v = v;
        this.s = s;
    }

    compare(c: Card): Comp{
        if (this.v > c.v) return Comp.greater;
        if (this.v < c.v) return Comp.smaller;
        return Comp.equal;
    }
}

type Money = number // Pink Floyd reference
let no_card = new Card(Value.invalid, Suit.invalid)

class Player{
    c = [no_card, no_card];
    
    own = 0;
    bet = 0;

    setCash(m: Money){
        this.own = m
    }
    increaseBet(b: Money){
        this.bet += b;
        this.own -= b;
    }
}

class Hand{
    c = [no_card, no_card, no_card, no_card, no_card];
}

const full_deck = [
    new Card(2, 1), new Card(3, 1), new Card(4, 1), new Card(5, 1), new Card(6, 1), new Card(7, 1), new Card(8, 1), new Card(9, 1), new Card(10, 1),
    new Card(11, 1), new Card(12, 1), new Card(13, 1), new Card(14, 1),
    new Card(2, 2), new Card(3, 2), new Card(4, 2), new Card(5, 2), new Card(6, 2), new Card(7, 2), new Card(8, 2), new Card(9, 2), new Card(10, 2),
    new Card(11, 2), new Card(12, 2), new Card(13, 2), new Card(14, 2),
    new Card(2, 3), new Card(3, 3), new Card(4, 3), new Card(5, 3), new Card(6, 3), new Card(7, 3), new Card(8, 3), new Card(9, 3), new Card(10, 3),
    new Card(11, 3), new Card(12, 3), new Card(13, 3), new Card(14, 3),
    new Card(2, 4), new Card(3, 4), new Card(4, 4), new Card(5, 4), new Card(6, 4), new Card(7, 4), new Card(8, 4), new Card(9, 4), new Card(10, 4),
    new Card(11, 4), new Card(12, 4), new Card(13, 4), new Card(14, 4)
]

class Stack{
    d: Card[] = [];

    constructor(){ // inits full shuffled deck
        let temp_deck = full_deck;
        for (let i = 51; i >= 0; i--){
            let ix = Math.floor(Math.random() * (i + 1))
            this.d.push(temp_deck[ix])
            temp_deck.splice(ix, 1)
        }
    }
}
