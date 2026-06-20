// const URL = "http://localhost:4000"
const URL = "https://721gb6ymy1.execute-api.us-east-2.amazonaws.com"



export async function apiCall(url, method = "GET", payload = null) {
    const isFormData = payload instanceof FormData;

    try {
        const token = localStorage.getItem('token'); // or sessionStorage if preferred
        const config = {
            method
        };

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        if (payload && method !== "GET") {
            config.body = isFormData ? payload : JSON.stringify(payload);
        }

        const response = await fetch(URL + url, config);

        if (response.status === 401 && localStorage.getItem("token")) {
            localStorage.removeItem("token")
            window.location.reload()
        }

        if (!response.ok) {
            const errText = await response.json();
            return {
                error: {
                    status: response.status,
                    message: errText.message
                }
            }
            // new Error(`Error ${ response.status }: ${ errText } `);
        }

        return await response.json();
    } catch (error) {
        return {
            error: "Something went wrong..."
        };
    }
}
