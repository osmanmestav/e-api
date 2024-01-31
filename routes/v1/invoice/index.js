import {list, create} from '../../../controller/v1/invoice.js';
import {schemaList, schemaCreate} from "./validation.js";

const routes = (instance, opt, done) => {
    instance.get("/", schemaList, list);
    instance.post("/", schemaCreate, create);
    done();
};
export default routes;
