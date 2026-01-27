import { Decimal } from 'decimal.js';

function getTickSpacing(feeTier: number) {
    console.debug('getTickSpacing:', feeTier)
    switch (feeTier) {
        case 100: {
            return 1
        }
        case 500: {
            return 10
        }
        case 3000: {
            return 60
        }
        default: {
            return 200
        }
    }
}
function main() {
    const res = getTickSpacing(Number(3000))
    console.log('res=', res)
}

main()

//npx hardhat run scripts\tmp1.ts