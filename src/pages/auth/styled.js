import { styled } from "@mui/material";
import {TextField, Typography} from "@mui/material";

export const AuthTextField = styled(TextField)((props) => {
  const {theme} = props;
  console.log("[AuthTextField] :: THEME = ", theme);
  return {
    borderBottomColor: theme.palette.primary.main,
    "&:before": {
      borderBottomColor: theme.palette.primary.light,
    },
    "&:after": {
      borderBottomColor: theme.palette.primary.main,
    },
    "&:hover:before": {
      borderBottomColor: `${theme.palette.primary.light} !important`,
    },
  }
})

export const ErrorBox = styled(Typography)((props) => {
  return {
    backgroundColor: "#fde1e1",
    border: "1px solid #fcd5d5",
    borderRadius: "0.25rem",
    padding: "0.75rem 1.25rem",
    marginTop: "1rem",
    color: "#7f3737",
  }
})