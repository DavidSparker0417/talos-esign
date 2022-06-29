import { Button, Grid, styled, Typography, useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
// styles
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;
export default function PdfViewer({ pdf , curPage}) {
  const pageContainerRef = useRef(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1);
  const [pageWidth, setPageWidth] = useState();
  
  function handlePageScale(parentWidth) {
    const scaleW = (parentWidth) / pageWidth;
    setScale(scaleW);
  }

  useEffect(() => {
    const resizeObserver = new ResizeObserver((event) => {
      if (pageWidth)
      {
        // console.log("[DAVID] resizeObervation :: pageWidth = ", event[0].contentBoxSize[0].inlineSize, pageWidth);
        handlePageScale(event[0].contentBoxSize[0].inlineSize);
      }
    });

    if (pageContainerRef)
      resizeObserver.observe(pageContainerRef.current);
  }, [pageContainerRef, pageWidth]);

  function onDocumentLoadSuccess({ numPages }) {
    setTotalPages(numPages);
  }

  function onHandlePageNumber(num) {
    if (num === 0 || num > totalPages) return;
    setCurrentPage(num);
    curPage(num);    
  }

  useEffect(() => {
    if (!pageWidth || !pageContainerRef.current) 
      return;
    
    console.log("[DAVID] page width changed. ", pageWidth, pageContainerRef.current.clientWidth);
    handlePageScale(pageContainerRef.current.clientWidth);
  }, [pageWidth])

  function onLoadSuccess(page) {
    setPageWidth(page.originalWidth);
  }

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      ref = {pageContainerRef}
    >
      {pdf && (
        <Document 
          // file={{data: pdf.buffer}} 
          file={pdf.url}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          { 
            Array(totalPages).fill(true).map((_, i) => 
              <Page 
                key={`page-${i}`}
                pageNumber={i} 
                scale={scale}
                noData = {false}
                onLoadSuccess = {i===1 ? onLoadSuccess : ()=>{}}
              />
          )}
        </Document>
      )}
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item xs={3} paddingLeft="16px" overflow="hidden">
          <Typography fontSize="14px">{pdf?.filename}</Typography>
        </Grid>
        {/* <Grid item xs={6} container justifyContent="center" alignItems="center">
          <Button 
            fontSize="14px"
            onClick={() => onHandlePageNumber(currentPage - 1)}>
            Prev
          </Button>
          <Typography fontSize="14px">{currentPage}</Typography>
          <Button 
            fontSize="14px"
            onClick={() => onHandlePageNumber(currentPage + 1)}>
            Next
          </Button>
        </Grid> */}
        <Grid item xs={3} paddingRight="16px" justifyContent="end">
          <Typography fontSize="14px" style={{textAlign:"end"}}>Page 1-{totalPages} </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}

