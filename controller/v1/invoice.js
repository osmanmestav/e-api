import investment from "../../models/invoice.js";
import campaigns from "../../models/campaigns.js";
import calculateUser from "../../helpers/calculate.js";
import transactions from "../../models/transactions.js";
import moment from "moment";
import mongoose from "mongoose";

const list = async (req, res) => {
    const {user_id} = req.user;
    let data = await investment.find({user_id: user_id, status: 1}).populate("campaign_id").sort({created: -1});
    let newData = [];

    for (let i = 0; i < data.length; i++) {
        let earn = await transactions.aggregate([
            {$match: {user_id: new mongoose.Types.ObjectId(user_id)}},
            {$match: {investment_id: new mongoose.Types.ObjectId(String(data[i]._id))}},
            {$match: {status: 'complete'}},
            {$match: {type: 'earn'}},
            {
                $group: {
                    _id: "$type",
                    total: {$sum: "$price"},
                    count: {$sum: 1},
                }
            }])
        newData.push({
            ...data[i].toObject(),
            earn: (earn[0] ? earn[0] : {_id: 'invest', total: 0, count: 0})

        })
    }
    res.send({
        status: true,
        data: newData,
    });
}
const create = async (req, res) => {
    let input = req.body;
    const created = await investment.create(input);
    res.send({
        status: true,
        data: created,
    });
}

export {list, create};