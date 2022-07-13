import {useSelector} from "react-redux";
import { Box, Grid } from "@mui/material";
import DSButton from "../../../components/DSButton";
import { PDFDocument } from "pdf-lib";

export default function TriggerPanel({onSetting}) {
  const {
    pdfBuffer, 
    pageCount, 
    pages, 
    drawData, 
    editFinished} = useSelector(state => state.tabs);
  
  async function onSign() {
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    console.log("++++++++++ :: siging :: ", pdfDoc);
    const initialPng = await pdfDoc.embedPng(drawData.initial.url);
    const sigPng = await pdfDoc.embedPng(drawData.sig.url);
    for(const i in pages) {
      console.log(pages[i]);
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
      }
      if (pages[i].date) {
        const pos = pages[i].date.pos;
        const y = curPage.getHeight() - pos.py - drawData.date.height/3;
        curPage.drawText(drawData.date.text, {
          size: 16,
          x: pos.px,
          y: y,
          width: drawData.date.width,
          height: drawData.date.height,
        });
      }
    }

    const pdfBytes = await pdfDoc.save();
    const bytes = new Uint8Array(pdfBytes);
    const blob =  new Blob([bytes], {type: "application/pdf"});
    let link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "signed.pdf";
    link.click();
  }
  return (
    <Grid container justifyContent="space-around">
      <DSButton onClick={onSetting}>
        Settings
      </DSButton>
      {editFinished === true && (
        <DSButton onClick={onSign}>
          Sign!
        </DSButton>
      )}
    </Grid>
  );
}
