import { styled } from "@mui/material";
import { Box } from "@mui/material";

export default styled(Box)(({theme, ownerState}) => {
  const {palette} = theme;
  const {borderColor} = ownerState;

  const borderColorValue = palette[borderColor] ? palette[borderColor].main : "inherit";
  return {
    borderColor: borderColorValue
  }
});