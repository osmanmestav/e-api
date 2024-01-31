import {apiLogout, getToken, logout} from "../../helpers/e-arsiv.js";

/**
 *
 * @param {username ,password}
 * @returns {status, data}
 */
const login = async (req, res) => {
    let body = req.body;
    const user = await getToken(body.username, body.password)
    //logout(user)
    res.send({
        status: (user ? true : false),
        data: user
    });
};

export {login};