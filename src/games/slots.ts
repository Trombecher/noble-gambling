import { Box } from "aena";

export function slots() {
    // Generell: Slot machine mit 3 Walzen zu 4 möglichen Symbolen ()

    let slot1 = new Box(0);
    let slot2 = new Box(0);
    let slot3 = new Box(0);

    // Spin function
    function spin(): number {
        var min = 0;
        var max = 3;
        var zufall = Math.floor(Math.random() * (max - min + 1)) + min;
        console.log(zufall);
        return zufall;
    }

    //wait function
    async function sleep(ms: number): Promise<void> {
        return new Promise(
            (resolve) => setTimeout(resolve, ms));
    }

    //function zum spinnen aller slots
    async function slotspin() {
        slot1.value = spin();
        await sleep(2000);
        slot2.value = spin();
        await sleep(2000);
        slot3.value = spin();
    }

    return {slot1, slot2, slot3, slotspin};
}