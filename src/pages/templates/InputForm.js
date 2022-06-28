
import React from "react";

// mui components
import Grid from "@mui/material/Grid";

// Kit components
import ESIconInput from "../../components/ESInput/ESIconInput";
import { Box, Typography, Button } from "@mui/material";

function InputForm({ title, description, items, buttons, formik, children, ...rest }) {
  return (
    <form onSubmit={formik.handleSubmit} {...rest}>
      <Typography
        variant="h4"
        textAlign="center"
        sx={{
          transform: "scale(1, 1.1)",
          letterSpacing: "2px",
        }}
      >
        {title}
      </Typography>
      {description && <Typography mb={3} fontSize="20px">
          {description}
        </Typography>
      }
      <Box
        borderRadius="xxl"
        coloredShadow="success"
        bgColor="rgba(0, 32, 59, 0.6)"
        pt={2} pb={3}
      >
        {items.map((item, index) => (
          <Grid container
            key={`inputform-grid-${index}`}
            spacing={1}
            justifyContent="center"
            textAlign="left"
            pt={2}
          >
            <Grid item xs={11} mb={1}>
              <Typography
                variant="body2"
                sx={{
                  fontSize: { xs: "14px", md: "16px" }
                }}>
                {item.caption}
              </Typography>
            </Grid>
            <Grid item xs={11} mb={2}>
              <ESIconInput
                type={item.type}
                name={item.name}
                id={item.name}
                placeholder={item.placeholder}
                readOnly={Boolean(item.readonly)}
                icon={item.icon}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values[item.name]}
                autocomplete={() => {
                    switch(item.type) {
                      case "password":
                        return "new-password";
                      case "username":
                        return "username";
                      case "email":
                        return "email";
                      default:
                        return "off";
                    }
                  }  
                }
                error={formik.touched[item.name] && Boolean(formik.errors[item.name])}
              />
              <Typography 
                color="error"
                fontSize="14px"
              >
                {formik.errors[item.name]}
              </Typography>
            </Grid>
          </Grid>
        ))}
        { children && <Grid container
          spacing={1}
          justifyContent="center"
          textAlign="left"
          pt={2}
        >
          {children}
        </Grid> }
      </Box>

      {buttons &&
      <Grid container spacing={1} mt={2} justifyContent="space-evenly" alignItems="center">
        {buttons.map((button, index) => (
          <Grid item key={`button-${index}`}>
            {
              button.type === "submit"
                ? <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    borderRadius: "8px",
                    fontSize: { xs: "14px", md: "16px" },
                  }}
                  type="submit"
                // disabled={!formik.dirty || !formik.isValid}
                >
                  {button.caption}
                </Button>
                : <Button
                  sx={{
                    borderRadius: "8px",
                    fontSize: { xs: "14px", md: "16px" },
                  }}
                  onClick={button.onClick}
                >
                  {button.caption}
                </Button>
            }
          </Grid>
        ))}
      </Grid>
      }
    </form>
  );
}

export default InputForm;
