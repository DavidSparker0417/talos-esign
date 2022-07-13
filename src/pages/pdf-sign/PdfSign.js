import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Box, Button, Grid, Modal, Typography } from "@mui/material";
import queryString from "query-string";

// components
import PdfViewer from "./components/PdfViewer/PdfViewer";
import testPayload from "./payload.json";
import coorinates from "./coordinates.json";
import { b64toBytes, getCoordFromSigner, trimFileName } from "./helper";
import SignPadV2 from "./components/signpad/signpad-hook";
import { drawTab, pdfLoad, setDrawData } from "../../redux/tabs";
import TriggerPanel from "./section/trigger";
import { fontList } from "./components/signpad/sections";

export default function PdfSign() {
  const [pdf, setPdf] = useState();
  const [pdfBuffer, setPdfBuffer] = useState();
  const [togglePad, setTogglePad] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [signer, setSigner] = useState();
  const [coord, setCoord] = useState();
  const tabs = useSelector((state) => state.tabs.pages);
  const setting = useSelector((state) => state.tabs.drawData);
  const dispatch = useDispatch();

  const doc = testPayload.documents[0];
  const originalPdfBuffer = b64toBytes(doc.documentBase64);
  useEffect(() => {
    const { id } = queryString.parse(window.location.search);
    const signers = testPayload?.recipients?.signers;
    const s = signers.find((s) => s.recipientId === parseInt(id));
    setSigner(s);
    const c = getCoordFromSigner(s, coorinates);
    setCoord(c);
    setPdf((old) => ({ ...old, filename: trimFileName(doc.name) }));
    setPdfBuffer(originalPdfBuffer);
  }, []);

  useEffect(() => {
    if (!pdfBuffer) return;

    const blob = new Blob([pdfBuffer], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    setPdf((pdf) => ({ ...pdf, url }));
    PDFDocument.load(pdfBuffer).then((doc) => {
      dispatch(pdfLoad({ buffer: pdfBuffer, pageCount: doc.getPageCount() }));
      // dispatch(pdfLoad(doc));
    });
  }, [pdfBuffer]);

  useEffect(() => {}, [currentPage]);

  function setup(settings) {
    console.log("+++++++++++ setup completed :: ", settings);
    dispatch(setDrawData(settings));
  }

  function onSetting() {
    setTogglePad(!togglePad);
  }

  return (
    <Grid container direction="column" wrap="nowrap" height="100%">
      <TriggerPanel onSetting={onSetting} />
      <PdfViewer
        pdf={pdf}
        curPage={(page) => setCurrentPage(page)}
        coordinates={coorinates}
        signer={signer}
      />
      <Modal 
        open={togglePad} 
        onClose={() => setTogglePad(false)}
        sx={{
          overflow:"scroll"
        }}
      >
        <SignPadV2
          close={() => setTogglePad(false)}
          signer={signer}
          setup={setup}
          sx= {{
            backgroundColor:"#ffffff",
            minHeight: "100%"
          }}
        />
      </Modal>
      {/* {togglePad ? (
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
            setup = {setup}
          />
        </div>
      ) : (
        <></>
      )} */}
    </Grid>
  );
}
