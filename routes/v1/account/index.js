import {list, userDetail} from '../../../controller/v1/account.js';
import {schemaList} from "./validation.js";

const routes = (instance, opt, done) => {
    instance.get("/", schemaList, list);
    instance.get("/:id", schemaList, userDetail);
    done();
};

export default routes;
