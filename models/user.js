import mongoose from "mongoose";

const accountSchema = mongoose.Schema({
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now},
    name: {type: String, required: false},
    surname: {type: String, required: false},
    email: {
        type: String,
        required: false,
        unique: true,
        lowercase: true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    password: {type: String, required: false, unique: true},

    status: {type: Number, required: true, default: 0}, // 0 - Inactive, 1 - Active, 2 - Blocked
    avatar: {type: String, default: null},
    confirm: {type: Number, default: 0}, // 0 - Wallet not create, 1 - Wallet created
    token: {type: Object, required: true},
    ip_address: {type: String, default: null},
    taxIDOrTRID: {type: String, default: null},
    title: {type: String, default: null},
    registryNo: {type: String, default: null},
    mersisNo: {type: String, default: null},
    taxOffice: {type: String, default: null},
    fullAddress: {type: String, default: null},
    buildingName: {type: String, default: null},
    buildingNumber: {type: String, default: null},
    doorNumber: {type: String, default: null},
    town: {type: String, default: null},
    country: {type: String, required: true},
    district: {type: String, default: null},
    city: {type: String, default: null},
    zipCode: {type: String, default: null},
    phoneNumber: {type: String, default: null},
    faxNumber: {type: String, default: null},
    webSite: {type: String, default: null},
    businessCenter: {type: String, default: null},
}, {
    versionKey: false
})
accountSchema.index({email: -1});
const account = mongoose.model('user', accountSchema);
export default account;