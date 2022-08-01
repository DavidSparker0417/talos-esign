import React from "react";
import payload from "./payload.json";
import DSButton from "../../components/DSButton";
import docsignService from "../../service/docsign.service";
export default function Test() {
  const {deliverDoc} = docsignService;

  function onDeliver() {
    deliverDoc(JSON.stringify(payload));
  }
  return (
    <DSButton onClick = {onDeliver}>
      Deliver
    </DSButton>
  );
}
