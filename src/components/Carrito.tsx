"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { NEGOCIO } from "@/config";
import { pesos, type Producto } from "@/lib/catalogo";

type Linea = { producto: Producto; cantidad: number };

type Ctx = {
  lineas: Linea[];
  abierto: boolean;
  setAbierto: (v: boolean) => void;
  agregar: (p: Producto) => void;
  cambiar: (sku: string, cantidad: number) => void;
  vaciar: () => void;
};

const CarritoCtx = createContext<Ctx | null>(null);
const CLAVE = "pggomas-pedido";

export function CarritoProvider({ children }: { children: ReactNode }) {
  const [lineas, setLineas] = useState<Linea[]>([]);
  const [abierto, setAbierto] = useState(false);
  const [cargado, setCargado] = useState(false);

  // el pedido queda guardado en el navegador si se cierra la página
  useEffect(() => {
    try {
      const s = localStorage.getItem(CLAVE);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (s) setLineas(JSON.parse(s));
    } catch {}
    setCargado(true);
  }, []);
  useEffect(() => {
    if (!cargado) return;
    try {
      localStorage.setItem(CLAVE, JSON.stringify(lineas));
    } catch {}
  }, [lineas, cargado]);

  const cambiar = (sku: string, cantidad: number) =>
    setLineas((ls) =>
      cantidad <= 0 ? ls.filter((l) => l.producto.sku !== sku) : ls.map((l) => (l.producto.sku === sku ? { ...l, cantidad } : l)),
    );
  const agregar = (p: Producto) =>
    setLineas((ls) =>
      ls.some((l) => l.producto.sku === p.sku)
        ? ls.map((l) => (l.producto.sku === p.sku ? { ...l, cantidad: l.cantidad + 1 } : l))
        : [...ls, { producto: p, cantidad: 1 }],
    );

  return (
    <CarritoCtx.Provider value={{ lineas, abierto, setAbierto, agregar, cambiar, vaciar: () => setLineas([]) }}>
      {children}
      <Panel />
    </CarritoCtx.Provider>
  );
}

export function useCarrito() {
  const c = useContext(CarritoCtx);
  if (!c) throw new Error("useCarrito fuera de CarritoProvider");
  return c;
}

export function BotonCarrito() {
  const { lineas, setAbierto } = useCarrito();
  const n = lineas.reduce((s, l) => s + l.cantidad, 0);
  return (
    <button
      onClick={() => setAbierto(true)}
      className="relative rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink/85"
    >
      Mi pedido
      {n > 0 && (
        <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-xs font-bold text-ink">
          {n}
        </span>
      )}
    </button>
  );
}

function mensaje(lineas: Linea[], nombre: string, localidad: string) {
  const total = lineas.reduce((s, l) => s + (l.producto.precio ?? 0) * l.cantidad, 0);
  const items = lineas.map(
    (l) =>
      `• ${l.cantidad} x ${l.producto.titulo} (${l.producto.sku})` +
      (NEGOCIO.mostrarPrecios && l.producto.precio ? ` - ${pesos(l.producto.precio * l.cantidad)}` : ""),
  );
  return [
    "¡Hola PGGOMAS! Quiero hacer este pedido:",
    "",
    ...items,
    ...(NEGOCIO.mostrarPrecios && total ? ["", `Total estimado: ${pesos(total)}`] : []),
    ...(nombre || localidad ? ["", nombre && `Nombre: ${nombre}`, localidad && `Localidad: ${localidad}`].filter((x) => x !== "") : []),
  ].join("\n");
}

