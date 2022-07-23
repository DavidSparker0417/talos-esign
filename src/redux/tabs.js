import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { b64toBytes } from "../pages/pdf-sign/helper";
import docsignService from "../service/docsign.service";
import { PDFDocument } from "pdf-lib";

export const getPayload = createAsyncThunk(
  "app/doc-sign/req-payload",
  async() => {
    try {
      const data = await docsignService.requestDoc();
      const {payload, coordinates} = data;
      console.log(payload);
      const doc = payload.documents[0];
      const pdfBuffer = b64toBytes(doc.documentBase64);
      const d = await PDFDocument.load(pdfBuffer);
      // state.pages = Array(state.pageCount).fill({});
      // state.pdfBuffer = pdfBuffer;
      return {
        fileName: doc.name,
        pdfBuffer: doc.documentBase64,
        pageCount: d.getPageCount(),
        signers: payload?.recipients?.signers
      };
    }
    catch(err) {
      console.log("Cannot get document from backend!");
    }
  }
);

const tabsSlice = createSlice({
  name: "PDF",
  initialState : {
    coordinates: undefined,
    pdfBuffer: undefined,
    fileName: undefined,
    signers: undefined,
    pageCount: 0,
    pages: [],
    drawData : {
      initial: {
        width: 24,
        height: 12,
        url: undefined
      },
      sig: {
        width: 64,
        height: 20,
        url: undefined
      },
      date: {
        width: 64,
        height: 20,
        text: undefined
      },
    },
    editFinished: false,
    setupComplete: false,
    signFinished: false,
    signDate: "",
  },
  reducers: {
    pdfLoad(state, action) {
      console.log("[REDUX] pdfLoad :: ", action.payload);
      const p = action.payload;
      state.pdfBuffer = p.buffer;
      state.pageCount = p.pageCount;
      state.pages = Array(p.pageCount).fill({});
    },
    setDrawData(state, action) {
      state.drawData.initial.url = action.payload.initial;
      state.drawData.sig.url = action.payload.sig;
      state.drawData.date.text = action.payload.date;
      console.log("[REDUX] setDrawData :: ", action.payload);
      state.setupComplete = true;
    },
    setTab(state, action) {
      const p = action.payload;
      const i = p.index;
      if (p.data.initial) {
        if (!state.pages[i].initial)
          state.pages[i].initial = {};
        state.pages[i].initial.pos = p.data.initial;
        state.pages[i].initial.drawn = false;
      }
      if (p.data.sig) {
        if (!state.pages[i].sig)
          state.pages[i].sig = {};
        state.pages[i].sig.pos = p.data.sig;
        state.pages[i].sig.drawn = false;
      }
      if (p.data.date) {
        if (!state.pages[i].date)
          state.pages[i].date = {};
        state.pages[i].date.pos = p.data.date;
        state.pages[i].date.drawn = false;
      }
      state.editFinished = false;
      console.log("[REDUX] setTab :: ", p);
    },
    drawTab(state, action) {
      const p = action.payload;
      const i = p.index;
      const {type} = p;
      console.log(`[REDUX] draw ${type} tab on page(${i})`);
      if (type === "initial")
        state.pages[i].initial.drawn = true;
      else if (type === "signature")
        state.pages[i].sig.drawn = true;
      else if (type === "date")
        state.pages[i].date.drawn = true;
      
      let finished = true;
      for(const j in state.pages) {
        if (state.pages[j].initial?.drawn === false ||
            state.pages[j].sig?.drawn === false)
        {
          finished = false;
          break;
        }
      }
      if(finished === true)
        state.editFinished = true;
    },
    doSign(state, action) {
      state.signFinished = true;
      state.signDate = action.payload;
    }
  },
  extraReducers : {
    [getPayload.fulfilled] : async (state, action) => {
      console.log("++++++++++++ 1 :: ", action.payload);
      const p = action.payload;
      // state.coordinates = action.payload.coordinates;
      // const doc = docPayload.documents[0];
      // console.log("++++++++++++ 1");
      // const pdfBuffer = b64toBytes(doc.documentBase64);
      // state.fileName = doc.name;
      // state.signers = docPayload?.recipients?.signers;
      // const d = await PDFDocument.load(pdfBuffer);
      // state.pageCount = d.getPageCount();
      // state.pages = Array(state.pageCount).fill({});
      state.pdfBuffer = p.pdfBuffer;
    },
  }
});

export const {setTab, drawTab, setDrawData, pdfLoad, doSign} = tabsSlice.actions;
export default tabsSlice.reducer;