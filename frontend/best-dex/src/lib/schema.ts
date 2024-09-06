import * as yup from "yup";

export const SignupSchema = yup.object().shape({
    name : yup.string().min(5, 'Display name must have at least 5 characters').max(20, 'Display name must have at most 20 characters').required('Display name is required'),
    checked: yup.boolean().oneOf([true], "You must accept the terms and conditions"),
    intro: yup.string().max(200, 'Introduction should be less than 200 characters').optional()
})