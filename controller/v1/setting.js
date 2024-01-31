import settings from "../../models/settings.js";

const list = async (req, res) => {
    const data = await settings.findOne();
    res.send({
        status: true,
        data: data,
    });
}
const edit = async (req, res) => {
    let input = req.body;
    const updated = await settings.updateOne({}, {data: input?.data})
    res.send({
        status: true,
        data: updated,
    });
}

export {list, edit};