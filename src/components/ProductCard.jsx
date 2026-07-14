import { motion } from "framer-motion";
import { BadgeIndianRupee, Edit, Trash2, ShoppingCart, Check, PackageCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { getImageFromId, normalised } from "../data/util";
import PermissionRenderer from "./Admin/PermissionRenderer";
import { useCart } from "./Cart/cartContext";

export default function ProductCard({
  product,
  onEdit,
  onDelete,
  onMarkSold
}) {
  const { addToCart, removeFromCart, isInCart } = useCart();

  const added = isInCart(product._id);

  const stopCardNavigation = (event, callback) => {
    event.preventDefault();
    event.stopPropagation();

    if (callback) {
      callback(product);
    }
  };

  return (
    <motion.article
      whileHover={{ y: !product.stock ? 0 : -6 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`
        group relative overflow-hidden rounded-[1.5rem]
        bg-white shadow-[0_18px_50px_rgba(0,0,0,0.08)]
        border border-black/5
        transition-all duration-500
        hover:shadow-[0_26px_70px_rgba(0,0,0,0.14)]
        ${!product.stock ? "opacity-75" : ""}
      `}
    >
      <Link to={`/product/${product.sku}`} className="block">
        <div className="relative overflow-hidden bg-[#F8F3EC]">

          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/35 z-20 flex items-center justify-center">
              <span className="text-white text-xl md:text-2xl font-serif rotate-[-12deg] bg-black/55 px-6 py-2 rounded-full">
                Sold
              </span>
            </div>
          )}

          <div className="aspect-[4/7] overflow-hidden">
            {product?.mainImageId ? (
              <img
                loading="lazy"
                src={getImageFromId(product.mainImageId ? product.mainImageId : "no_image.png")}
                alt={normalised(product.name)}
                className={`
                      h-full w-full
                      transition-transform duration-700 ease-out
                      group-hover:scale-105
                      ${!product.mainImageId ? "object-contain" : "object-cover"}
                      ${!product.mainImageId ? "p-10" : ""}
                        `}
              />
            ) : (
              <div className="h-full w-full flex flex-col items-center justify-center text-[#9A7B4F]">
                <PackageCheck
                  size={42}
                  strokeWidth={1.3}
                />

                <p className="mt-3 text-xs uppercase tracking-[0.24em]">
                  Image unavailable
                </p>
              </div>
            )}

          </div>

          <div className="absolute inset-x-3 bottom-3 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 hidden md:block">
            <div className="rounded-full bg-white/90 backdrop-blur-md px-4 py-2 text-center text-sm font-medium text-[#181818] shadow-lg">
              View Details
            </div>
          </div>
        </div>

        <div className="p-3 md:p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[10px] md:text-xs uppercase tracking-[0.15em] text-[#9A7B4F] truncate">
              {product.fabric || "Saree"}
            </p>

            <div className="flex items-center">
              <p className="text-[8px] truncate bg-[#F8F3EC] text-[#6B5F54] px-2 py-1 rounded-full me-2">
                {product.sku}
              </p>

              {product.colorHex && (
                <span
                  title={product.color}
                  className="h-4 w-4 rounded-full border border-black/10 flex-shrink-0"
                  style={{ backgroundColor: product.colorHex }}
                />
              )}
            </div>
          </div>


          <h3 className="mt-2 font-serif text-xl md:text-2xl leading-tight text-[#181818] line-clamp-2">
            {normalised(product.name)}
          </h3>

          <p className="mt-2 text-xs md:text-sm text-[#6B5F54] line-clamp-2 hidden sm:block">
            {product.description}
          </p>

          <div className="mt-4 flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              {product.offerPrice ? (
                <span className="text-xs md:text-sm text-[#9CA3AF] line-through">
                  ₹{product.price}
                </span>
              ) : <></>}

              <span className="font-semibold text-sm md:text-base text-[#181818]">
                ₹{product.offerPrice || product.price}
              </span>
            </div>

            {product.occasions?.length ? (
              <span className="text-[11px] md:text-xs text-[#6B5F54]">
                Perfect for {product.occasions.join(", ")}
              </span>
            ) : null}
          </div>
        </div>
      </Link>


      <PermissionRenderer>
        {product.stock > 0 && <>
          <div className="px-3 md:px-4 pb-4 flex gap-2">
            <button
              type="button"
              onClick={(event) => stopCardNavigation(event, onEdit)}
              className="
              flex-1
              rounded-full
              border border-black/10
              py-2
              flex items-center justify-center gap-2
              text-xs font-medium
              hover:bg-[#181818]
              hover:text-white
              transition
            "
            >
              <Edit size={14} />
              Edit
            </button>

            <button
              type="button"
              onClick={(event) => stopCardNavigation(event, onDelete)}
              className="
              flex-1
              rounded-full
              border border-red-200
              text-red-600
              py-2
              flex items-center justify-center gap-2
              text-xs font-medium
              hover:bg-red-600
              hover:text-white
              transition
            "
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>

          <div className="px-3 md:px-4 pb-4 flex gap-2">
            <button
              type="button"
              onClick={() => {
                if (added) {
                  removeFromCart(product._id);
                } else {
                  addToCart(product);
                }
              }}
              className=" flex-1
              rounded-full
              border border-black/10
              py-2
              flex items-center justify-center gap-2
              text-xs font-medium
              hover:bg-[#181818]
              hover:text-white
              transition"
            >
              {added ? (
                <>
                  <Check size={16} />
                  Added To Cart
                </>
              ) : (
                <>
                  <ShoppingCart size={16} />
                  Add To Cart
                </>
              )}
            </button>


            <button
              disabled={isInCart(product._id)}
              type="button"
              onClick={(event) =>
                stopCardNavigation(event, () => onMarkSold(product))
              }
              className="
          flex-1
          rounded-full
          border border-green-200
          text-green-700
          py-2
          flex items-center justify-center gap-2
          text-xs font-medium
          hover:bg-green-600
          hover:text-white
          transition
          "
            >
              <BadgeIndianRupee size={14} />
              Sell now
            </button>
          </div>
        </>}
      </PermissionRenderer>

    </motion.article >
  );
}