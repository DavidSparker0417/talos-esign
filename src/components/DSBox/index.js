import { forwardRef } from "react";
import DSBoxRoot from "./DSBoxRoot";

const DSBox = forwardRef(({borderColor, children, ...rest}, ref) => {
  return(
    <DSBoxRoot 
      {...rest} 
      ref = {ref}
      ownerState = {{
        borderColor
      }}
    >
      {children}
    </DSBoxRoot>
  )
});

export default DSBox;