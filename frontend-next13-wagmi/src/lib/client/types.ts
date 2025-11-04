type DexResponseType<T = any> = {
    success: boolean;
    code: number;
    message: string;
    data?: T;
    errors?: any
}