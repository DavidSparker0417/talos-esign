import {
  Badge,
  Box,
  Button,
  Grid,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useRef, useState } from "react";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination, Scrollbar, Mousewheel } from "swiper";
// styles
import useStyles, { FreshingBanner } from "./styles";
import { minWidth } from "@mui/system";
import { convertMMtoPixel } from "../../helper";
import { drawTab, setTab } from "../../../../redux/tabs";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

function ESTab({ x, y, color, drawn, image, width, height, ...rest }) {
  return (
		<>
		{
			(drawn && drawn === true )
			? <Box 
					component="img" 
					src={image} 
					width={width}
					height={height}
					sx = {{
						position: "absolute",
						left: `${x}px`,
						top: `${y - height/2}px`,
					}}
				/>
			: <FreshingBanner
				{...rest}
				sx={{
					position: "absolute",
					left: `${x}px`,
					top: `${y - height/2}px`,
					width: {width},
					height: {height},
				}}
			/>
		}
		</>
  );
}

export default function PdfViewer({
  pdf,
  curPage,
  coordinates,
  signer,
}) {
  const pageContainerRef = useRef(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [scale, setScale] = useState([]);
  const classes = useStyles({ pageHeight: "900px" });
  const [coord, setCoord] = useState();
  const dispatch = useDispatch();
	const tabs = useSelector(state => state.tabs.pages);
	const drawData = useSelector(state => state.tabs.drawData)
  const [swiper, setSwiper] = useState();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!signer || !coordinates) return;
    let cooSigner;
    cooSigner = coordinates.allSigners?.owners.find(
      (o) => o.email === signer.email
    );
    if (!cooSigner)
      cooSigner = coordinates.allSigners?.tenants.find(
        (o) => o.email === signer.email
      );
    setCoord(cooSigner);
  }, [signer, coordinates]);

  function onDocumentLoadSuccess({ numPages }) {
    console.log(
      `=============== onDocumentLoadSuccess:: numPages = ${numPages} `
    );
    setTotalPages(numPages);
    setScale(Array(numPages).fill(1));
  }

  function setCoordinateParams(pageIndex, page) {
    const pOrgInitPos = coord.pages[pageIndex]?.initialCoordinates[0];
    console.log("Initial pos = ", pOrgInitPos);

    const scaleW = pageContainerRef.current.clientWidth / page.originalWidth;
    const scaleH = pageContainerRef.current.clientHeight / page.originalHeight;
    const initialRPos = convertMMtoPixel(pOrgInitPos, scaleW, scaleH);

    const pOrgSignPos = coord.pages[pageIndex]?.signatureCoordinates[0];
    console.log("Signature pos = ", pOrgSignPos);
    const sigPos = convertMMtoPixel(pOrgSignPos, scaleW, scaleH);

    let payload = {};
    payload.index = pageIndex;
		let pdata = {};
		pdata.width = page.originalWidth;
		pdata.height = page.originalHeight;
    if (initialRPos)
			pdata.initial = {
					...initialRPos
				};
    if (sigPos)
			pdata.sig = {
					...sigPos
				};
		payload.data = pdata;
    dispatch(setTab(payload));
  }

  function onLoadSuccess(page) {
    const pageIndex = page._pageIndex;
    const scaleH = pageContainerRef.current.clientHeight / page.originalHeight;
    setScale((sc) =>
      sc.map((s, i) => {
        if (i === pageIndex) return scaleH;
        else return s;
      })
    );
    console.log(
      `===============[PDF] onLoadSuccess(${pageIndex})` +
        ` page(${page.originalWidth} x ${page.originalHeight})` +
        ` container(${pageContainerRef.current.clientWidth} x ${pageContainerRef.current.clientHeight})`
    );
  }

  function onRenderSuccess(page) {
    const pageIndex = page._pageIndex;
    console.log(`=============== Rendering [${pageIndex}]`);

    setCoordinateParams(pageIndex, page);
    // console.log("[PDF] :: W/H", page.originalWidth, page.originalHeight, x, y);
  }

  function onSliderChange(swp) {
    console.log("[onSliderChange] :: ", swp.activeIndex);
    setSwiper(swp);
    setCurrentPage(swp.activeIndex);
  }

  const naviateNextPageIfAllMarked = useCallback(() => {
    const i = swiper.activeIndex;
    let isAllDrawn = true;
    if (!tabs)
      return;
    if (tabs[i].initial?.drawn === false) 
      isAllDrawn = false;
    else if (tabs[i].sig?.drawn === false) 
      isAllDrawn = false;
    console.log("[Timeout] :: ", isAllDrawn, tabs[i]);
    if (isAllDrawn === true) {
      const nextSlide = swiper.activeIndex + 1;
      if (nextSlide < totalPages)
        swiper.slideTo(nextSlide);
    }
  }, [tabs]);

  useEffect(() => {
    if (!tabs || !swiper)
      return;
    const i = swiper.activeIndex;
    let isAllDrawn = true;
    if (tabs[i].initial?.drawn === false) 
      isAllDrawn = false;
    else if (tabs[i].sig?.drawn === false) 
      isAllDrawn = false;
    console.log("[Timeout] :: ", isAllDrawn, tabs[i]);
    if (isAllDrawn === true) {
      const nextSlide = swiper.activeIndex + 1;
      if (nextSlide < totalPages)
        swiper.slideTo(nextSlide);
    }
  }, [count]);

  async function onTabClick(pn, type) {
    console.log(`++++++++ :: onTabClick(${pn}) ${type}`);
    if (!drawData?.initial?.url) {
      console.log(`You have to setup before doing this.`);
      return;
    }
    dispatch(drawTab({index: pn, type: type}));
    // setTimeout(naviateNextPageIfAllMarked, 2000);
    setTimeout(()=> setCount(c => c + 1), 2000);
  }

  return (
    <Grid
      container
      justifyContent="space-between"
      alignItems="center"
      flexDirection="column"
      wrap="nowrap"
      height="100%"
    >
      <Box
        ref={pageContainerRef}
        className={classes.PDFDocWrapper}
        height="100%"
      >
        {pdf && (
          <Document file={pdf.url} onLoadSuccess={onDocumentLoadSuccess}>
            <Swiper
              modules={[Pagination, Mousewheel]}
              mousewheel={true}
              direction={"vertical"}
              onSlideChange={onSliderChange}
              onSwiper = {(swp) => setSwiper(swp)}
              pagination={{ clickable: true }}
              style={{ height: pageContainerRef.current.clientHeight }}
            >
              {Array(totalPages)
                .fill(true)
                .map((_, i) => (
                  <SwiperSlide key={`page-${i}`}>
                    <Page
                      pageNumber={i + 1}
                      scale={scale[i] ? scale[i] : 1}
                      noData={false}
                      renderTextLayer={false}
                      // height={pageContainerRef.current.clientHeight}
                      onLoadSuccess={onLoadSuccess}
                      onRenderSuccess={onRenderSuccess}
                    />
										{tabs && tabs[i]?.initial ? (
                      <ESTab
                        x={tabs[i].initial.pos.x}
                        y={tabs[i].initial.pos.y}
												drawn = {tabs[i].initial.drawn}
												image = {drawData?.initial.url}
												width = {drawData?.initial.width}
												height = {drawData?.initial.height}
                        onClick={() => onTabClick(i, "initial")}
                      />
                    ) : (
                      <></>
                    )}
										{tabs && tabs[i]?.sig ? (
                      <ESTab
                        x={tabs[i].sig.pos.x}
                        y={tabs[i].sig.pos.y}
												drawn = {tabs[i].sig.drawn}
												image = {drawData?.sig.url}
												width = {drawData?.sig.width}
												height = {drawData?.sig.height}
												color="dodgerblue"
                        onClick={() => onTabClick(i, "signature")}
                      />
                    ) : (
                      <></>
                    )}
                  </SwiperSlide>
                ))}
            </Swiper>
          </Document>
        )}
      </Box>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item xs={6} paddingLeft="16px" overflow="hidden">
          <Typography component="span" fontSize="14px">{pdf?.filename}</Typography>
          <Typography component="span" fontFamily="Mr Dafoe">&nbsp;</Typography>
        </Grid>
        <Grid item xs={6} paddingRight="16px" justifyContent="end">
          <Typography fontSize="14px" style={{ textAlign: "end" }}>
            Page 1-{totalPages}{" "}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}
