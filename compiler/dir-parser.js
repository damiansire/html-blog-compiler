const fs = require("fs");
const path = require("path");

function obtenerNombresArchivosYCarpetas(rutaProyecto) {
  const archivos = fs.readdirSync(rutaProyecto);

  archivos.forEach((archivo) => {
    const rutaArchivo = path.join(rutaProyecto, archivo);
    const stats = fs.statSync(rutaArchivo);

    if (stats.isDirectory()) {
      console.log(`Carpeta: ${archivo}`);
      obtenerNombresArchivosYCarpetas(rutaArchivo); // Llamada recursiva para explorar subcarpetas
    } else if (stats.isFile()) {
      console.log(`Archivo: ${archivo}`);
    }
  });
}

// Ejemplo de uso
const rutaProyecto = "../blog";
obtenerNombresArchivosYCarpetas(rutaProyecto);
