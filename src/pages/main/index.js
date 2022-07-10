import { Routes, Route, Navigate } from "react-router-dom";
import { Typography } from "@mui/material";
import NavBar from "../../components/NavBar";
import PdfSign from "../pdf-sign/PdfSign";
import { useUI } from "../../context/ui";
import { useEffect } from "react";
import Test from "../test";

export default function Main() {
  const {setLoading} = useUI();
  useEffect(() => {
    setLoading(false);
  }, []);
  return (
    <>
      <NavBar
        components={[
        <Typography variant="h4" fontSize={{xs:"24px", sm:"36px"}}>Smart Contracts</Typography>
      ]}
      />
      <Routes>
        <Route exact path="doc-sign" element={<PdfSign />} />
        <Route exact path="test" element={<Test />} />
        <Route exact path="/" element={<Navigate to="doc-sign?id=4" />} />
      </Routes>
    </>
  );
}
