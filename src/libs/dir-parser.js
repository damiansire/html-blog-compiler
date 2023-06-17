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

function obtenerNombresDelDirectorio(rutaProyecto, onlyFiles, onlyFolders) {
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

    if (
      (!onlyFiles && !onlyFolders) ||
      (onlyFolders && stats.isDirectory()) ||
      (onlyFiles && !stats.isDirectory())
    ) {
      elementos.push(elemento);
    }
  });

  return elementos;
}

const elementos = obtenerNombresDelDirectorio("../blog/posts");
console.log(elementos);

module.exports = {
  obtenerNombresDelDirectorioYSubDirectorio,
  obtenerNombresDelDirectorio,
};
