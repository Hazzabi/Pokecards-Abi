# Entrega Pagina web con llamados a API - PokeApi

## Vista al trabajo
Despliegue en el siguiente link: https://pokecard-abi.netlify.app/
## Api usada
- api: [pokeapi](https://pokeapi.co/)
- endpoint base: `https://pokeapi.co/api/v2/pokemon/`

## Uso de fuente
la fuente esta en la carpeta `assets`:
- `Pokemon Solid.ttf`

En `estilos.css` se uso `@font-face` para cargar esa fuente local.
luego se aplico al `h1` con la clase `.titulo-principal`.
tambien se puso un color rosa palo para que combine con el fondo.

## Creacion de Cards
las cartas se crean con javascript en `script.js`.
y se insertan en el html con los siguientes pasos:
1. Pongo una lista de nombres de pokemon.
2. Por cada nombre, se hace `fetch` a la api.
3. Con los datos recibidos, se crean etiquetas con `createElement`.
4. se mete cada carta dentro del contenedor `#contenedor-cartas`.

en cada carta se muestra:
- nombre
- hp
- tipos
- imagen
- altura y peso
- ataques
- stats basicas
- habilidad principal y numero de pokedex

## Estructura del proyecto
- `index.html`: estructura base de la pagina y el `h1`.
- `estilos.css`: colores, fuente, diseno de cartas y responsive.
- `script.js`: peticiones a la api y creacion de cartas.
- `assets/`: icono, logo y fuente.


