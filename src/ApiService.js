import axios from 'axios';

const DASHBOARD_API_URL = "http://localhost:8888/nest";

class ApiService {
    fetchDashboard() {
        return axios.get(`${DASHBOARD_API_URL}/dashboard`);
    }
}

export default new ApiService();