// src/app/layout.tsx
import {CartProvider} from "@/context/CartContext";
import {LoginProvider} from "@/context/LoginContext";
import {CustomerProvider} from "@/context/ClienteContext";
import './globals.css';                    // <--- add this

export const metadata = {
  title: 'Mi App',
  description: 'Dashboard admin',


};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="es">
      <body className="bg-gray-100">
      <LoginProvider>
          <CustomerProvider>
          <CartProvider>
              {children}
          </CartProvider>
          </CustomerProvider>
      </LoginProvider>
      </body>
      </html>
  );
}
