import mongoose from "mongoose";

const withdrawSchema = mongoose.Schema({
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now},
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true},
    wallet_id: {type: mongoose.Schema.Types.ObjectId, ref: 'wallet', required: true},
    price: {type: Number, required: true},
    description: {type: String},
    data: {type: Object},
    status: {type: Number, required: true, default: 0} //0:pending
}, {
    versionKey: false
})
withdrawSchema.index({user_id: -1});
const withdraw = mongoose.model('withdraw', withdrawSchema);
export default withdraw;