import {login} from '../../../controller/v1/e-auth.js';
import {schemaLogin} from "./validation.js";

const authRoutes = (instance, opt, done) => {
    instance.post("/login", schemaLogin, login);
    done();
};

export default authRoutes;
