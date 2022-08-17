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
import { doSign, getPayload, pdfLoad, setDrawData, setToken } from "../../redux/tabs";
import TriggerPanel from "./section/trigger";
import DSButton from "../../components/DSButton";
import getFormattedDate from "../../helpers/datetime";
import docsignService from "../../service/docsign.service";
import { useNavigate } from "react-router-dom";
import htmlToPdfmake from "html-to-pdfmake"
import InstallPWA from "./components/InstallPwa";

export default function PdfSign() {
  const [pdf, setPdf] = useState();
  const [pdfBuffer, setPdfBuffer] = useState();
  const [togglePad, setTogglePad] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [signer, setSigner] = useState();
  const [coordinate, setCoordinate] = useState();
  const {
    pdfBuffer: resultPdfBuffer,
    pages,
    editFinished, 
    drawData,
    token
  } = useSelector((state) => state.tabs);
  const [toggleSign, setToggleSign] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  useEffect(() => {
    const { token } = queryString.parse(window.location.search);
    // dispatch(getPayload());
    dispatch(setToken(token));
    docsignService.requestDoc(token).then(res => {
      console.log(res);
      const id = res.id;
      console.log("id = ", id);
      const payload = res.payload;
      const doc = payload.documents[0];
      const originalPdfBuffer = b64toBytes(doc.documentBase64);
      const s = payload?.recipients?.signers[id];
      setSigner(s);
      setCoordinate(res.coordinates?.allSigners[id]);
      setPdf((old) => ({ ...old, filename: trimFileName(doc.name) }));
      setPdfBuffer(originalPdfBuffer);
    })
    .catch(err => {
      if(err.message === "Unauthorized") {
        navigate("/login");
      }
      console.log(err);
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

    const signedResult = await docsignService.sign(token, JSON.stringify(drInfo));
    let blob;
    let link;

    console.log("+++++++++++ audit trail :: ", signedResult);
    const json2html = require("json2html");
    const testJson = {
      certificateOfCompletion: [
        {
          folerId: "3419dldlr873a3d4",
          subject: "Please Sign",
          docPages: 4,
          signatures: 4,
          initials: 6,
          certPages: 5
        }
      ],
      recordTracking: [
        {
          status: "Original",
          location: "Self Custody"
        }
      ],
      signerLog: [
        {
          name: "owner one",
          email: "maximgoriki88@gmail.com",
          authLevel: "Email Verification",
          signatureId: "dlfdkriu349",
          initialId: "lkdlh9ulds",
          ipAddrress: "192.43.144.32",
          disclosureAccepted: "8/4 2022 8:30 pm",
          sent: "8/4 2022 7:32 pm",
          viewed: "8/4 2022 8:32 pm",
          signed: "8/4 2022 9:32 pm",
        },
        {
          name: "owner two",
          email: "maximgoriki88@gmail.com",
          authLevel: "Email Verification",
          signatureId: "315ld34fdkriu349",
          initialId: "djlo934;h",
          ipAddrress: "172.43.144.32",
          disclosureAccepted: "8/4 2022 7:30 pm",
          sent: "8/4 2022 7:36 pm",
          viewed: "8/4 2022 8:56 pm",
          signed: "8/4 2022 9:20 pm",
        }
      ]
    };
    const auditTrailHtml = json2html.render(testJson);
    const html = htmlToPdfmake(auditTrailHtml);
    const pdfMake = require("pdfmake/build/pdfmake");
    var pdfFonts = require("pdfmake/build/vfs_fonts");
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    // pdfMake.createPdf({
    //   content:html,
    //   defaultStyle: {
    //     fontSize: 12
    //   },
    //   pageOrientation: 'landscape',
    //   pageSize: "A2",
    //   pageMargins: [ 10, 10, 10, 10 ],
    // })
    //   .download("audit-trail.pdf");
    
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
        coordinate={coordinate}
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
