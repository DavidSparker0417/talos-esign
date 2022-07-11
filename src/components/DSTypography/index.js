import { forwardRef } from "react";
import DSTypographyRoot from "./DSTypographyRoot";

const DSTypography = forwardRef(({ color, children, ...rest }, ref) => {
  return (
    <DSTypographyRoot 
      {...rest} 
      ref = {ref}
      ownerState = {{
        color
      }}
    >
      {children}
    </DSTypographyRoot>
  );
});

export default DSTypography;
