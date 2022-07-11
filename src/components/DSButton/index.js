import { forwardRef } from "react";
import DSButtonRoot from "./DSButtonRoot";

const DSButton = forwardRef(({ color, variant, children, ...rest }, ref) => {
  const _variant = variant || "contained";
  return (
    <DSButtonRoot
      {...rest}
      ref={ref}
      size="small"
      variant={_variant}
      ownerState={{
        color,
        variant: _variant,
      }}
    >
      {children}
    </DSButtonRoot>
  );
});

export default DSButton;
