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
const schemaEdit = {
    onRequest: [verifyAccessToken],
    schema: {
        body: {
            type: 'object',
            properties: {
                data: {
                    type: 'object',
                }
            },
            required: ['data']
        },
        headers: {
            type: 'object',
            properties: {
                'Authorization': {type: 'string'}
            },
            required: ['Authorization']
        }
    }
}

export {schemaList, schemaEdit}