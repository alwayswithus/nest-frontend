import axios from 'axios';

const DASHBOARD_API_URL = "http://localhost:8080/nest";

class ApiService {
    fetchDashboard() {
        return axios.get(`/nest/api/dashboard/${window.sessionStorage.getItem("authUserNo")}`);
    }

    fetchProjectMember(projectNo) {
        return axios.get(`/nest/api/dashboard/member/${projectNo}`)
    }

    fetchKanbanMain(projectNo, authUserNo){
        return axios.get(`/nest/api/kanbanMain/${projectNo}/${authUserNo}`);
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

    fetchGantt(no){
        return axios.post(`/nest/api/kanbanGantt/${no}`);
    }

    fetchFile(projectNo) {
        return axios.get(`/nest/api/dashboard/${projectNo}/file`);
    }

    fetchEmailCheck(email){
        return axios.post(`/nest/api/emailcheck?email=${email}`)
    }
}

export default new ApiService();