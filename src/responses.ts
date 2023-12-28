import {AaioResponse} from "./types";

export interface PaymentInfoResponse extends AaioResponse {
    id: string;
    order_id: string;
    desc: string;
    merchant_id: string;
    merchant_domain: string;
    method?: string;
    amount: number;
    currency: string;
    profit?: number;
    commission?: number;
    commission_client?: number;
    commission_type: `${number}:${number}`;
    email: string;
    status: 'success' | 'in_process' | 'hold' | 'expired';
    date: string;
    expired_date: string;
    complete_date?: string;
    us_vars: any[];
}

export interface PaymentMethodsResponse extends AaioResponse {
    list: Record<string, {
        name: string;
        min: {
            RUB: number;
            UAH: number;
            USD: number;
            EUR: number;
        };
        max: {
            RUB: number;
            UAH: number;
            USD: number;
            EUR: number;
        };
        commission_percent: number;
    }>
}

export interface IpsResponse extends AaioResponse {
    list: `${number}.${number}.${number}.${number}`[]
}

export interface BalanceResponse extends AaioResponse {
    balance: number;
    referral: number;
    hold: number;
}

export interface CreatePayoffResponse extends AaioResponse {
    id: string;
    my_id: string;
    method: string;
    wallet: string;
    amount: number;
    amount_in_currency: number;
    amount_rate: number;
    amount_down: number;
    commission: number;
    commission_type: number;
    status: 'in_process' | 'cancel' | 'success';
}

export interface PayoffRatesResponse extends AaioResponse {
    USD: number;
    UAH: number;
    USDT: number;
    BTC: number;
}

export interface PayoffInfoResponse extends AaioResponse {
    id: string;
    payoffId: string;
    method: string;
    wallet: string;
    amount: number;
    amount_down: number;
    commission: number;
    commission_type: 0 | 1;
    status: 'in_process' | 'cancel' | 'success';
    cancel_message?: string;
    date: string;
    complete_date?: string;
}

export interface PayoffMethodsResponse extends AaioResponse {
    list: Record<string, {
        name: string;
        min: number;
        max: number;
        commission_percent: number;
        commission_sum: number;
    }>
}