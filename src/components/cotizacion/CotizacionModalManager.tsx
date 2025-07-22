'use client';
import { useCotizacionFlow } from "@/contexts/CotizacionFlow";
import CotizacionDetalleModal from "@/components/Modal/CotizacionDetalleModal";

export default function CotizacionModalManager() {
    const { state, dispatch } = useCotizacionFlow();
    const { modal } = state;

    console.log('probando')
    const onClose = () => dispatch({ type: "CERRAR_MODAL" });

    return (
        <>
            {modal.tipo === "detalle" && modal.data && (
                <CotizacionDetalleModal
                    open={true}
                    onClose={onClose}
                    data={modal.data}
                />
            )}
        </>
    );
}
