'use client';
import { useState } from "react";
import Sidebar from "@/components/admin/sideBar";
import Header from "@/components/admin/header";

export default function VendedorLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (
        <div className="flex h-screen">
            <Sidebar open={sidebarOpen}/>
            <div className="flex flex-col flex-1 relative">
                <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}/>
                <main className="flex-1 pt-[80px] px-8 py-6 overflow-y-auto bg-gray-100">
                    {children}
                </main>
            </div>
        </div>
    );
}
