 'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CheckoutPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to home if accessed directly
        router.push('/');
    }, []);

    return <div>Redirecting...</div>;
}