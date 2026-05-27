import { products } from "./products"

const cloudinaryDB = "dkiauapz4"
const imgResolution = "f_auto,q_auto"

export function getImageFromId(imageId) {
    return `https://res.cloudinary.com/${cloudinaryDB}/image/upload/${imgResolution}/${imageId}`
}

const uniqueValues = (key) => {
    return [...new Set(products.flatMap((p) => p[key]))];
};

const uniqueColors = () => {
    const colorMap = new Map();

    products.forEach((product) => {
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
    occasions: uniqueValues("occasion"),
    categories: uniqueValues("categories"),
    borderTypes: uniqueValues("borderType"),
    weaves: uniqueValues("weave"),
};