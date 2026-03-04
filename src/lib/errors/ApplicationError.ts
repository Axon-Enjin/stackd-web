export class ApplicationError extends Error {
    code: string;

    constructor(code: string, message: string) {
        super(message);
        this.name = "ApplicationError";
        this.code = code;
    }
}


export class LimitExceededError extends ApplicationError {
    constructor(message: string) {
        super("LIMIT_EXCEEDED", message);
    }
}