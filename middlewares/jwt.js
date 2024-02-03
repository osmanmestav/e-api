import JWT from 'jsonwebtoken'
import User from "../models/account.js";



const generateToken = async (data, type) => {
    let options = {
        expiresIn: (type === "access" ? "10d" : '20d')
    };
    return await JWT.sign({
        account_id: data._id,
        email: data.email
    }, process.env.JWT_SECRET, options);
}


const verifyAccessToken = (req, res, next) => {
    const authorizationToken = req.headers.authorization;
    if (!authorizationToken) {
        throw new Error(498)
    }
    if (typeof authorizationToken == 'undefined') throw new Error(498)
    const token = authorizationToken.split(" ")[1];
    JWT.verify(token, process.env.JWT_SECRET, async (err, verify) => {
        if (err) return await res.code(401).send({
            success: false,
            errorCode: 401,
            message: 'Unauthorized',
            path: res.url,
            method: res.method,
            timestamp: new Date().toISOString(),
        });
        let user = await User.findOne({_id: verify.account_id});
        //let tokens = await Token.findOne({user_id: verify.account_id, "token.accessToken": token});
        if (!user) {
            return await res.code(401).send({
                success: false,
                errorCode: 401,
                message: 'Unauthorized',
                path: res.url,
                method: res.method,
                timestamp: new Date().toISOString(),
            });
        }
        req.payload = verify;
        req.account = verify;
        next()
    });
};

export {generateToken, verifyAccessToken}
