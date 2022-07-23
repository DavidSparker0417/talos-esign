import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Box, Button, Grid, Modal, Typography } from "@mui/material";
import queryString from "query-string";

// components
import PdfViewer from "./components/PdfViewer/PdfViewer";
import testPayload from "./payload.json";
// import coorinates from "./coordinates.json";
import { b64toBytes, getCoordFromSigner, trimFileName } from "./helper";
import SignPadV2 from "./components/signpad/signpad-hook";
import { doSign, getPayload, pdfLoad, setDrawData } from "../../redux/tabs";
import TriggerPanel from "./section/trigger";
import DSButton from "../../components/DSButton";
import getFormattedDate from "../../helpers/datetime";
import docsignService from "../../service/docsign.service";

export default function PdfSign() {
  const [pdf, setPdf] = useState();
  const [pdfBuffer, setPdfBuffer] = useState();
  const [togglePad, setTogglePad] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [signer, setSigner] = useState();
  const [coordinates, setCoordinates] = useState();
  const {
    pdfBuffer: resultPdfBuffer,
    pages,
    editFinished, 
    drawData
  } = useSelector((state) => state.tabs);
  const [toggleSign, setToggleSign] = useState(false);
  const dispatch = useDispatch();
  
  useEffect(() => {
    const { id } = queryString.parse(window.location.search);
    // dispatch(getPayload());
    docsignService.requestDoc().then(res => {
      console.log(res);
      setCoordinates(res.coordinates);
      const payload = res.payload;
      const doc = payload.documents[0];
      const originalPdfBuffer = b64toBytes(doc.documentBase64);
      const signers = payload?.recipients?.signers;
      const s = signers.find((s) => s.recipientId === parseInt(id));
      setSigner(s);
      setPdf((old) => ({ ...old, filename: trimFileName(doc.name) }));
      setPdfBuffer(originalPdfBuffer);
    });
  }, []);

  useEffect(() => {
    if(editFinished === true)
      setToggleSign(true);
  }, [editFinished]);

  useEffect(() => {
    if (!pdfBuffer) return;

    const blob = new Blob([pdfBuffer], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    setPdf((pdf) => ({ ...pdf, url }));
    PDFDocument.load(pdfBuffer).then((doc) => {
      dispatch(pdfLoad({ buffer: pdfBuffer, pageCount: doc.getPageCount() }));
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

  async function onSign() {
    const pdfDoc = await PDFDocument.load(resultPdfBuffer);
    console.log("++++++++++ :: siging :: ", pdfDoc);
    const initialPng = await pdfDoc.embedPng(drawData.initial.url);
    const sigPng = await pdfDoc.embedPng(drawData.sig.url);
    const signDate = getFormattedDate(new Date());
    const drInfo = {
      initial: {},
      sig: {},
      date: {}
    };
    drInfo.initial.mark = drawData.initial.url;
    drInfo.initial.coords = new Array(pages.length);
    drInfo.sig.mark = drawData.sig.url;
    drInfo.sig.coords = new Array(pages.length);
    drInfo.date.mark = signDate;
    drInfo.date.coords = new Array(pages.length);
    for(const i in pages) {
      const curPage = pdfDoc.getPages()[i];
      if (pages[i].initial) {
        const pos = pages[i].initial.pos;
        const y = curPage.getHeight() - pos.py - drawData.initial.height/2;
        curPage.drawImage(initialPng, {
          x: pos.px,
          y: y,
          width: drawData.initial.width,
          height: drawData.initial.height,
        });
        drInfo.initial.coords[i] = {
          x: pos.px, 
          y, 
          width: drawData.initial.width, 
          height: drawData.initial.height
        };
      }
      if (pages[i].sig) {
        const pos = pages[i].sig.pos;
        const y = curPage.getHeight() - pos.py - drawData.sig.height/3;
        curPage.drawImage(sigPng, {
          x: pos.px,
          y: y,
          width: drawData.sig.width,
          height: drawData.sig.height,
        });
        drInfo.sig.coords[i] = {
          x: pos.px, 
          y, 
          width: drawData.sig.width, 
          height: drawData.sig.height
        };
      }
      if (pages[i].date) {
        const pos = pages[i].date.pos;
        const y = curPage.getHeight() - pos.py - drawData.date.height/3;
        curPage.drawText(signDate, {
          size: 16,
          x: pos.px,
          y: y,
          width: drawData.date.width,
          height: drawData.date.height,
        });
        drInfo.date.coords[i] = {
          x: pos.px, 
          y, 
          width: drawData.date.width, 
          height: drawData.date.height
        };
      }
      setToggleSign(false);
      dispatch(doSign(signDate));
    }

    const signedResult = await docsignService.sign(signer.email, "sign", JSON.stringify(drInfo));
    console.log("+++++++++++ audit trail :: ", signedResult);
    let blob;
    let link;
    blob = new Blob([JSON.stringify(signedResult.auditTrail)], {type: "application/json"});
    link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "audit-trail.json";
    link.click();

    const pdfBytes = await pdfDoc.save();
    // const bytes = new Uint8Array(pdfBytes);
    const bytes = new Uint8Array(b64toBytes(signedResult.signedPdf));
    blob =  new Blob([bytes], {type: "application/pdf"});
    link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "signed.pdf";
    link.click();
  }

  return (
    <Grid container direction="column" wrap="nowrap" height="100%">
      <TriggerPanel onSetting={onSetting} />
      <PdfViewer
        pdf={pdf}
        curPage={(page) => setCurrentPage(page)}
        coordinates={coordinates}
        signer={signer}
      />
      <Modal 
        open={togglePad} 
        onClose={() => setTogglePad(false)}
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
      <Modal
        open={toggleSign}
        onClose={() => setToggleSign(false)}
      >
        <Grid container justifyContent="center" alignItems="center" height="100%">
          <DSButton sx={{height:"fit-content"}} onClick={onSign}>
            SIGN!
          </DSButton>
        </Grid>
      </Modal>
    </Grid>
  );
}
