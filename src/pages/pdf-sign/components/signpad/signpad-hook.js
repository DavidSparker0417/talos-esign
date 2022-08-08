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
import docsignService from "../../../../service/docsign.service";
import { useSelector } from "react-redux";

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
  const [agree, setAgree] = useState(false);
  const {token} = useSelector(state => state.tabs);

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

  async function onSign() {
    console.log("+++++++++++++++++  :: ", initialRef.current);
    const sigImageUrl = signRef.current.getTrimmedCanvas().toDataURL();
    const signatureImageBytes = await fetch(sigImageUrl).then((res) =>
      res.arrayBuffer()
    );

    const initialImageUrl = initialRef.current.getTrimmedCanvas().toDataURL();
    try {
      await docsignService.adoptSign(token);
      setup({
        sig: sigImageUrl,
        initial: initialImageUrl,
        date: getFormattedDate(new Date())
      });
    } catch (e) {
      toast.error(e.message);
    }
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
        agree = {agree}
        setAgree = {setAgree}
        ref={{
          signRef,
          initialRef
        }}/>
      <div style={{ flex: 1 }}></div>
      <FinishSettings 
        onSign={onSign} 
        onCancel={closeBtn} 
        agree={!agree}
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
