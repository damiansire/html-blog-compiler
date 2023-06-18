const path = require("path");
const fs = require("fs");
const { getPathTag } = require("./html-parser");
const { obtenerNombresDelDirectorio } = require("./dir-parser");
const basePath = path.resolve();
const srcPath = path.resolve(basePath, "src");
const templatePath = path.resolve(basePath, "src", "template");
// Construye la ruta del archivo utilizando la biblioteca 'path'
const filePath = path.join(templatePath, "layout", "posts", "index.html");
const outputPath = path.join(basePath, "dist");

/**
 * Convierte una etiqueta de la forma <path\\> en una ruta de archivo.
 *
 * @param {string} etiqueta - La etiqueta a convertir en ruta.
 * @returns {string} La ruta de archivo resultante.
 *
 * @example
 * // Retorna la ruta de archivo correspondiente a la etiqueta
 * const rutaArchivo = convertirEtiquetaARuta("<path\carpeta1\carpeta2>");
 */
function convertirEtiquetaARuta(etiqueta) {
  const etiquetaSinMarcadores = etiqueta.replace(/<path\\|>/g, ""); // Eliminar los marcadores < y >
  const partes = etiquetaSinMarcadores.split("\\"); // Dividir la etiqueta en partes separadas por \
  const ruta = path.join(templatePath, ...partes, "index.html");
  return ruta;
}

function getHtmlByPath(rutaElement) {
  try {
    return fs.readFileSync(rutaElement, "utf-8");
  } catch (err) {
    if (err.errno === -4058) {
      console.log(`No se pudo encontrar elemento en la ruta: ${rutaElement}`);
    }
    throw err;
  }
}

/**
 * Obtiene el HTML de una ruta especificada por un tag HTML.
 *
 * @param {string} currentTag - El tag HTML que representa la ruta.
 * @returns {string} El contenido HTML de la ruta especificada por el tag.
 * @throws {Error} Si no se puede obtener el HTML de la ruta.
 *
 * @example
 * // Retorna el contenido HTML de la ruta especificada por el tag "<path\components\header>"
 * const html = getHtmlByTag("<path\components\header>");
 */
function getHtmlByTag(currentTag) {
  const rutaElement = convertirEtiquetaARuta(currentTag);
  const html = getHtmlByPath(rutaElement);
  return html;
}

/**
 * Separar una cadena en varias líneas utilizando el salto de línea correspondiente al sistema operativo.
 * Además, elimina los espacios en blanco al inicio y al final de cada línea.
 *
 * @param {string} input - La cadena de entrada.
 * @returns {string[]} Un array con las líneas resultantes.
 */
function separateStringByNewLine(input) {
  const os = require("os");
  const newLine = os.EOL;

  return input.split(newLine).map((line) => line.trim());
}

function separarTagYAtributo(cadena) {
  const regex = /(<[^ ]+)([^>]*)>/;
  const match = cadena.match(regex);

  if (match) {
    const tag = match[1].trim() + ">";
    const atributosText = match[2].trim();
    if (atributosText) {
      const atributosArray = separateStringByNewLine(atributosText);
      const atributosHashMap = arrayToHashmap(atributosArray, "=");
      return { tag, atributos: atributosHashMap };
    }
    return { tag, atributos: null };
  }

  return null;
}

function obtenerJSONDesdeRuta(rutaArchivo) {
  try {
    const contenido = fs.readFileSync(rutaArchivo, "utf-8");
    const jsonData = JSON.parse(contenido);
    return jsonData;
  } catch (error) {
    console.error("Error al leer el archivo JSON:", error);
    return null;
  }
}

function obtenerVariables(html) {
  const regex = /{{\s*(\w+)\s*}}/g;
  const elementos = [];
  let match;

  while ((match = regex.exec(html)) !== null) {
    const nombreElemento = match[1];
    const coincidencia = match[0];
    elementos.push({ name: nombreElemento, text: coincidencia });
  }

  return elementos;
}

