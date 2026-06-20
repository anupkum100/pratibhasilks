export const MODAL_SECTIONS = [
    {
        key: "basic",
        title: "Basic Information",
        fields: [
            { name: "sku", label: "SKU", required: true },
            { name: "name", label: "Product Name", required: true },
            {
                name: "description",
                label: "Product Description",
                textarea: true,
                placeholder:
                    "Write product story, fabric feel, occasion and care details...",
            },
        ],
    },
    {
        key: "pricing",
        title: "Pricing & Stock",
        fields: [
            { name: "price", label: "Price", type: "number", required: true },
            { name: "offerPrice", label: "Offer Price", type: "number" },
            { name: "stock", label: "Stock Count", type: "number", required: true },
        ],
    },
    {
        key: "images",
        title: "Images",
        fields: [
            { name: "mainImageId", label: "Main Image", imageUpload: true },
            {
                name: "otherImageIds",
                label: "Other Images",
                multiImageUpload: true,
            },
        ],
    },
    {
        key: "craft",
        title: "Craft & Style",
        fields: [
            { name: "fabric", label: "Fabric", customSelect: true, required: true },
            { name: "color", label: "Color" },
            // { name: "colorHex", label: "Color Hex" },
            { name: "occasions", label: "Occasion", placeholder: "Comma Separated Occasions", },
            {
                name: "categories",
                label: "Categories",
                textarea: true,
                placeholder: "Comma Separated Categories",
            },
        ],
    },
    {
        key: "additionalInformation",
        title: "Additional Information",
        fields: [
            {
                name: "additionalInformation",
                label: "",
                textarea: true,
                placeholder:
                    "Write Product Care instruction or any comment...",
            },
        ],
    },
];

export const PRICE_CODE_MAP = {
    0: "P",
    1: "R",
    2: "O",
    3: "F",
    4: "I",
    5: "T",
    6: "A",
    7: "B",
    8: "L",
    9: "E",
};