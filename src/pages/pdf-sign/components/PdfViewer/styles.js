import { Badge, styled } from "@mui/material";
import { makeStyles } from "@mui/styles";

export default makeStyles(props => {
  return {
    PDFDocWrapper: {
      "& .react-pdf__Document": {
        overflow: "hidden",
        // width: "100%"
      },
      "& .react-pdf__Page__canvas" : {
        width: "100%!important",
      },
      "& .swiper-slide" : {
        position: "relative",
        display: "flex"
      }
    },
  };
});

export const FreshingBanner = styled(Badge)(({theme}) => {
  return {
    cursor: "pointer",
    borderRadius: "3px",
    "-webkit-animation": "glowing 1500ms infinite",
    "-moz-animation:" : "glowing 1500ms infinite",
    "-o-animation:" : "glowing 1500ms infinite",
    animation : "glowing 1500ms infinite"
  }
});