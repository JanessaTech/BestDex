import BaseErrorImp from "../base_errors/BaseErrorImp";
import type ErrorPropType from "../base_errors/ErrorPropType";

export class PoolError extends BaseErrorImp {
    constructor(props: ErrorPropType) {
        super(props);
    }
}