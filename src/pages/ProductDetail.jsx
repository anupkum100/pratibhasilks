import { ShieldBan } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PremiumLoader from "../components/PremiumLoader";
import AdditionalInformation from "../components/ProductDetail/AdditionalInformation";
import CareInstructionsCard from "../components/ProductDetail/CareInstructionCard";
import { NeedHelpOnProduct } from "../components/ProductDetail/NeedHelpOnProduct";
import ProductGallery from "../components/ProductDetail/ProductGallery";
import { ProductInfo } from "../components/ProductDetail/ProductInfo";
import { useDelayedLoader } from "../data/util";
import { apiCall } from "../serice/api";
import { Helmet } from "react-helmet-async";

export default function ProductDetail() {
  const { id } = useParams();

  const [productDetails, setProductDetails] = useState({});
  const [loading, setLoading] = useState(true);

  const { showLoader, isExiting } = useDelayedLoader(loading, 500);

  const fetchProductDetails = async () => {
    setLoading(true);

    try {
      const res = await apiCall(`/api/products/${id}`);

      if (!res.error && res.data) {
        setProductDetails(res.data);
      }
    } catch (error) {
      console.log("Error fetching Product details..")
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  if (!loading && !productDetails?.sku) {
    return (
      <main className="min-h-screen bg-[#F8F3EC] flex justify-center items-center px-5 text-center">
        <div className="bg-white rounded-[2rem] p-10 shadow-xl max-w-lg">
          <ShieldBan size={64} className="text-red-700 mb-5 mx-auto" />

          <h1 className="font-serif text-4xl mb-3">
            Product not found
          </h1>

          <p className="text-[#6B5F54] leading-7">
            This product may be added in future. For now, explore our
            listed saree collection.
          </p>

          <Link
            to="/products"
            className="inline-block mt-7 bg-[#181818] text-white px-7 py-3 rounded-full"
          >
            View Collections
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-[#F8F3EC] text-[#181818] overflow-hidden">
      <Helmet>
        <title>
          {productDetails?.name
            ? `${productDetails.name} | Pratibha Silks`
            : "Premium Sarees | Pratibha Silks"}
        </title>

        <meta
          name="description"
          content={
            productDetails?.description ||
            `Shop ${productDetails?.name || "premium handcrafted sarees"} from Pratibha Silks.`
          }
        />

        <link
          rel="canonical"
          href={`https://www.pratibhasilks.com/product/${productDetails?.sku || ""}`}
        />
      </Helmet>

      {showLoader ? <PremiumLoader isExiting={isExiting} /> :

        <section
          className={`max-w-7xl mx-auto px-5 pt-8 md:pt-16 pb-16 transition-all duration-700 ease-out ${showLoader ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
            }`}
        >
          <div className="mb-8 text-sm text-[#6B5F54]">
            <Link to="/" className="hover:text-[#181818]">
              Home
            </Link>{" "}
            /{" "}
            <Link to="/products" className="hover:text-[#181818]">
              Collections
            </Link>{" "}
            / <span className="text-[#181818]">{productDetails?.name}</span>
          </div>

          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-14 items-start">
            <ProductGallery productDetails={productDetails} />
            <ProductInfo productDetails={productDetails} />
          </div>

          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-14 items-start mt-5">
            <CareInstructionsCard careInstructions={productDetails?.careInstructions} />
            <AdditionalInformation productDetails={productDetails} />
          </div>

          <NeedHelpOnProduct />
        </section>}
    </main>
  );
}