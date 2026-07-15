import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import AnalyticsTracker from "./components/AnalyticsTracker";
import { CartProvider } from "./components/Cart/cartContext";
import ScrollToTop from "./components/ScrollTop";
import { AuthProvider } from "./contexts/AuthContexts";
import "./styles.css";
import { initGA } from "./utils/analytics";

initGA();
const queryClient = new QueryClient();

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const app = (
  <HelmetProvider>
    <BrowserRouter>
      <AnalyticsTracker />
      <ScrollToTop />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </HelmetProvider>
);

ReactDOM.createRoot(document.getElementById("root")).render(
  googleClientId ? (
    <GoogleOAuthProvider clientId={googleClientId}>
      {app}
    </GoogleOAuthProvider>
  ) : (
    app
  )
);
