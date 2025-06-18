
export function divide(a: number, b: number) {
    if(b === 0) throw new Error("Divisor cannot be zero");
    return parseFloat((a / b).toFixed(2))
}