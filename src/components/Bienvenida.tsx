'use client'
// src/components/Bienvenida.tsx
import React, {useEffect} from 'react'
import { useQuery } from '@tanstack/react-query'
import { useCotizacionFlow } from '@/contexts/CotizacionFlow'
import { sucursalService, Sucursal } from '@/services/apiService'

export default function Bienvenida() {
    const { state, dispatch } = useCotizacionFlow()
    const {
        data: sucursales = [],
    } = useQuery<Sucursal[]>({
        queryKey: ['sucursales'],
        queryFn: () => sucursalService.obtenerSucursales(),
        staleTime: 1000 * 60 * 5, // opcional: cache de 5 minutos
    })

// Convertir el string JSON a objeto

    const [datosUsuario, setDatosUsuario] = React.useState({
        name: '',
        email: '',
    })


    useEffect(() => {
        if (!state.usuario?.email || !state.usuario?.nombre) {
            try {
                const userString = localStorage.user;
                const usuario = JSON.parse(userString);
                setDatosUsuario({
                    name: usuario.name,
                    email: usuario.email,
                });
                dispatch({
                    type: 'ADD_USER_TO_CONTEXT',
                    payload: {
                        nombre: usuario.name,
                        email: usuario.email,
                    },
                });
            } catch (e) {
                console.error('Error al parsear usuario:', e);
            }
        }
    }, [dispatch, state.usuario]);

    return (
        <div>

            <div className="bg-white px-[40px] py-[10px] rounded-[10px]
                      shadow-[0_0_2px_rgba(0,0,0,0.25)] flex flex-col gap-[10px] items-center sm:items-start">
            <h1 className="text-center sm:text-start font-semibold font-montserrat text-[32px]">
                Bienvenido
            </h1>
                <h2 className="font-semibold font-montserrat text-[24px]">
                    {datosUsuario.name}
                </h2>

                <div className="flex gap-[20px] flex-wrap items-baseline justify-center sm:justify-start">
                    <p className="font-montserrat">{datosUsuario.email}</p>
                    <select
                        className="border rounded px-2 py-1"
                        value={state.sucursalId ?? ''}
                        onChange={(e) =>
                            dispatch({ type: 'SET_STORE', payload: Number(e.target.value) })
                        }
                    >
                        <option value="" disabled>
                            -- Elige tienda --
                        </option>
                        {sucursales.map((sucursal) => (
                            <option key={sucursal.id} value={String(sucursal.id)}>
                                {sucursal.nombre}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    )
}