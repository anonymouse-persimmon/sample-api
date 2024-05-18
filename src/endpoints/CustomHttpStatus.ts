export class CustomHttpStatus extends Error {
    private status: HttpStatus;
    private innerError: Error | undefined;

    constructor(status: HttpStatus, message: string, e?: Error) {
        super(message);
        this.status = status;
        this.message = message;
        this.innerError = e;
    }

    public describeMessage(){
        return `{code: ${this.status.code}, message: ${this.status.message}, detail: ${this.message}, inner: ${this.innerError.message}}`
    }
}
type HttpStatus = {
    code: number;
    message: string;
}
export const BAD_REQUEST: HttpStatus = {code: 400, message: 'Bad Request'}
export const UNAUTHORIZED: HttpStatus = {code: 401, message: 'Unauthorized'}
export const FORBIDDEN: HttpStatus = {code: 403, message: 'Forbidden'}
export const NOT_FOUND: HttpStatus = {code: 404, message: 'Not Found'}
export const OK: HttpStatus = {code: 200, message: 'OK'}
export const CREATED: HttpStatus = {code: 201, message: 'Created'}
export const ACCEPTED: HttpStatus = {code: 202, message: 'Accepted'}
export const INTERNAL_SERVER_ERROR: HttpStatus = {code: 500, message: 'Internal Server Error'}
