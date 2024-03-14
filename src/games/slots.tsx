import { Box } from "aena";
import { insertBox } from "aena/glue";
import { Button, MoneyBetter } from "../components";
import { Game } from "../games";

enum SlotState {
    Cherry,
    Banana,
    Apple,
    Star,
    Diamond,
}

function randomSlotState(): SlotState {
    return Math.floor(5 * Math.random());
}

export const Slots: Game = ({balance}) => {
    const slots = [
        new Box<SlotState>(randomSlotState()),
        new Box<SlotState>(randomSlotState()),
        new Box<SlotState>(randomSlotState())
    ] as const;

    const locked = new Box(false);
    const moneyBet = new Box(0);

    return (
        <>
            <div>{slots.map(slot => (
                <Slot slot={slot}/>
            ))}</div>
            <MoneyBetter
                locked={locked}
                amount={moneyBet}
                max={balance}
            />
            <Button onclick={() => {
                slots.forEach(slot => slot.value = randomSlotState());
                if(slots[0] === slots[1] && slots[0] === slots[2]) {
                    balance.value += moneyBet.value * 10;
                } else {
                    balance.value -= moneyBet.value;
                }
            }}>Spin</Button>
        </>
    )
}

function Slot({slot}: {slot: Box<number>}) {
    return (
        <div>{insertBox(slot, state => (
            <div>{state}</div>
        ))}</div>
    )
}