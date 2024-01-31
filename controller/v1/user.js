import user from "../../models/user.js";
import reference from "../../models/references.js";
import sponsor from "../../models/sponsor.js";
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
const referenceList = async (req, res) => {
    let {user_id} = req.user;

    const data = await reference.find({user_id: user_id}).populate("user_ref_id");
    res.send({
        status: true,
        data: data,
    });
}
const sponsorList = async (req, res) => {
    let {user_id} = req.user;
    const data = await sponsor.find({user_id: new mongoose.Types.ObjectId(String(user_id))}).populate("user_ref_id");
    res.send({
        status: true,
        data: data,
    });
}

export {list, userDetail, referenceList, sponsorList};