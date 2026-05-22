import React from "react";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col justify-center items-center text-center px-6 bg-[#faf7f2]">
            <h1 className="text-7xl md:text-8xl font-bold text-[#7A1F1F]">
                404
            </h1>
            <h2 className="text-2xl md:text-4xl font-semibold mt-4 text-[#2b2b2b]">
                This saree seems to be sold out already 👀
            </h2>
            <p className="text-gray-600 mt-5 max-w-2xl leading-8 text-base md:text-lg">
                The page you’re looking for disappeared faster than
                a bridal collection during wedding season.
            </p>
            <p className="text-gray-500 mt-2 text-sm md:text-base">
                Either the link is broken... or someone’s bua ji already booked it.
            </p>
            <button
                onClick={() => navigate("/")}
                className="mt-8 bg-[#7A1F1F] hover:bg-[#5e1717] text-white px-8 py-3 rounded-full transition-all duration-300 shadow-lg hover:scale-105"
            >
                Back to Collection
            </button>

        </div>
    );
};

export default PageNotFound;
