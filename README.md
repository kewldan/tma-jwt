# TMA JWT

This library needed to support JWT for the TMA.js library for Telegram WebApps.
It uses asynchronous jose, H256 JWT methods with your key.
It already has a built-in method, and a reserved `POST /api/auth` route.
The setup in 3 steps.

### Build

1. `$ git clone https://github.com/kewldan/tma-jwt`
2. `$ cd tma-jwt`
3. `npm i`
4. `npm run build`

### Dependencies

* `@tma/sdk.js` - [npm](https://www.npmjs.com/package/@tma.js/sdk-react)
* `jose` - [npm](https://www.npmjs.com/package/jose)
* `next` - [npm](https://nextjs.org/)
* `react` - [npm](https://react.dev/)
* [DEV] Rollup with `rollup` - [npm](https://rollupjs.org/)

### Install

* Create `/app/lib/Security.ts` with content:

```ts
import {Authenticator} from "tma-jwt";

export const authenticator = new Authenticator('default-issuer', 'MY JWT SECRET KEY (SHA256 phrase)');
```

* Create `/app/api/auth/route.ts` with this content:

```ts
import {NextRequest} from "next/server";
import {authenticator} from "@/lib/Security";


export async function POST(request: NextRequest) {
    return authenticator.handleAuthRequest(request);
}
```

* Modify `layout.tsx`, add wrapper for children:

```tsx
import {TelegramAuth} from "tma-jwt";

<TelegramAuth>
    {children}
</TelegramAuth>
```

* Enjoy, use authenticator.verifyJWTCookie():

```tsx
import React from "react";
import {authenticator} from "@/lib/Security";

export default async function Home() {
    const jwt = await authenticator.verifyJWTCookie();

    return jwt ? (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <h1>
                Hello, {jwt.userId}
            </h1>
        </main>
    ) : <span>Hold on</span>;
}
```