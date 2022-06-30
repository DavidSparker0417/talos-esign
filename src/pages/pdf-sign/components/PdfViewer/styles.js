import { makeStyles } from "@mui/styles";

export default makeStyles(props => {
  return {
    PDFDocWrapper: {
      "& .react-pdf__Document": {
        overflow: "hidden",
      },
    },
  };
});
