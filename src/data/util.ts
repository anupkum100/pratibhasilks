const cloudinaryDB = "dkiauapz4"
const imgResolution = "f_auto,q_auto"

export function getImageFromId(imageId) {
    return `https://res.cloudinary.com/${cloudinaryDB}/image/upload/${imgResolution}/${imageId}`
}