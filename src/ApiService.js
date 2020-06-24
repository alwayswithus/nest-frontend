import axios from 'axios';

const DASHBOARD_API_URL = "http://localhost:8080/nest";

class ApiService {
    fetchDashboard() {
        return axios.get(`/nest/api/dashboard/${window.sessionStorage.getItem("authUserNo")}`);
    }

    fetchCalendar() {
        return axios.get(`/nest/api/calendar/${window.sessionStorage.getItem("authUserNo")}`);
    }

    fetchCalendarAllTask(authUserNo){
        return axios.get(`/nest/api/calendar/alltask/${authUserNo}`)
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

    fetchEmailCheckName(email,name){
        return axios.post(`/nest/api/emailnamecheck?email=${email}&name=${name}`)
    }

    fetchNotification(){
        return axios.get(`/nest/api/notification/${window.sessionStorage.getItem("authUserNo")}`)
    }

    fetchProfileUser(userNo){
        return axios.get(`/nest/api/profile/${userNo}`)
    }

    fetchEmailKeyCK(key){
        return axios.post(`/nest/api/emailConfirm?key=${key}`)
    }

    fetchUserProjectByUserNo(userNo){
        return axios.get(`/nest/api/profile/account/${userNo}`)
    }

    fetchHistory(projectNo){
        return axios.get(`/nest/api/history/${projectNo}`)
    }

    fetchTasksCount(projectNo){
        return axios.get(`/nest/api/kanbanMain/tasksCount/${projectNo}`)
    }

    fetchNewNotice(userNo){
        return axios.get(`/nest/api/notification/new/${userNo}`)
    }
}

export default new ApiService();