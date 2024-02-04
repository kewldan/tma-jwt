'use client';

import React, {useEffect} from "react";
import {useInitDataRaw} from "@tma.js/sdk-react";

export function TelegramAuth({children}: {
    children: React.ReactNode
}) {
    const initDataRaw = useInitDataRaw();

    useEffect(() => {
        if (!initDataRaw)
            return;

        fetch('/api/auth', {
            method: 'POST',
            headers: {
                'X-Api-Key': initDataRaw
            }
        }).then(response => {
            response.json().then((data: {
                type: 'success' | 'error';
                message?: string;
                again: boolean;
            }) => {
                if (data.type !== 'success') {
                    console.error(`Failed to auth, ${data.message}`)
                } else {
                    if (!data.again) {
                        window.location.reload();
                    }
                }
            });
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {children}
        </>
    )
}