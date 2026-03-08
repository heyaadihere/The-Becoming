import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ContactPage from "./pages/ContactPage";
import RefundPolicyPage from "./pages/RefundPolicyPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfUsePage from "./pages/TermsOfUsePage";
import CookiePolicyPage from "./pages/CookiePolicyPage";
import AdminDashboard from "./pages/AdminDashboard";
import SignupPage from "./pages/SignupPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/refund-policy" element={<RefundPolicyPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-use" element={<TermsOfUsePage />} />
          <Route path="/cookie-policy" element={<CookiePolicyPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
