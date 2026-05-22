import { Swiper, SwiperSlide } from "swiper/react";

import {
    Pagination,
    Autoplay,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const images = [
    `https://res.cloudinary.com/dkiauapz4/image/upload/f_auto,q_auto/ChatGPT_Image_May_22_2026_06_14_54_PM_z9pvkv.png`,
    // `https://res.cloudinary.com/dkiauapz4/image/upload/f_auto,q_auto/IMG_4574_ycdz7j.jpg`,
    `https://res.cloudinary.com/dkiauapz4/image/upload/f_auto,q_auto/ChatGPT_Image_May_22_2026_06_19_14_PM_bd2asn.png`,
    // "https://images.unsplash.com/photo-1618901185975-d59f7091bcfe?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

export default function HeroCarousel() {
    return (
        <div className="h-[20vh] sm:h-[70vh] md:h-[80vh] relative flex items-center justify-center md:justify-end text-white overflow-hidden">

            <Swiper
                modules={[Pagination, Autoplay]}
                slidesPerView={1}
                loop
                grabCursor
                pagination={{
                    clickable: true,
                }}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                className="h-full"
            >
                {images.map((image, index) => (
                    <SwiperSlide key={index}>

                        {/* KEEPING YOUR ORIGINAL APPROACH */}
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{
                                backgroundImage: `url('${image}')`,
                            }}
                        />

                    </SwiperSlide>
                ))}
            </Swiper>

        </div>
    );
}