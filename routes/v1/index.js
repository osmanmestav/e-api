import path from 'path';
import {fileURLToPath} from 'url';
import * as fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routes = [];
fs.readdirSync(__dirname).forEach(function (folder) {
    if (fs.lstatSync(__dirname + '/' + folder).isDirectory()) {
        routes.push({
            prefix: folder,
            router: import("./" + folder + "/index.js"),
        })
    }
});

const initializeRoutes = async (instance, opt, done) => {
    routes.forEach(route => {
        instance.register(route.router, {prefix: route.prefix});
    });
    done();
};

export default initializeRoutes;
