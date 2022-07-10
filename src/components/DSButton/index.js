import { forwardRef } from "react";
import DSButtonRoot from "./DSButtonRoot";

const DSButton = forwardRef(({color, variant, children, ...rest}, ref) => (
  <DSButtonRoot 
    {...rest} 
    ref={ref}
    // color="primary"
    size="small"
    variant= {variant || "contained"}
    ownerState = {{color}}
  >
    {children}
  </DSButtonRoot>
))

export default DSButton;