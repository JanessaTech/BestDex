import * as yup from "yup";

const positionSchema = {
    getPositions: yup.object({
        params:yup.object({
            chainId: yup.number().typeError('chainId should be an integer equal to or greater than 1!').min(1, 'chainId should be equal to or greater than 1!').integer('Please enter a valid integer for chainId!').required('chainId is required')
        }),
        query: yup.object({
            owner : yup.string().required('owner is required').matches(/^0x[a-fA-F0-9]{40}$/, 'owner is an invalid cryptocurrency address'),
            page: yup.number().min(1, 'page should be equal to or greater than 1!').integer('Please enter a valid integer for page!'),
            pageSize: yup.number().min(1, 'pageSize should be equal to or greater than 10!').max(100, 'pageSize can not be greater than 100').integer('Please enter a valid integer for pageSize!')
        })
    })
}

export default positionSchema