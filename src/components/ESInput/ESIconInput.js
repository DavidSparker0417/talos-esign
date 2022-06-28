/**
 **************************************************************
 * The Fans Together Website - v1.0.0
 **************************************************************
 * 
 * Product Page: 
 * Copyright 2022 @TFTTeam (https://www.tft-dev-team.com)
 * 
 * Coded by Telecrypto@OKI
 * 
 **************************************************************
 */

import React from "react";
import { forwardRef } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// mui components
import InputAdornment from "@mui/material/InputAdornment";

import { ESIconInputRoot } from "./ESInputRoot";

const ESIconInput = forwardRef(({
  error, success, disabled, normal,
  icon,
  readOnly,
  InputProps,
  ...props
}, ref) => (
  <ESIconInputRoot
    ref={ref}
    ownerState={{ error, success, disabled, normal }}
    fullWidth
    InputProps={{
      readOnly,
      ...InputProps,
      startAdornment: icon
        ? (
          <InputAdornment position="start">
            {icon}
          </InputAdornment>
        )
        : null,
    }}
    {...props}
  />
));

// Setting default values for the props of ESIconInput
ESIconInput.defaultProps = {
  error: false,
  success: false,
  disabled: false,
  normal: true
};

// Typechecking props for the ESIconInput
ESIconInput.propTypes = {
  error: PropTypes.bool,
  success: PropTypes.bool,
  disabled: PropTypes.bool,
  normal: PropTypes.bool,
  icon: PropTypes.any,
  readOnly: PropTypes.any,
  InputProps: PropTypes.any,
};

ESIconInput.displayName = "ESIconInput";
export default ESIconInput;
