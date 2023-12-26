import {AaioResponse} from "./types";

interface IpsResponse extends AaioResponse {
    list: `${number}.${number}.${number}.${number}`[]
}

export async function getIps(): Promise<{}> {
    const request = await fetch('https://aaio.io/api/public/ips');
    return await request.json();
}

export async function sendRequest(apiKey: string, uri: string, data?: Record<string, string | number>) {
    const response = await fetch(`https://aaio.io/api${uri}`, {
        method: 'POST',
        body: JSON.stringify(data || {}),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Api-Key': apiKey
        }
    });
    return await response.json();
}