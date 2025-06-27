// src/app/layout.tsx
import './globals.css';
import Header from "@/components/Header";                    // <--- add this

export const metadata = {
  title: 'Mi App',
  description: 'CRM Ventas',


};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="es">
      <body className="bg-gray-100">
      <Header/>
              {children}
      </body>
      </html>
  );
}
