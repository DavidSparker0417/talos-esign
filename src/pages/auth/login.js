import { Box, Tab, Tabs, Typography } from "@mui/material";
import {withStyles} from "@mui/styles";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { refresh } from "../../redux/auth";
import SignIn from "./signin";
import SignUp from "./signup";

const StyledTabs = withStyles({
  flexContainer: {
    justifyContent: "center"
  }
})(Tabs);

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function Login() {
  const [tabIndex, setTabIndex] = useState(0);
  const dispatch = useDispatch();

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
    dispatch(refresh());
  };
  return (
    <Box width="70%" margin="auto" paddingTop="20%">
      <StyledTabs 
        value={tabIndex} 
        onChange={handleChange}
        contentContainerStyle={{justifyContent: "center"}}
      >
        <Tab label="Login" {...a11yProps(0)}/>
        <Tab label="Register" {...a11yProps(1)} />
      </StyledTabs>

      <TabPanel value={tabIndex} index={0}>
        <SignIn />
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <SignUp />
      </TabPanel>
    </Box>
  );
}
