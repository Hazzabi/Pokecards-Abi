// lista a elegir de pokemones
const nombresPokemon = [
  "gardevoir",
  "altaria",
  "espeon",
  "eevee",
  "sylveon",
  "umbreon",
  "glaceon",
  "mew",
  "chikorita",
  "sprigatito",
  "lapras",
  "leafeon",
  "shaymin-land",
  "tinkaton",
  "ampharos",
  "mimikyu-disguised"
];

// url base de la api
const urlApi = "https://pokeapi.co/api/v2/pokemon/";

// traduccion de tipos a clases para poder colorear las cards en css.
const clasesTipo = {
  normal: "tipo-normal",
  fire: "tipo-fuego",
  water: "tipo-agua",
  grass: "tipo-planta",
  electric: "tipo-electrico",
  ice: "tipo-hielo",
  fighting: "tipo-lucha",
  poison: "tipo-veneno",
  ground: "tipo-tierra",
  flying: "tipo-volador",
  psychic: "tipo-psiquico",
  bug: "tipo-bicho",
  rock: "tipo-roca",
  ghost: "tipo-fantasma",
  dragon: "tipo-dragon",
  dark: "tipo-siniestro",
  steel: "tipo-acero",
  fairy: "tipo-hada"
};

// traduccion de tipos para mostrarlos a español
const textoTipo = {
  normal: "normal",
  fire: "fuego",
  water: "agua",
  grass: "planta",
  electric: "electrico",
  ice: "hielo",
  fighting: "lucha",
  poison: "veneno",
  ground: "tierra",
  flying: "volador",
  psychic: "psiquico",
  bug: "bicho",
  rock: "roca",
  ghost: "fantasma",
  dragon: "dragon",
  dark: "siniestro",
  steel: "acero",
  fairy: "hada"
};

// contenedor donde se agregaran las cartas
const contenedorCartas = document.getElementById("contenedor-cartas");

// al iniciar la pagina, pedimos los pokemones de la lista
cargarPokemon();

// obtengo datos de la api y luego creo cards
async function cargarPokemon() {
  for (let i = 0; i < nombresPokemon.length; i++) {
    const nombre = nombresPokemon[i];
    const pokemon = await obtenerPokemon(nombre);

    if (pokemon) {
      const carta = crearCartaPokemon(pokemon);
      contenedorCartas.appendChild(carta);
    }
  }
}

// pido el pokemon y si da algun error lo evito para que no falle toda la pagina
async function obtenerPokemon(nombre) {
  try {
    const respuesta = await fetch(urlApi + nombre);
    if (!respuesta.ok) {
      throw new Error("pokemon no encontrado: " + nombre);
    }
    return await respuesta.json();
  } catch (error) {
    console.warn(error.message);
    return null;
  }
}

// creo la card, colocando etiquetas de html con createElement
function crearCartaPokemon(pokemon) {
  const carta = document.createElement("article");
  const tipoPrincipal = pokemon.types[0].type.name;
  const claseTipo = clasesTipo[tipoPrincipal] || "tipo-normal";
  carta.className = "carta-pokemon " + claseTipo;

  const encabezado = document.createElement("div");
  encabezado.className = "encabezado-carta";

  const nombre = document.createElement("h2");
  nombre.className = "nombre-pokemon";
  nombre.textContent = limpiarNombre(pokemon.name);

  const hp = document.createElement("span");
  hp.className = "hp-pokemon";
  hp.textContent = "HP " + obtenerStat(pokemon, "hp");

  encabezado.appendChild(nombre);
  encabezado.appendChild(hp);

  const lineaTipos = document.createElement("div");
  lineaTipos.className = "linea-tipos";
  for (let i = 0; i < pokemon.types.length; i++) {
    const tipo = pokemon.types[i];
    const chip = document.createElement("span");
    chip.className = "chip-tipo";
    chip.textContent = textoTipo[tipo.type.name] || tipo.type.name;
    lineaTipos.appendChild(chip);
  }

  const marcoImagen = document.createElement("div");
  marcoImagen.className = "marco-imagen";

  const imagen = document.createElement("img");
  imagen.className = "imagen-pokemon";
  imagen.src = pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default;
  imagen.alt = "imagen de " + limpiarNombre(pokemon.name);

  marcoImagen.appendChild(imagen);

  const infoBasica = document.createElement("p");
  infoBasica.className = "info-basica";
  infoBasica.textContent = "altura: " + pokemon.height / 10 + " m  -  peso: " + pokemon.weight / 10 + " kg";

  const bloqueAtaques = document.createElement("section");
  bloqueAtaques.className = "bloque-ataques";

  const tituloAtaques = document.createElement("p");
  tituloAtaques.className = "titulo-bloque";
  tituloAtaques.textContent = "ataques";
  bloqueAtaques.appendChild(tituloAtaques);

  const ataque1 = crearFilaAtaque(
    obtenerNombreMovimiento(pokemon, 0, "golpe basico"),
    Math.max(20, Math.round(obtenerStat(pokemon, "attack") * 0.55))
  );
  const ataque2 = crearFilaAtaque(
    obtenerNombreMovimiento(pokemon, 1, "energia lunar"),
    Math.max(20, Math.round(obtenerStat(pokemon, "special-attack") * 0.55))
  );
  bloqueAtaques.appendChild(ataque1);
  bloqueAtaques.appendChild(ataque2);

  const bloqueStats = document.createElement("div");
  bloqueStats.className = "bloque-stats";
  bloqueStats.appendChild(crearMiniDato("atk", obtenerStat(pokemon, "attack")));
  bloqueStats.appendChild(crearMiniDato("def", obtenerStat(pokemon, "defense")));
  bloqueStats.appendChild(crearMiniDato("vel", obtenerStat(pokemon, "speed")));

  const pieCarta = document.createElement("div");
  pieCarta.className = "pie-carta";
  pieCarta.appendChild(crearDato("habilidad", obtenerNombreHabilidad(pokemon)));
  pieCarta.appendChild(crearDato("nº pokedex", "#" + pokemon.id));

  carta.appendChild(encabezado);
  carta.appendChild(lineaTipos);
  carta.appendChild(marcoImagen);
  carta.appendChild(infoBasica);
  carta.appendChild(bloqueAtaques);
  carta.appendChild(bloqueStats);
  carta.appendChild(pieCarta);

  return carta;
}

