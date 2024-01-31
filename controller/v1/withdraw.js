import withdraw from "../../models/withdraw.js";

const list = async (req, res) => {
    const {user_id} = req.user;
    const data = await withdraw.find({user_id: user_id});
    return await res.send({
        status: true,
        data: data,
    });
}
const create = async (req, res) => {
    const {user_id} = req.user;
    let input = req.body;
    const resumeWithdraw = await withdraw.findOne({user_id: user_id, status: 0})
    if (resumeWithdraw) throw new Error(309)
    const created = await withdraw.create({
        user_id: user_id,
        wallet_id: input.wallet_id,
        price: input.price,
        description: input.description
    });
    return await res.send({
        status: true,
        data: created,
    });

}

export {list, create};