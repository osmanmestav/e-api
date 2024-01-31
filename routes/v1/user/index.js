import {list, userDetail, referenceList, sponsorList} from '../../../controller/v1/user.js';
import {schemaList} from "./validation.js";

const routes = (instance, opt, done) => {
    instance.get("/", schemaList, list);
    instance.get("/:id", schemaList, userDetail);
    instance.get("/reference", schemaList, referenceList);
    instance.get("/sponsor", schemaList, sponsorList);
    done();
};

export default routes;
