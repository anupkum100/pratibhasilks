import { X, ShoppingBag } from "lucide-react";
import { useCart } from "./cartContext";

export default function CartDrawer({ open, onClose }) {
    const { cartItems, removeFromCart } = useCart();

    if (!open) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/40 z-[998]" onClick={onClose} />
            <div className="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-[#FFFCF8] z-[999] shadow-[-20px_0_60px_rgba(0,0,0,0.15)] flex flex-col">
                <div className="p-6 border-b border-[#E8DCCB] flex justify-between items-center">
                    <div>
                        <p className="text-[11px] tracking-[0.3em] uppercase text-[#A27B48]">Order Basket</p>
                        <h2 className="font-serif text-3xl mt-1">Selected Sarees</h2>
                    </div>
                    <button onClick={onClose} className="h-10 w-10 rounded-full bg-[#F6EFE4] flex items-center justify-center">
                        <X size={18} />
                    </button>
                </div>
                <div className="flex-1 overflow-auto p-6">
                    {cartItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center">
                            <ShoppingBag size={48} className="text-[#CBB69A]" />
                            <p className="mt-4 text-[#6B5F54]">No sarees added yet</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cartItems.map((product) => (
                                <div key={product._id} className="rounded-[1.5rem] border border-[#E8DCCB] p-4 bg-white">
                                    <div className="flex justify-between gap-3">
                                        <div>
                                            <h4 className="font-medium">{product.name}</h4>
                                            <p className="text-xs text-[#6B5F54] mt-1">{product.sku}</p>
                                        </div>
                                        <button onClick={() => removeFromCart(product._id)} className="text-xs text-red-600">Remove</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {cartItems.length > 0 && (
                    <div className="p-6 border-t border-[#E8DCCB]">
                        <button className="w-full rounded-full bg-[#17130F] text-white py-3">Create Order</button>
                    </div>
                )}
            </div>
        </>
    );
}
