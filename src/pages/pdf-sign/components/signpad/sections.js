import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  styled,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { forwardRef, useEffect, useRef, useState } from "react";
import getAbbrName from "./helpers";
import SignaturePad from "react-signature-canvas";
import FontPicker from "font-picker-react";
import DSButton from "../../../../components/DSButton";
import DSTypography from "../../../../components/DSTypography";
import DSBox from "../../../../components/DSBox";
import DSInput from "../../../../components/DSInput";

function NameBox({ label, value, setValue, ...rest }) {
  return (
    <Grid container wrap="nowrap" flexDirection="column" {...rest}>
      <Typography fontSize="12px">
        {label}
        <Typography component="span" color="#bd0808">
          &nbsp;*
        </Typography>
      </Typography>
      <DSInput
        required
        id="outlined-required"
        value={value}
        onChange={({ target }) => setValue(target.value)}
        sx={{
          border: "solid 2px grey"
        }}
        InputProps = {{
          style : {
            fontSize: "3vw"
          }
        }}
      />
    </Grid>
  );
}

export default function SignerNamePanel({
  name,
  setName,
  abrName,
  setAbrName,
  ...rest
}) {
  return (
    <Grid container {...rest} justifyContent="space-between">
      <NameBox label="FULL NAME" value={name} setValue={setName} xs={6}/>
      <NameBox label="INITIALS" value={abrName} setValue={setAbrName} xs={4}/>
    </Grid>
  );
}

const DSToggleButton = styled(ToggleButton)(({theme}) => {
  const {button, white, primary } = theme?.palette;
  return {
    backgroundColor: button.main,
    color: white.main,
    borderRadius: "0",
    "&.Mui-selected, &.Mui-selected:hover": {
      backgroundColor: primary.main,
      color: white.main,
    },
    "&:hover" : {
      backgroundColor: button.main,
      color: "orange",
    }
  }
});

export function ChooseStyle({ onStyleChange, ...rest }) {
  const [type, setType] = useState(1);
  const [editType, setEdityType] = useState("text");

  useEffect(() => {
    if (!onStyleChange)
      return;
    
    switch(editType) {
      case "text":
      case "upload":
        onStyleChange(1);
        break;
      case "pen":
        onStyleChange(0);
        break;
    }
    // onStyleChange(type);
  }, [editType]);

  function handleChange(event, newType) {
    setEdityType(newType);
    console.log("[DAVID] +++++++++++ changine type :: ", newType);
  }

  return (
    <Grid container {...rest}>
      <ToggleButtonGroup 
        exclusive
        value = {editType}
        onChange = {handleChange}
        fullWidth
      >
        <DSToggleButton 
          value="text" 
        >
            Text
        </DSToggleButton>
        <DSToggleButton
          value="pen"
        >
          Pen
        </DSToggleButton>
        <DSToggleButton
          value="upload"
        >
          upload
        </DSToggleButton>
      </ToggleButtonGroup>
      {/* <FormControl {...rest} style={{ flex: 1 }}>
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
      </FormControl> */}
      {/* <DSButton style={{ flex: 1 }}>{type === 0 ? "DRAW" : "TEXT"}</DSButton> */}
      {/* <DSButton style={{ flex: 1 }}>UPLOAD</DSButton> */}
    </Grid>
  );
}

const FingerDrawPanel = forwardRef(({ type, title }, ref) => {
  useEffect(() => {
    if (type == 1) {
      ref.current.off();
    } else {
      ref.current.on();
    }
  }, [type, ref]);

  return (
    <DSBox border="solid 2px" borderColor="border">
      <Typography backgroundColor="yellow">{title}</Typography>
      <SignaturePad
        dotSize={2}
        minWidth={2}
        maxWidth={5}
        canvasProps={{
          style: {
            width: "100%",
            height: "150px",
          },
        }}
        ref={ref}
      />
    </DSBox>
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

export const fontList = [
  "Mr Dafoe",
  "Pacifico",
  "Permanent Marker",
  "Sriracha",
  "Yellowtail",
  "Architects Daughter",
  "Berkshire Swash",
  "Caveat Brush",
  "Damion",
  "Gochi Hand",
];

function ChangeFonts({ name, onChangeFont }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    onChangeFont(fontList[0]);
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleChangeFont = (font) => {
    setAnchorEl(null);
    if (onChangeFont) onChangeFont(font);
  };

  return (
    <Box>
      <DSButton
        id="basic-button"
        variant="gradient"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{
          color: "mediumblue",
          textTransform: "none",
        }}
      >
        Chang STYLE
      </DSButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {fontList.map((f, i) => (
          <MenuItem
            key={`font-change-${i}`}
            onClick={() => handleChangeFont(f)}
          >
            <Typography fontFamily={f}>{name}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
export const DrawPanel = forwardRef((props, ref) => {
  const { signRef, initialRef } = ref;
  const [activeFont, setActiveFont] = useState();

  function drawBySystemFont() {
    if (props.type !== 1) return;
    clearSign();
    console.log("drawBySystemFont :: ", activeFont);
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
  }, [props.type, activeFont, props.name, props.abrName]);

  function clearSign() {
    // setSignText("");
    signRef?.current?.clear();
    initialRef?.current?.clear();
  }

  return (
    <Grid container wrap="nowrap" flexDirection="column" px={1}>
      <Grid
        item
        mt={2}
        container
        justifyContent="space-between"
        alignItems="center"
      >
        <DSTypography fontSize="1.5rem" color="border">
          Preview
        </DSTypography>
        <Button
          variant="text"
          color="primary"
          onClick={props.type === 0 ? clearSign : () => {}}
        >
          Clear
        </Button>
      </Grid>
      <Box>
        <FingerDrawPanel title="Signature" type={props.type} ref={signRef} />
        <FingerDrawPanel title="Initial" type={props.type} ref={initialRef} />
        {props.type === 1 && (
          <ChangeFonts name={props.name} onChangeFont={setActiveFont} />
        )}
      </Box>
      <Typography mt={1} fontSize={{ xs: "10px", sm: "16px" }}>
        By selecting Adopt and Sign, I agree that the signature and initals will
        be my electronic representation of my Signature and Initials for all
        purposes within these documents. When I, my agent, or my representative
        use them on all documents both on binding and non binting contacts, such
        signatures and initals will act just the same as a Pen to Paper
        signature and initial.
      </Typography>
    </Grid>
  );
});

export function FinishSettings({ onSign, onCancel }) {
  return (
    <div style={{ display: "flex", height: "40px" }}>
      <DSButton
        onClick={onSign}
        sx={{
          flex: 1,
          textTransform: "none",
        }}
      >
        ADOPT and SIGN
      </DSButton>
      <DSButton
        variant="gradient"
        sx={{
          flex: 1,
          color: "#c84c09",
          textTransform: "none",
        }}
        onClick={onCancel}
      >
        Cancel
      </DSButton>
    </div>
  );
}
