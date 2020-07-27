import authHeader from './auth-header';

const API_URL = "http://131.181.190.87:3000/stocks";

class UserService {

    async getAllStocks() {
        const data = await fetch(API_URL + '/symbols');
        return data.json();
    }

    async getStock(sym) {
        const data = await fetch(API_URL + '/' + sym);
        return data.json();
    }

    async getAuthedStock(sym, query) {
        let urlString = API_URL + '/authed/' + sym + '?' + query;
        const data = await fetch(urlString, { headers: authHeader() });
        return data.json();
    }

}

export default new UserService();