import type { Metadata } from "next";
import { Suspense } from "react";
import { Catalogo } from "@/components/Catalogo";

export const metadata: Metadata = { title: "Catálogo · PGGOMAS" };

export default function Page() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight">Catálogo</h1>
      <p className="mt-1 text-ink/60">Elegí las piezas, sumalas a tu pedido y mandalo por WhatsApp.</p>
      <Suspense>
        <Catalogo />
      </Suspense>
    </div>
  );
}
