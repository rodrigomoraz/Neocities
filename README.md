# Teletexto Rodri

Página personal para [Neocities](https://neocities.org) con estética de teletexto.
Hecha solo con HTML, CSS y JavaScript estándar (sin dependencias ni paso de compilación).

## Estructura

```
index.html                     Menú principal (sin canal)
assets/
  css/teletext.css             Estilos comunes
  js/config.js                 Configuración: secciones, páginas, calificaciones y mensajes de la cinta
  js/teletext.js               Genera cabecera (fecha/hora, cinta, título), menús y navegación
secciones/
  100-acerca-de-mi/            Canal 100 → index.html (menú) + 101.html, 102.html…
  200-videojuegos/             Canal 200 → index.html (menú) + 201.html…
  300-peliculas/               Canal 300 → index.html (menú) + 301.html…
  400-otros/                   Canal 400 → index.html (menú) + 401.html…
```

| Sección        | Canal | Color    |
| -------------- | ----- | -------- |
| Menú principal | —     | Azul     |
| Acerca de mí   | 100   | Rojo     |
| Videojuegos    | 200   | Verde    |
| Películas      | 300   | Amarillo |
| Otros          | 400   | Cian     |

El color del texto de la barra de título y de los botones (blanco o negro) se elige
automáticamente según el contraste con el color de fondo.

## Añadir una reseña

1. Copia una página de la sección, p. ej. `secciones/200-videojuegos/201.html` → `205.html`,
   cambia `data-page="205"` en `<body>` y escribe el contenido dentro de `<article>`.
2. Añade la entrada en `assets/js/config.js`:

   ```js
   { number: 205, title: "Nombre del juego", rating: 3.5 }
   ```

   El título se mostrará como `Nombre del juego - ★★★½`, y la página aparecerá
   automáticamente en el menú de la sección.

Los mensajes de la cinta se editan en `tickerMessages` dentro de `config.js`.

## Controles (como un mando de televisión)

| Tecla     | Acción                                                                 |
| --------- | ---------------------------------------------------------------------- |
| ◄ / ►     | Página anterior / siguiente (menú → 100 → 101 → 102 → 200 → 201 …, cíclico) |
| ▲ / ▼     | Elegir una opción del menú o de los botones de sección                 |
| Espacio   | Abrir la opción elegida                                               |
| 0-9       | Teclear un número de tres cifras (p. ej. `302`) para saltar a esa página |

El orden de ◄ ► sigue el orden de `config.js`. Las páginas también se navegan con ratón,
pantalla táctil o Tab/Enter.

## Vista previa local

Abre `index.html` directamente en el navegador, o sirve la carpeta:

```sh
python3 -m http.server
```

## Publicar

Sube el contenido de la carpeta (excepto `README.md` y `.git`) a Neocities, o usa la
[CLI de Neocities](https://neocities.org/cli): `neocities push .`
