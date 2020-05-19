import axios from 'axios';

const DASHBOARD_API_URL = "http://localhost:8080/nest";

class ApiService {
    fetchDashboard() {
        return axios.get(`${DASHBOARD_API_URL}/api/dashboard`);
    }
}

export default new ApiService();