import { Navigate, Route, Routes } from "react-router";
import LandingPage from "./pages/LandingPage";
import PrivacyPage from "./pages/PrivacyPage";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import PageLoader from "./components/PageLoader";

import { Toaster } from "react-hot-toast";

function App() {
  const { initAuthListener, isCheckingAuth, authUser } = useAuthStore();

  useEffect(() => {
    initAuthListener();
  }, [initAuthListener]);

  if (isCheckingAuth) return <PageLoader />;

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/chat" element={authUser ? <ChatPage /> : <Navigate to={"/login"} />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to={"/chat"} />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to={"/chat"} />} />
        <Route path="/forgot-password" element={!authUser ? <ForgotPasswordPage /> : <Navigate to={"/chat"} />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
      </Routes>

      <Toaster />
    </>
  );
}
export default App;
