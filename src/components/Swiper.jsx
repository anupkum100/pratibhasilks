import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const images = [
    "https://res.cloudinary.com/dkiauapz4/image/upload/f_auto,q_auto/ChatGPT_Image_May_22_2026_06_14_54_PM_z9pvkv.png",
    "https://res.cloudinary.com/dkiauapz4/image/upload/f_auto,q_auto/ChatGPT_Image_May_22_2026_06_19_14_PM_bd2asn.png",
];

export default function HeroCarousel() {
    return (
        <div className="h-[20vh] sm:h-[70vh] md:h-[80vh] relative overflow-hidden">

            <Swiper
                modules={[Pagination, Autoplay]}
                slidesPerView={1}
                loop={true}
                grabCursor={true}
                observer={true}
                observeParents={true}
                pagination={{
                    clickable: true,
                }}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                className="h-full w-full"
            >

                {images.map((image, index) => (
                    <SwiperSlide key={index} className="h-full">

                        <div
                            className="w-full h-full bg-cover bg-center"
                            style={{
                                backgroundImage: `url(${image})`,
                            }}
                        />

                    </SwiperSlide>
                ))}

            </Swiper>
        </div>
    );
}