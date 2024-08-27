interface BaseError extends Error {
    key: string
    params: any[]
    code: number
    errors: any
    message: string
}

export default BaseError