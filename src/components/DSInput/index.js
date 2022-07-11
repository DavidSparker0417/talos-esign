import { forwardRef } from "react";
import DSInputRoot from "./DSInputRoot";

const DSInput = forwardRef(({inputProps, ...rest}, ref) => (
  <DSInputRoot 
    {...rest} 
    ref={ref}
    inputProps={{
      ...inputProps,
      style:{
        padding: "8px"
      }
    }}
  />
))

export default DSInput;