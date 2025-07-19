import { useCallback, useState } from 'react'

type CheckResult =
    | { ok: true; placeId: string; formatted: string }
    | { ok: false; reason: string }

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!

export function useAddressCheck() {
    const [loading, setLoading] = useState(false)
    const [error,   setError]   = useState<string | null>(null)

    const check = useCallback(
        async (street: string, comuna: string, ciudad: string): Promise<CheckResult> => {
            setLoading(true)
            setError(null)

            // ❶ Build full query
            const query = `${street}, ${comuna}, ${ciudad}, Chile`

            try {
                const res = await fetch(
                    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                        query,
                    )}&region=cl&key=${API_KEY}`,
                )
                const data = await res.json()

                if (data.status !== 'OK' || !data.results.length) {
                    return { ok: false, reason: 'Sin coincidencias' }
                }

                // ❷ Elegimos el primer resultado “preciso”
                const match = data.results.find((r: any) => {
                    const types = r.types as string[]
                    if (types.includes('country')) return false // demasiado genérico

                    // comprobamos que tenga los components requeridos
                    const comp = (t: string) =>
                        r.address_components.some((c: any) => c.types.includes(t))

                    return (
                        comp('route') &&
                        comp('locality') &&                // comuna o ciudad
                        comp('administrative_area_level_2') // provincia Reg. Metropolitana
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
            } catch (e: any) {
                setError(e.message)
                return { ok: false, reason: 'Error de red' }
            } finally {
                setLoading(false)
            }
        },
        [],
    )

    return { check, loading, error }
}
