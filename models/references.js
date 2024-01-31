import mongoose from "mongoose";

const referenceSchema = mongoose.Schema({
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now},
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
    user_ref_id: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
    status: {type: Number, required: true, default: 0}
}, {
    versionKey: false
})
referenceSchema.index({user_id: -1});
const reference = mongoose.model('reference', referenceSchema);
export default reference;