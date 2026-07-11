
import { Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import About from "./pages/About";
import SoldProducts from "./pages/Admin/SoldProducts";
import Cart from "./pages/Cart";
import Contact from "./pages/Contact";
import FAQ from "./pages/CustomerCare/FAQ";
import InvoiceVerification from "./pages/CustomerCare/InvoiceVerification";
import ReturnsExchanges from "./pages/CustomerCare/ReturnsExchanges";
import ShippingPolicy from "./pages/CustomerCare/ShippingPolicy";
import TrackOrder from "./pages/CustomerCare/TrackOrder";
import Home from "./pages/Home";
import InvoicePage from "./pages/InvoicePage";
import Orders from "./pages/Admin/Orders";
import PageNotFound from "./pages/PageNotFound";
import PaymentsPage from "./pages/Admin/Payments";
import ProductDetail from "./pages/ProductDetail";
import Products from "./pages/Products";
import ProtectedAdminRoute from "./pages/ProtectesAdminRoute";
import SareeTypes from "./pages/SareeTypes";


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
            <Route path="/admin/payments" element={<PaymentsPage />} />
            <Route path="/admin/sold" element={<SoldProducts />} />
          </Route>

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
