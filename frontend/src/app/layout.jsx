import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';
import { Providers } from './providers';
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Deoxy Academia - Sistema de Gestión',
  description: 'Sistema de gestión de inventario y producción para Deoxy Academia',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${inter.className} antialiased`}>
      <Providers>{children}</Providers>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}