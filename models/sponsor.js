import mongoose from "mongoose";

const sponsorSchema = mongoose.Schema({
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now},
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
    user_ref_id: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
    create_user: {type: Date, required: true},
    index: {type: Number, required: true, default: 0},
    status: {type: Number, required: true, default: 0}
}, {
    versionKey: false
})
sponsorSchema.index({user_id: -1});
const sponsor = mongoose.model('sponsor', sponsorSchema);
export default sponsor;