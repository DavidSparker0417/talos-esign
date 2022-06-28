import { createTheme } from '@mui/material';
import pxToRem from "./functions/pxToRem"
import colors from './base/colors';

export default createTheme({
  functions: {
    pxToRem
  },
  palette: {...colors}
  // palette: {...colors}
})