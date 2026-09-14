# DERMALYSSE · Club de Socias

Plataforma privada para socias de Dermalysse.

## Identidad visual actual

- **Fondo principal:** Crema `#FDFBD4`
- **Detalles/acentos:** Beige `#E0CD95` y Beige oscuro `#D4BF6E`
- **Texto:** Café oscuro `#2D2818`
- **Tipografía:** Fraunces (serif bold moderna) + Jost (sans)

## Curso inicial y membresía

El curso inicial es **Uso de Tecnologías Avanzadas en Cosmiatría**, identificado por `course-uso-de-tecnologias-avanzadas-en-cosmiatria`. Todas sus clases excepto la última están disponibles gratis para personas registradas. Un curso de cero o una clase no concede ninguna clase gratuita. La última clase y todos los demás cursos requieren membresía; se mantienen las reglas de publicación y disponibilidad.

`initial-course-policy.js` contiene la misma política que el backend `dermalysse-webhook`. El ID se mantiene estable al filtrar o reordenar el catálogo. Las flags antiguas `isPreview` no autorizan otras clases. Los archivos de `data/` sirven como respaldo; el portal también carga el catálogo de Firestore.

El portal usa autenticación Firebase real. Las clases solicitan autorización en `POST /bunny/playback`. El backend acredita progreso mediante `POST /courses/progress`, incluido el tramo gratuito. Los certificados requieren completar el curso. La protección reside en el backend: coordina su despliegue con el portal.

## Bienvenida

El recorrido `membership-tour.js` y su CSS se montan después del acceso. Se puede saltar, cerrar con Escape o repetir desde el botón Recorrido. Su finalización se guarda por usuario y marca en el navegador. El enlace `?auth=register&course=initial` abre el registro y dirige al curso inicial después del acceso.

El login describe beneficios. Los precios y controles de pago se muestran en Mi Suscripción. `catalogo.html` es una venta independiente de un curso y conserva su flujo existente.

## Verificación

Ejecuta `node --test` para probar el reproductor con cursos de 0, 1, 2 y 8 clases, otros cursos, membresía y flags antiguas, además de la sintaxis del JavaScript inline. Para pruebas visuales usa un servidor HTTP local con Firebase/backend simulados; no hace falta escribir cuentas o pagos reales.

## Despliegue en GitHub Pages

Sube el contenido a tu repositorio → Settings → Pages → Source: `main / root`

---

Diseñado por **TEC CAPITAL** para Dermalysse.
