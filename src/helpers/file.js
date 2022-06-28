export function getBinaryFromPublic(path) {
  fetch(path)
    .then(function (res) {
      return res.blob();
    })
    .then(function (blob) {
      return blob.arrayBuffer();
    })
    .then(function (buffer) {
      console.log("[DAVID] P12BUFFER = ", buffer);
      return buffer;
    })
    .catch(function (err) {
      console.log("[getBinaryFromPublic] error = ", err)
      return null;
    });
}