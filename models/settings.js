import mongoose from "mongoose";

const settingSchema = mongoose.Schema({
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now},
    data: {type: Object, required: true}
}, {
    versionKey: false
})
settingSchema.index({device: -1});
const setting = mongoose.model('setting', settingSchema);
export default setting;