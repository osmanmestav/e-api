import networks from "../../models/networks.js";

const list = async (req, res) => {
    const data = await networks.find();
    res.send({
        status: true,
        data: data,
    });
}
const create = async (req, res) => {
    let input = req.body;
    const created = await networks.create(input);
    res.send({
        status: true,
        data: created,
    });
}
const edit = async (req, res) => {
    let input = req.body;
    const network = await networks.findOne({_id: input.id});
    if (!network) throw new Error(400)
    const updated = await networks.updateOne(
        {_id: input.id},
        {name: input.name, code: input.code, data: input.data, contract_id: input.contract_id, status: input.status}
    )
    res.send({
        status: true,
        data: updated,
    });
}

export {list, create, edit};