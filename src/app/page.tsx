import Image from "next/image";
import Link from "next/link";
import { IconoWhatsapp } from "@/components/Carrito";
import { NEGOCIO } from "@/config";
import { categorias } from "@/lib/catalogo";

// Textos de prueba: revisar con la familia antes de publicar.
const RUBROS = [
  { titulo: "Repuestos de moto", texto: "Juntas, manchones, tacos de maza, filtros y pedalines para las motos más vendidas.", img: "/img/cat-motos.jpg", href: "/catalogo?c=motos" },
  { titulo: "Bieletas", texto: "Bieletas de barra estabilizadora para autos y camionetas. Próximamente en el catálogo online.", img: "/img/cat-bieletas.jpg", href: "#contacto" },
  { titulo: "Bujes, topes y soportes", texto: "Piezas de suspensión y tren delantero. Próximamente en el catálogo online.", img: "/img/cat-bujes.jpg", href: "#contacto" },
];

const PASOS = [
  { n: "1", titulo: "Elegí las piezas", texto: "Buscá por modelo o código en el catálogo y sumalas a tu pedido." },
  { n: "2", titulo: "Mandalo por WhatsApp", texto: "El pedido se arma solo. Lo revisás y lo enviás con un toque." },
  { n: "3", titulo: "Te confirmamos", texto: "Te respondemos con stock, precio final y la forma de envío o retiro." },
];

export default function Home() {
  const total = categorias.reduce((n, c) => n + c.productos.length, 0);
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="absolute -right-24 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-gold/90 sm:right-0" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:py-24 md:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="mb-4 inline-block rounded-full border border-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-gold">
              Fábrica en Córdoba · +40 años
            </p>
            <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
              Piezas de goma <span className="text-gold">directo de fábrica.</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-white/75">
              Fabricamos juntas, manchones, bieletas, bujes y soportes para motos, autos y camionetas. Elegí lo que necesitás y pedilo
              por WhatsApp.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/catalogo" className="rounded-full bg-gold px-6 py-3 font-bold text-ink transition hover:bg-gold-deep">
                Ver catálogo ({total} piezas)
              </Link>
              <a href={`https://wa.me/${NEGOCIO.whatsapp}`} target="_blank" rel="noreferrer"
                className="flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 font-semibold transition hover:bg-white/10">
                <IconoWhatsapp /> Consultanos
              </a>
            </div>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <Image src="/img/hero.jpg" alt="Juego de tacos de maza PGGOMAS" fill priority sizes="(min-width: 768px) 450px, 90vw"
              className="rounded-full object-cover shadow-2xl ring-8 ring-white" />
          </div>
        </div>
      </section>

      {/* DATOS */}
      <section className="border-b border-ink/10 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 text-center sm:grid-cols-4">
          {[
            ["+40", "años fabricando"],
            ["100%", "fabricación nacional"],
            ["3 meses", "de garantía de fábrica"],
            ["Todo el país", "envíos a coordinar"],
          ].map(([a, b]) => (
            <div key={b}>
              <p className="text-2xl font-extrabold text-swoosh sm:text-3xl">{a}</p>
              <p className="text-sm text-ink/60">{b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* RUBROS */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <h2 className="text-3xl font-extrabold tracking-tight">Qué fabricamos</h2>
        <p className="mt-2 max-w-xl text-ink/60">Piezas de goma y autopartes para reposición, hechas en nuestra planta de Villa Adela.</p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {RUBROS.map((r) => (
            <Link key={r.titulo} href={r.href} className="group overflow-hidden rounded-2xl border border-ink/10 bg-white transition hover:-translate-y-0.5 hover:shadow-lg">
              <div className="relative aspect-[4/3] bg-white">
                <Image src={r.img} alt="" fill sizes="(min-width: 768px) 360px, 90vw" className="object-contain p-4 transition group-hover:scale-105" />
              </div>
              <div className="border-t border-ink/5 p-5">
                <h3 className="text-lg font-bold">{r.titulo}</h3>
                <p className="mt-1 text-sm text-ink/60">{r.texto}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CÓMO PEDIR */}
      <section className="bg-gold">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-3xl font-extrabold tracking-tight">Cómo hacer tu pedido</h2>
          <ol className="mt-8 grid gap-6 md:grid-cols-3">
            {PASOS.map((p) => (
              <li key={p.n} className="rounded-2xl bg-white/60 p-6">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-ink font-bold text-gold">{p.n}</span>
                <h3 className="mt-4 text-lg font-bold">{p.titulo}</h3>
                <p className="mt-1 text-ink/70">{p.texto}</p>
              </li>
            ))}
          </ol>
          <Link href="/catalogo" className="mt-10 inline-block rounded-full bg-ink px-6 py-3 font-bold text-white transition hover:bg-ink/85">
            Empezar pedido
          </Link>
        </div>
      </section>

      {/* NOSOTROS */}
      <section id="nosotros" className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:py-20 md:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-white">
          <Image src="/img/fabrica.jpg" alt="" fill sizes="(min-width: 768px) 540px, 90vw" className="object-contain p-6" />
          {/* foto de prueba: reemplazar por una de la planta */}
        </div>
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Una fábrica familiar</h2>
          <p className="mt-4 text-ink/70">
            Hace más de 40 años que fabricamos piezas de goma en Córdoba. Empezamos abasteciendo a casas de repuestos y hoy también le
            vendemos directo a quien arregla su moto o su auto.
          </p>
          <p className="mt-3 text-ink/70">
            Controlamos cada pieza en planta y respondemos personalmente cada consulta. Si no encontrás lo que buscás, escribinos: es
            probable que lo tengamos o lo podamos fabricar.
          </p>
          <p className="mt-6 text-sm text-ink/40">Texto de prueba.</p>
        </div>
      </section>
    </>
  );
}
