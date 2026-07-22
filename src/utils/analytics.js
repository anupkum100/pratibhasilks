import ReactGA from "react-ga4";

const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

export const initGA = () => {
    if (!measurementId) return;
    ReactGA.initialize(measurementId);
};

export const trackPageView = (path) => {
    if (!measurementId) return;

    ReactGA.send({
        hitType: "pageview",
        page: path,
    });
};