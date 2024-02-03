import mongoose from "mongoose";

const InvoiceSchema = mongoose.Schema({
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now},
    account_id: {type: mongoose.Schema.Types.ObjectId, ref: 'account', required: true},
    status: {type: Number, required: true, default: 0}
}, {
    versionKey: false
})
InvoiceSchema.index({account_id: -1});
const Invoice = mongoose.model('invoice', InvoiceSchema);
export default Invoice;