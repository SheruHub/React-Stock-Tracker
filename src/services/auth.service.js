const API_URL = "http://131.181.190.87:3000";

class AuthService {

    async login(email, password) {

        let url = API_URL + '/user/login'
        let credentials = JSON.stringify({ email: email, password: password });

        const data = await fetch(
            url, {
            method: "POST",
            headers: { accept: "application/json", "Content-Type": "application/json" },
            body: credentials,
        }
        );

        const loginData = await data.json();
        if(loginData.token) localStorage.setItem("user", JSON.stringify(loginData));
        return loginData;
    }

    logout() {
        localStorage.removeItem("user");
    }

    async register(email, password) {
        let url = API_URL + '/user/register'
        let credentials = JSON.stringify({ email: email, password: password });

        const data = await fetch(
            url, {
            method: "POST",
            headers: { accept: "application/json", "Content-Type": "application/json" },
            body: credentials,
        }
        );

        const loginData = await data.json();
        return {
            type: "REGISTER",
            payload: loginData,
        };
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }
}

export default new AuthService();