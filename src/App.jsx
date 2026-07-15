import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import PremiumLoader from "./components/PremiumLoader";
import ProtectedAdminRoute from "./pages/ProtectesAdminRoute";

const About = lazy(() => import("./pages/About"));
const OnlineOrders = lazy(() => import("./pages/Admin/OnlineOrders"));
const Orders = lazy(() => import("./pages/Admin/Orders"));
const PaymentsPage = lazy(() => import("./pages/Admin/Payments"));
const SoldProducts = lazy(() => import("./pages/Admin/SoldProducts"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const Contact = lazy(() => import("./pages/Contact"));
const FAQ = lazy(() => import("./pages/CustomerCare/FAQ"));
const InvoiceVerification = lazy(() => import("./pages/CustomerCare/InvoiceVerification"));
const ReturnsExchanges = lazy(() => import("./pages/CustomerCare/ReturnsExchanges"));
const ShippingPolicy = lazy(() => import("./pages/CustomerCare/ShippingPolicy"));
const TrackOrder = lazy(() => import("./pages/CustomerCare/TrackOrder"));
const Home = lazy(() => import("./pages/Home"));
const InvoicePage = lazy(() => import("./pages/InvoicePage"));
const OrderSuccessPage = lazy(() => import("./pages/OrderSuccessPage"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Products = lazy(() => import("./pages/Products"));
const SareeTypes = lazy(() => import("./pages/SareeTypes"));

export default function App() {
  return (
    <div>
      <Navbar />
      <div className="pt-[60px]">
        <Suspense fallback={<PremiumLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Navigate to="/checkout" replace />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/saree-types" element={<SareeTypes />} />
            <Route path="/invoice/:invoiceId" element={<InvoicePage />} />

            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/checkout/:sku" element={<CheckoutPage />} />
            <Route path="/order-success/:orderNumber" element={<OrderSuccessPage />} />

            <Route path="/shipping-policy" element={<ShippingPolicy />} />
            <Route path="/returns-exchanges" element={<ReturnsExchanges />} />
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="/invoice-verification" element={<InvoiceVerification />} />
            <Route path="/faq" element={<FAQ />} />

            <Route element={<ProtectedAdminRoute />}>
              <Route path="/admin/orders" element={<Orders />} />
              <Route path="/admin/online-orders" element={<OnlineOrders />} />

              <Route path="/admin/payments" element={<PaymentsPage />} />
              <Route path="/admin/sold" element={<SoldProducts />} />
            </Route>

            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}
