const fs = require("fs");
const path = require("path");

function obtenerNombresArchivosYCarpetas(rutaProyecto, rutaRelativa = "") {
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
      const subElementos = obtenerNombresArchivosYCarpetas(
        rutaArchivo,
        `${rutaRelativa}/${archivo}`
      ); // Llamada recursiva para explorar subcarpetas
      elementos.push(...subElementos);
    }
  });

  return elementos;
}

// Ejemplo de uso
const rutaProyecto = "../blog";
const data = obtenerNombresArchivosYCarpetas(rutaProyecto);
console.log(data);
