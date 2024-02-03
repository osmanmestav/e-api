import {apiLogout, getToken, logout} from "../../helpers/e-arsiv.js";
import account from "../../models/account.js";

/**
 *
 * @param {username ,password}
 * @returns {status, data}
 */
const login = async (req, res) => {
    let body = req.body;
    const user = await getToken(body.username, body.password)
    await account.updateOne({_id: req.user._id}, {e_token: user.token})
    res.send({
        status: (user ? true : false),
        data: user
    });
};

/**
 *
 * @param {token}
 * @returns {status, data}
 */
const Logout = async (req, res) => {
    let body = req.body;
    const Logout = await logout(body.token)
    res.send({
        status: (Logout ? true : false),
        data: Logout
    });
};

export {login, Logout};