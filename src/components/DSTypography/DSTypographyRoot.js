import { Typography } from "@mui/material";
import { styled } from "@mui/material";

export default styled(Typography)(({theme, ownerState}) => {
  const { palette } = theme;
  const { color } = ownerState;

  const colorValue = color === "inherit" || !palette[color] ? "inherit" : palette[color].main;
  return {
    color: colorValue
  };
});