export type AaioResponse = {
    type: 'success' | 'error';
    code?: 400 | 401;
    message?: string;
}

export type Language = 'ru' | 'en';

export type Currency = 'RUB' | 'UAH' | 'EUR' | 'USD';