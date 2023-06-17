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
      console.log(
        `No se pudo encontrar ${currentTag} en la ruta: ${rutaElement}`
      );
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
}

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
    const htmlElement = getHtmlByTag(currentTag);
    htmlOutput = htmlOutput.replace(currentTag, htmlElement);
    match = getPathTag(htmlOutput);
  }

  return htmlOutput;
}

function runCompiler() {
  // Agarro el index de layout
  const layoutPath = path.join(templatePath, "layout");
  const postsPath = path.join(srcPath, "data-template", "posts");

  //getHtmlByPath()
  const elementos = obtenerNombresDelDirectorio(layoutPath);
  //Crear post carpeta posts en dist
  const postFolderPath = path.join(outputPath, "posts");
  fs.mkdirSync(postFolderPath, { recursive: true });
  //Crear archivos de posts en dist
  const posts = obtenerNombresDelDirectorio(postsPath);
  posts.forEach((post) => {
    const postHtml = getHtmlByPath(post.ruta);
    const htmlOutput = sustituirEtiquetasPathPorCodigoHtml(postHtml);
    const postDistPath = path.join(postFolderPath, post.nombre);
    fs.writeFileSync(postDistPath, htmlOutput, "utf-8");
  });

  /*
  const html = fs.readFileSync(filePath, "utf-8");
  const htmlOutput = sustituirEtiquetasPathPorCodigoHtml(html);
  fs.writeFileSync(outputPath, htmlOutput, "utf-8");
  */
}

module.exports = {
  runCompiler,
};
