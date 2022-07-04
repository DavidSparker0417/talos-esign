import React, { useEffect, useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Box, Button, Grid } from "@mui/material";

// components
import PdfViewer from "./components/PdfViewer/PdfViewer";
import testPayload from "./payload.json";
import coorinates from "./coordinates.json";
import { b64toBytes, insertInitialsToPDF, trimFileName } from "./helper";
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
    insertInitialsToPDF(originalPdfBuffer, coorinates).then((buffer) => {
      setPdfBuffer(buffer);
      setPdf((old) => ({ ...old, filename: trimFileName(doc.name) }));
    });
    setSigner(testPayload.recipients.signers[0]);
  }, []);

  useEffect(() => {
    if (!pdfBuffer) return;

    const blob = new Blob([pdfBuffer], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    setPdf((pdf) => ({ ...pdf, url }));
  }, [pdfBuffer]);

  useEffect(() => {
  }, [currentPage]);

  return (
    <Grid
      container
      direction="column"
      wrap = "nowrap"
      height="100%"
    >
      <Button
        variant="contained"
        size="medium"
        color="button"
        onClick={() => {
          setTogglePad(!togglePad);
        }}
        sx = {{margin: "auto"}}
      >
        Start Signing Session
      </Button>
      <PdfViewer pdf={pdf} curPage={(page) => setCurrentPage(page)} />
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
    </Grid>
  );
}
