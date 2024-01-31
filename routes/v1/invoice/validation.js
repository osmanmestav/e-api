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

const schemaCreate = {
    onRequest: [verifyAccessToken],
    body: {
        type: 'object',
        properties: {
            campaign_id: {
                type: 'string',
            },
            price: {
                type: 'number',
            }
        },
        required: ['campaign_id', 'price']
    },
    headers: {
        type: 'object',
        properties: {
            'Authorization': {type: 'string'}
        },
        required: ['Authorization']
    }
}
export {schemaList, schemaCreate}