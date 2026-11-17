/*
 * Configuración central del sitio.
 *
 * Para añadir una página nueva:
 *   1. Copia una página existente de la sección (p. ej. secciones/200-videojuegos/201.html)
 *      y renómbrala con su número (p. ej. 205.html). Cambia su atributo data-page.
 *   2. Añade su entrada en la lista `pages` de la sección correspondiente.
 *      El título, las estrellas, el menú de la sección y la navegación se generan solos.
 *
 * `rating` acepta valores de 1 a 5 en pasos de 0.5 (p. ej. 3.5 → ★★★½).
 */
window.TELETEXT_CONFIG = {
  siteName: "TELETEXTO RODRI",

  // Mensajes de la cinta superior (se ciclan de derecha a izquierda).
  tickerMessages: [
    "Bienvenido a mi rincón de Neocities",
    "Escribe un número de página (p. ej. 201) para saltar directamente",
    "Nuevas reseñas próximamente en las páginas 200, 300 y 400",
    "Gracias por tu visita"
  ],

  // Página del menú principal (sin canal).
  home: {
    title: "Menú principal",
    color: "blue",
    path: "index.html"
  },

  // Colores disponibles (paleta real de teletexto):
  // red, green, yellow, blue, magenta, cyan, white
  sections: [
    {
      number: 100,
      title: "Acerca de mí",
      color: "red",
      dir: "secciones/100-acerca-de-mi",
      pages: [
        { number: 101, title: "¿Quién soy?" },
        { number: 102, title: "Acerca del uso de IA" }
      ]
    },
    {
      number: 200,
      title: "Videojuegos",
      color: "green",
      dir: "secciones/200-videojuegos",
      pages: [
        { number: 201, title: "Videojuego de ejemplo 1", rating: 5 },
        { number: 202, title: "Videojuego de ejemplo 2", rating: 4.5 },
        { number: 203, title: "Videojuego de ejemplo 3", rating: 3 },
        { number: 204, title: "Videojuego de ejemplo 4", rating: 1.5 }
      ]
    },
    {
      number: 300,
      title: "Películas",
      color: "yellow",
      dir: "secciones/300-peliculas",
      pages: [
        { number: 301, title: "Película de ejemplo 1", rating: 4 },
        { number: 302, title: "Película de ejemplo 2", rating: 3.5 },
        { number: 303, title: "Película de ejemplo 3", rating: 2 },
        { number: 304, title: "Película de ejemplo 4", rating: 2.5 }
      ]
    },
    {
      number: 400,
      title: "Otros",
      color: "cyan",
      dir: "secciones/400-otros",
      pages: [
        { number: 401, title: "Reseña de ejemplo 1", rating: 5 },
        { number: 402, title: "Reseña de ejemplo 2", rating: 4 },
        { number: 403, title: "Reseña de ejemplo 3", rating: 3.5 },
        { number: 404, title: "Reseña de ejemplo 4", rating: 1 }
      ]
    }
  ]
};
