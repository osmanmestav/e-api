import mongoose from "mongoose";

const accountHistorySchema = mongoose.Schema({
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now},
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true},
    user_id_ref: {type: mongoose.Schema.Types.ObjectId, ref: 'users', default: null},
    withdraw_id: {type: mongoose.Schema.Types.ObjectId, ref: 'withdraw'},
    wallet_id: {type: mongoose.Schema.Types.ObjectId, ref: 'wallet'},
    campaign_id: {type: mongoose.Schema.Types.ObjectId, ref: 'campaigns'},
    investment_id: {type: mongoose.Schema.Types.ObjectId, ref: 'investment'},
    price: {type: Number, required: true},
    charge: {type: Number},
    type: {type: String, required: true, default: 'deposit', enum: ['deposit', 'invest', 'withdraw', 'earn']}, //0: Deposit, 1: Invest, 2: Withdraw
    status: {type: String, required: true, default: 'pending'}, //0: pending, 1: process, 2: complete, 3: cancel
    data: {type: Object},
}, {
    versionKey: false
})
accountHistorySchema.index({user_id: -1});
const transactions = mongoose.model('transactions', accountHistorySchema);
export default transactions;