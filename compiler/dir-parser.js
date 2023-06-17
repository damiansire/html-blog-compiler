const fs = require("fs");
const path = require("path");

function obtenerNombresArchivosYCarpetas(rutaProyecto, rutaRelativa = "") {
  const archivos = fs.readdirSync(rutaProyecto);

  archivos.forEach((archivo) => {
    const rutaArchivo = path.join(rutaProyecto, archivo);
    const stats = fs.statSync(rutaArchivo);

    if (stats.isDirectory()) {
      console.log(`Carpeta: ${rutaRelativa}/${archivo}`);
      obtenerNombresArchivosYCarpetas(
        rutaArchivo,
        `${rutaRelativa}/${archivo}`
      ); // Llamada recursiva para explorar subcarpetas
    } else if (stats.isFile()) {
      console.log(`Archivo: ${rutaRelativa}/${archivo}`);
    }
  });
}

// Ejemplo de uso
const rutaProyecto = "../blog";
obtenerNombresArchivosYCarpetas(rutaProyecto);
