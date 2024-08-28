import * as yup from "yup";

const accountSchema = {
    login : yup.object({
        body: yup.object({
            name : yup.string().min(5).max(15).required(),
            password: yup.string().min(5).max(10).required()
        })
    }),
    register : yup.object({
        body: yup.object({
            name : yup.string().min(5).max(15).required(),
            password: yup.string().min(5).max(10).required(),
            email: yup.string().email().optional()
        })
    }),
    updateAccount : yup.object({
        body: yup.object({
            id : yup.number().required(),
            name : yup.string().min(5).max(15).required(),
            password: yup.string().min(5).max(10).optional(),
            email: yup.string().email().optional()
        })
    }),
    deleteAccount :yup.object({
        params: yup.object({
            id : yup.number().required()
        })
    }),
    getByAccountId :yup.object({
        params: yup.object({
            id : yup.number().required()
        })
    })
}

export default accountSchema
