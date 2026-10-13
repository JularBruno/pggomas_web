"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { NEGOCIO } from "@/config";
import Link from "next/link";
import { categorias, descuento, pesos } from "@/lib/catalogo";
import { useCarrito } from "./Carrito";

const normalizar = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export function Catalogo() {
  const sp = useSearchParams();
  const router = useRouter();
  const slug = sp.get("c") ?? categorias[0]?.slug;
  const categoria = categorias.find((c) => c.slug === slug) ?? categorias[0];
  const [tipo, setTipo] = useState<string>();
  const [q, setQ] = useState("");
  const { lineas, agregar, setAbierto } = useCarrito();

  const tipos = useMemo(() => [...new Set(categoria.productos.map((p) => p.tipo))], [categoria]);
  const productos = useMemo(() => {
    const qq = normalizar(q.trim());
    return categoria.productos.filter(
      (p) => (!tipo || p.tipo === tipo) && (!qq || normalizar(`${p.titulo} ${p.sku} ${p.codigo}`).includes(qq)),
    );
  }, [categoria, tipo, q]);

  const elegirCategoria = (s: string) => {
    setTipo(undefined);
    router.replace(`/catalogo?c=${s}`, { scroll: false });
  };

  return (
    <>
      <div className="sticky top-[57px] z-30 -mx-4 mt-6 space-y-3 border-b border-ink/10 bg-paper/95 px-4 py-3 backdrop-blur">
        <div className="flex flex-wrap gap-2">
          {categorias.map((c) => (
            <button key={c.slug} onClick={() => elegirCategoria(c.slug)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${c.slug === categoria.slug ? "bg-ink text-white" : "bg-white text-ink ring-1 ring-ink/15 hover:ring-ink/40"}`}>
              {c.nombre}
            </button>
          ))}
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por moto, modelo o código…"
            className="ml-auto w-full rounded-full border border-ink/15 bg-white px-4 py-1.5 text-sm sm:w-72" />
        </div>
        {tipos.length > 1 && (
          <div className="flex flex-wrap gap-2 text-sm">
            {[undefined, ...tipos].map((t) => (
              <button key={t ?? "todos"} onClick={() => setTipo(t)}
                className={`rounded-full px-3 py-1 transition ${tipo === t ? "bg-gold font-semibold" : "text-ink/60 hover:text-ink"}`}>
                {t ?? "Todos"}
              </button>
            ))}
          </div>
        )}
      </div>

      {productos.length === 0 ? (
        <p className="py-16 text-center text-ink/60">No encontramos piezas con esa búsqueda. Escribinos por WhatsApp y te ayudamos.</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {productos.map((p) => {
            const enPedido = lineas.find((l) => l.producto.sku === p.sku)?.cantidad;
            const pct = NEGOCIO.mostrarPrecios ? descuento(p) : null;
            return (
              <article key={p.sku} className="flex flex-col overflow-hidden rounded-xl border border-ink/10 bg-white">
                <Link href={`/p/${p.sku}`} className="relative aspect-square bg-white">
                  {pct && <EtiquetaDescuento pct={pct} className="absolute left-2 top-2" />}
                  {p.foto ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.foto} alt={p.titulo} loading="lazy" className="h-full w-full object-contain p-2" />
                  ) : (
                    <div className="grid h-full place-items-center text-sm text-ink/30">Foto próximamente</div>
                  )}
                </Link>
                <div className="flex flex-1 flex-col gap-2 p-3">
                  <h2 className="text-sm font-medium leading-snug">
                    <Link href={`/p/${p.sku}`} className="hover:underline">{p.titulo}</Link>
                  </h2>
                  <p className="text-xs text-ink/40">Cód. {p.codigo || p.sku}</p>
                  <div className="mt-auto flex items-center justify-between gap-2 pt-1">
                    {NEGOCIO.mostrarPrecios && p.precio ? (
                      <span className="flex flex-col leading-tight">
                        {pct && <span className="text-xs text-ink/40 line-through tabular-nums">{pesos(p.precioLista!)}</span>}
                        <span className={`font-bold tabular-nums ${pct ? "text-sky-700" : ""}`}>{pesos(p.precio)}</span>
                      </span>
                    ) : (
                      <span className="text-sm text-ink/50">Consultar</span>
                    )}
                    <button onClick={() => agregar(p)}
                      className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${enPedido ? "bg-ink text-white" : "bg-gold hover:bg-gold-deep"}`}>
                      {enPedido ? `En pedido (${enPedido}) +` : "Agregar"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {lineas.length > 0 && (
        <button onClick={() => setAbierto(true)}
          className="fixed bottom-5 left-1/2 z-30 -translate-x-1/2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-white shadow-xl sm:hidden">
          Ver pedido ({lineas.reduce((s, l) => s + l.cantidad, 0)})
        </button>
      )}
    </>
  );
}

export function EtiquetaDescuento({ pct, className = "" }: { pct: number; className?: string }) {
  return <span className={`rounded-md bg-sky-500 px-2 py-0.5 text-xs font-extrabold text-white ${className}`}>−{pct}% OFF</span>;
}
