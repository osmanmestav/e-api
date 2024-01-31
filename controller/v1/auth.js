import bcrypt from 'bcryptjs';
import {generateToken} from "../../middlewares/jwt.js";
import users from '../../models/user.js'

import requestIp from "request-ip";
import referenceCode from "../../models/referenceCode.js";
import {generatorCode} from "../../helpers/generatorCode.js";
import sponsor from "../../models/sponsor.js";
import reference from "../../models/references.js";
import networks from "../../models/networks.js";
import wallets from "../../models/wallet.js";

/**
 *
 * @param {email ,password}
 * @returns {status, data}
 */
const login = async (req, res) => {
    let body = req.body;
    const user = await users.findOne({email: body.email});
    if (!user) throw new Error(308)
    const userData = user?.toObject();
    const isMatched = await bcrypt.compare(body.password, user.password);
    if (!isMatched) throw new Error(308)
    const accessToken = await generateToken(user, "access");
    const refreshToken = await generateToken(user, "refresh");

    await users.updateOne({_id: user._id}, {
        accessToken: accessToken,
        refreshToken: refreshToken,
        ip_address: requestIp.getClientIp(req)
    })
    res.send({
        status: true,
        data: {...userData, token: {accessToken, refreshToken}}
    });
};

const emailControl = async (req, res) => {
    let input = req.body;
    const user = await users.findOne({email: input.email});
    if (!user) throw new Error(308)
    res.send({
        status: true,
        user: user,
    });
}

const register = async (req, res) => {
    let body = req.body;

    const reference = await referenceCode.findOne({code: body.code});
    if (!reference && body.code) await res.code(401).send({
        success: false,
        errorCode: 400,
        message: 'Not Found Reference Id',
        path: res.url,
        method: res.method,
        timestamp: new Date().toISOString(),
    });
    body.password = await bcrypt.hash(req.body.password, 10);
    const user = await users.create({
        name: body.name,
        surname: body.surname,
        email: body.email,
        password: body.password,
        country: body.country,
        phone: body.phone,
    });


    const userData = user?.toObject();
    let code = await generatorCode(10);
    await referenceCode.create({
        user_id: user?._id,
        code: code,
        status: 1
    })

    res.send({
        status: true,
        data: {...userData, reference: code}
    });
};

const password = async (req, res) => {
    let body = req.body;
    const user = await users.findOne({email: body.email});
    if (!user) throw new Error(308)
    let password = await generatorCode(6, 'number');
    let newPassword = await bcrypt.hash(password, 10);
    await users.updateOne({_id: user?._id}, {password: newPassword})
    //Email send implement
    res.send({
        status: true
    });
};

export {login, register, password, emailControl};