import {verifyAccessToken} from "../../../middlewares/jwt.js";

const schemaLogin = {
    schema: {
        body: {
            type: 'object',
            properties: {
                email: {
                    type: 'string',
                },
                password: {
                    type: 'string',
                }
            },
            required: ['email', 'password']
        },
    }
}

const schemaRegister = {
    schema: {
        body: {
            type: 'object',
            properties: {
                code: {
                    type: 'string',
                },
                name: {
                    type: 'string',
                },
                surname: {
                    type: 'string',
                },
                email: {
                    type: 'string',
                },
                password: {
                    type: 'string',
                },
                country: {
                    type: 'string',
                },
                phone: {
                    type: 'string',
                }
            },
            required: ['name', 'surname', 'email', 'password', 'country', 'phone']
        },
    }
}

const schemaPassword = {
    onRequest: [verifyAccessToken],
    schema: {
        body: {
            type: 'object',
            properties: {
                email: {
                    type: 'string',
                }
            },
            required: ['email']
        },
    }
}

export {schemaLogin, schemaRegister, schemaPassword}