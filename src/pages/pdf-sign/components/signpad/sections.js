import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { forwardRef, useEffect, useRef, useState } from "react";
import getAbbrName from "./helpers";
import SignaturePad from "react-signature-canvas";
import FontPicker from "font-picker-react";
import DSButton from "../../../../components/DSButton";

export default function SignerNamePanel({ name, setName, abrName, setAbrName, ...rest }) {

  return (
    <Grid container {...rest}>
      <Grid item xs={8}>
        <TextField
          required
          id="outlined-required"
          label="FULL NAME"
          value={name}
          onChange={({target}) => setName(target.value)}
          fullWidth
          inputProps={{
            style: {padding: "0.2rem"}
          }}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          required
          id="outlined-required"
          label="INITIALS"
          value={abrName}
          fullWidth
          onChange={({ target }) => setAbrName(target.value)}
          inputProps={{
            style: {padding: "0.2rem"}
          }}
        />
      </Grid>
    </Grid>
  );
}

export function ChooseStyle({ onStyleChange, ...rest }) {
  const [type, setType] = useState(0);

  useEffect(() => {
    onStyleChange && onStyleChange(type);
  }, [type]);

  return (
    <Grid container>
      <FormControl {...rest} style={{flex:1}}>
        <InputLabel id="draw-style-label">CHOOSE STYLE</InputLabel>
        <Select
          labelId="draw-style-label"
          id="draw-style"
          value={type}
          label="CHOOSE STYLE"
          onChange={({ target }) => setType(target.value)}
          inputProps={{
            sx: {
              padding: "0.5rem",
            },
          }}
        >
          <MenuItem value={0}>PEN</MenuItem>
          <MenuItem value={1}>TEXT</MenuItem>
        </Select>
      </FormControl>
      <DSButton style={{ flex: 1 }}>
        {type === 0 ? "DRAW" : "TEXT"}
      </DSButton>
      <DSButton style={{ flex: 1 }}>
        UPLOAD
      </DSButton>
    </Grid>
  );
}

const FingerDrawPanel = forwardRef((props, ref) => {
  return (
    <Box border="solid 1px black">
      <Typography backgroundColor="yellow">{props.title}</Typography>
      <SignaturePad 
        dotSize = {4.5}
        minWidth={3}
        maxWidth={10}
        canvasProps = {{
          style: {
            width: "100%",
            height: "150px",
          }
        }}
        ref={ref} 
      />
    </Box>
  );
});

const TextStyledPanel = forwardRef(
  ({ title, text, activeFont, ...rest }, ref) => {
    return (
      <Box {...rest}>
        <Typography backgroundColor="yellow">{title}</Typography>
        <TextField
          fullWidth
          value={text}
          {...rest}
          InputProps={{
            sx: {
              fontFamily: activeFont,
              fontSize: "xxx-large",
            },
          }}
        />
      </Box>
    );
  }
);

export const DrawPanel = forwardRef((props, ref) => {
  const { signRef, initialRef } = ref;
  const [activeFont, setActiveFont] = useState("Alex Brush");

  function drawBySystemFont() {
    if (props.type !== 1)
      return;
    clearSign();
    let ctx = signRef?.current?.getCanvas()?.getContext("2d");
    ctx.font = `48px ${activeFont}`;
    ctx.fillText(props.name, 10, 50);

    ctx = initialRef?.current?.getCanvas()?.getContext("2d");
    ctx.font = `48px ${activeFont}`;
    ctx.fillText(props.abrName, 10, 50);
  }

  useEffect(() => {
    clearSign();
    drawBySystemFont();
  }, [props.type]);

  useEffect(() => {
    if (props.type !== 1)
      return;
    drawBySystemFont();
  }, [activeFont]);

  useEffect(() => {
    drawBySystemFont();
  }, [props.name, props.abrName]);

  function clearSign() {
    // setSignText("");
    signRef?.current?.clear();
    initialRef?.current?.clear();
  }

  return (
    <Grid container wrap="nowrap" flexDirection="column">
      <Grid item>
        <Button
          variant="text"
          color="primary"
          onClick={clearSign}
          sx={{
            width: "fit-content",
            float: "right",
          }}
        >
          Clear
        </Button>
      </Grid>
      <Box>
        <FingerDrawPanel title="Signature" ref={signRef} />
        <FingerDrawPanel title="Initial" ref={initialRef} />
        <FontPicker
          apiKey="AIzaSyAKBqo-hpY-nz_NG-kbQ3LxwPF_CKIBmnk"
          activeFontFamily={activeFont}
          onChange={(nextFont) => setActiveFont(nextFont.family)}
          categories="handwriting"
        />
      </Box>
      {/* {props.type === 0 ? (
        <Box>
          <FingerDrawPanel title="Signature" ref={signRef} />
          <FingerDrawPanel title="Initial" ref={initialRef} />
        </Box>
      ) : (
        <Box>
          <TextStyledPanel 
            title="Signature"
            text={props.name} 
            activeFont={activeFont} 
            mb={1}
          />
          <TextStyledPanel 
            title="Initial"
            text={signText} 
            activeFont={activeFont} 
            mb={1}
          />
          <FontPicker
            apiKey="AIzaSyAKBqo-hpY-nz_NG-kbQ3LxwPF_CKIBmnk"
            activeFontFamily={activeFont}
            onChange={(nextFont) => setActiveFont(nextFont.family)}
            categories="handwriting"
          />
        </Box>
      )} */}
      <Typography mt={1} fontSize={{xs:"10px", sm: "16px"}}>
          By selecting Adopt and Sign, I agree that the signature and initals
          will be my electronic representation of my Signature and Initials for
          all purposes within these documents. When I, my agent, or my
          representative use them on all documents both on binding and non
          binting contacts, such signatures and initals will act just the same
          as a Pen to Paper signature and initial.
      </Typography>
    </Grid>
  );
});

export function FinishSettings({ onSign, onCancel }) {
  return (
    <div style={{ display: "flex", height: "50px" }}>
      <Button
        variant="contained"
        color="primary"
        style={{ flex: 1, borderRadius: "0px" }}
        onClick={onSign}
      >
        ADOPT and SIGN
      </Button>
      <Button
        variant="outlined"
        color="primary"
        style={{ flex: 1, borderRadius: "0px" }}
        onClick={onCancel}
      >
        Cancel
      </Button>
    </div>
  );
}
