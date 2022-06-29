export default function b64toBlob(b64Data, contentType = "", sliceSize = 512) {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });

  return blob;
}

export function b64toBytes(b64Data) {
  const byteCharacters = atob(b64Data);
  let uint8Array = new Uint8Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    uint8Array[i] = byteCharacters.charCodeAt(i);
  }
  return uint8Array;
}

export function arrayBufferToBase64( buffer ) {
  var binary = '';
  var bytes = new Uint8Array( buffer );
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
      binary += String.fromCharCode( bytes[ i ] );
  }
  return window.btoa( binary );
}

export function trimFileName(filename) {
  const dotPos = filename.lastIndexOf(".");
  let name = filename.slice(0, dotPos);
  const ext = filename.substr(dotPos);
  if (name?.length > 8) name = name.slice(0, 4) + ".." + name.slice(-4);
  name = name + ext;
  return name;
}

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
