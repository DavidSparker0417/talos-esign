import { Routes, Route, Navigate } from "react-router-dom";
import Main from "./pages/main";
import Login from "./pages/auth/login";
import PrivateRoute, { PublicRoute } from "./routes/route";
import PdfSign from "./pages/pdf-sign/PdfSign";
import Test from "./pages/test";
import { Box } from "@mui/material";
import AuthPage from "./pages/authenticate";

function App() {
  return (<Box display="flex" flexDirection="column" height="100%">
    <Routes>
      <Route
        path="/app"
        element={
          <PrivateRoute>
            <Main />
          </PrivateRoute>
        }
      >
        <Route path="doc-sign" element={<PdfSign/>}/>
        <Route path="test" element={<Test/>}/>
      </Route>

      <Route
        path="/login"
        element={
          <PublicRoute>
            <AuthPage />
          </PublicRoute>
        }
      />

      <Route exact path="/" element={<Navigate to="/app" />} />
    </Routes>
    </Box>
  );
}

export default App;
