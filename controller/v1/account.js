import user from "../../models/account.js";
import mongoose from "mongoose";

const list = async (req, res) => {
    const data = await user.find();
    res.send({
        status: true,
        data: data,
    });
}

const userDetail = async (req, res) => {
    let user_id = req.params.id;
    const data = await user.findOne({_id: user_id});
    res.send({
        status: true,
        data: data,
    });
}

export {list, userDetail};