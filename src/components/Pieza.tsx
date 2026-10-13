"use client";

import { useState } from "react";
import type { Producto } from "@/lib/catalogo";
import { useCarrito } from "./Carrito";

export function Galeria({ fotos, alt }: { fotos: string[]; alt: string }) {
  const [sel, setSel] = useState(0);
  if (!fotos.length)
    return <div className="grid aspect-square place-items-center rounded-2xl border border-ink/10 bg-white text-ink/30">Foto próximamente</div>;
  return (
    <div className="space-y-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={fotos[sel]} alt={alt} className="aspect-square w-full rounded-2xl border border-ink/10 bg-white object-contain p-4" />
      {fotos.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {fotos.map((f, i) => (
            <button key={f} onClick={() => setSel(i)} aria-label={`Foto ${i + 1}`}
              className={`overflow-hidden rounded-lg border bg-white ${i === sel ? "border-ink ring-1 ring-ink" : "border-ink/10 hover:border-ink/40"}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f} alt="" className="aspect-square w-full object-contain p-1" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function AgregarAlPedido({ producto }: { producto: Producto }) {
  const { lineas, agregar, setAbierto } = useCarrito();
  const enPedido = lineas.find((l) => l.producto.sku === producto.sku)?.cantidad;
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <button onClick={() => agregar(producto)}
        className={`rounded-full px-6 py-3 font-bold transition ${enPedido ? "bg-ink text-white" : "bg-gold hover:bg-gold-deep"}`}>
        {enPedido ? `En pedido (${enPedido}) · sumar otra` : "Agregar al pedido"}
      </button>
      {enPedido && (
        <button onClick={() => setAbierto(true)} className="rounded-full border border-ink/20 px-6 py-3 font-semibold hover:bg-ink/5">
          Ver pedido
        </button>
      )}
    </div>
  );
}
