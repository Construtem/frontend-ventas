import React from 'react';
import { FaCheck, FaClock, FaTimes } from 'react-icons/fa';

/** Dummy data */
interface Cotizacion {
    id: number;
    fecha: string;
    cliente: string;
    estado: 'Aprobada' | 'Pendiente' | 'Rechazada';
    total: string;
}

const dummyData: Cotizacion[] = [
    { id: 1, fecha: '05/05/2025', cliente: 'Cliente A', estado: 'Aprobada',  total: '26.500 $' },
    { id: 2, fecha: '05/05/2025', cliente: 'Cliente A', estado: 'Pendiente', total: '26.500 $' },
    { id: 3, fecha: '05/05/2025', cliente: 'Cliente A', estado: 'Rechazada', total: '26.500 $' },
    { id: 4, fecha: '05/05/2025', cliente: 'Cliente A', estado: 'Aprobada',  total: '26.500 $' },
];

const HistorialCotizaciones: React.FC = () => {
    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>Historial de Cotizaciones</h1>

                {/* chips */}
                <div style={styles.chipWrap}>
                    <div style={styles.chip}>
                        <div style={styles.chipIconBox}>
                            <FaCheck color="#111" />
                        </div>
                        <div style={styles.chipDetails}>
                        <strong>Cotizaciones</strong>
                        <span>aprobadas</span>
                        </div>
                    </div>
                    <div style={styles.chip}>
                        <div style={styles.chipIconBox}>
                            <FaClock color="#111"/>
                        </div>
                        <div style={styles.chipDetails}>
                        <strong>Cotizaciones</strong>
                        <span>Pendientes</span>
                        </div>
                    </div>
                    <div style={styles.chip}>
                        <div style={styles.chipIconBox}>
                            <FaTimes color="#111"/>
                        </div>
                        <div style={styles.chipDetails}>
                        <strong>Cotizaciones</strong>
                        <span>Rechazadas</span>
                        </div>
                    </div>
                </div>

                {/* tabla */}
                <table style={styles.table}>
                    <thead>
                    <tr>
                        <th style={styles.th}>Fecha</th>
                        <th style={styles.th}>Cliente</th>
                        <th style={styles.th}>Estado</th>
                        <th style={styles.th}>Total</th>
                    </tr>
                    </thead>
                    <tbody>
                    {dummyData.map((c) => (
                        <tr key={c.id}>
                            <td style={styles.td}>{c.fecha}</td>
                            <td style={styles.td}>{c.cliente}</td>
                            <td style={styles.td}>
                                <span style={badgeStyleForEstado(c.estado)}>{c.estado}</span>
                            </td>
                            <td style={styles.td}>{c.total}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const styles: Record<string, React.CSSProperties> = {
    container: {
        marginLeft: "180px", // ancho del sidebar
        marginTop: "70px",   // alto del header
        padding: "2rem",
        boxSizing: "border-box",
        minHeight: "calc(100vh - 70px)",
        backgroundColor: "#f5f5f5",
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: '2rem',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
    },
    title: {
        fontSize: 28,
        fontWeight: 700,
        marginBottom: 24,
    },
    chipWrap: {
        display: 'flex',
        gap: 24,
        marginBottom: 32,
    },
    chip: {
        display: 'flex',
        gap: 4,
        alignItems: 'flex-start',
        padding: 16,
        borderRadius: 8,
        border: '1px solid #E0E0E0',
        minWidth: 180,
        alignItems: 'center',
        gap: 8,
    },
    chipIconBox: {
        width: 36,
        height: 36,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        backgroundColor: '#F2F2F2',
    },
    chipDetails:{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        border: '0.1px solid #EAEAEA',
        borderRadius: '8px',

    },
    th: {
        textAlign: 'left' as const,
        padding: '0.75rem 1rem',
        backgroundColor: '#F3F3F3',
        fontWeight: 600,
        fontSize: 14,
    },
    td: {
        padding: '0.75rem 1rem',
        fontSize: 14,
        borderBottom: '1px solid #EAEAEA',
    },
    badge: {
        padding: '4px 10px',
        borderRadius: 6,
        fontSize: 12,
        fontWeight: 600,
    },
    aprobada: {
        backgroundColor: 'rgba(76, 175, 80, 0.15)',
        color: '#4CAF50',
    },
    pendiente: {
        backgroundColor: 'rgba(255, 193, 7, 0.15)',
        color: '#FFC107',
    },
    rechazada: {
        backgroundColor: 'rgba(229, 57, 53, 0.15)',
        color: '#E53935',
    },
};

const badgeStyleForEstado = (estado: Cotizacion['estado']): React.CSSProperties => ({
    ...styles.badge,
    ...(estado === 'Aprobada'
        ? styles.aprobada
        : estado === 'Pendiente'
            ? styles.pendiente
            : styles.rechazada),
});

export default HistorialCotizaciones;
