import mongoose from "mongoose";

const referenceCodeSchema = mongoose.Schema({
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now},
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true},
    code: {type: Object, required: true},
    status: {type: Number, required: true, default: 0}
}, {
    versionKey: false
})
referenceCodeSchema.index({code: -1});
const referenceCode = mongoose.model('reference_code', referenceCodeSchema);
export default referenceCode;