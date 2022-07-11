import { Button } from "@mui/material";
import { styled } from "@mui/material";

export default styled(Button)(({theme, ownerState}) => {
  const {palette, functions} = theme;
  const {rgba} = functions;
  const {button, transparent, white} = palette;
  const {color, variant} = ownerState;
  const outliedStyles = () => {
    // background color value
    const backgroundValue = color === "white" ? rgba(white.main, 0.1) : transparent.main;
    return {
      backgroundColor: backgroundValue,
      "&:hover" : {
        backgroundColor: backgroundValue
      }
    }
  }
  const containedStyles = () => {
    const backgroundValue = palette[color] ? palette[color].main : button.main;
    return {
      backgroundColor: backgroundValue,
      "&:hover" : {
        backgroundColor: backgroundValue
      }
    }
  }
  return {
    ...(variant === "contained" && containedStyles()),
    ...(variant === "outlined" && outliedStyles()),
    borderRadius: "unset"
  }
})