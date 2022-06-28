export function getBackendErrMsg(error) {
  return error?.response?.data?.message 
    || error.message 
    || error.toString();
}