function getPathFromAtribute(atributo) {
  const rutaDelAtributo = atributo.replace(/data="(.+?)"/, "$1");
  const rutaCompleta = path.join(srcPath, "data-template", rutaDelAtributo);
  return rutaCompleta;
}

/**
 * Convierte un array de líneas en un hashmap utilizando un símbolo separador.
 *
 * @param {string[]} array - El array de líneas.
 * @param {string} separator - El símbolo separador.
 * @returns {Object} Un objeto hashmap con las claves y valores correspondientes.
 * @example
 * const lines = [
 *   'data="posts\\index.json"',
 *   'test-variable="sadasddsa"'
 * ];
 *
 * const separator = '=';
 *
 * // Resultado:
 * // {
 * //   data: 'posts\\index.json',
 * //   'test-variable': 'sadasddsa'
 * // }
 */
function arrayToHashmap(array, separator) {
  const hashmap = {};

  array.forEach((line) => {
    const [key, value] = line.split(separator);
    hashmap[key.trim()] = value.replace(/["']/g, "").trim();
  });

  return hashmap;
}

function interpolarVariables(htmlElement, variablesInJson) {
  const variables = obtenerVariables(htmlElement);
  variables.forEach(({ text, name }) => {
    const regex = new RegExp(text, "g");
    htmlElement = htmlElement.replace(regex, variablesInJson[name]);
  });
  return htmlElement;
}

function generateHtmlBySlot(htmlSlot, jsonData) {
  let htmlOutput = "";
  jsonData.forEach((variablesInJson) => {
    htmlOutput += interpolarVariables(htmlSlot, variablesInJson);
  });
  return htmlOutput;
}

//TODO: Hacer primero un analicis y despues las cosas, asi evito logicas complejas
/**
 * Sustituye las etiquetas que comienzan con "<path\\" en un HTML por su correspondiente código HTML.
 *
 * @param {string} html - El HTML original que contiene las etiquetas a sustituir.
 * @returns {string} El HTML modificado con las etiquetas sustituidas.
 *
 * @example
 * // Retorna el HTML modificado con las etiquetas sustituidas
 * const nuevoHtml = sustituirEtiquetasPathPorCodigoHtml(htmlOriginal);
 */
function sustituirEtiquetasPathPorCodigoHtml(html) {
  let htmlOutput = html;

  let match = getPathTag(htmlOutput);
  while (match !== null) {
    const currentTag = match[0];
    const { tag, atributos } = separarTagYAtributo(currentTag);
    let htmlBase = getHtmlByTag(tag);
    if (atributos) {
      if ("data" in atributos) {
        const jsonPath = getPathFromAtribute(atributos.data);
        const jsonData = obtenerJSONDesdeRuta(jsonPath);
        htmlBase = generateHtmlBySlot(htmlBase, jsonData);
      }
    }
    htmlOutput = htmlOutput.replace(currentTag, htmlBase);
    match = getPathTag(htmlOutput);
  }

  return htmlOutput;
}

function compilePostsIndex() {
  const principalIndex = path.join(templatePath, "layout", "index.html");
  const principalIndexPath = path.join(outputPath, "index.html");
  const principalHtml = getHtmlByPath(principalIndex);
  const htmlOutput = sustituirEtiquetasPathPorCodigoHtml(principalHtml);
  fs.writeFileSync(principalIndexPath, htmlOutput, "utf-8");
}

function compilePosts() {
  const postsPath = path.join(srcPath, "data-template", "posts");
  const postFolderPath = path.join(outputPath, "posts");
  //Crear post carpeta posts en dist
  fs.mkdirSync(postFolderPath, { recursive: true });
  //Crear archivos de posts en dist
  const posts = obtenerNombresDelDirectorio(postsPath);
  posts.forEach((post) => {
    const postHtml = getHtmlByPath(post.ruta);
    const htmlOutput = sustituirEtiquetasPathPorCodigoHtml(postHtml);
    const postDistPath = path.join(postFolderPath, post.nombre);
    fs.writeFileSync(postDistPath, htmlOutput, "utf-8");
  });
}

function runCompiler() {
  compilePostsIndex();
  compilePosts();
}

module.exports = {
  runCompiler,
};
