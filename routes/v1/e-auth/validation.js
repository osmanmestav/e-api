const schemaLogin = {
    schema: {
        body: {
            type: 'object',
            properties: {
                username: {
                    type: 'string',
                },
                password: {
                    type: 'string',
                }
            },
            required: ['username', 'password']
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


export {schemaLogin}