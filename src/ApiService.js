import axios from 'axios';

const DASHBOARD_API_URL = "http://localhost:8080/nest";

class ApiService {
    fetchDashboard() {
        return axios.get(`/nest/api/dashboard`);
    }

    fetchKanbanMain(){
        return axios.get(`/nest/api/kanbanMain`);
    }
}

export default new ApiService();