# PGGOMAS web

Landing de la marca y catálogo con pedido por WhatsApp. Es un sitio estático: todas las páginas, incluida la de cada pieza, se generan en el build. Se despliega en Vercel.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de producción
```

## Páginas

- `/`: landing (rubros, cómo pedir, nosotros, contacto).
- `/catalogo`: catálogo por categoría y tipo, con buscador. `?c=motos` abre una categoría.
- `/p/[sku]`: ficha de la pieza con fotos, descripción, precio y descuento.
- "Mi pedido" es un carrito que se guarda en el navegador. Arma el mensaje y lo manda por WhatsApp.

## Datos

- **Contacto y opciones:** `src/config.ts`. El WhatsApp es provisorio (el de Bruno), y la dirección, el horario y el link a ML están "a confirmar". `mostrarPrecios` muestra u oculta los precios.
- **Catálogo:** `src/data/catalogo.json`. No se edita a mano: lo genera el admin (proyecto `../admin`, local) con "Exportar a la web" a partir de las planillas de ML. Trae SKU, título, tipo, precio, precio de lista si está en promo, fotos y descripción. No trae stock ni notas internas.
- **Fotos de las piezas:** son las URLs de Mercado Libre (`mlstatic.com`). Las de la landing están en `public/img/` y son de prueba, igual que los textos.

## Actualizar el catálogo publicado

1. En el admin, tocar "Exportar a la web".
2. Commitear `src/data/catalogo.json` y pushear.
3. Vercel vuelve a desplegar solo.
