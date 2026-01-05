import * as yup from "yup";

const websocketSchema = {
    broadcast: yup.object({
        body: yup.object({
            channel: yup.string().required('channel is required'),
            message: yup.string().required('message is required')
        })
    }),
    sendTo: yup.object({
        body: yup.object({
            channel: yup.string().required('channel is required'),
            message: yup.string().required('message is required'),
            subscriptionId:  yup.string().required('subscriptionId is required'),
        })
    })
}

export default websocketSchema