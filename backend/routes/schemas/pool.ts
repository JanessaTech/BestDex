import * as yup from "yup";

const poolSchema = {
    getLatestPoolInfo:yup.object({
        params:yup.object({
            chainId: yup.number().typeError('chainId should be an integer equal to or greater than 1!').min(1, 'chainId should be equal to or greater than 1!').integer('Please enter a valid integer for chainId!').required('chainId is required')
        }),
        query: yup.object({
            poolAddress : yup.string().required('poolAddress is required').matches(/^0x[a-fA-F0-9]{40}$/, 'poolAddress is an invalid cryptocurrency address')
        })
    })
}

export default poolSchema