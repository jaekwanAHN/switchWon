'use client';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = () => {
        Cookies.remove('accessToken');
        Cookies.remove('memberId');
        router.push('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm">
                <div className="mx-auto max-w-7xl px-4 flex h-16 justify-between items-center">
                    <span className="text-xl font-bold">Exchange App</span>
                    <div className="flex gap-6 items-center">
                        <Link href="/" className={`text-sm font-medium ${pathname === '/' ? 'text-black' : 'text-gray-500'}`}>환전 하기</Link>
                        <Link href="/history" className={`text-sm font-medium ${pathname === '/history' ? 'text-black' : 'text-gray-500'}`}>환전 내역</Link>
                        <button onClick={handleLogout} className="bg-indigo-600 text-white px-3 py-2 rounded text-sm">Log out</button>
                    </div>
                </div>
            </nav>
            <main className="mx-auto max-w-7xl p-4 py-8">{children}</main>
        </div>
    );
}