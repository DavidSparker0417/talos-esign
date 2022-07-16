import React, { Component, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
// import SignaturePad from "signature_pad";
import { Box, Button, Grid, TextField } from "@mui/material";
import { degrees, drawImage, PDFDocument, rgb, StandardFonts } from "pdf-lib";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import DocsignService from "../../../../service/docsign.service";
import { arrayBufferToBase64, b64toBytes } from "../../helper";
import SignaturePad from "react-signature-pad-wrapper";
import { useUI } from "../../../../context/ui";
import SignerNamePanel, { ChooseStyle, DrawPanel, FinishSettings } from "./sections";
import getFormattedDate from "../../../../helpers/datetime";

function getAbbrName(name) {
  if (!name) return "";

  const nParts = name.split(" ");
  let abrName = "";
  nParts.map((p) => {
    abrName += p[0];
  });
  return abrName;
}

export default function SignPadV2({ signer, close, setup, ...rest }) {
  const [type, setType] = useState(0);
  const [signText, setSignText] = useState();
  const signRef = useRef();
  const initialRef = useRef();
  const { setLoading } = useUI();
  const [name, setName] = useState(signer?.name);
  const [abrName, setAbrName] = useState(getAbbrName(signer?.name));

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

  function CloseButton({onClick, ...rest}) {
    return(
      <Box textAlign="right" {...rest}>
        <span
          style={{
            fontSize: "45px",
            display: "inline-block",
            transform: "rotate(45deg)",
            cursor: "pointer",
          }}
          onClick={() => onClick()}
        >
          +
        </span>
      </Box>
    )
  }

  // async function onSign() {
  //   const pdfDoc = await PDFDocument.load(pdfBuffer);
  //   const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  //   const pages = pdfDoc.getPages();
  //   const curPageNum = page - 1;
  //   const curPage = pages[0];
  //   let drawInfo = {
  //     type: type === 0 ? "draw" : "text",
  //     x: parseInt(signer.tabs.signHereTabs[0].anchorXOffset),
  //     y: parseInt(signer.tabs.signHereTabs[0].anchorYOffset),
  //     width: 0,
  //     height: 0,
  //     data: 0,
  //   };

  //   if (type === 1) {
  //     // text
  //     drawInfo.type = "text";
  //     drawInfo.data = signText;
  //     curPage.drawText(signText, {
  //       x: drawInfo.x,
  //       y: drawInfo.y,
  //       size: 50,
  //       font: helveticaFont,
  //       color: rgb(0.95, 0.1, 0.1),
  //     });
  //   } else {
  //     const drawnSigUrl = signRef.current.signaturePad.toDataURL();
  //     const pngImageBytes = await fetch(drawnSigUrl).then((res) =>
  //       res.arrayBuffer()
  //     );
  //     const pngImage = await pdfDoc.embedPng(pngImageBytes);
  //     const pngDims = pngImage.scale(0.2);
  //     drawInfo.type = "draw";
  //     drawInfo.imgWidth = pngDims.width;
  //     drawInfo.imgHeight = pngDims.height;
  //     drawInfo.x = parseInt(signer.tabs.signHereTabs[0].anchorXOffset);
  //     // drawInfo.y = curPage.getHeight() - drawInfo.imgHeight - parseInt(signer.tabs.signHereTabs[0].anchorYOffset);
  //     drawInfo.y = parseInt(signer.tabs.signHereTabs[0].anchorYOffset);
  //     const pngImageB64 = await fetch(drawnSigUrl).then((res) => {
  //       return res.url.split("base64,")[1];
  //     });
  //     drawInfo.data = pngImageB64;
  //     curPage.drawImage(pngImage, {
  //       x: drawInfo.x,
  //       y: drawInfo.y,
  //       width: drawInfo.imgWidth,
  //       height: drawInfo.imgHeight,
  //     });
  //   }

  //   let pdfBytes = await pdfDoc.save();

  //   let signedResp;
  //   try {
  //     setLoading(true, "Signing ...");
  //     signedResp = await DocsignService.signDoc(
  //       arrayBufferToBase64(pdfBuffer),
  //       {
  //         page: curPageNum,
  //         ...drawInfo,
  //       }
  //     );
  //   } catch (e) {
  //     toast.error(e.message);
  //     setLoading(false);
  //   }

  //   setLoading(false);

  //   if (update) update(pdfBytes);

  //   const signedBuffer = b64toBytes(signedResp.data);
  //   var bytes = new Uint8Array(signedBuffer);
  //   var blob = new Blob([bytes], { type: "application/pdf" }); // change resultByte to bytes
  //   var link = document.createElement("a");
  //   link.href = window.URL.createObjectURL(blob);
  //   link.download = "signed.pdf";
  //   link.click();
  //   closeBtn();
  // }

  async function onSign() {
    console.log("+++++++++++++++++  :: ", initialRef.current);
    const sigImageUrl = signRef.current.getTrimmedCanvas().toDataURL();
    const signatureImageBytes = await fetch(sigImageUrl).then((res) =>
      res.arrayBuffer()
    );

    const initialImageUrl = initialRef.current.getTrimmedCanvas().toDataURL();
    const initialImageBytes = await fetch(initialImageUrl).then((res) =>
      res.arrayBuffer()
    );
    setup({
      sig: sigImageUrl,
      initial: initialImageUrl,
      date: getFormattedDate(new Date())
    });
    closeBtn();
  }

  return (
    <Grid
      container
      wrap="nowrap"
      flexDirection="column"
      position="relative"
      {...rest}
    >
      <CloseButton onClick={closeBtn} sx={{maxHeight:"4vh"}}/>
      <SignerNamePanel 
        name={name}
        setName={setName}
        abrName={abrName}
        setAbrName={setAbrName}
        mb={3}
        px={1}
        maxHeight="8vh"
      />
      <ChooseStyle 
        onStyleChange={(t) => setType(t)} 
        px={1} 
        maxHeight="5vh"
      />
      <DrawPanel 
        type={type} 
        name={name}
        abrName={abrName}
        maxHeight="75vh"
        ref={{
          signRef,
          initialRef
        }}/>
      <div style={{ flex: 1 }}></div>
      <FinishSettings 
        onSign={onSign} 
        onCancel={closeBtn} 
        maxHeight={{
          xs: "5vh" ,
          sm: "60px"
        }}
        height= {{
          xs: "fit-content",
          sm: "40px"
        }}
        position="absolute"
        left="0px"
        bottom="0px"
      />
    </Grid>
  );
}
