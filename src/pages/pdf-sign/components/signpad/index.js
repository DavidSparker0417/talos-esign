import React, { Component } from "react";
import { toast } from "react-toastify";
import SignaturePad from "signature_pad";
import { Button, Grid } from "@mui/material";
import { degrees, PDFDocument, rgb, StandardFonts } from "pdf-lib";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import DocsignService from "../../../../service/docsign.service";
import { arrayBufferToBase64, b64toBytes } from "../../helper";

class SignPad extends Component {
  constructor(props) {
    super(props);
    this.clearSign = this.clearSign.bind(this);
    this.onSign = this.onSign.bind(this);
    this.closeBtn = this.closeBtn.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.resizeCanvas = this.resizeCanvas.bind(this);
    this.state = {
      type: 0,
      sign_text: "",
    };
  }

  signaturePad = null;

  componentDidMount() {
    const canvas = document.querySelector("#canvas");

    window.addEventListener("resize", this.resizeCanvas);
    this.resizeCanvas();

    this.signaturePad = new SignaturePad(canvas);
  }

  clearSign() {
    this.signaturePad.clear();
    this.setState({ sign_text: "" });
  }

  async onSign() {
    const pdfBuffer = this.props?.pdfBuffer;
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const pages = pdfDoc.getPages();
    const curPageNum = this.props.page - 1;
    const curPage = pages[curPageNum];
    
    let type = "draw";
    let x, y;
    let signData;
    let imgWidth, imgHeight;
    if (this.state.type === 1) {
      const { width, height } = curPage.getSize();
      type = "text";
      x = 5;
      y = height / 2 + 300;
      signData = this.state.sign_text;
      curPage.drawText(signData, {
        x,
        y,
        size: 50,
        font: helveticaFont,
        color: rgb(0.95, 0.1, 0.1),
        rotate: degrees(-45),
      });
    } else {
      const pngDataUrl = await this.signaturePad.toDataURL();
      const pngImageBytes = await fetch(pngDataUrl).then((res) =>
        res.arrayBuffer()
      );

      const pngImageB64 = await fetch(pngDataUrl).then((res) => {
        return res.url.split("base64,")[1];
      });
      
      const pngImage = await pdfDoc.embedPng(pngImageBytes);
      const pngDims = pngImage.scale(1.0);
      type = "draw";
      x = curPage.getWidth() / 2 - pngDims.width / 2 + 75;
      y = curPage.getHeight() / 2 - pngDims.height + 250;
      imgWidth = pngDims.width;
      imgHeight = pngDims.height;
      signData = pngImageB64;
      curPage.drawImage(pngImage, {
        x,
        y,
        width: imgWidth,
        height: imgHeight,
      });
    }

    let pdfBytes = await pdfDoc.save();
    let signedResp;
    try {
      signedResp = await DocsignService.signDoc(
        arrayBufferToBase64(pdfBuffer),
        {
            page: curPageNum,
            type,
            width : curPage.getWidth(),
            height : curPage.getHeight(),
            x,
            y,
            imgWidth,
            imgHeight,
            data: signData
        }
      );
    } catch (e) {
      toast.error(e.message);
    }
    
    const signedBuffer = b64toBytes(signedResp.data);
    var bytes = new Uint8Array(signedBuffer);
    var blob = new Blob([bytes], { type: "application/pdf" }); // change resultByte to bytes

    if (this.props.update) {
      this.props.update(pdfBytes);
    }
    var link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "signed.pdf";
    link.click();
    this.closeBtn();
  }

  closeBtn() {
    if (this.props.close) {
      this.props.close();
    }
  }

  resizeCanvas() {
    if (this.state.type === 0) {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      const canvas = document.querySelector("#canvas");
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      canvas.getContext("2d").scale(ratio, ratio);
      if (this.signaturePad) this.signaturePad.clear(); // otherwise isEmpty() might return incorrect value
    }
  }

  handleChange(event) {
    this.setState({
      type: event.target.value,
    });
  }

  handleTextChange(event) {
    console.log("textarea: ", event.target.value);
    this.setState({
      sign_text: event.target.value,
    });
  }

  render() {
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
          onClick={this.closeBtn}
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
              value={this.state.type}
              label="CHOOSE STYLE"
              onChange={this.handleChange}
              inputProps = {{
                sx: {
                  padding: "0.5rem"
                }
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
            <Button variant="text" color="primary" onClick={this.clearSign}>
              Clear
            </Button>
          </div>
          <div
            style={{
              height: "300px",
              backgroundColor: "pink",
              borderRadius: "10px",
            }}
          >
            {this.state.type === 0 ? (
              <canvas id="canvas" style={{ width: "100%", height: "100%" }} />
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
                value={this.state.sign_text}
                onChange={this.handleTextChange}
              ></textarea>
            )}
          </div>
          <div>
            <p>
              By selecting Adopt and Sign, I agree that the signature and
              initals will be my electronic representation of my Signature and
              Initials for all purposes within these documents. When I, my
              agent, or my representative use them on all documents both on
              binding and non binting contacts, such signatures and initals will
              act just the same as a Pen to Paper signature and initial.
            </p>
          </div>
        </div>
        <div style={{ flex: 1 }}></div>
        <div style={{ display: "flex", height: "50px" }}>
          <Button
            variant="contained"
            color="primary"
            style={{ flex: 1, borderRadius: "0px" }}
            onClick={this.onSign}
          >
            ADOPT and SIGN
          </Button>
          <Button
            variant="outlined"
            color="primary"
            style={{ flex: 1, borderRadius: "0px" }}
            onClick={this.closeBtn}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }
}

export default SignPad;
