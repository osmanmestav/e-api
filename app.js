import * as dotenv from 'dotenv'
import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";
import fastifyCompress from "@fastify/compress";
import notFoundHandler from "./middlewares/notFoundHandler.js";
import customErrorHandler from "./middlewares/customErrorHandler.js";
import {XMLParser, XMLBuilder, XMLValidator} from "fast-xml-parser";
import * as fs from "fs";


dotenv.config()

const app = fastify({logger: true});
await app.register(fastifyCors, {
    cors: "*",
});
await app.register(fastifyHelmet, {
    xssFilter: true,
    noSniff: true,
    referrerPolicy: true,
    ieNoOpen: true,
    contentSecurityPolicy: false,
});
await app.register(fastifyCompress, {global: false});

app.register(import('@fastify/swagger'), {})
app.register(import('@fastify/swagger-ui'), {
    routePrefix: '/docs',
    swagger: {
        info: {
            title: 'My FirstAPP Documentation',
            description: 'My FirstApp Backend Documentation description',
            version: '0.1.0',
            termsOfService: 'https://mywebsite.io/tos',
            contact: {
                name: 'John Doe',
                url: 'https://www.johndoe.com',
                email: 'john.doe@email.com'
            }
        },
        externalDocs: {
            url: 'https://www.johndoe.com/api/',
            description: 'Find more info here'
        },
        host: '127.0.0.1:3001',
        basePath: '',
        schemes: ['http', 'https'],
        consumes: ['application/json'],
        produces: ['application/json'],

    },
})


app.register(import("./routes/v1/index.js"), {prefix: "/api/v1"});
app.register(import('fastify-user-agent'))


app.setNotFoundHandler(notFoundHandler);
app.setErrorHandler(customErrorHandler);

const startServer = async () => {
    try {
        const port = process.env.PORT;
        await app.listen({port: port})
        console.log(`Server is running`);
        console.log(app.printRoutes());
    } catch (err) {
        app.log.error(err)
        process.exit(1)
    }
}
startServer()


/*
fs.readFile('a.xml', function (err, data) {
    if (!err) {

        const parser = new XMLParser();
        let jObj = parser.parse(data);

        const builder = new XMLBuilder();
        const xmlContent = builder.build(jObj);
        console.log(jObj)
        //console.log(JSON.stringify(data));
    }
});
*/


