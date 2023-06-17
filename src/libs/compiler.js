const path = require("path");
const fs = require("fs");
const { getPathTag } = require("./html-parser");

const basePath = path.resolve();
const templatePath = path.resolve(basePath, "src", "template");
// Construye la ruta del archivo utilizando la biblioteca 'path'
const filePath = path.join(templatePath, "layout", "posts", "index.html");
const outputPath = path.join(basePath, "dist", "index.html");

function convertirEtiquetaARuta(etiqueta) {
  const etiquetaSinMarcadores = etiqueta.replace(/<path\\|>/g, ""); // Eliminar los marcadores < y >
  const partes = etiquetaSinMarcadores.split("\\"); // Dividir la etiqueta en partes separadas por \
  const ruta = path.join(templatePath, ...partes, "index.html");
  return ruta;
}

function runCompiler() {
  // Lee el archivo HTML
  const html = fs.readFileSync(filePath, "utf-8");
  let htmlOutput = html;

  let match = getPathTag(htmlOutput);
  while (match !== null) {
    const currentTag = match[0];
    const rutaElement = convertirEtiquetaARuta(currentTag);
    let htmlElement;
    try {
      htmlElement = fs.readFileSync(rutaElement, "utf-8");
    } catch (err) {
      if (err.errno === -4058) {
        console.log(
          `No se pudo encontrar ${currentTag} en la ruta: ${rutaElement}`
        );
      }
      throw err;
    }
    htmlOutput = htmlOutput.replace(currentTag, htmlElement);
    match = getPathTag(htmlOutput);
  }

  fs.writeFileSync(outputPath, htmlOutput, "utf-8");
}

runCompiler();

module.exports = {
  runCompiler,
};
