import * as yup from "yup";

const positionSchema = {
    getPositions: yup.object({
        params:yup.object({
            chainId: yup.number().typeError('chainId should be an integer equal to or greater than 1!').min(1, 'chainId should be equal to or greater than 1!').integer('Please enter a valid integer for chainId!').required('chainId is required')
        }),
        query: yup.object({
            owner : yup.string().required('owner is required').matches(/^0x[a-fA-F0-9]{40}$/, 'owner is an invalid cryptocurrency address')
        })
    })
}

export default positionSchema