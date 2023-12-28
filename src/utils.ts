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