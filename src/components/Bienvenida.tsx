'use client'
// src/components/Bienvenida.tsx
import React, {useEffect} from 'react'
import { useQuery } from '@tanstack/react-query'
import { useCotizacionFlow } from '@/contexts/CotizacionFlow'
import { sucursalService, Sucursal } from '@/services/apiServices'
import NumberIcon from "@/components/NumberIcon";

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
    console.log(datosUsuario)
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
        <div className={'flex gap-[20px] items-center flex-wrap'}>
            <NumberIcon number={1}/>
            <div>

            <h2 className={'text-[28px] font-semibold'}>Selecciona tienda</h2>
            <select
                className="border rounded px-2 py-1"
                value={!state.sucursalId ? '' : state.sucursalId}
                onChange={(e) =>
                    dispatch({type: 'SET_STORE', payload: Number(e.target.value)})
                }
                data-tour="store-selector"
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
            )
            }