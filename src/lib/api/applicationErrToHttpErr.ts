import { ApplicationError, LimitExceededError } from "../errors/ApplicationError";
import { BadRequestError, InternalServerError } from "../errors/HttpError";

export const applicationErrToHttpErr = (error: ApplicationError) => {
    if (error instanceof LimitExceededError) {
        return new BadRequestError("Limit Exceeded", error);
    }

    return new InternalServerError("Unknown Application Error", error);
}