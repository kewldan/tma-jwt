import {sendRequest} from "./utils";
import sha256 from 'crypto-js/sha256';
import Hex from 'crypto-js/enc-hex';
import {AaioResponse} from "./types";

interface PaymentInfoResponse extends AaioResponse {
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

interface PaymentMethodsResponse extends AaioResponse {
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

export class Merchant {
    private readonly id: string;
    private readonly secret: string;
    private readonly currency: string;
    private readonly apiKey: string;

    /**
     * Create instance for merchant
     * @param id Merchant ID
     * @param secret Merchant secret key #2
     * @param apiKey API-Key for some methods
     * @param currency Default payment currency, can be overridden
     */
    constructor(id: string, secret: string, apiKey: string, currency: string = 'RUB') {
        this.id = id;
        this.secret = secret;
        this.apiKey = apiKey;
        this.currency = currency;
    }

    /**
     * Creates a payment URL for customer
     * @param amountValue payment amount
     * @param order_id Order ID in your system
     * @param description (Optional) Description of order
     * @param email (Optional) Customer E-Mail
     * @param lang (Optional) Language, ru or en
     * @param referral (Optional) Referral code
     * @param currency (Optional) Currency override, default is client default
     */
    createPayment(amountValue: number, order_id: string, description?: string, email?: string, lang?: 'en' | 'ru', referral?: string, currency?: string): string {
        const paymentCurrency = currency || this.currency;

        const sign = Hex.stringify(sha256([this.id, String(amountValue), paymentCurrency, this.secret, order_id].join(':')));

        const amount = String(amountValue);

        const paymentData: Record<string, any> = {
            merchant_id: this.id,
            amount,
            order_id,
            sign,
            currency: paymentCurrency,
            referral,
            desc: description,
            email,
            lang: lang || 'ru'
        }

        for (const key in paymentData) {
            if (!paymentData[key]) {
                delete paymentData[key];
            }
        }

        return `https://aaio.io/merchant/pay?${
            new URLSearchParams(paymentData)
        }`;
    }

    async getPaymentInfo(orderId: string): Promise<PaymentInfoResponse> {
        return await sendRequest(this.apiKey, '/info-pay', {
            order_id: orderId
        })
    }

    async getPaymentMethods(): Promise<PaymentMethodsResponse> {
        return await sendRequest(this.apiKey, '/methods-pay', {
            merchant_id: this.id
        });
    }
}