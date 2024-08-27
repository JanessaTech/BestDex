import BaseErrorImp from "../base_errors/BaseErrorImp";
import type ErrorPropType from "../base_errors/ErrorPropType";

export class AccountError extends BaseErrorImp {
    constructor(props: ErrorPropType) {
        super(props);
    }
}

/**
 * Here is an example of how to add a new local custom error under account
 */
export class AccountDemoError extends BaseErrorImp {
    constructor(props: ErrorPropType) {
        super(props);
    }
}