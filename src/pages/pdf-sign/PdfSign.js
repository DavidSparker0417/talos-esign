import React, { useEffect, useState } from "react";
import { Box, Button, Grid } from "@mui/material";

// components
import PdfViewer from "./components/PdfViewer/PdfViewer";
import testPayload from "./payload.json";
import { b64toBytes, trimFileName } from "./helper";

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
    setPdfBuffer(originalPdfBuffer);
    setPdf((old) => ({ ...old, filename: trimFileName(doc.name) }));
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
        <PdfViewer 
          pdf={pdf} 
          curPage={(page) => setCurrentPage(page)} 
        />
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
            signer = {signer}
          />
        </div>
      ) : (
        <></>
      )}
    </Box>
  );
}
