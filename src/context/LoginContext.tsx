'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface Usuario {
    id: string;
    nombre: string;
    email: string;
    rol: 'administrador' | 'vendedor';
}

interface LoginContextType {
    usuario: Usuario | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const LoginContext = createContext<LoginContextType | undefined>(undefined);
const STORAGE_KEY = 'construtem-user';

export const LoginProvider = ({ children }: { children: ReactNode }) => {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const router = useRouter();

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) setUsuario(JSON.parse(stored));
    }, []);

    useEffect(() => {
        if (usuario) localStorage.setItem(STORAGE_KEY, JSON.stringify(usuario));
        else localStorage.removeItem(STORAGE_KEY);
    }, [usuario]);

    const login = async (email: string, password: string) => {
        if (
            email === 'admin@utem.cl' && password === 'administrador'
        ) {
            const user:Usuario = { id: '1', nombre: 'Admin', email, rol: 'administrador' };
            setUsuario(user);
            router.push('/admin/inicio');
        } else if (
            email === 'vendedor@utem.cl' && password === 'vendedor'
        ) {
            const user:Usuario = { id: '2', nombre: 'Vendedor', email, rol: 'vendedor' };
            setUsuario(user);
            router.push('/vendedor');
    console.log(user)
        } else {
            throw new Error('Credenciales incorrectas');
        }
    };

    const logout = () => {
        setUsuario(null);
        router.push('/');
    };

    const isAuthenticated = usuario !== null;

    return (
        <LoginContext.Provider value={{ usuario, login, logout, isAuthenticated }}>
            {children}
        </LoginContext.Provider>
    );
};

export const useLogin = () => {
    const context = useContext(LoginContext);
    if (!context) throw new Error('useLogin debe usarse dentro de <LoginProvider>');
    return context;
};
