'use client';
import React, { useEffect, useState } from "react";
import Image from 'next/image';
import logo from '@/styles/images/contrutem.png';
import exit from '@/styles/images/logout2.png';
import { useRouter } from "next/navigation";

interface UserData {
    name: string;
    email: string;
    photoURL?: string;
    rol: string;
}

const Header: React.FC = () => {
    const [user, setUser] = useState<UserData | null>(null);
    const router = useRouter();
    const frontLoginUrl = process.env.NEXT_PUBLIC_FRONT_LOGIN || "https://login.tssw.cl";

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const parsedUser: UserData = JSON.parse(storedUser);
                setUser(parsedUser);
            } catch (err) {
                console.error("Error al parsear datos de usuario, limpiando localStorage:", err);
                localStorage.removeItem("user");
            }
        } else {
            console.log("No se encontró información de usuario en localStorage, redirigiendo a login");
            window.location.href = `${frontLoginUrl}`;
        }
    }, []);

    const handleLogout = async () => {
        localStorage.removeItem("user");
        console.log("Usuario ha cerrado sesión");
        window.location.href = `${frontLoginUrl}`;
    };

    return (
        <header className="w-full h-[58px] bg-[#2d2d2d] text-white flex items-center justify-between px-8 fixed top-0 left-0 z-[100] shadow-md">
            <div className="flex items-center h-full">
                <Image
                    src={logo}
                    alt="ConstrUTEM Logo"
                    className="max-h-[58px] w-auto cursor-pointer"
                    onClick={() => router.push("/admin/inicio")}
                />
            </div>

            <div className="flex items-center gap-6">
                {user && (
                    <div className="flex items-center gap-3 px-4 py-1">
                        <span className="bg-[#ff8000] text-[#222222] font-medium text-sm font-roboto px-4 py-2 rounded-full shadow-md uppercase whitespace-nowrap">
                            {localStorage.rol?.toLocaleUpperCase()}
                        </span>

                        <span className="bg-white text-gray-800 rounded-full p-1 text-lg flex items-center justify-center">
                            {user.photoURL ? (
                                <Image
                                    src={user.photoURL}
                                    alt="Foto perfil"
                                    width={32}
                                    height={32}
                                    className="rounded-full object-cover"
                                />
                            ) : (
                                "👤"
                            )}
                        </span>

                        <div className="flex flex-col leading-[1.2]">
                            <span className="text-white text-base">{user.name}</span>
                            <span className="text-indigo-300 text-sm">{user.email}</span>
                        </div>
                    </div>
                )}

                <Image
                    src={exit}
                    alt="Cerrar sesión"
                    width={32}
                    height={32}
                    className="cursor-pointer select-none"
                    onClick={handleLogout}
                />
            </div>
        </header>
    );
};

export default Header;
