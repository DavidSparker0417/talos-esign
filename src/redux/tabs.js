import { createSlice } from "@reduxjs/toolkit";

const tabsSlice = createSlice({
  name: "PDF",
  initialState : {
    pdfBuffer: undefined,
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
        height: 24,
        url: undefined
      },
    },
    editFinished: false,
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
      console.log("[REDUX] setDrawData :: ", action.payload);
      state.drawData.initial.url = action.payload.initial;
      state.drawData.sig.url = action.payload.sig;
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
    }
  }
});

export const {setTab, drawTab, setDrawData, pdfLoad} = tabsSlice.actions;
export default tabsSlice.reducer;