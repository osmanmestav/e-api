import mongoose from "mongoose";

const walletSchema = mongoose.Schema({
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now},
    network_id: {type: mongoose.Schema.Types.ObjectId, ref: 'network', required: true},
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true},
    name: {type: String, required: true},
    type: {type: String, required: true, default: 'deposit', enum: ['deposit', 'withdraw', 'personal']},
    address: {type: String, required: true},
    data: {type: Object},
    status: {type: String, required: true, default: 'passive', enum: ['passive', 'active', 'complete', 'cancel']} //0: passive, 1: active, 2: complete, 3: cancel
}, {
    versionKey: false
})
walletSchema.index({name: -1});
const wallet = mongoose.model('wallet', walletSchema);
export default wallet;