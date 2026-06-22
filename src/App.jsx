
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PageNotFound from "./pages/PageNotFound";
import InvoicePage from "./pages/InvoicePage";
import SareeTypes from "./pages/SareeTypes";
import ShippingPolicy from "./pages/CustomerCare/ShippingPolicy";
import ReturnsExchanges from "./pages/CustomerCare/ReturnsExchanges";
import TrackOrder from "./pages/CustomerCare/TrackOrder";
import InvoiceVerification from "./pages/CustomerCare/InvoiceVerification";
import FAQ from "./pages/CustomerCare/FAQ";
import Orders from "./pages/Orders";
import ProtectedAdminRoute from "./pages/ProtectesAdminRoute";


export default function App() {
  return (
    <div>
      <Navbar />
      <div className="pt-[60px]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/saree-types" element={<SareeTypes />} />
          <Route path="/invoice/:invoiceId" element={<InvoicePage />} />

          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/returns-exchanges" element={<ReturnsExchanges />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/invoice-verification" element={<InvoiceVerification />} />
          <Route path="/faq" element={<FAQ />} />

          <Route element={<ProtectedAdminRoute />}>
            <Route path="/admin/orders" element={<Orders />} />
          </Route>

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
