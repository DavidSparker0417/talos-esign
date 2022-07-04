import { makeStyles } from "@mui/styles";

export default makeStyles(props => {
  return {
    PDFDocWrapper: {
      "& .react-pdf__Document": {
        overflow: "hidden",
        width: "100%"
      },
      "& .react-pdf__Page__canvas" : {
        width: "100%!important",
      }
    },
  };
});
