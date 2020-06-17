const API_URL = "http://192.168.1.223:8080/nest";
const API_HEADERS = {
  "Content-Type": "application/json",
};
class ApiNotification {
  fetchInsertNotice(
    senderNo,
    senderName,
    receiver,
    noticeType,
    taskNo,
    projectNo
  ) {
    let userArray = [];
    receiver.map((user) => userArray.push(user.userNo));

    const noticeData = {
      senderNo: senderNo, // 보내는사람 한명
      senderName: senderName,
      receiver: userArray, // 받는사람 여러명
      noticeType: noticeType,
      taskNo: taskNo,
      projectNo: projectNo,
    };

    fetch(`${API_URL}/api/notification/insertNotice`, {
      method: "post",
      headers: API_HEADERS,
      body: JSON.stringify(noticeData),
    });
  }
}
export default new ApiNotification();
