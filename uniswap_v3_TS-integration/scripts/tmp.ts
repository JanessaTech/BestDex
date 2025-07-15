

function test() {
    const decimals = 2
    const rawValue = '12300'
    let valueStr = rawValue.toString().padStart(decimals + 1, '0');
    console.log('valueStr =', valueStr)
            
    // 插入小数点
    const integerPart = valueStr.slice(0, -decimals) || '0';
    const fractionalPart = valueStr.slice(-decimals).replace(/0+$/, '');
    console.log('integerPart =', integerPart)
    console.log('fractionalPart =', fractionalPart)
    console.log(0.1 + 0.2)
    console.log('0x404460C6A5EdE2D891e8297795264fDe62ADBB75'.toLowerCase())
    
}
test()

// npx ts-node .\scripts\tmp.ts 