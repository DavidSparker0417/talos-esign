import { createTheme } from '@mui/material';
import pxToRem from "./functions/pxToRem";
import rgba from "./functions/rgba";
import colors from './base/colors';

export default createTheme({
  functions: {
    pxToRem,
    rgba,
  },
  palette: {...colors},
})