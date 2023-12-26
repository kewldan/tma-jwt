export type AaioResponse = {
    type: 'success' | 'error';
    code?: 400 | 401;
    message?: string;
}