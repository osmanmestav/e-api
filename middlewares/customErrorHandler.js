import CustomAPIError from "../helpers/customError.js";
import {errorCodes} from "../helpers/errorCode.js";


const customErrorHandler = (error, request, reply) => {
    let customError = error;
    if (error.name === "ValidationError") {
        customError = new CustomAPIError("Validation Error", 400);
    }
    let errors = String(error).split(' ');
    let code = (errors[1] ? errors[1] : errors[0]);

    let errorCode = code;
    let errorMessage = errorCodes.find(x => x.code == errorCode)
    if (errorMessage) customError = new CustomAPIError(errorMessage?.message, errorMessage?.errorCode);

    return reply.code(customError.statusCode || customError.status || 500).send({
        success: false,
        errorCode: customError.statusCode,
        message: customError.message || "Internal Server Error",
        path: request.url,
        method: request.method,
        timestamp: new Date().toISOString(),
    });
};

export default customErrorHandler;
