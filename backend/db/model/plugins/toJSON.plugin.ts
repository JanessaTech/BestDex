
const toJSON = (schema: any, options:any) => {
    schema.options.toJSON = Object.assign(schema.options.toJSON || {}, {
        transform(doc: any, ret: any, options: any) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    })
}

export default toJSON