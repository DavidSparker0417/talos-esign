import { useSelector, useDispatch } from "react-redux";
import { Box, TextField, Typography, useTheme } from "@mui/material";
import { AuthTextField, ErrorBox } from "./styled";
import * as yup from "yup";
import { useFormik } from "formik";
import { login, register } from "../../redux/auth";
import InputForm from "../templates/InputForm";
import EmailIcon from "@mui/icons-material/Email";
import KeyIcon from "@mui/icons-material/Key";
import CheckIcon from "@mui/icons-material/Check";
import PersonIcon from "@mui/icons-material/Person";

export default function SignUp() {
  const dispatch = useDispatch();
  const errMessage = useSelector(state => state.auth.err);

  const LoginValidationSchema = yup.object({
    username: yup
      .string(`Enter your username`)
      .min(3, `Username should be of minimum 3 characters length`)
      .required(`This field is required!`),
    email: yup
      .string(`Enter your email address`)
      .email(`This is not a valid email.`)
      .required(`This field is required!`),
    password: yup
      .string(`Enter your password`)
      .min(8, `Password should be of minimum 8 characters length`)
      .required(`Password is required`),
    confirmPassword: yup
      .string(`Confirm your password`)
      .oneOf([yup.ref("password"), null], `Passwords must match`)
      .required(`Please retype your password.`),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: LoginValidationSchema,
    onSubmit: async (values) => {
      doRegister({
        type: "esign",
        data: {
          ...values,
        },
      });
    },
  });

  const RegisterFormData = [
    {
      type: "username",
      name: "username",
      caption: `Name: `,
      placeholder: `Enter your account name`,
      icon: <PersonIcon />,
    },
    {
      type: "email",
      name: "email",
      caption: `Email:`,
      placeholder: `Enter your email address`,
      icon: <EmailIcon />,
    },
    {
      type: "password",
      name: "password",
      caption: `Password:`,
      placeholder: `Enter your password`,
      icon: <KeyIcon />,
    },
    {
      type: "password",
      name: "confirmPassword",
      caption: `Confirm Password:`,
      placeholder: `Confirm your password`,
      icon: <CheckIcon />,
    },
  ];
  const buttons = [
    {
      type: "submit",
      caption: `Create your account`,
      onClick: () => { },
    },
  ];

  function doRegister({ type, data }) {
    dispatch(register({ type, data }));
  }

  return (
    <Box>
      <InputForm
        title="Register Your Account"
        items = {RegisterFormData}
        formik = {formik}
        buttons = {buttons}
      />
      {
        errMessage && 
        <ErrorBox>
          {errMessage}
        </ErrorBox>
      }
      
    </Box>
  );
}
