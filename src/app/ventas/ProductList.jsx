'use client'
import notImage from '@/styles/images/notImage.png';
import Image from "next/image";
import { useCart } from '@/context/CartContext.tsx'; // si ya lo tienes implementado
import { useState } from 'react';
import { mockProducts } from '@/mock/mockProducts';

const ProductList = () => {
    const { cart, addToCart, total, updateQuantity, clearCart } = useCart();
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('nombre');
    const filteredProducts = [...mockProducts]
        .filter(p => p.nombre.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            if (sortBy === 'nombre') return a.nombre.localeCompare(b.nombre);
            return a.precio - b.precio;
        })
    return (
        <div style={styles.containerStyle}>
            {/* IZQUIERDA */}
            <div style={styles.containerleft}>
                {/* Buscador y ordenar */}
                <div style={styles.containerInputSearch}>
                    <input
                        type="text"
                        placeholder="Buscar producto"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={styles.inputSearchStyle}
                    />
                    <select onChange={(e) => setSortBy(e.target.value, any)} style={styles.selectStyle}>
                        <option value="nombre">Nombre</option>
                        <option value="precio">Precio</option>
                    </select>
                </div>

                {/* Listado */}
                <div style={styles.containerListProducts}>
                    {filteredProducts.map((product) => (
                        <div key={product.sku} style={styles.cardProduct}>
                            <Image src={notImage} alt={product.nombre} width={80} height={80} />
                            <div style={{ flex: 1, marginLeft: '1rem' }}>
                                <h3 style={{ margin: 0 }}>{product.nombre}</h3>
                                <p style={{ margin: '0.2rem 0' }}>${product.precio.toLocaleString()}</p>
                                <p style={{ margin: '0.2rem 0' }}>Cantidad: {product.cantidad}</p>
                            </div>
                            <div>
                                <button
                                    style={styles.buttonAddCart}
                                    onClick={() => addToCart(product)}
                                >
                                    Agregar al carrito
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* DERECHA */}
            {/* --- CARRITO -------------------------------------------- */}
            <div style={styles.containerRight}>
                <h2 style={styles.cartTitle}>Carrito</h2>

                <div style={styles.cartItemsWrapper}>
                    {cart.length === 0 ? (
                        <p style={{color: '#777'}}>El carrito está vacío.</p>
                    ) : (
                        cart.map(item => (
                            <div key={item.sku} style={styles.cartItem}>
                                {/* parte izquierda: nombre y precio unitario */}
                                <div>
                                    <p style={styles.cartItemName}>{item.nombre}</p>
                                    <p style={styles.cartItemPrice}>${item.precio.toLocaleString()}</p>
                                </div>

                                {/* parte derecha: selector de cantidad + subtotal */}
                                <div style={styles.qtyBlock}>
                                    <button
                                        style={styles.qtyBtn}
                                        onClick={() => updateQuantity(item.sku, item.cantidad - 1)}
                                    >
                                        –
                                    </button>
                                    <span style={styles.qtyNumber}>{item.cantidad}</span>
                                    <button
                                        style={styles.qtyBtn}
                                        onClick={() => updateQuantity(item.sku, item.cantidad + 1)}
                                    >
                                        +
                                    </button>
                                </div>

                                <p style={styles.subtotal}>${(item.precio * item.cantidad).toLocaleString()}</p>
                            </div>
                        ))
                    )}
                </div>
                {cart.length > 0 ? (
                    <button onClick={clearCart} style={styles.clearCartBtn}>
                        Vaciar carrito
                    </button>):null
                }
                {/* total + botón */}
                {cart.length > 0 && (
                    <>
                        <div style={styles.totalRow}>
                            <span>Total:</span>
                            <span style={styles.totalNumber}>
          ${total.toLocaleString()}
        </span>
                        </div>

                        <button style={styles.orderBtn}>Realizar pedido</button>
                    </>
                )}
            </div>

        </div>
    );
};

export default ProductList;
const styles = {
    containerStyle: {
        marginLeft: "200px",
        marginTop: "90px",
        display: "flex",
        gap: "1rem",
        padding: "1rem",
    },
    containerleft: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: "8px",
        padding: "1rem",
    },
    containerRight: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: "8px",
        padding: "1rem",
    },
    containerInputSearch: {
        display: "flex",
        gap: "1rem",
        marginBottom: "1rem",
    },
    inputSearchStyle: {
        flex: 1,
        padding: "0.5rem",
        borderRadius: "4px",
        border: "1px solid #ccc",
    },
    selectStyle: {
        padding: "0.5rem",
        borderRadius: "4px",
        border: "1px solid #ccc",
    },
    cardProduct: {
        display: "flex",
        alignItems: "center",
        padding: "1rem",
        border: "1px solid #ccc",
        borderRadius: "8px",
        marginBottom: "1rem",
        backgroundColor: "#f9f9f9",
    },
    buttonAddCart: {
        padding: "0.5rem 1rem",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
    },
    containerCartList: {
        marginTop: "1rem",
    },
    cartTitle: {
        fontSize: '1.25rem',
        fontWeight: 600,
        marginBottom: '1rem',
    },
    cartItemsWrapper: {
        maxHeight: '60vh',
        overflowY: 'auto',
        marginBottom: '1rem',
    },
    cartItem: {
        display: 'grid',
        gridTemplateColumns: '1fr auto auto',
        alignItems: 'center',
        columnGap: '1rem',
        padding: '0.75rem 0',
        borderBottom: '1px solid #e5e5e5',
    },
    cartItemName: { fontWeight: 600, margin: 0 },
    cartItemPrice: { margin: 0, fontSize: '0.9rem', color: '#555' },
    qtyBlock: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
        background: '#f9f9f9',
        border: '1px solid #ddd',
        borderRadius: '4px',
        padding: '0 0.25rem',
    },
    qtyBtn: {
        background: 'transparent',
        border: 'none',
        fontSize: '1rem',
        width: '1.5rem',
        height: '1.5rem',
        cursor: 'pointer',
    },
    qtyNumber: {
        minWidth: '1.5rem',
        textAlign: 'center',
        fontSize: '0.9rem',
    },
    subtotal: {
        fontWeight: 500,
        fontSize: '0.95rem',
        textAlign: 'right',
    },
    totalRow: {
        display: 'flex',
        justifyContent: 'space-between',
        fontWeight: 600,
        fontSize: '1.1rem',
        borderTop: '1px solid #e5e5e5',
        paddingTop: '0.75rem',
        marginBottom: '1rem',
    },
    totalNumber: { fontWeight: 700 },
    orderBtn: {
        width: '100%',
        padding: '0.75rem',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        fontSize: '1rem',
        cursor: 'pointer',
    },
    clearCartBtn: {
        width: '100%',
        padding: '0.5rem',
        backgroundColor: '#e63946',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        marginTop: '1rem',
        cursor: 'pointer',
    }

};

