const cloudinaryDB = "dkiauapz4"
const imgResolution = "f_auto,q_auto"

export const products = [
  {
    id: "SLK_1",
    name: "Tussar Silk",
    price: 7999,
    offerPrice: 5999,
    image:
      `https://res.cloudinary.com/${cloudinaryDB}/image/upload/${imgResolution}/IMG_4572_dovznp.jpg`,
    images: [
      `https://res.cloudinary.com/${cloudinaryDB}/image/upload/${imgResolution}/IMG_4574_ycdz7j.jpg`,
      `https://res.cloudinary.com/${cloudinaryDB}/image/upload/${imgResolution}/IMG_9281_husfdv.jpg`,
      `https://res.cloudinary.com/${cloudinaryDB}/image/upload/${imgResolution}/IMG_9273_jqpflb.jpg`,
      `https://res.cloudinary.com/${cloudinaryDB}/image/upload/${imgResolution}/IMG_9275_se90i8.jpg`,

    ],
    limitedStock: true,
    description: "Bhagalpuri tussar ghicha silk with madhubani painting.",
    fabric: "Silk",
    borderType: "Zari",
    weave: "Handloom",
    blouseIncluded: true,
    blouseFabric: "Silk",
    blouseType: "Attached with Saree",
    length: "6.5 m",
    categories: ["Silk Sarees", "New Arrival"],
    color: "Golden",
    occasion: "Work",
  }
];

// Filter options for the shop
export const filterOptions = {
  colors: ["Red", "Green", "Maroon", "Golden"],
  fabrics: ["Silk", "Organza"],
  occasions: ["Wedding", "Work", "Festival"],
};
