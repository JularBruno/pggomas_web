import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AgregarAlPedido, Galeria } from "@/components/Pieza";
import { EtiquetaDescuento } from "@/components/Catalogo";
import { NEGOCIO } from "@/config";
import { descuento, pesos, productos } from "@/lib/catalogo";

// una página estática por pieza del catálogo
export function generateStaticParams() {
  return productos.map((p) => ({ sku: p.sku }));
}

// al pedido (que se guarda en el navegador) va solo el producto
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sinCategoria = ({ categoria, ...p }: (typeof productos)[number]) => p;

const buscar = (sku: string) => productos.find((p) => p.sku === decodeURIComponent(sku));

export async function generateMetadata({ params }: PageProps<"/p/[sku]">): Promise<Metadata> {
  const p = buscar((await params).sku);
  return p ? { title: `${p.titulo} · PGGOMAS`, description: p.descripcion.split("\n")[0] } : {};
}

export default async function Page({ params }: PageProps<"/p/[sku]">) {
  const p = buscar((await params).sku);
  if (!p) notFound();
  const pct = NEGOCIO.mostrarPrecios ? descuento(p) : null;
  const fotos = p.fotos.length ? p.fotos : p.foto ? [p.foto] : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="text-sm text-ink/50">
        <Link href={`/catalogo?c=${p.categoria.slug}`} className="hover:text-ink hover:underline">
          ← {p.categoria.nombre} / {p.tipo}
        </Link>
      </nav>
      <div className="mt-4 grid gap-8 md:grid-cols-2">
        <Galeria fotos={fotos} alt={p.titulo} />
        <div>
          <h1 className="text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">{p.titulo}</h1>
          <p className="mt-1 text-sm text-ink/40">Cód. {p.codigo || p.sku}</p>
          {NEGOCIO.mostrarPrecios && p.precio ? (
            <div className="mt-5">
              {pct && (
                <p className="flex items-center gap-2">
                  <span className="text-ink/40 line-through tabular-nums">{pesos(p.precioLista!)}</span>
                  <EtiquetaDescuento pct={pct} />
                </p>
              )}
              <p className={`text-3xl font-extrabold tabular-nums ${pct ? "text-sky-700" : ""}`}>{pesos(p.precio)}</p>
            </div>
          ) : (
            <p className="mt-5 text-ink/60">Precio a consultar</p>
          )}
          <AgregarAlPedido producto={sinCategoria(p)} />
          <p className="mt-3 text-sm text-ink/50">Te confirmamos stock, precio final y envío por WhatsApp.</p>
          {p.descripcion && <Descripcion texto={p.descripcion} />}
        </div>
      </div>
    </div>
  );
}

// la descripción viene en texto plano de ML: títulos en mayúsculas y listas con "- "
function Descripcion({ texto }: { texto: string }) {
  return (
    <div className="mt-8 space-y-4 border-t border-ink/10 pt-6 text-ink/80">
      {texto.split(/\n\s*\n/).map((bloque, i) => {
        const lineas = bloque.split("\n").map((l) => l.trim()).filter(Boolean);
        const titulo = lineas[0] && lineas[0] === lineas[0].toUpperCase() && /[A-ZÁÉÍÓÚÑ]/.test(lineas[0]) ? lineas.shift() : undefined;
        const items = lineas.filter((l) => l.startsWith("- "));
        return (
          <section key={i}>
            {titulo && <h2 className="mb-1 text-sm font-bold uppercase tracking-wide text-ink">{titulo}</h2>}
            {items.length === lineas.length && items.length ? (
              <ul className="list-disc space-y-0.5 pl-5">
                {items.map((l, j) => <li key={j}>{l.slice(2)}</li>)}
              </ul>
            ) : (
              lineas.map((l, j) => <p key={j}>{l}</p>)
            )}
          </section>
        );
      })}
    </div>
  );
}
