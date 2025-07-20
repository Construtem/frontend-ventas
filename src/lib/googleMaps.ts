/** lib/googleMaps.ts */
export interface ValidatedAddress {
    /* Place-ID de Google Maps, muy útil para futuras consultas */
    placeId:    string
    /* Dirección formateada “oficial” que devuelve Google */
    formatted:  string

    /* Componentes útiles separados */
    street:     string
    comuna:     string
    ciudad:     string
}

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string

/**
 * Valida una dirección chilena usando la Geocoding API.
 *
 * @param street “Los Castaños 1234”
 * @param comuna “Providencia”
 * @param ciudad “Santiago”
 *
 * @return `ValidatedAddress` si la encuentra · `null` si no hay match
 */
export async function validateAddress (
    street: string,
    comuna: string,
    ciudad: string
): Promise<ValidatedAddress | null> {
    if (!API_KEY) throw new Error('Falta NEXT_PUBLIC_GOOGLE_MAPS_API_KEY')

    const query = `${street}, ${comuna}, ${ciudad}, Chile`

    const url =
        `https://maps.googleapis.com/maps/api/geocode/json` +
        `?address=${encodeURIComponent(query)}` +
        `&components=country:CL` +
        `&key=${API_KEY}`

    const res = await fetch(url)
    const data: GoogleGeocodeResponse = await res.json()

    if (data.status !== 'OK' || data.results.length === 0) return null

    const r = data.results[0]

    const find = (type: string) =>
        r.address_components.find(c => c.types.includes(type))?.long_name ?? ''

    const result: ValidatedAddress = {
        placeId:   r.place_id,
        formatted: r.formatted_address,
        street:    `${find('route')} ${find('street_number')}`.trim(),
        comuna:    find('administrative_area_level_3') || find('locality'),
        ciudad:    find('administrative_area_level_2') || find('locality'),
    }

    return result
}

interface GoogleGeocodeResponse {
    status:  'OK' | 'ZERO_RESULTS' | string
    results: Array<{
        formatted_address: string
        place_id:          string
        address_components: Array<{
            long_name:  string
            short_name: string
            types:      string[]
        }>
    }>
}
