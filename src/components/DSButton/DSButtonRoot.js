import { Button } from "@mui/material";
import { styled } from "@mui/material";

export default styled(Button)(({theme, ownerState}) => {
  const {palette} = theme;
  const {button} = palette;
  const {color} = ownerState;
  const backgroundValue = palette[color] ? palette[color].main : button.main;
  return {
    backgroundColor: backgroundValue,
    "&:hover" : {
      backgroundColor: backgroundValue
    }
  }
})