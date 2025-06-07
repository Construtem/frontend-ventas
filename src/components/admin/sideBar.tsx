'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useLogin } from '@/context/LoginContext';
import { ADMIN_SideBar, VENDEDOR_SideBar } from '@/config/sideBar';
import type { NavItem } from '@/config/sideBar';

export default function Sidebar({ open }: { open: boolean }) {
    const { usuario } = useLogin();
    const [expanded, setExpanded] = useState<string | null>(null);

    if (!usuario) return null;
    const nav = usuario.rol === 'vendedor' ? VENDEDOR_SideBar : ADMIN_SideBar;

    const toggleExpand = (id: string) => {
        setExpanded(prev => (prev === id ? null : id));
    };

    return (
        <aside
            className={`mt-[58px] h-full bg-[#1f2937] text-white flex flex-col transition-all duration-300 ${
                open ? 'w-64 px-4' : 'w-0 overflow-hidden'
            }`}
        >
            <nav className="flex flex-col gap-1 pt-4 text-sm font-medium">
                {nav.map((item: NavItem) =>
                    item.children ? (
                        <div key={item.id}>
                            <button
                                className="w-full flex items-center gap-x-2 py-2 px-2 hover:bg-gray-700 rounded-md"
                                onClick={() => toggleExpand(item.id)}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                                <span className="ml-auto">{expanded === item.id ? '▲' : '▼'}</span>
                            </button>

                            {expanded === item.id && (
                                <div className="ml-4 pl-2 border-l border-gray-600">
                                    {item.children.map((subItem) => (
                                        <Link
                                            key={subItem.id}
                                            href={subItem.href ?? '#'}
                                            className="flex items-center gap-x-2 py-2 px-2 text-gray-300 hover:bg-gray-700 rounded-md"
                                        >
                                            {subItem.icon}
                                            <span>{subItem.label}</span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link
                            key={item.id}
                            href={item.href ?? '#'}
                            className="flex items-center gap-x-2 py-2 px-2 hover:bg-gray-700 rounded-md"
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </Link>
                    )
                )}
            </nav>
        </aside>
    );
}