// muestro nombres mas limpios
function limpiarNombre(nombre) {
  return nombre.replace("-land", "").replace("-disguised", "");
}

// limpio el texto que viene con guiones de la api
function limpiarNombrePokemonApi(texto) {
  return texto.split("-").join(" ");
}

// saca un stat por nombre (hp, attack, defense, etc)
function obtenerStat(pokemon, nombreStat) {
  for (let i = 0; i < pokemon.stats.length; i++) {
    if (pokemon.stats[i].stat.name === nombreStat) {
      return pokemon.stats[i].base_stat;
    }
  }
  return 0;
}

// da el nombre del ataque segun posicion o un texto por defecto
function obtenerNombreMovimiento(pokemon, posicion, textoPorDefecto) {
  if (pokemon.moves[posicion] && pokemon.moves[posicion].move) {
    return pokemon.moves[posicion].move.name;
  }
  return textoPorDefecto;
}

// da la primera habilidad o un texto de respaldo
function obtenerNombreHabilidad(pokemon) {
  if (pokemon.abilities[0] && pokemon.abilities[0].ability) {
    return limpiarNombrePokemonApi(pokemon.abilities[0].ability.name);
  }
  return "sin habilidad";
}

// creo una fila de ataques para la card
function crearFilaAtaque(nombreAtaque, dano) {
  const fila = document.createElement("div");
  fila.className = "fila-ataque";

  const nombre = document.createElement("span");
  nombre.className = "nombre-ataque";
  nombre.textContent = limpiarNombrePokemonApi(nombreAtaque);

  const poder = document.createElement("span");
  poder.className = "poder-ataque";
  poder.textContent = dano;

  fila.appendChild(nombre);
  fila.appendChild(poder);
  return fila;
}

// creo un mini datos para mostrar atk, def y vel en la card
function crearMiniDato(etiqueta, valor) {
  const caja = document.createElement("div");
  caja.className = "mini-dato";

  const nombre = document.createElement("span");
  nombre.className = "mini-etiqueta";
  nombre.textContent = etiqueta;

  const numero = document.createElement("span");
  numero.className = "mini-valor";
  numero.textContent = valor;

  caja.appendChild(nombre);
  caja.appendChild(numero);
  return caja;
}

// creo una funcion para crear un dato con etiqueta y valor, para mostrar habilidad y numero de pokedex al final de la card
function crearDato(etiqueta, valor) {
  const parrafo = document.createElement("p");
  parrafo.className = "dato-pokemon";

  const textoEtiqueta = document.createElement("span");
  textoEtiqueta.className = "etiqueta-dato";
  textoEtiqueta.textContent = etiqueta + ": ";

  parrafo.appendChild(textoEtiqueta);
  parrafo.appendChild(document.createTextNode(valor));

  return parrafo;
}
