import * as yup from "yup";
import { CHAINNAME } from "../../helpers/common/constants";

const subgraphSchema = {
    getStatus: yup.object({
        params: yup.object({
            chainName: yup.mixed().oneOf(Object.values(CHAINNAME)).required('chainName is required'),
        })
    })
}

export default subgraphSchema