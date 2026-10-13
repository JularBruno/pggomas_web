import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Archivo } from "next/font/google";
import { BotonCarrito, CarritoProvider } from "@/components/Carrito";
import { NEGOCIO } from "@/config";
import "./globals.css";

const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PGGOMAS · Piezas de goma directo de fábrica",
  description: "Fabricantes de piezas de goma y autopartes en Córdoba desde hace más de 40 años.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${archivo.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <CarritoProvider>
          <header className="sticky top-0 z-40 border-b border-ink/10 bg-white/90 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-2.5">
              <Link href="/" className="flex items-center gap-2">
                <Image src="/img/logo.png" alt="" width={40} height={35} priority />
                <span className="text-lg font-extrabold tracking-tight">PGGOMAS</span>
              </Link>
              <nav className="ml-auto hidden gap-6 text-sm font-medium sm:flex">
                <Link href="/catalogo" className="hover:text-swoosh">Catálogo</Link>
                <Link href="/#nosotros" className="hover:text-swoosh">Nosotros</Link>
                <Link href="/#contacto" className="hover:text-swoosh">Contacto</Link>
              </nav>
              <div className="ml-auto sm:ml-0">
                <BotonCarrito />
              </div>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer id="contacto" className="bg-ink text-white/80">
            <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
              <div>
                <p className="text-lg font-extrabold text-white">PGGOMAS</p>
                <p className="mt-2 text-sm">Fabricantes de piezas de goma y autopartes en Córdoba desde hace más de 40 años.</p>
              </div>
              <div className="text-sm">
                <p className="mb-2 font-semibold text-white">Contacto</p>
                <p>WhatsApp {NEGOCIO.whatsappVisible}</p>
                <p>{NEGOCIO.email}</p>
                <p>{NEGOCIO.direccion}</p>
                <p>{NEGOCIO.horario}</p>
              </div>
              <div className="text-sm">
                <p className="mb-2 font-semibold text-white">También estamos en</p>
                <a href={NEGOCIO.mercadoLibre} target="_blank" rel="noreferrer" className="underline-offset-2 hover:underline">
                  Mercado Libre
                </a>
              </div>
            </div>
            <p className="border-t border-white/10 py-4 text-center text-xs text-white/40">© PGGOMAS · Villa Adela, Córdoba</p>
          </footer>
        </CarritoProvider>
      </body>
    </html>
  );
}