function Panel() {
  const { lineas, abierto, setAbierto, cambiar, vaciar } = useCarrito();
  const [nombre, setNombre] = useState("");
  const [localidad, setLocalidad] = useState("");
  const total = lineas.reduce((s, l) => s + (l.producto.precio ?? 0) * l.cantidad, 0);
  const link = `https://wa.me/${NEGOCIO.whatsapp}?text=${encodeURIComponent(mensaje(lineas, nombre.trim(), localidad.trim()))}`;

  return (
    <div className={`fixed inset-0 z-50 ${abierto ? "" : "pointer-events-none"}`} aria-hidden={!abierto}>
      <div
        onClick={() => setAbierto(false)}
        className={`absolute inset-0 bg-ink/40 transition-opacity ${abierto ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-paper shadow-2xl transition-transform ${
          abierto ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
          <h2 className="text-lg font-bold">Mi pedido</h2>
          <button onClick={() => setAbierto(false)} className="text-2xl leading-none text-ink/50 hover:text-ink" aria-label="Cerrar">
            ×
          </button>
        </header>

        {lineas.length === 0 ? (
          <p className="p-5 text-ink/60">Todavía no agregaste piezas. Elegilas del catálogo y te armamos el pedido por WhatsApp.</p>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-ink/10 overflow-y-auto px-5">
              {lineas.map(({ producto: p, cantidad }) => (
                <li key={p.sku} className="flex gap-3 py-3">
                  {p.foto && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.foto} alt="" className="h-16 w-16 shrink-0 rounded-md border border-ink/10 bg-white object-contain" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium leading-snug">{p.titulo}</p>
                    <p className="text-xs text-ink/50">{p.sku}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <button onClick={() => cambiar(p.sku, cantidad - 1)} className="h-7 w-7 rounded border border-ink/20">−</button>
                      <span className="w-6 text-center tabular-nums">{cantidad}</span>
                      <button onClick={() => cambiar(p.sku, cantidad + 1)} className="h-7 w-7 rounded border border-ink/20">+</button>
                      {NEGOCIO.mostrarPrecios && p.precio && (
                        <span className="ml-auto text-sm font-semibold tabular-nums">{pesos(p.precio * cantidad)}</span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="space-y-3 border-t border-ink/10 p-5">
              {NEGOCIO.mostrarPrecios && total > 0 && (
                <p className="flex justify-between text-lg font-bold">
                  <span>Total estimado</span>
                  <span className="tabular-nums">{pesos(total)}</span>
                </p>
              )}
              <div className="grid grid-cols-2 gap-2">
                <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre (opcional)"
                  className="rounded-md border border-ink/15 bg-white px-3 py-2 text-sm" />
                <input value={localidad} onChange={(e) => setLocalidad(e.target.value)} placeholder="Localidad (opcional)"
                  className="rounded-md border border-ink/15 bg-white px-3 py-2 text-sm" />
              </div>
              <a href={link} target="_blank" rel="noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 font-semibold text-white transition hover:brightness-95">
                <IconoWhatsapp /> Enviar pedido por WhatsApp
              </a>
              <p className="text-center text-xs text-ink/50">Te confirmamos stock, precio final y envío por WhatsApp.</p>
              <button onClick={vaciar} className="w-full text-sm text-ink/50 underline-offset-2 hover:underline">Vaciar pedido</button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

export function IconoWhatsapp({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.75-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.04 21.5h-.01a9.43 9.43 0 0 1-4.8-1.31l-.35-.2-3.57.93.95-3.48-.22-.36A9.4 9.4 0 0 1 2.6 12C2.6 6.8 6.84 2.56 12.05 2.56a9.38 9.38 0 0 1 6.67 2.77 9.38 9.38 0 0 1 2.76 6.68c0 5.2-4.24 9.44-9.44 9.44zm8.03-17.47A11.27 11.27 0 0 0 12.04.7C5.8.7.72 5.78.72 12.02c0 2 .52 3.94 1.51 5.66L.62 23.5l5.95-1.56a11.3 11.3 0 0 0 5.47 1.4h.01c6.24 0 11.32-5.08 11.32-11.32 0-3.02-1.18-5.87-3.32-8z" />
    </svg>
  );
}
