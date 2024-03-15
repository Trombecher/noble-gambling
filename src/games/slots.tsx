import {Box} from "aena";
import {Button, MoneyBetter} from "../components";
import {Game} from "../games";

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
    balance.addListener(balance => moneyBet.value > balance && (moneyBet.value = balance))

    return (
        <>
            <div class={"self-center flex gap-2"}>{slots.map(slot => (
                <Slot slot={slot}/>
            ))}</div>
            <MoneyBetter
                locked={locked}
                amount={moneyBet}
                max={balance}
                class={"self-center"}
            />
            <Button
                onclick={() => {
                    slots.forEach(slot => slot.value = randomSlotState());
                    if(slots[0].value === slots[1].value && slots[0].value === slots[2].value) {
                        balance.value += moneyBet.value * 50;
                    } else {
                        balance.value -= moneyBet.value;
                    }
                }}
                class={"self-center mt-4"}
            >Spin</Button>
        </>
    );
};

const FILE_NAMES: {[I in SlotState]: string} = {
    [SlotState.Apple]: "apple.png",
    [SlotState.Star]: "star.svg",
    [SlotState.Diamond]: "diamond.svg",
    [SlotState.Cherry]: "cherries.svg",
    [SlotState.Banana]: "banana.svg",
};

function Slot({slot}: {slot: Box<SlotState>}) {
    return (
        <div class={"w-24 flex justify-center items-center h-32"}>
            <img
                src={slot.derive(slot =>
                    `/noble-gambling/slots/${FILE_NAMES[slot]}`)}
                alt={""}
            />
        </div>
    );
}