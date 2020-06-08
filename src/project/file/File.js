import React from "react";
import Table from 'react-bootstrap/Table'
import ReactTooltip from "react-tooltip";
import { Link } from "react-router-dom";
import moment from 'moment';
import Navigator from '../../navigator/Navigator'
import TopBar from '../topBar/TopBar';
import './file.scss';
import ApiService from "../../ApiService";
import Pagination from './Pagination';
import { paginate } from './Paginate';
import update from "react-addons-update";
import Viewer from 'react-viewer'
import EachFile from "./EachFile";

const API_URL = "http://localhost:8080/nest";
const API_HEADERS = {
    "Content-Type": "application/json",
};
export default class File extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            url: sessionStorage.getItem("authUserBg"),
            pageSize: 10,
            currentPage: 1,
            projectFiles: [],
            fileSearch: "",
            count: null,
            visible: false,
            loading: false,
            rotatable: false
        }
    }

    componentDidMount() {
        this.setState({
            loading: true
        });


    }
    // CallBack Background Image Setting 
    callbackChangeBackground(url) {

        let authUser = {
            userNo: window.sessionStorage.getItem("authUserNo"),
            userBg: url
        }

        fetch(`${API_URL}/api/user/backgroundChange`, {
            method: 'post',
            headers: API_HEADERS,
            body: JSON.stringify(authUser)
        })

        sessionStorage.setItem("authUserBg", url)
        this.setState({
            url: url
        })
    }

    callbackFirstPage() {
        this.setState({
            currentPage: 1
        })
    }

    callbackPreviousPage(page) {

        if (page === 1) {
            this.setState({
                currentPage: 1
            })
        }
        else {
            this.setState({
                currentPage: page - 1
            })
        }
    }

    callbackHandlePageChange(page) {

        this.setState({
            currentPage: page
        })
    }

    callbackNextPage(page, pageCount) {
        if (pageCount === page) {
            this.setState({
                currentPage: pageCount
            })
        }
        else {
            this.setState({
                currentPage: page + 1
            })
        }
    }

    callbackLastPage(pageCount) {
        this.setState({
            currentPage: pageCount
        })
    }

    onInputChnage(event) {
        this.setState({
            fileSearch: event.target.value
        })
    }

    //파일 다운로드
    downloadEmployeeData(fileNo) {
        //blob : 이미지, 사운드, 비디오와 같은 멀티미디어 데이터를 다룰 때 사용, MIME 타입을 알아내거나, 데이터를 송수신
        fetch(`${API_URL}/api/download/${fileNo}`)
            .then(response => {
                const filename = response.headers.get('Content-Disposition').split('filename=')[1];
                response.blob().then(blob => {
                    let url = window.URL.createObjectURL(blob);
                    let a = document.createElement('a');
                    a.href = url;
                    console.log(a.href)
                    a.download = filename;
                    a.click();
                });
            });
    }

    //파일 삭제하기
    onClickDeleteFile(fileNo, commentNo) {
        if (window.confirm("파일을 삭제하시겠습니까?")) {

            const fileIndex = this.state.projectFiles.findIndex((file) => file.fileNo === fileNo);
    
            fetch(`${API_URL}/api/comment/${commentNo}/${fileNo}`, {
            method: "delete"
            })
            .then(response => response.json())
            .then(json => {
                let newFileList = update(this.state.projectFiles, {
                    $splice: [[fileIndex, 1]],
                });

                this.setState({
                    projectFiles:newFileList
                })
            })
        }
    }

    //이미지 뷰어
    onClickImage() {
        this.setState({
            visible: !this.state.visible
        })
    }
    render() {

        if (this.state.count === 0)
            return <p>There are no movies in the database.</p>

        const files = paginate(this.state.projectFiles, this.state.currentPage, this.state.pageSize); // 페이지 별로 아이템이 속한 배열을 얻어옴

        return (
            <div className="File" style={{ backgroundImage: `url(${this.state.url})` }}>
                <Navigator callbackChangeBackground={this.props.callbackChangeBackground} />
                <TopBar projectNo={this.props.match.params.projectNo} activePath={this.props.location.pathname} />
                <div className="file-resource-table">
                    <Table>
                        <thead>
                            <tr style={{ backgroundColor: "#E3E3E3" }}>
                                <th style={{ paddingLeft: "17px" }}>이름</th>
                                <th>위치</th>
                                <th>공유한 날짜</th>
                                <th>공유한 사람</th>
                            </tr>
                        </thead>
                        <tbody>
                            {files && files
                            .map(projectFile =>
                                <EachFile 
                                    projectFile = {projectFile}
                                    projectNo={this.props.match.params.projectNo}
                                />
                            )}
                        </tbody>
                    </Table>

                    <Pagination
                        pageSize={this.state.pageSize}
                        itemsCount={this.state.count}
                        currentPage={this.state.currentPage}
                        onPageChange={{
                            firstPage: this.callbackFirstPage.bind(this),
                            preivousPage: this.callbackPreviousPage.bind(this),
                            pageChange: this.callbackHandlePageChange.bind(this),
                            nextPage: this.callbackNextPage.bind(this),
                            lastPage: this.callbackLastPage.bind(this)
                        }}
                    />
                </div>
            </div>
        )
    }
    componentDidMount() {
        ApiService.fetchFile(this.props.match.params.projectNo)
            .then(response => {
                this.setState({
                    projectFiles: response.data.data,
                    count: Object.values(response.data.data).length
                })
            })
    }
}