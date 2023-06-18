const fs = require("fs");
const path = require("path");

function obtenerNombresDelDirectorioYSubDirectorio(
  rutaProyecto,
  rutaRelativa = ""
) {
  const archivos = fs.readdirSync(rutaProyecto);
  const elementos = [];

  archivos.forEach((archivo) => {
    const rutaArchivo = path.join(rutaProyecto, archivo);
    const stats = fs.statSync(rutaArchivo);
    const elemento = {
      nombre: archivo,
      ruta: `${rutaRelativa}/${archivo}`,
      esCarpeta: stats.isDirectory(),
    };

    elementos.push(elemento);

    if (stats.isDirectory()) {
      const subElementos = obtenerNombresDelDirectorioYSubDirectorio(
        rutaArchivo,
        `${rutaRelativa}/${archivo}`
      ); // Llamada recursiva para explorar subcarpetas
      elementos.push(...subElementos);
    }
  });

  return elementos;
}

/**
 * Obtiene los nombres de los archivos y carpetas en un directorio dado, aplicando filtros opcionales.
 *
 * @param {string} rutaProyecto - Ruta del directorio a explorar.
 * @param {Object} [options] - Opciones de filtrado.
 * @param {boolean} [options.onlyFiles=false] - Indica si solo se deben incluir archivos en los resultados.
 * @param {boolean} [options.onlyFolders=false] - Indica si solo se deben incluir carpetas en los resultados.
 * @param {string} [options.fileExtension=null] - Extensión de archivo opcional para filtrar por tipo de archivo.
 * @returns {Array} - Array de objetos con información de los archivos y carpetas encontrados.
 */
function obtenerNombresDelDirectorio(rutaProyecto, options = {}) {
  const {
    onlyFiles = false,
    onlyFolders = false,
    fileExtension = null,
  } = options;

  const archivos = fs.readdirSync(rutaProyecto);
  const elementos = [];

  archivos.forEach((archivo) => {
    const rutaArchivo = path.join(rutaProyecto, archivo);
    const stats = fs.statSync(rutaArchivo);
    const elemento = {
      nombre: archivo,
      ruta: `${rutaProyecto}/${archivo}`,
      esCarpeta: stats.isDirectory(),
    };

    const archivoExtension = path.extname(archivo).toLowerCase();

    if (
      ((!onlyFiles && !onlyFolders) ||
        (onlyFolders && stats.isDirectory()) ||
        (onlyFiles && !stats.isDirectory())) &&
      (!fileExtension || archivoExtension === fileExtension.toLowerCase())
    ) {
      elementos.push(elemento);
    }
  });

  return elementos;
}

module.exports = {
  obtenerNombresDelDirectorioYSubDirectorio,
  obtenerNombresDelDirectorio,
};

/*
let data = obtenerNombresDelDirectorio("../data-template/posts");
data = data.map((x) => x.nombre);
console.log(data);
*/
