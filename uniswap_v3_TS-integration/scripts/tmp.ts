

function test() {
    let amount = '0.223'
    let next = '2'
    const allow =  (amount === '' &&next >= '0' && next <= '9')
    || (amount === '0' && next === '.')
    || (/^[1-9]\d{0,2}$/.test(amount) && next >= '0' && next <= '9')
    || (/^[1-9]\d{0,2}$/.test(amount) && next === '.')
    || (/^[1-9]\d{0,2}\.\d{0,3}$/.test(amount) && next >= '0' && next <= '9')
    || (/^0\.\d{0,2}$/.test(amount) && next >= '0' && next <= '9')

    console.log('allow = ', allow)
}
test()