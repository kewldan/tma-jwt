import {NextRequest} from "next/server";
import {InitDataParsed, parseInitData} from "@tma.js/sdk";

async function HMAC(key: ArrayBuffer, message: ArrayBuffer): Promise<ArrayBuffer> {
    const keyBytes = new Uint8Array(key);
    const messageBytes = new Uint8Array(message);

    const importedKey = await crypto.subtle.importKey(
        "raw",
        keyBytes,
        {name: "HMAC", hash: {name: "SHA-256"}},
        false,
        ["sign"]
    );

    return await crypto.subtle.sign("HMAC", importedKey, messageBytes);
}

async function getSecret() {
    const key = new TextEncoder().encode('WebAppData');
    const message = new TextEncoder().encode(process.env.BOT_TOKEN);

    return await HMAC(key, message);
}

export default async function validateTelegramHeader(request: NextRequest): Promise<{
    initData: InitDataParsed;
    userId: number;
} | null> {
    const initDataRaw = request.headers.get('X-Api-Key');

    if (initDataRaw) {
        const initDataData = Object.fromEntries(new URLSearchParams(initDataRaw));

        const hash = initDataData.hash;

        const checkString = Object.keys(initDataData)
            .filter((key) => key !== "hash")
            .map((key) => `${key}=${initDataData[key]}`)
            .sort()
            .join('\n');

        const secret = await getSecret();
        const message = new TextEncoder().encode(checkString)

        const signature = await HMAC(secret, message);

        const signatureHex = Array.from(new Uint8Array(signature))
            .map((byte) => byte.toString(16).padStart(2, "0"))
            .join("");

        if (signatureHex === hash) {
            const initData = parseInitData(initDataRaw);
            const userId = initData.user?.id;

            if (userId) {
                return {
                    initData,
                    userId
                }
            }
        }
    }

    return null;
}