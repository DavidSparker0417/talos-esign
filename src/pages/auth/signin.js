import { useSelector, useDispatch } from "react-redux";
import { Box, TextField, Typography, useTheme } from "@mui/material";
import { AuthTextField, ErrorBox } from "./styled";
import * as yup from "yup";
import { useFormik } from "formik";
import { login, signin } from "../../redux/auth";
import InputForm from "../templates/InputForm";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import KeyIcon from "@mui/icons-material/Key";
import { useUI } from "../../context/ui";

export default function SignIn() {
  const dispatch = useDispatch();
  const errMessage = useSelector(state => state.auth.err);
  const {setLoading} = useUI();

  setLoading(useSelector(state => state.auth.pending));
  const LoginValidationSchema = yup.object({
    uemail: yup
      .string(`Enter your username or email address`)
      .min(3, `Username should be of minimum 3 characters length`)
      .required(`Username or Email address is required`),
    password: yup
      .string(`Enter your password`)
      .min(8, `Password should be of minimum 8 characters length`)
      .required(`Password is required`),
  });

  const formik = useFormik({
    initialValues: {
      uemail: "",
      password: "",
    },
    validationSchema: LoginValidationSchema,
    onSubmit: async (values) => {
      const { uemail, password } = values;
      const reqData =
        uemail.indexOf("@") !== -1
          ? {
            email: uemail,
            password,
          }
          : {
            username: uemail,
            password,
          };

      doLogIn({
        type: "esign",
        data: {
          ...reqData,
        },
      });
    },
  });

  const LoginFormData = [
    {
      type: "uemail",
      name: "uemail",
      caption: `Username / email:`,
      placeholder: `Username or Email Address`,
      icon: <ContactMailIcon />,
    },
    {
      type: "password",
      name: "password",
      caption: `Password:`,
      placeholder: `Enter your password`,
      icon: <KeyIcon />,
    },
  ];
  const buttons = [
    {
      type: "submit",
      caption: `Log In`,
      onClick: () => { },
    },
    {
      caption: "Fogot Password",
      onClick: () => {}
    }
  ];

  function doLogIn({ type, data }) {
    dispatch(signin({ type, data }));
  }

  return (
    <Box>
      <InputForm
        title="Log In"
        items = {LoginFormData}
        formik = {formik}
        buttons = {buttons}
      ></InputForm>
      {
        errMessage &&
        <ErrorBox>
          {errMessage}
        </ErrorBox>
      }
    </Box>
  );
}
