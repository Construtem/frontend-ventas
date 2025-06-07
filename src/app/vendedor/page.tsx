// src/app/usuario/vendedor.tsx

export default function Vendedor() {
    return (
        <div className="ml-[180px] mt-[70px] p-8 min-h-[calc(100vh-70px)] bg-gray-100">
            <div style={cardStyle}>
                <h1 style={words}>Bienvenido, Vendedor</h1>
            </div>
        </div>
    );
}

const cardStyle: React.CSSProperties = {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "3rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};

const words: React.CSSProperties = {
    fontSize: "1.875rem",
    fontWeight: "semibold",
    fontFamily: 'Montserrat, sans-serif',
};