import Hex from "crypto-js/enc-hex";
import sha256 from "crypto-js/sha256";
import {Currency} from "./types";

/**
 * Generates sign for payment
 * @param merchant_id Merchant ID
 * @param amount Payment amount
 * @param currency Payment currency
 * @param secret Secret 1st or 2nd depending on purposes
 * @param order_id Your order ID
 */
export function createPaymentSign(merchant_id: string, amount: number, currency: Currency, secret: string, order_id: string) {
    return Hex.stringify(sha256([merchant_id, String(amount), currency, secret, order_id].join(':')));
}
