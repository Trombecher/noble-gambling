import { Box } from "aena";
import { slots } from "./slots";
import { insertBox } from "aena/glue";

export default function Slots() {
    const {slotspin, ...boxes} = slots();

    return (
        <>
            <div>{Object.values(boxes).map(slot => (
                <Slot slot={slot}/>
            ))}</div>
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