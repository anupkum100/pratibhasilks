import {
  Instagram, Search
} from "lucide-react";
import { useEffect, useState } from "react";
import Hero from "../components/Landing/Hero";
import Intro from "../components/Landing/Intro";
import OtherInfo from "../components/Landing/OtherInfo";
import SareeTypesPreview from "../components/Landing/SareePreview";
import ShopByOccasion from "../components/Landing/ShopByOccasion";
import Story from "../components/Landing/Story";
import Trust from "../components/Landing/Trust";
import { apiCall } from "../serice/api";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const openAddModal = () => {
    setModalMode("add");
    setSelectedProduct(null);
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setModalMode("edit");
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const fetchProducts = () => {
    setLoading(true);

    apiCall("/api/products").then((res) => {
      setLoading(false);
      !res.error ? setProducts(res.data || []) : setProducts([]);
    });
  };

  const handleProductSubmit = async (payload) => {
    const isEdit = modalMode === "edit";

    const url = isEdit
      ? `/api/products/${selectedProduct._id}`
      : `/api/products`;

    const res = await apiCall(url, isEdit ? "PUT" : "POST", payload);

    if (res?.error) {
      alert(res.message || "Something went wrong");
      return;
    }

    setModalOpen(false);
    fetchProducts();
  };

  const deleteProduct = async (product) => {
    const confirmDelete = window.confirm(`Delete ${product.name}?`);
    if (!confirmDelete) return;

    const res = await apiCall(`/api/products/${product._id}`, "DELETE");

    if (res?.error) {
      alert(res.message || "Failed to delete product");
      return;
    }

    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const featuredProducts = products.slice(0, 4);

  return (
    <main className="bg-[#F8F3EC] text-[#181818] overflow-hidden">
      {/* MOBILE LUXURY TOP BAR */}
      <div className="hidden sticky top-0 z-50 bg-[#F8F3EC]/90 backdrop-blur-xl border-b border-black/5 px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-[10px] tracking-[0.35em] uppercase text-[#9A7B4F]">
            Pratibha
          </p>
          <h1 className="font-serif text-xl leading-none">Silks</h1>
        </div>

        <div className="flex gap-3">
          <Search size={20} />
          <Instagram size={20} />
        </div>
      </div>

      <Hero />

      <Trust />

      <Intro />

      <ShopByOccasion />

      <Story />

      <SareeTypesPreview />

      <OtherInfo />

      {/* FEATURED PRODUCTS */}
      {/* <section className="px-5 pb-20 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs tracking-[0.45em] uppercase text-[#9A7B4F]">
              New Arrivals
            </p>
            <h2 className="font-serif text-5xl mt-2">Freshly Draped</h2>
          </div>

          <button
            onClick={openAddModal}
            className="hidden md:block bg-black text-white px-6 py-3 rounded-full"
          >
            + Add Product
          </button>
        </div>

        <button
          onClick={openAddModal}
          className="md:hidden w-full mb-5 bg-black text-white px-6 py-3 rounded-full"
        >
          + Add Product
        </button>

        <ProductModal
          isOpen={modalOpen}
          mode={modalMode}
          product={selectedProduct}
          onClose={() => setModalOpen(false)}
          onSubmit={handleProductSubmit}
        />

        {loading ? (
          <div className="py-20 text-center text-[#6B5F54]">
            Loading collection...
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product._id || product.sku}
                product={product}
                isAdmin={true}
                onEdit={openEditModal}
                onDelete={deleteProduct}
              />
            ))}
          </div>
        )}
      </section> */}

    </main>
  );
}