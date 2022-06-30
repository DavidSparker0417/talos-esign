import React, { useEffect, useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Box, Button, Grid } from "@mui/material";

// components
import PdfViewer from "./components/PdfViewer/PdfViewer";
import testPayload from "./payload.json";
import { b64toBytes, insertInitialsToPDF, trimFileName } from "./helper";

import SignPad from "./components/signpad";
import SignPadV2 from "./components/signpad/signpad-hook";

export default function PdfSign() {
  const [pdf, setPdf] = useState();
  const [pdfBuffer, setPdfBuffer] = useState();
  const [togglePad, setTogglePad] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [signer, setSigner] = useState();

  const doc = testPayload.documents[0];
  const originalPdfBuffer = b64toBytes(doc.documentBase64);
  useEffect(() => {
    // async function insertInitials(pdfBuffer, payload) {
    //   const signers = payload?.recipients?.signers;
    //   const initialTab = signers?.tabs?.initialHereTabs[0];
    //   if (!initialTab)
    //     return pdfBuffer;

    //   const pdfDoc = await PDFDocument.load(pdfBuffer);
    //   const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    //   const pages = pdfDoc.getPages();
    //   const curPage = pages[0];

    //   curPage.drawText(initialTab.anchorString, {
    //     x: initialTab.anchorXOffset,
    //     y: initialTab.anchorYOffset,
    //     size: 10,
    //     font: helveticaFont,
    //     color: rgb(0.95, 0.1, 0.1),
    //   });

    //   let pdfBytes = await pdfDoc.save();
    //   return pdfBytes;
    // }


    insertInitialsToPDF(originalPdfBuffer, testPayload).then((buffer) => {
      setPdfBuffer(buffer);
      setPdf((old) => ({ ...old, filename: trimFileName(doc.name) }));
      console.log("Initial inserted buffer = ", buffer);
    });
    console.log(testPayload.recipients.signers[0]);
    setSigner(testPayload.recipients.signers[0]);
  }, []);

  useEffect(() => {
    if (!pdfBuffer) return;

    const blob = new Blob([pdfBuffer], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    setPdf((pdf) => ({ ...pdf, url }));
    console.log("[DAVID] base64Response :: ", blob, url);
  }, [pdfBuffer]);

  useEffect(() => {
    console.log("current page chaged: ", currentPage);
  }, [currentPage]);

  return (
    <Box textAlign="center">
      <Button
        variant="contained"
        size="medium"
        color="button"
        margin="auto"
        onClick={() => {
          setTogglePad(!togglePad);
        }}
      >
        Start Signing Session
      </Button>
      <Grid container>
        <PdfViewer pdf={pdf} curPage={(page) => setCurrentPage(page)} />
      </Grid>
      {togglePad ? (
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "fixed",
            bottom: "0px",
            left: "0px",
            right: "0px",
            backgroundColor: "white",
          }}
        >
          <SignPadV2
            pdfBuffer={originalPdfBuffer}
            update={(buffer) => setPdfBuffer(buffer)}
            close={() => setTogglePad(false)}
            page={currentPage}
            signer={signer}
          />
        </div>
      ) : (
        <></>
      )}
    </Box>
  );
}
