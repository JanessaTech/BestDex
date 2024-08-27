import yup from 'yup'

const accountSchema = {
    login : yup.object({
        body: yup.object({
            name : yup.string().min(5).max(15).required(),
            password: yup.string().min(5).max(10).required()
        })
    })
}

export default accountSchema
