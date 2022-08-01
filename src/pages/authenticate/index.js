import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import DSInput from "../../components/DSInput";
import { useSelector } from "react-redux";
import docsignService from "../../service/docsign.service";
import {useNavigate} from "react-router-dom";

function FirstStage({onNext, contact, setContact, phone, setPhone}) {
  return (
    <>
      <Typography>Email</Typography>
      <DSInput sx={{ marginBottom: "2rem"}} value={contact} onChange={({target}) => setContact(target.value)}/>
      <Typography>PhoneNumber</Typography>
      <DSInput sx={{ marginBottom: "2rem"}} value={phone} onChange={({target}) => setPhone(target.value)}/>
      <Button variant="contained" onClick={onNext}>Next</Button>
    </>
  );
}

function SecondStage({contact, phone, onNext}) {
  const VerificationMethodBox = ({title, data, ...rest}) => {
    return(
    <Box border="solid 1px" p={3} {...rest} sx={{cursor: "pointer"}}>
      <Typography>{title}</Typography>
      <Typography>Use your {data} {title}</Typography>
    </Box>
    );
  }
  return(
    <Box>
      <Typography mb={3} variant="h5" textAlign="center">Select Verification Method</Typography>
      <VerificationMethodBox mb={2} title="Email" data={contact} onClick={() => onNext("email")}/>
      <VerificationMethodBox title="Phone" data={phone} onClick={() => onNext("phone")}/>
    </Box>
  )
}

function VerificationUI({code, setCode, onVerify, onResend}) {
  return(
    <Box display="flex" flexDirection="column">
      <Typography mb={3} variant="h5" textAlign="center">
        Get code from your email inbox
      </Typography>
      <Typography mb={3} textAlign="center">
        Enter code received in your email
      </Typography>
      <DSInput fullWidth sx={{marginBottom:"2rem"}} value={code} onChange={({target})=> setCode(target.value)}/>
      <Button variant="contained" sx={{marginBottom:"1rem"}} onClick={onVerify}>Verify</Button>
      <Button onClick={onResend}>Resend Code</Button>
    </Box>
  )
}

function InformBox({msg, ...rest}) {
  if (msg)
    return(
      <Typography {...rest} color="#c50b0b" textAlign="center">
        {msg}
      </Typography>
    );
  else return(<></>)
}

export default function AuthPage() {
  const [stage, setStage] = useState(0);
  const [contact, setContact] = useState();
  const [phone, setPhone] = useState();
  const [verifType, setVerifType] = useState();
  const {token} = useSelector(state=>state.tabs);
  const [verifCode, setVerifiCode] = useState();
  const navigate = useNavigate();
  const [infoMsg, setInfoMsg] = useState();
  
  useEffect(() => {
    setInfoMsg(undefined);
  }, [stage]);
  function gotoSecondStage() {
    if (!contact || !phone) {
      setInfoMsg("Plese enter contact information in the above input boxes.")
      return;
    }
    setStage(1);
  }

  async function gotoVerify(type) {
    try {
      const resp = await docsignService.auth(token, {type: type, addr: type==="email"?contact:phone});
      console.log("+++++++++++ :: ", token, resp.message);
      setInfoMsg(resp.message);
      setStage(2);
      setVerifType(type);
    } catch(e) {
      setInfoMsg(e.message);
    }
  }
  async function onVerify() {
    setInfoMsg(undefined);
    docsignService.verify(token, verifCode)
    .then(resp => {
      console.log("+++++++++++ :: ", resp);
      navigate(`/app/doc-sign/?token=${token}`);
    })
    .catch(e => {
      console.log("********* error :: ", e);
      setInfoMsg(e.message);
    });
  }
  async function onResend() {
    try {
      const resp = await docsignService.auth(token, {type: verifType, addr: verifType==="email"?contact:phone});
      setInfoMsg(resp.message);
    } catch(e) {
      setInfoMsg(e.message);
    }
  }

  return (
    <Box
      pt="20%"
      px="10%"
      position="relative"
      display="flex"
      flexDirection="column"
      flexWrap="nowrap"
    >
      <Box display="flex" justifyContent="center" mb="10%">
        <Typography variant="h4">SmartContracts</Typography>
      </Box>
      {
        stage===0 ? 
          (<FirstStage 
            onNext={gotoSecondStage} 
            contact={contact} 
            setContact={setContact}
            phone={phone}
            setPhone={setPhone}
          />)
        : stage ===1 ? 
          (<SecondStage contact={contact} phone={phone} onNext={gotoVerify}/>)
        : stage === 2 ? 
          (<VerificationUI code={verifCode} setCode={setVerifiCode} onVerify={onVerify} onResend={onResend}/>)
        : (<></>)
      }
      <InformBox mt={5} msg={infoMsg}/>
    </Box>
  );
}
