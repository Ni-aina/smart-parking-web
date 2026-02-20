'use client';

import { useRouter } from 'next/navigation';
import { Home } from 'lucide-react';
import CustomButton from '@/components/ui/customButton';

const NotFound = ()=> {
    const router = useRouter();

    return (
        <div className="flex items-center justify-center h-dvh bg-black/95">
            <div className="text-center space-y-6 px-4">
                <h1 className="text-6xl font-bold text-yellow-500">404</h1>
                <p className="text-2xl font-semibold text-white">Page not found</p>
                <p className="text-gray-300 max-w-md mx-auto">
                    The page you're looking for doesn't exist.
                </p>
                <div className="flex justify-center gap-4">
                    <CustomButton
                        onClick={() => router.push("/")}
                        Icon={Home}
                        title="Go Home"
                    />
                </div>
            </div>
        </div>
    )
}

export default NotFound;