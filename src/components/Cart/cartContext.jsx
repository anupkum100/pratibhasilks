// contexts/CartContext.jsx

import { createContext, useContext, useEffect, useState } from "react";
import { apiCall } from "../../serice/api";
import { useQueryClient } from "@tanstack/react-query";


const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const queryClient = useQueryClient();

    useEffect(() => {
        const saved = localStorage.getItem("ps-cart");

        if (saved) {
            setCartItems(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(
            "ps-cart",
            JSON.stringify(cartItems)
        );
    }, [cartItems]);

    const addToCart = (product) => {
        setCartItems((prev) => {
            const exists = prev.some(
                (item) => item._id === product._id
            );

            if (exists) return prev;

            return [...prev, product];
        });
    };

    const removeFromCart = (productId) => {
        setCartItems((prev) =>
            prev.filter((item) => item._id !== productId)
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const isInCart = (productId) => {
        return cartItems.some(
            (item) => item._id === productId
        );
    };

    const createOrder = async (payload) => {
        const response = await apiCall(
            "/api/orders",
            "POST",
            payload
        );

        clearCart();

        await queryClient.invalidateQueries({
            queryKey: ["products"],
        });

        return response;
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                clearCart,
                isInCart,
                createOrder
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);