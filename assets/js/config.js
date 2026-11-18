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
  siteName: "CANAL RODRI",

  // Mensajes de la cinta superior (se ciclan de derecha a izquierda).
  tickerMessages: [
    "Qué frío hace aquí en la cima",
    "Arriba el Cruz Azul",
    "Anúnciate aquí",
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
        { number: 201, title: "Ghost of Yotei", rating: 4.5 },
        { number: 202, title: "Tomodachi Life", rating: 4 },
        { number: 203, title: "Kirby Air Riders", rating: 4.5 },
        { number: 204, title: "Pokemon Brilliant Diamond", rating: 2.5 }
      ]
    },
    {
      number: 300,
      title: "Películas",
      color: "yellow",
      dir: "secciones/300-peliculas",
      pages: [
        { number: 301, title: "Ceniza en la boca", rating: 2.5 },
        { number: 302, title: "Resident Evil", rating: 4 },
        { number: 303, title: "Sleep", rating: 3.5 },
        { number: 304, title: "En el camino", rating: 3 }
      ]
    },
    {
      number: 400,
      title: "Otros",
      color: "cyan",
      dir: "secciones/400-otros",
      pages: [
        { number: 401, title: "Muse", rating: 4.5 },
        { number: 402, title: "We3", rating: 4 },
        { number: 403, title: "9060", rating: 4.5 },
        { number: 404, title: "Sushi Go!", rating: 4 }
      ]
    }
  ]
};
