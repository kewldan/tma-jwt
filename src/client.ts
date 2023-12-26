import {AaioResponse} from "./types";
import {Merchant} from "./merchant";
import {sendRequest} from "./utils";

interface BalanceResponse extends AaioResponse {
    balance: number;
    referral: number;
    hold: number;
}

interface CreatePayoffResponse extends AaioResponse {
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

interface PayoffRatesResponse extends AaioResponse {
    USD: number;
    UAH: number;
    USDT: number;
    BTC: number;
}

interface PayoffInfoResponse extends AaioResponse {
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

interface PayoffMethodsResponse extends AaioResponse {
    list: Record<string, {
        name: string;
        min: number;
        max: number;
        commission_percent: number;
        commission_sum: number;
    }>
}

export class Client {
    private readonly apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    createMerchant(merchantId: string, secretKey: string, currency: string = 'RUB') {
        return new Merchant(merchantId, secretKey, this.apiKey, currency);
    }

    async getBalance(): Promise<BalanceResponse> {
        return await sendRequest(this.apiKey, '/balance');
    }

    async createPayoff(method: string, amount: number, wallet: string, commissionType: 0 | 1, payoff_id: string): Promise<CreatePayoffResponse> {
        return await sendRequest(this.apiKey, '/create-payoff', {
            my_id: payoff_id,
            method,
            amount,
            wallet,
            commission_type: commissionType,
        });
    }

    async getPayoffRates(): Promise<PayoffRatesResponse> {
        return await sendRequest(this.apiKey, '/rates-payoff');
    }

    async getPayoffInfo(payoffId: string): Promise<PayoffInfoResponse> {
        return await sendRequest(this.apiKey, '/info-payoff', {
            my_id: payoffId
        });
    }

    async getPayoffMethods(): Promise<PayoffMethodsResponse> {
        return await sendRequest(this.apiKey, '/methods-payoff');
    }
}