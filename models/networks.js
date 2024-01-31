import mongoose from "mongoose";

const networkSchema = mongoose.Schema({
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now},
    name: {type: String, required: true},
    code: {type: String, required: true},
    data: {type: Object, default: null},
    contract_id: {type: String, required: true},
    status: {type: Number, required: true, default: 0}
}, {
    versionKey: false
})
networkSchema.index({name: -1});
const network = mongoose.model('network', networkSchema);
export default network;