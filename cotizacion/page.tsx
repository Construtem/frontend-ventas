export default function CotizacionPage() {
return (
  <header 
  style={{ backgroundColor: "#2D2D2D" }}
  className="text-white"> {/*Adorno de arriba*/}

    <nav className="container mx-auto p-4"></nav> {/*Inicio del contenerdor de todas las cosas en el cuadro*/}
    <main className="bg-[#F7F7F7] min-h-screen p-8 text-[#222222]"> 
      <div className="bg-white shadow-lg p-10 rounded-lg max-w-4xl mx-auto text-black">

        <div className="mb-6">
          <p className="text-xl font-semibold text-[#222222]">Confirmar la orden</p> <p><br /></p>
          <p className="text-base font-semibold text-[#222222]">boleta/factura</p> 
        </div>


        {[
          ["Número de orden", "1234567"],
          ["Fecha", "12-34-5678"],
        ].map(([label, value]) => (
          <div key={label} className="flex items-center space-x-2 mb-4">
            <div className="bg-gray-100 p-3 rounded w-[170px]">
              <p className="text-base font-semibold text-[#222222]">{label}:</p>
            </div>
            <span className="text-base text-[#222222]">{value}</span>
          </div>
        ))}


        <div className="p-6 bg-gray-50 rounded shadow-inner mb-6">
          <h2 className="text-xl font-bold mb-4 text-[#222222]">Producto 1</h2>
          <table className="w-full border-separate border-spacing-4">
            <tbody>
              <tr className="bg-white rounded-lg">

                <td className="w-1/3 text-center">
                  <img
                    src="https://cdn-icons-png.freepik.com/512/8488/8488381.png"
                    alt="Producto"
                    className="w-24 h-24 object-contain mx-auto"
                  />
                </td>

                <td className="align-top">
                  <div className="text-left">
                    <p className="text-base font-semibold text-[#222222]">Producto 1</p>
                    <p className="text-sm text-[#222222]">Precio: <span className="font-medium text-[#222222]">$00.000</span></p>
                    <p className="text-sm text-[#222222]">Impuestos: <span className="font-medium text-[#222222]">$0.000</span></p>
                    <p className="text-sm text-[#222222]">Cantidad: <span className="font-medium text-[#222222]">1</span></p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {[
          ["Precio total", "$00.000"],
          ["Descuentos", "$00.000"],
          ["Costo transporte", "$00.000"],
          ["Total impuestos", "$00.000"],
          ["Monto total", "$00.000"],
          ["Método de pago", "Efectivo, Tarjeta..."],
        ].map(([label, value]) => (
          <div key={label} className="flex items-center space-x-2 mb-4">
            <div className="bg-gray-100 p-3 rounded w-[170px]">
              <p className="text-base font-semibold text-[#222222]">{label}:</p>
            </div>
            <span className="text-base text-[#222222]">{value}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-8 mt-10">   {/*Posicion botones*/}
        <button                    
          className="rounded-full px-11 py-4 text-white bg-[#FF7300] hover:bg-orange-700 cursor-pointer"> 
          Confirmar
        </button>                                         {/*Fin boton naranjo confirmar*/}
        <button 
          className="rounded-full px-11 py-4 text-white bg-[#5C5C5C] hover:bg-gray-700 cursor-pointer"> 
          Atrás
        </button>                                         {/*Fin boton gris atras*/}
      </div>   
    </main>

  </header>
  );
}

