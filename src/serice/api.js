// const URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : "http://localhost:4000";
const URL = "https://721gb6ymy1.execute-api.us-east-2.amazonaws.com";

export async function apiCall(
    url,
    method = "GET",
    payload = null,
    customHeaders = {}
) {
    try {
        const token = localStorage.getItem("ps_token");
        const isFormData = payload instanceof FormData;

        const headers = {
            ...(!isFormData && { "Content-Type": "application/json" }),
            ...customHeaders,
            ...(token && { Authorization: `Bearer ${token}` }),
        };

        const config = {
            method,
            headers,
        };

        if (payload && method !== "GET") {
            config.body = isFormData ? payload : JSON.stringify(payload);
        }

        const response = await fetch(`${URL}${url}`, config);

        let data = null;

        try {
            data = await response.json();
        } catch {
            data = null;
        }

        if ((response.status === 401 || response.status === 403) && token) {
            window.dispatchEvent(new Event("ps-auth-logout"));

            return {
                error: {
                    status: response.status,
                    message: data?.message || "Session expired. Please login again.",
                },
            };
        }

        if (!response.ok) {
            return {
                error: {
                    status: response.status,
                    message: data?.message || data?.error || "Something went wrong",
                },
            };
        }

        return data;
    } catch (error) {
        console.error(error);

        return {
            error: {
                message: error.message || "Network error",
            },
        };
    }
}
