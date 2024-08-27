import type ErrorPropType from './ErrorPropType';
import BaseErrorImp from './BaseErrorImp';

export class UnSupportedAuthError extends BaseErrorImp {
    constructor(props: ErrorPropType) {
        super(props);
    }
}
export class UnauthorizedError extends BaseErrorImp {
    constructor(props: ErrorPropType) {
        super(props);
    }
}

export class UnmatchedTokenError extends BaseErrorImp{
    constructor(props: ErrorPropType) {
        super(props);
    }
}

/**
 * This is an example of how to add new global custom error class
 */
export class GlobalDemoError extends BaseErrorImp {
    constructor(props: ErrorPropType) {
        super(props);
    }
}