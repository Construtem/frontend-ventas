// src/hooks/useAddressCheck.ts
'use client'

import { useCallback, useState } from 'react'

/* ---------- Tipos mínimos de la respuesta de Geocoding ---------- */
type AddressComponent = {
    long_name:  string
    short_name: string
    types:      string[]
}

interface GeocodeResult {
    types:              string[]
    address_components: AddressComponent[]
    place_id:           string
    formatted_address:  string
}

interface GeocodeResponse {
    status:  string
    results: GeocodeResult[]
}

/* -------------------------- Retorno del hook -------------------- */
type CheckResult =
    | { ok: true;  placeId: string; formatted: string }
    | { ok: false; reason: string }

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!

export function useAddressCheck() {
    const [loading, setLoading] = useState(false)
    const [error,   setError]   = useState<string | null>(null)

    /* ----------------------------------------------------------------
     *  check(): valida una dirección en Chile
     * ----------------------------------------------------------------*/
    const check = useCallback(
        async (street: string, comuna: string, ciudad: string): Promise<CheckResult> => {
            setLoading(true)
            setError(null)

            /* ① Query completo */
            const query = `${street}, ${comuna}, ${ciudad}, Chile`

            try {
                const res = await fetch(
                    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                        query,
                    )}&region=cl&key=${API_KEY}`,
                )

                const data = (await res.json()) as GeocodeResponse

                if (data.status !== 'OK' || data.results.length === 0) {
                    return { ok: false, reason: 'Sin coincidencias' }
                }

                /* ② Elegimos el primer resultado suficientemente “preciso” */
                const match = data.results.find((r) => {
                    /* descartamos resultados demasiado genéricos */
                    if (r.types.includes('country')) return false

                    const has = (t: string) =>
                        r.address_components.some((c) => c.types.includes(t))

                    return (
                        has('route') &&                          // calle
                        has('locality') &&                       // comuna / ciudad
                        has('administrative_area_level_2')       // provincia / RM
                    )
                })

                if (!match) {
                    return { ok: false, reason: 'Dirección incompleta o ambigua' }
                }

                return {
                    ok:        true,
                    placeId:   match.place_id,
                    formatted: match.formatted_address,
                }
            } catch (e: unknown) {
                const err = e as Error
                setError(err.message)
                return { ok: false, reason: 'Error de red' }
            } finally {
                setLoading(false)
            }
        },
        [],
    )

    return { check, loading, error }
}
