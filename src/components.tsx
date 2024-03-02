import {Box, JSX} from "aena";
import {insertBoxAsText} from "aena/glue";

export function MoneyBetter({
    locked,
    amount,
    max
}: {
    locked: Box<boolean>,
    amount: Box<number>,
    max: Box<number>
}) {
    return (
        <div>
            <div>Bet: ${insertBoxAsText(amount)}</div>
            <input
                class={"block"}
                type={"range"}
                min={0}
                max={max as Box<string | number>}
                oninput={e => amount.value = +e.target.value}
                step={1}
                disabled={locked}
                value={0}
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
        <button class={`${className} bg-shade-900 py-1 rounded-full hover:bg-shade-800`} {...props}>{children}</button>
    )
}