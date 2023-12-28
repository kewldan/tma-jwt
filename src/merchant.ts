import {sendRequest} from "./utils";
import {Currency, Language} from "./types";
import {createPaymentSign} from "./security";
import {PaymentInfoResponse, PaymentMethodsResponse} from "./responses";


export class Merchant {
    private readonly id: string;
    private readonly secret: string;
    private readonly apiKey: string;

    /**
     * Create instance for merchant
     * @param id Merchant ID
     * @param secret Merchant secret key #2
     * @param apiKey API-Key for some methods
     */
    constructor(id: string, secret: string, apiKey: string) {
        this.id = id;
        this.secret = secret;
        this.apiKey = apiKey;
    }

    /**
     * Creates a payment URL for customer
     * @param amount Payment amount
     * @param order_id Order ID in your system
     * @param currency Payment currency
     * @param options Additional options to payment
     * @return Payment URL for customer
     */
    createPayment(amount: number, order_id: string, currency: Currency, options?: {
        method?: string,
        desc?: string,
        email?: string,
        lang?: Language,
        referral?: string,
        us_key?: string
    }): string {
        const sign = createPaymentSign(this.id, amount, currency, this.secret, order_id);

        const paymentData: Record<string, any> = {
            merchant_id: this.id,
            amount: String(amount),
            order_id,
            sign,
            currency,
            ...options
        }

        for (const key in paymentData) {
            if (!paymentData[key]) {
                delete paymentData[key];
            }
        }

        return 'https://aaio.io/merchant/pay?' + new URLSearchParams(paymentData);
    }

    /**
     * Fetch payment info
     * @param orderId Your Order ID
     */
    async getPaymentInfo(orderId: string): Promise<PaymentInfoResponse> {
        return await sendRequest(this.apiKey, '/info-pay', {
            order_id: orderId
        })
    }

    /**
     * Fetch available payment methods (Enabled for merchant)
     */
    async getPaymentMethods(): Promise<PaymentMethodsResponse> {
        return await sendRequest(this.apiKey, '/methods-pay', {
            merchant_id: this.id
        });
    }
}