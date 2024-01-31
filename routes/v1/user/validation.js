import {verifyAccessToken} from "../../../middlewares/jwt.js";

const schemaList = {
    onRequest: [verifyAccessToken],
    schema: {
        headers: {
            type: 'object',
            properties: {
                'Authorization': {type: 'string'}
            },
            required: ['Authorization']
        }
    }
}

export {schemaList}