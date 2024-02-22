import { Box } from "aena";

// Generell:Slot machine mit 3 Walzen zu 4 möglichen Symbolen ()

// Spin function
function spin(): number {
    var min = 0;
    var max = 3;
    var zufall = Math.floor(Math.random() * (max-min+1)) + min;
    console.log(zufall);
    return zufall;
}

function slots() {
    let slot1 = new Box(0);
    
}



