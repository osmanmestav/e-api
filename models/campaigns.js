import mongoose from "mongoose";

const campaignsSchema = mongoose.Schema({
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now},
    name: {type: String, required: true},
    description: {type: String},
    percent: {type: Number, required: true},
    minDay: {type: Number, required: true},
    min: {type: Number, required: true},
    max: {type: Number, required: true},
    type: {type: Number, required: true, default: 0, enum: [0, 1]},
    term_type: {type: Number, required: true, default: 0, enum: [0, 1, 2, 3]},
    status: {type: Number, required: true, default: 0}
}, {
    versionKey: false
})
campaignsSchema.index({name: -1});
const campaigns = mongoose.model('campaigns', campaignsSchema);
export default campaigns;