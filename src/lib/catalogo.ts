// Lo genera el admin ("Exportar a la web") a partir de las planillas de ML.
import datos from "@/data/catalogo.json";

export type Producto = {
  sku: string;
  codigo: string;
  titulo: string;
  tipo: string;
  precio: number | null; // el que se cobra (con promo si tiene)
  precioLista?: number | null; // solo si está en promo: se muestra tachado
  foto: string | null;
  fotos: string[];
  descripcion: string;
};

export type Categoria = { slug: string; nombre: string; descripcion: string; productos: Producto[] };

export const categorias = datos.categorias as Categoria[];

export const productos = categorias.flatMap((c) => c.productos.map((p) => ({ ...p, categoria: c })));

/** Porcentaje de descuento redondeado, o null si no está en promo. */
export const descuento = (p: Producto) =>
  p.precioLista && p.precio && p.precio < p.precioLista ? Math.round((1 - p.precio / p.precioLista) * 100) : null;

export const pesos = (n: number) =>
  n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
