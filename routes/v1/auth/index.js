import {emailControl, login, password, register} from '../../../controller/v1/auth.js';
import {schemaLogin, schemaPassword, schemaRegister} from "./validation.js";

const authRoutes = (instance, opt, done) => {
    instance.post("/login", schemaLogin, login);
    instance.post("/register", schemaRegister, register);
    instance.post("/password", schemaPassword, password);
    instance.post("/email-control", emailControl);
    done();
};

export default authRoutes;
