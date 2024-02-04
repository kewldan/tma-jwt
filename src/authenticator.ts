import {cookies} from "next/headers";
import {JWTPayload, jwtVerify, SignJWT} from "jose";
import {createSecretKey, KeyObject} from "node:crypto";
import {NextRequest} from "next/server";
import validateTelegramHeader from "./TelegramAuthValidator";

type Payload = {
    userId: number;
}

type AuthenticatorPayload = JWTPayload & Payload;

export class Authenticator {
    private readonly secretKey: KeyObject;

    public constructor(private issuer: string, secret: string, private expiration: string | number | Date = '1 day') {
        this.secretKey = createSecretKey(secret, 'utf-8');
    }

    public async handleAuthRequest(request: NextRequest) {
        const header = await validateTelegramHeader(request);

        if (!header)
            return Response.json({type: 'error', message: 'Authentication header is not provided'});

        const token = cookies().get('token');

        if (token) {
            try {
                const userId = await this.verifyJWT(token.value);
                if (userId) {
                    return Response.json({type: 'success', again: true});
                }
            } catch (_) {

            }
        }

        cookies().set({
            name: 'token',
            value: await this.createJWT({userId: header.userId}),
            expires: Date.now() + 3600 * 24 * 1000,
            path: '/',
            secure: true,
            httpOnly: true,
            priority: 'high',
            sameSite: 'strict'
        });

        return Response.json({type: 'success', again: false});
    }

    public async verifyJWTCookie(): Promise<AuthenticatorPayload | null> {
        const token = cookies().get('token');
        if (token) {
            return await this.verifyJWT(token.value);
        } else {
            return null;
        }
    }

    public async verifyJWT(token: string): Promise<AuthenticatorPayload | null> {
        try {
            const verify = await jwtVerify(token, this.secretKey, {
                typ: 'JWT',
                algorithms: ['HS256'],
                issuer: this.issuer
            });

            return verify.payload as AuthenticatorPayload;
        } catch (e) {

        }

        return null;
    }

    public async createJWT(payload: AuthenticatorPayload): Promise<string> {
        return await new SignJWT(payload)
            .setProtectedHeader({alg: 'HS256', typ: 'JWT'})
            .setIssuer(this.issuer)
            .setIssuedAt()
            .setExpirationTime(this.expiration)
            .sign(this.secretKey);
    }
}