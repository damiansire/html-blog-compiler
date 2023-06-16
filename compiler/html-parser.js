function getTagsStartBy(startBy, html) {
  const etiquetaRegExp = new RegExp(`<${startBy}[a-z]+[^>]*>`, "gi");
  const etiquetas = new Set();
  let match = etiquetaRegExp.exec(html);
  while (match !== null) {
    etiquetas.add(match[0]);
    match = etiquetaRegExp.exec(html);
  }
  return etiquetas;
}

function getPathTags(html) {
  const pathStart = "path\\\\";
  return getTagsStartBy(pathStart, html);
}

function getPathTag(html) {
  const pathStart = "path\\\\";
  const etiquetaRegExp = new RegExp(`<${pathStart}[a-z]+[^>]*>`, "gi");
  return etiquetaRegExp.exec(html);
}

module.exports = {
  getPathTags,
  getPathTag,
};
