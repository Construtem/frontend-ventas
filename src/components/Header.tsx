'use client'
import React, { useEffect, useState } from "react";
import Image from 'next/image';
import logo from '@/styles/images/contrutem.png';
import exit from '@/styles/images/logout2.png';
import { useRouter } from "next/navigation";
import Link from "next/link";
import Modal from '@/components/Modal/Modal';
import Button from '@/components/Button';
import {ModalBody, ModalFooter, ModalHeader} from "@/components/Modal/ModalsParts";

interface UserData {
    name: string;
    email: string;
    photoURL?: string;
    rol?: string;
}

const Header: React.FC = () => {
    const [user, setUser] = useState<UserData | null>(null);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const router = useRouter();
    const frontLoginUrl = process.env.NEXT_PUBLIC_FRONT_LOGIN || "https://login.tssw.cl";

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const parsedUser: UserData = JSON.parse(storedUser);
                setUser(parsedUser);
            } catch (err) {
                console.error("Error al parsear datos de usuario:", err);
                localStorage.removeItem("user");
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        window.location.href = frontLoginUrl;
    };

    return (
        <>
            {/* HEADER */}
            <header className="w-full h-[58px] bg-[#2d2d2d] text-white flex items-center justify-between px-4 sm:px-6 md:px-8 fixed top-0 left-0 z-[100] shadow-md">
                <div className="flex items-center h-full">
                    <Link href="/" className="flex items-center h-full">
                        <Image
                            src={logo}
                            alt="ConstrUTEM Logo"
                            className="max-h-[58px] w-auto cursor-pointer"
                            onClick={() => router.push("/admin/inicio")}
                        />
                    </Link>
                </div>

                <div className="flex items-center gap-4 sm:gap-5 md:gap-6">
                    {user && (
                        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 px-2 sm:px-3 md:px-4 py-1">
                            <span className="bg-[#ff8000] text-[#222222] font-medium text-xs sm:text-sm font-roboto px-2 sm:px-3 py-1.5 sm:py-2 rounded-full shadow-md uppercase whitespace-nowrap">
                                {localStorage.rol?.toLocaleUpperCase()}
                            </span>

                            <span className="bg-white text-gray-800 rounded-full p-[6px] text-lg flex items-center justify-center">
                                {user.photoURL ? (
                                    <Image
                                        src={user.photoURL}
                                        alt="Foto perfil"
                                        width={32}
                                        height={32}
                                        className="rounded-full object-cover min-w-[32px] min-h-[32px] max-w-[32px] max-h-[32px] select-none"
                                    />
                                ) : (
                                    "👤"
                                )}
                            </span>

                            <div className="flex flex-col leading-[1.2] text-right">
                                <span className="text-white text-montserrat text-sm sm:text-base md:hidden">
                                    {obtenerNombreYApellido(user.name).corto}
                                </span>
                                <span className="text-white text-montserrat text-sm sm:text-base hidden md:inline">
                                    {obtenerNombreYApellido(user.name).completo}
                                </span>
                                <span className="text-montserrat text-xs sm:text-sm truncate hidden sm:inline">
                                    {user.email}
                                </span>
                            </div>
                        </div>
                    )}

                    <Image
                        src={exit}
                        alt="Cerrar sesión"
                        width={28}
                        height={28}
                        className="cursor-pointer select-none"
                        onClick={() => setShowLogoutModal(true)}
                    />
                </div>
            </header>

            {/* MODAL CONFIRMACIÓN CIERRE DE SESIÓN */}
            <Modal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)}>
                <ModalHeader className={'px-[60px] flex gap-10'} title="¿Deseas cerrar la sesión?" onClose={() => setShowLogoutModal(false)} />
                <ModalBody className={'py-[40px]'}>
                    <p className="text-gray-700 text-base text-center">Serás redirigido a la plataforma de login.</p>
                </ModalBody>
                <ModalFooter className={'flex justify-center'}>
                    <div className={'w-full flex items-center justify-between gap-[10px]'}>
                        <div className={'w-[50%] flex items-end justify-end'}>
                            <Button
                                label="Sí, cerrar sesión"
                                className="bg-red-600 hover:bg-red-700 text-white"
                                onClick={handleLogout}
                            />
                        </div>
                        <div className={'w-[50%]'}>
                            <Button
                                label="Cancelar"
                                className="bg-gray-200"
                                onClick={() => setShowLogoutModal(false)}
                            />
                        </div>
                    </div>
                </ModalFooter>
            </Modal>
        </>
    );
};

export default Header;

function obtenerNombreYApellido(nombreCompleto: string): { corto: string; completo: string } {
    const partes = nombreCompleto.trim().split(' ');
    const corto = partes.length >= 2 ? `${partes[0]} ${partes[2] || partes[1]}` : nombreCompleto;
    return {
        corto,
        completo: nombreCompleto
    };
}
