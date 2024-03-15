import {Box, JSX} from "aena";
import {insertBoxAsString} from "aena/glue";

export function MoneyBetter({
    locked,
    amount,
    max,
    class: className,
    min = 0
}: {
    locked: Box<boolean>,
    amount: Box<number>,
    max: Box<number>
    class?: string
    min?: number
}) {
    return (
        <div class={`${className || ""} w-64`}>
            <div class={"text-center text-xl"}>Bet: ${insertBoxAsString(amount)}</div>
            <input
                type={"range"}
                min={min}
                max={max as Box<string | number>}
                oninput={e => amount.value = +e.target.value}
                step={1}
                disabled={locked}
                class={"w-full"}
                value={amount as Box<string | number | string[]>}
            />
            <div class={"flex gap-2"}>{([
                ["0", 0],
                ["1/4", 0.25],
                ["1/2", 0.5],
                ["3/4", 0.75],
                ["All in", 1],
            ] as const).map(([text, m]) => (
                <button
                    class={"w-full bg-white/30 hover:bg-white/50 disabled:bg-white/0 py-1 rounded-lg"}
                    onclick={() => amount.value = max.value * m}
                    disabled={locked}
                >{text}</button>
            ))}</div>
        </div>
    )
}

export function Button({
    children,
    class: className,
    ...props
}: JSX.IntrinsicElements["button"]) {
    return (
        <button class={`${className} transition px-4 bg-white/30 py-1 rounded-xl text-lg hover:bg-white/50 active:bg-white/80`} {...props}>{children}</button>
    )
}