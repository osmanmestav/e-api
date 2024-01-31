import {list, edit} from '../../../controller/v1/setting.js';
import {schemaList, schemaEdit} from "./validation.js";

const routes = (instance, opt, done) => {
    instance.get("/", schemaList, list);
    instance.put("/", schemaEdit, edit);
    done();
};

export default routes;
