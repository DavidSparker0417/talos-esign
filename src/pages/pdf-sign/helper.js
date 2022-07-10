import { PDFDocument, PDFDocumentFactory, rgb, StandardFonts } from "pdf-lib";

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

export async function insertInitialsToPDF(pdfBuffer, coordinates) {
  const owners = coordinates?.allSigners?.owners;
  const tenants = coordinates?.allSigners?.tenants;
  if (!owners || !tenants)
    return pdfBuffer;
  
  const pdfDoc = await PDFDocument.load(pdfBuffer);
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pages = pdfDoc.getPages();
  const curPage = pages[0];
  const form = pdfDoc.getForm();
  const fields = form.getFields();
  console.log("[CUR PAGE] With/Height = ", curPage.getWidth(), curPage.getHeight());

  fields.map((f, i) => {
    const type = f.constructor.name;
    const name = f.getName();
    const widget = f.acroField.getWidgets()[0];
    const rect = widget.Rect();
  })

  owners.map((s, i) => {
    const initialTab = s?.pages[0];
    const x = parseFloat(initialTab.initialCoordinates[0][0]);
    const y = parseFloat(initialTab.initialCoordinates[0][1]);
    curPage.drawText(s.ancherString, {
      x, 
      y,
      size: 10, 
      font: helveticaFont, 
      color: rgb(0.95, 0.1, 0.1),
    });
  })

  tenants.map((s, i) => {
    const initialTab = s?.pages[0];
    const x = parseFloat(initialTab.initialCoordinates[0][0]);
    const y = parseFloat(initialTab.initialCoordinates[0][1]);
    curPage.drawText(s.ancherString, {
      x, y,
      size: 10, 
      font: helveticaFont, 
      color: rgb(0.95, 0.1, 0.1),
    });
  })

  let pdfBytes = await pdfDoc.save();
  return pdfBuffer;
}

export function getCoordFromSigner(signer, coordinates) {
  if (!signer || !coordinates)
    return undefined;
  
  let cooSigner;
  cooSigner = coordinates.allSigners?.owners.find(
    (o) => o.email === signer.email
  );
  if (!cooSigner)
    cooSigner = coordinates.allSigners?.tenants.find(
      (o) => o.email === signer.email
    );
  
  return cooSigner;
}

export function convertMMtoPixel(mmpos, scaleW, scaleH) {
  let x, y;
  if (!mmpos || !mmpos?.length || mmpos.length < 2) return;

  x = mmpos[0];
  y = mmpos[1];

  let px, py;
  px = (x / 25.4) * 72;
  py = (y / 25.4) * 72;  
  if (scaleW)
    x = px * scaleW;
  if (scaleH)
    y = py * scaleH;
  return { x, y, px, py };
}