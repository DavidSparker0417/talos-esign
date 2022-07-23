import React from "react";
import payload from "../pdf-sign/payload.json";
import coordinates from "../pdf-sign/coordinates.json";
import DSButton from "../../components/DSButton";
import docsignService from "../../service/docsign.service";
export default function Test() {
  const {deliverDoc} = docsignService;
  function onDeliver() {
    deliverDoc(JSON.stringify(payload), JSON.stringify(coordinates));
  }
  return (
    <DSButton onClick = {onDeliver}>
      Deliver
    </DSButton>
  );
}
