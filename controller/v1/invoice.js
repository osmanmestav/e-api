import moment from "moment";
import mongoose from "mongoose";
import invoice from "../../models/invoice.js";
import {getAllInvoice} from "../../helpers/e-arsiv.js";
import account from "../../models/account.js";

const list = async (req, res) => {
    const {account_id} = req.account;
    const data = await invoice.find({account_id: account_id});
    res.send({
        status: true,
        data: data,
    });
}

/**
 *
 * @param {startDate, endDate, type}
 * @param res
 * @returns {status, data}
 */
const eList = async (req, res) => {
    const {account_id} = req.account;
    const data = req.body;
    const user = await account.findOne({_id: account_id});
    const invoice = await getAllInvoice(user.e_token, data.startDate, data.endDate, data.type);
    res.send({
        status: (invoice ? true : false),
        data: invoice,
    });
}
const create = async (req, res) => {
    let input = req.body;
    const created = await invoice.create(input);
    res.send({
        status: true,
        data: created,
    });
}

export {list, eList, create};