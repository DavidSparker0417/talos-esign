import React, { Component, useRef, useState } from "react";
import { toast } from "react-toastify";
// import SignaturePad from "signature_pad";
import { Button, Grid } from "@mui/material";
import { degrees, PDFDocument, rgb, StandardFonts } from "pdf-lib";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import DocsignService from "../../../../service/docsign.service";
import { arrayBufferToBase64, b64toBytes } from "../../helper";
import SignaturePad from 'react-signature-pad-wrapper';

export default function SignPadV2({pdfBuffer, page, update, close}) {
  const [type, setType] = useState(0);
  const [signText, setSignText] = useState();
  const [drawnSig, setDrawnSig] = useState();
  const signRef = useRef();
  function closeBtn() {
    if (close) close();
  }

  function handleChange(event) {
    setType(event.target.value);
  }

  function clearSign() {
    setSignText("");
    signRef?.current?.signaturePad?.clear();
  }

  function handleTextChange(event) {
    setSignText(event.target.value);
  }

  async function onSign() {
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const pages = pdfDoc.getPages();
    const curPageNum = page - 1;
    const curPage = pages[curPageNum];
    let drawInfo = {
      type: type === 0 ? "draw" : "text",
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      data: 0
    };
    if (type === 1) { // text
      drawInfo.type = "text";
      drawInfo.x = 5;
      drawInfo.y = curPage.getHeight() / 2;
      drawInfo.data = signText;
      curPage.drawText(signText, {
        x: drawInfo.x,
        y: drawInfo.y, 
        size: 50, 
        font: helveticaFont, 
        color: rgb(0.95, 0.1, 0.1),
        rotate: degrees(-45)
      });
    } else {
      const drawnSigUrl = signRef.current.signaturePad.toDataURL();
      const pngImageBytes = await fetch(drawnSigUrl).then(res => res.arrayBuffer());
      const pngImage = await pdfDoc.embedPng(pngImageBytes);
      const pngDims = pngImage.scale(1.0);
      drawInfo.type = "draw";
      drawInfo.x = curPage.getWidth() / 2 - pngDims.width / 2;
      drawInfo.y = curPage.getHeight() / 2 - pngDims.height;
      drawInfo.imgWidth = pngDims.width;
      drawInfo.imgHeight = pngDims.height;
      const pngImageB64 = await fetch(drawnSigUrl).then((res) => {
        return res.url.split("base64,")[1];
      });
      drawInfo.data = pngImageB64;
      curPage.drawImage(pngImage, {
        x: drawInfo.x,
        x: drawInfo.y,
        width: drawInfo.imgWidth,
        height: drawInfo.imgHeight,
      });
    }

    let pdfBytes = await pdfDoc.save();

    let signedResp;
    try {
      signedResp = await DocsignService.signDoc(
        arrayBufferToBase64(pdfBuffer),
        {
            page: curPageNum,
            ...drawInfo
        }
      );
    } catch (e) {
      toast.error(e.message);
    }

    if (update) 
      update(pdfBytes);
    
    const signedBuffer = b64toBytes(signedResp.data);
    var bytes = new Uint8Array(signedBuffer);
    var blob = new Blob([bytes], { type: "application/pdf" }); // change resultByte to bytes
    var link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "signed.pdf";
    link.click();
    closeBtn();
  }
  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <div
        style={{ position: "absolute", right: "10px", top: "50px" }}
        onClick={() => closeBtn()}
      >
        <span
          style={{
            fontSize: "45px",
            display: "inline-block",
            transform: "rotate(45deg)",
          }}
        >
          +
        </span>
      </div>
      <Grid container mt="100px">
        <FormControl style={{ flex: 1 }}>
          <InputLabel id="demo-simple-select-label">CHOOSE STYLE</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={type}
            label="CHOOSE STYLE"
            onChange={handleChange}
            inputProps={{
              sx: {
                padding: "0.5rem",
              },
            }}
          >
            <MenuItem value={0}>PEN</MenuItem>
            <MenuItem value={1}>TEXT</MenuItem>
          </Select>
        </FormControl>
        <Button color="primary" variant="contained" style={{ flex: 1 }}>
          DRAW SIGNATURE
        </Button>
        <Button color="primary" variant="outlined" style={{ flex: 1 }}>
          UPLOAD SIGNATURE
        </Button>
      </Grid>
      <div
        style={{
          paddingLeft: "20px",
          paddingRight: "20px",
          marginTop: "30px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button variant="text" color="primary" onClick={clearSign}>
            Clear
          </Button>
        </div>
        <div
          style={{
            height: "300px",
            width: "95%",
            backgroundColor: "pink",
            borderRadius: "10px",
          }}
        >
          {type === 0 ? (
            <SignaturePad 
              height={300} 
              redrawOnResize 
              ref = {signRef}
            />
          ) : (
            <textarea
              style={{
                width: "100%",
                height: "100%",
                resize: "none",
                padding: "10px 20px",
                borderRadius: "10px",
              }}
              placeholder="Please input your signature"
              value={signText}
              onChange={handleTextChange}
            ></textarea>
          )}
        </div>
        <div style={{paddingTop: "16px"}}>
          <p>
            By selecting Adopt and Sign, I agree that the signature and initals
            will be my electronic representation of my Signature and Initials
            for all purposes within these documents. When I, my agent, or my
            representative use them on all documents both on binding and non
            binting contacts, such signatures and initals will act just the same
            as a Pen to Paper signature and initial.
          </p>
        </div>
      </div>
      <div style={{ flex: 1 }}></div>
      <div style={{ display: "flex", height: "50px" }}>
        <Button
          variant="contained"
          color="primary"
          style={{ flex: 1, borderRadius: "0px" }}
          onClick={onSign}
        >
          ADOPT and SIGN
        </Button>
        <Button
          variant="outlined"
          color="primary"
          style={{ flex: 1, borderRadius: "0px" }}
          onClick={closeBtn}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
