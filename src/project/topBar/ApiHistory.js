
import moment from 'moment';
import SockJsClient from "react-stomp";
const API_URL = "http://192.168.1.223:8080/nest";
const API_HEADERS = {
  "Content-Type": "application/json",
};
class ApiHistory {
  fetchInsertHistory(
    senderNo,
    senderName,
    receiver,
    historyType,
    actionName,
    projectNo,
    clientRef
  ) {
    let userArray = [];
    receiver.map((user) => userArray.push(user.userNo));

    const historyData = {
      senderNo: senderNo, // 보내는사람 한명
      senderName: senderName,
      receiver: userArray, // 받는사람 여러명
      historyType: historyType,
      historyDate: moment(Date.now()).format("YYYY-MM-DD hh:mm:ss"),
      actionName: actionName, // 행위
      projectNo: projectNo,
    };

    clientRef.sendMessage("/app/history/all",JSON.stringify(historyData));
    return fetch(`${API_URL}/api/history/insertHistory`, {
      method: "post",
      headers: API_HEADERS,
      body: JSON.stringify(historyData),
    });
  }
}
export default new ApiHistory();
