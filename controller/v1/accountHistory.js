import transactions from "../../models/transactions.js";
import mongoose from "mongoose";
import calculateUser from "../../helpers/calculate.js";

const list = async (req, res) => {
    const {user_id} = req.user;
    const type = req.params.type;
    /*await transactions.find({user_id: user_id})
        .populate('wallet_id wallet_id.network_id')
        .sort({createed: -1})
        .select("price created status user_id wallet_id.address wallet_id.code wallet_id.name");
        */
    const data = await transactions.aggregate([
        {$sort: {created: -1}},
        {$match: {user_id: new mongoose.Types.ObjectId(user_id)}},
        {$match: {type: type}},
        {
            $lookup: {
                from: "wallets",
                localField: "wallet_id",
                foreignField: "_id",
                as: "wallet",
                pipeline: [{
                    $project: {
                        address: 1,
                        code: 1,
                        name: 1
                    }
                }]
            }
        },
        {
            $lookup: {
                from: "campaign",
                localField: "campaign_id",
                foreignField: "_id",
                as: "campaign"
            }
        },
        {
            $project: {
                price: 1,
                created: 1,
                status: 1,
                charge: 1,
                user_id: 1,
                wallet: {$arrayElemAt: ["$wallet", 0]},
                campaign: {$arrayElemAt: ["$campaign", 0]}
            }
        }
    ])
    res.send({
        status: true,
        data: data,
    });
}

const listAll = async (req, res) => {
    const {user_id} = req.user;
    /*await transactions.find({user_id: user_id})
        .populate('wallet_id wallet_id.network_id')
        .sort({createed: -1})
        .select("price created status user_id wallet_id.address wallet_id.code wallet_id.name");
        */
    const data = await transactions.aggregate([
        {$sort: {created: -1}},
        {$match: {user_id: new mongoose.Types.ObjectId(user_id)}},
        {$match: {$or: [{status: 'complete'}, {status: 'pending'}]}},
        {
            $lookup: {
                from: "wallets",
                localField: "wallet_id",
                foreignField: "_id",
                as: "wallet",
                pipeline: [{
                    $project: {
                        address: 1,
                        code: 1,
                        name: 1
                    }
                }]
            }
        },
        {
            $lookup: {
                from: "campaigns",
                localField: "campaign_id",
                foreignField: "_id",
                as: "campaign"
            }
        },
        {
            $lookup: {
                from: "invoice",
                localField: "investment_id",
                foreignField: "_id",
                as: "investment"
            }
        },
        {
            $project: {
                price: 1,
                created: 1,
                status: 1,
                charge: 1,
                user_id: 1,
                type: 1,
                wallet: {$arrayElemAt: ["$wallet", 0]},
                campaign: {$arrayElemAt: ["$campaign", 0]},
                investment: {$arrayElemAt: ["$investment", 0]},
            }
        }
    ])
    res.send({
        status: true,
        data: data,
    });
}

const create = async (req, res) => {
    const {user_id} = req.user;
    let input = req.body;
    //transaction = await transactions.findOne({user_id: user_id, type: input.type, status: 'pending'});
    //if (transaction) await transactions.updateOne({_id: transaction._id, user_id: user_id, price: input.price})
    const transaction = await transactions.create({
        wallet_id: input.wallet_id,
        price: input.price,
        type: 'deposit',
        charge: process.env.chargeDeposit,
        user_id: user_id,
    });
    res.send({
        status: true,
        data: transaction,
    });
}


const withdrawCreate = async (req, res) => {
    const {user_id} = req.user;
    let input = req.body;

    const {total, depositTotal, withdrawTotal, investTotal, earnTotal} = await calculateUser(user_id)
    if (input.price > total) return await res.code(400).send({
        success: false,
        errorCode: 400,
        message: 'Price must be less than maximum withdraw',
        path: res.url,
        method: res.method,
        timestamp: new Date().toISOString(),
    });
    //transaction = await transactions.findOne({user_id: user_id, type: input.type, status: 'pending'});
    //if (transaction) await transactions.updateOne({_id: transaction._id, user_id: user_id, price: input.price})
    const transaction = await transactions.create({
        wallet_id: input.wallet_id,
        price: input.price,
        type: 'withdraw',
        charge: process.env.chargeWithdraw,
        user_id: user_id,
        data: {
            wallet: input.wallet
        }
    });
    res.send({
        status: true,
        data: transaction,
    });
}

const calculate = async (req, res) => {
    const {user_id} = req.user;
    const {total, depositTotal, withdrawTotal, investTotal, earnTotal} = await calculateUser(user_id)
    res.send({
        status: true,
        data: {
            depositTotal: depositTotal,
            withdrawTotal: withdrawTotal,
            investTotal: investTotal,
            earnTotal: earnTotal,
            total: total,
        }
    });
}

export {list, listAll, create, withdrawCreate, calculate};