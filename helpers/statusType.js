//0: Deposit, 1: Invest, 2: Withdraw
const Status = (type) => {
    if (type == 0) return 'deposit';
    if (type == 1) return 'invest';
    if (type == 2) return 'withdraw';
}
const Types = (type) => {
    if (type == 0) return 'deposit';
    if (type == 1) return 'invest';
    if (type == 2) return 'withdraw';
}


export {Status, Types}