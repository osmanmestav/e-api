import mongoose from "mongoose";
import transactions from "../models/transactions.js";

const calculateUser = async (user_id) => {
    const withdraw = await transactions.aggregate([
        {$match: {user_id: new mongoose.Types.ObjectId(user_id)}},
        {$match: {type: 'withdraw'}},
        {$match: {$or: [{status: 'complete'}, {status: 'pending'}]}},
        {
            $group: {
                _id: "$type",
                total: {$sum: "$price"},
                count: {$sum: 1},
            }
        }
    ])
    const deposit = await transactions.aggregate([
        {$match: {user_id: new mongoose.Types.ObjectId(user_id)}},
        {$match: {type: 'deposit'}},
        {$match: {status: 'complete'}},
        {
            $group: {
                _id: "$type",
                total: {$sum: "$price"},
                count: {$sum: 1},
            }
        }
    ])
    const invest = await transactions.aggregate([
        {$match: {user_id: new mongoose.Types.ObjectId(user_id)}},
        {$match: {type: 'invest'}},
        {$match: {status: 'complete'}},
        {
            $group: {
                _id: "$type",
                total: {$sum: "$price"},
                count: {$sum: 1},
            }
        }
    ])

    const earn = await transactions.aggregate([
        {$match: {user_id: new mongoose.Types.ObjectId(user_id)}},
        {$match: {type: 'earn'}},
        {$match: {status: 'complete'}},
        {
            $group: {
                _id: "$type",
                total: {$sum: "$price"},
                count: {$sum: 1},
            }
        }
    ])

    const charge = await transactions.aggregate([
        {$match: {user_id: new mongoose.Types.ObjectId(user_id)}},
        {$match: {status: 'complete'}},
        {
            $group: {
                _id: "",
                total: {$sum: "$charge"},
                count: {$sum: 1},
            }
        }
    ])
    let depositTotal = (deposit[0] ? deposit[0]?.total : 0);
    let withdrawTotal = (withdraw[0] ? withdraw[0]?.total : 0);
    let investTotal = (invest[0] ? invest[0]?.total : 0);
    let earnTotal = (earn[0] ? earn[0]?.total : 0);
    let chargeTotal = (charge[0] ? charge[0]?.total : 0);
    const total = depositTotal - (withdrawTotal + investTotal) + earnTotal - chargeTotal;
    return {total, depositTotal, withdrawTotal, investTotal, earnTotal, chargeTotal}
}
export default calculateUser;