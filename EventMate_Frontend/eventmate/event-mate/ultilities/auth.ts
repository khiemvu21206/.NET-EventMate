import { KEY_AUTH_TOKEN } from "@/constants/constant";
import { AES, enc } from 'crypto-js';

const SECRET = process.env.SECRET_SAVE_TOKEN || 'default_secret';
export function getAuthInfo() {
    try {
        const authToken = localStorage.getItem(KEY_AUTH_TOKEN);
        const authTokenDecode = decodeAuthInfo(authToken ?? '');
        return authTokenDecode;
    } catch {
        return undefined;
    }
}
export function clearAuthInfo() {
    localStorage.removeItem(KEY_AUTH_TOKEN);
}
export function setAuthInfo(authInfo: unknown) {
    if (!authInfo) return;
    const authToken = encodeAuthInfo(authInfo);
    localStorage.setItem(KEY_AUTH_TOKEN, authToken);
}
export function encodeAuthInfo(authInfo: unknown) {
    if (!SECRET) {
        throw new Error('SECRET is not defined');
    }
    return encodeURIComponent(AES.encrypt(JSON.stringify(authInfo), SECRET).toString());
}
export function decodeAuthInfo(str: string) {
    return JSON.parse(
        AES.decrypt(decodeURIComponent(str), SECRET).toString(enc.Utf8)
    );
}