import axios from 'axios';

const DASHBOARD_API_URL = "http://localhost:8080/nest";

class ApiService {
    fetchDashboard() {
        return axios.get(`/nest/api/dashboard/${window.sessionStorage.getItem("authUserNo")}`);
    }

    fetchKanbanMain(){
        return axios.get(`/nest/api/kanbanMain`);
    }

    fetchTagList(){
        return axios.get(`/nest/api/taglist`);
    }

    fetchUser(){
        return axios.get(`/nest/api/user/${window.sessionStorage.getItem("authUserNo")}`);
    }

    fetchLogin(email, password){
        return axios.post(`/nest/api/login?email=${email}&password=${password}`)
    }
}

export default new ApiService();