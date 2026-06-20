import { productsWithImage } from "./products"

const cloudinaryDB = "dkiauapz4"
const imgResolution = "f_auto,q_auto"

export function getImageFromId(imageId) {
    if (!imageId) return "";

    if (
        String(imageId).startsWith("blob:") ||
        String(imageId).startsWith("data:") ||
        String(imageId).startsWith("http")
    ) {
        return imageId;
    }
    return `https://res.cloudinary.com/${cloudinaryDB}/image/upload/${imgResolution}/${imageId}`
}

const uniqueValues = (key) => {
    return [...new Set(productsWithImage.flatMap((p) => p[key]))];
};

const uniqueColors = () => {
    const colorMap = new Map();

    productsWithImage.forEach((product) => {
        colorMap.set(product.color, {
            name: product.color,
            hex: product.colorHex,
        });
    });

    return Array.from(colorMap.values());
};

export const filterOptions = {
    colors: uniqueColors(),
    fabrics: uniqueValues("fabric"),
    occasions: uniqueValues("occasions"),
    categories: uniqueValues("categories")
};

import { useEffect, useState } from "react";

export function useDelayedLoader(isLoading, minDuration = 1000) {
    const [showLoader, setShowLoader] = useState(isLoading);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        let timer;

        if (isLoading) {
            setShowLoader(true);
            setIsExiting(false);
        } else if (showLoader) {
            setIsExiting(true);

            timer = setTimeout(() => {
                setShowLoader(false);
                setIsExiting(false);
            }, minDuration);
        }

        return () => clearTimeout(timer);
    }, [isLoading, showLoader, minDuration]);

    return { showLoader, isExiting };
}

export function normalised(str = "") {
    return str.toLowerCase().replace(/([A-Z])/g, ' $1')
        // 2. Replace hyphens and underscores with spaces
        .replace(/[-_]+/g, ' ')
        // 3. Trim extra spaces and lowercase everything
        .trim()
        .toLowerCase()
        // 4. Capitalize the very first letter
        .replace(/^./, char => char.toUpperCase())
}