import { createContext, useContext, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../contexts/AuthContexts";
import { apiCall } from "../../serice/api";

const LEGACY_CART_STORAGE_KEY = "ps-cart";
const PUBLIC_CART_STORAGE_KEY = "ps-public-cart";
const ADMIN_CART_STORAGE_KEY = "ps-admin-cart";

const CartContext = createContext();

const getCartItemKey = (item) => String(item?.sku || item?._id || "");

const normaliseSavedCart = (items) => {
    if (!Array.isArray(items)) return [];

    return items.reduce((uniqueItems, item) => {
        const itemKey = getCartItemKey(item);
        const alreadyAdded = uniqueItems.some(
            (cartItem) => getCartItemKey(cartItem) === itemKey
        );

        if (!itemKey || alreadyAdded) return uniqueItems;

        return [...uniqueItems, item];
    }, []);
};

const readSavedCart = (storageKey) => {
    try {
        const saved = localStorage.getItem(storageKey);

        return saved ? normaliseSavedCart(JSON.parse(saved)) : [];
    } catch (error) {
        localStorage.removeItem(storageKey);
        return [];
    }
};

const getStoredAdminStatus = () => {
    try {
        const savedUser = localStorage.getItem("ps_user");

        return savedUser ? JSON.parse(savedUser)?.role === "admin" : false;
    } catch (error) {
        return false;
    }
};

export function CartProvider({ children }) {
    const { isAdmin } = useAuth();
    const [publicCartItems, setPublicCartItems] = useState(() => {
        const legacyCart = readSavedCart(LEGACY_CART_STORAGE_KEY);
        const savedPublicCart = readSavedCart(PUBLIC_CART_STORAGE_KEY);
        const legacyCartBelongsToAdmin = getStoredAdminStatus();

        return savedPublicCart.length || legacyCartBelongsToAdmin
            ? savedPublicCart
            : legacyCart;
    });
    const [adminCartItems, setAdminCartItems] = useState(() => {
        const legacyCart = readSavedCart(LEGACY_CART_STORAGE_KEY);
        const savedAdminCart = readSavedCart(ADMIN_CART_STORAGE_KEY);
        const legacyCartBelongsToAdmin = getStoredAdminStatus();

        return savedAdminCart.length || !legacyCartBelongsToAdmin
            ? savedAdminCart
            : legacyCart;
    });
    const queryClient = useQueryClient();

    useEffect(() => {
        localStorage.setItem(
            PUBLIC_CART_STORAGE_KEY,
            JSON.stringify(publicCartItems)
        );
    }, [publicCartItems]);

    useEffect(() => {
        localStorage.setItem(
            ADMIN_CART_STORAGE_KEY,
            JSON.stringify(adminCartItems)
        );
    }, [adminCartItems]);

    const activeCartItems = isAdmin ? adminCartItems : publicCartItems;
    const setActiveCartItems = isAdmin ? setAdminCartItems : setPublicCartItems;

    const addProductToCart = (product, setItems) => {
        if (!product?.sku) return false;

        let added = false;

        setItems((prev) => {
            const productKey = getCartItemKey(product);
            const exists = prev.some(
                (item) => getCartItemKey(item) === productKey
            );

            if (exists) return prev;

            added = true;
            return [...prev, product];
        });

        return added;
    };

    const removeProductFromCart = (product, setItems) => {
        const productKey =
            typeof product === "string" ? product : getCartItemKey(product);

        setItems((prev) =>
            prev.filter(
                (item) =>
                    getCartItemKey(item) !== productKey &&
                    item?._id !== productKey
            )
        );
    };

    const addToCart = (product) => addProductToCart(product, setActiveCartItems);

    const addToPublicCart = (product) => addProductToCart(product, setPublicCartItems);

    const addToAdminCart = (product) => addProductToCart(product, setAdminCartItems);

    const removeFromCart = (product) => removeProductFromCart(product, setActiveCartItems);

    const removeFromPublicCart = (product) =>
        removeProductFromCart(product, setPublicCartItems);

    const removeFromAdminCart = (product) =>
        removeProductFromCart(product, setAdminCartItems);

    const clearCart = () => {
        setActiveCartItems([]);
    };

    const clearPublicCart = () => {
        setPublicCartItems([]);
    };

    const clearAdminCart = () => {
        setAdminCartItems([]);
    };

    const cartHasProduct = (items, product) => {
        const productKey =
            typeof product === "string" ? product : getCartItemKey(product);

        return items.some(
            (item) =>
                getCartItemKey(item) === productKey ||
                item?._id === productKey
        );
    };

    const isInCart = (product) => cartHasProduct(activeCartItems, product);

    const isInPublicCart = (product) => cartHasProduct(publicCartItems, product);

    const isInAdminCart = (product) => cartHasProduct(adminCartItems, product);

    const createOrder = async (payload) => {
        const response = await apiCall(
            "/api/orders",
            "POST",
            payload
        );

        if (response?.error) {
            throw new Error(response.error.message || "Failed to create order");
        }

        clearAdminCart();

        await queryClient.invalidateQueries({
            queryKey: ["products"],
        });

        return response;
    };

    return (
        <CartContext.Provider
            value={{
                cartItems: activeCartItems,
                cartCount: activeCartItems.length,
                publicCartItems,
                publicCartCount: publicCartItems.length,
                adminCartItems,
                adminCartCount: adminCartItems.length,
                addToCart,
                addToPublicCart,
                addToAdminCart,
                removeFromCart,
                removeFromPublicCart,
                removeFromAdminCart,
                clearCart,
                clearPublicCart,
                clearAdminCart,
                isInCart,
                isInPublicCart,
                isInAdminCart,
                createOrder
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
