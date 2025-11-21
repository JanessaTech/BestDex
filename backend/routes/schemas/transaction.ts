import * as yup from "yup";
import { TRANSACTION_TYPE } from "../../helpers/common/constants";

const transactionSchema = {
    create: yup.object({
        body: yup.object({
            chainId: yup.number().typeError('chainId should be an integer equal to or greater than 1!').min(1, "chainId should be an integer equal to or greater than 1!").integer('Please enter a valid integer for chainId!'),
            tokenId: yup.number().min(1, 'tokenId should be equal to or greater than 1!').integer('Please enter a valid integer for tokenId!').optional(),
            tx: yup.string().required('tx is required'),
            txType:  yup.mixed().oneOf(Object.values(TRANSACTION_TYPE)),
            token0: yup.string().required('token0 is required').matches(/^0x[a-fA-F0-9]{40}$/, 'token0 is an invalid cryptocurrency address'),
            token1: yup.string().required('token1 is required').matches(/^0x[a-fA-F0-9]{40}$/, 'token1 is an invalid cryptocurrency address'),
            amount0: yup.string().required('amount0 is required'),
            amount1: yup.string().required('amount0 is required'),
            usd: yup.string().required('usd is required'),
            from: yup.string().required('from is required').matches(/^0x[a-fA-F0-9]{40}$/, 'from is an invalid cryptocurrency address'),
        })
    }),
    getTransactions: yup.object({
        params:yup.object({
            chainId: yup.number().typeError('chainId should be an integer equal to or greater than 1!').min(1, 'chainId should be equal to or greater than 1!').integer('Please enter a valid integer for chainId!').required('chainId is required')
        }),
        query: yup.object({
            from : yup.string().required('from is required').matches(/^0x[a-fA-F0-9]{40}$/, 'from is an invalid cryptocurrency address'),
            page: yup.number().min(1, 'page should be equal to or greater than 1!').integer('Please enter a valid integer for page!').optional(),
            pageSize: yup.number().min(1, 'pageSize should be equal to or greater than 10!').max(100, 'pageSize can not be greater than 100').integer('Please enter a valid integer for pageSize!')
        })
    })
}

export default transactionSchema