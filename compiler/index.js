const path = require("path");
const fs = require("fs");
const { getPathTag } = require("./html-parser");

function convertirEtiquetaARuta(etiqueta) {
  const etiquetaSinMarcadores = etiqueta.replace(/<path\\|>/g, ""); // Eliminar los marcadores < y >
  const partes = etiquetaSinMarcadores.split("\\"); // Dividir la etiqueta en partes separadas por \
  const ruta = path.join("..", "blog", ...partes, "index.html");
  return ruta;
}

// Construye la ruta del archivo utilizando la biblioteca 'path'
const filePath = path.join("..", "blog", "layout", "posts", "index.html");

// Lee el archivo HTML
const html = fs.readFileSync(filePath, "utf-8");
let htmlOutput = html;

let match = getPathTag(htmlOutput);
while (match !== null) {
  const currentTag = match[0];
  const rutaElement = convertirEtiquetaARuta(currentTag);
  const htmlElement = fs.readFileSync(rutaElement, "utf-8");
  htmlOutput = htmlOutput.replace(currentTag, htmlElement);
  match = getPathTag(htmlOutput);
}

const outputPath = path.join("..", "blog-compiled", "index.html");
fs.writeFileSync(outputPath, htmlOutput, "utf-8");
