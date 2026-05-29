const URL = "http://localhost:4000"
// const URL = "https://acbqgm94kf.execute-api.us-east-2.amazonaws.com"

export async function apiCall(url, method = "GET", data = null) {
    try {
        const token = localStorage.getItem('token'); // or sessionStorage if preferred
        const config = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        if (data && method !== "GET") {
            config.body = JSON.stringify(data);
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
                    message: errText.error
                }
            }
            // new Error(`Error ${ response.status }: ${ errText } `);
        }

        return await response.json();
    } catch (error) {
        return {
            error: {
                message: "Something went wrong"
            }
        };
    }
}
