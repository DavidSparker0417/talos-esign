 import React from "react";
 import { useDispatch, useSelector } from "react-redux";
 
 import Snackbar from "@mui/material/Snackbar";
 import MuiAlert from "@mui/material/Alert";
 
 import { close, handle_obsolete } from "../../redux/messages";
 import store from "../../redux/store";
 
 const Alert = React.forwardRef(function Alert(props, ref) {
   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
 });
 
 export default function ToastBox() {
   const messages = useSelector(state => state.messages);
   const message = messages.active;
   const dispatch = useDispatch();
 
   // Returns a function that can closes a message
   const handleClose = function (message) {
     return function () {
       dispatch(close(message));
     };
   };
 
   return (message &&
     <Snackbar
       open={true}
       key={message.created}
       autoHideDuration={6000}
       anchorOrigin={{
         vertical: "bottom",
         horizontal: "right",
       }}>
       <Alert
         severity={message.severity}
         onClose={handleClose(message)}
       >
         {message.text}
       </Alert>
     </Snackbar>
   );
 }
 
 window.setInterval(() => {
   store.dispatch(handle_obsolete());
 }, 60000);
 