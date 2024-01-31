import wallet from "../../models/wallet.js";

const list = async (req, res) => {
    const {user_id} = req.user;
    const data = await wallet.find({user_id: user_id, type: 'deposit', status: 'active'});
    res.send({
        status: true,
        data: data,
    });
}
const create = async (req, res) => {
    const {user_id} = req.user;
    let input = req.body;
    const created = await wallet.create({
        user_id: user_id,
        network_id: input.network_id,
        name: input.name,
        code: input.code,
        type: input.type,
        address: input.address,
        data: input.data
    });
    res.send({
        status: true,
        data: created,
    });
}

export {list, create};