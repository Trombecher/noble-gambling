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
        <div class={`${className}`}>
            <div>Bet: ${insertBoxAsString(amount)}</div>
            <input
                type={"range"}
                min={min}
                max={max as Box<string | number>}
                oninput={e => amount.value = +e.target.value}
                step={1}
                disabled={locked}
                value={amount as Box<string | number | string[]>}
            />
        </div>
    )
}

export function Button({
    children,
    class: className,
    ...props
}: JSX.IntrinsicElements["button"]) {
    return (
        <button class={`${className} transition px-4 bg-black py-1 rounded-xl text-lg hover:bg-black/60 active:bg-white/20`} {...props}>{children}</button>
    )
}