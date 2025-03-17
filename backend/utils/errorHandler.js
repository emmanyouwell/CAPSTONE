class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;

        Error.captureStackTrace(this, this.constructor)
    }
    toJSON() {
        return { message: this.message, statusCode: this.statusCode };
    }

}

module.exports = ErrorHandler;