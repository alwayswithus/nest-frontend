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
            count: null
        }
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
                                <th>크기</th>
                                <th>공유한 날짜</th>
                                <th>공유한 사람</th>
                            </tr>
                        </thead>
                        <tbody>
                            {files && files
                            .map(projectFile =>
                                <tr className="file-contents" key={projectFile.fileNo}>
                                    <td>
                                        <div className="file-name-cell">
                                            <div className="file-name-cell-image">
                                                <img className="file-image" src={`${API_URL}${projectFile.filePath}`} />
                                                {projectFile.originName}
                                            </div>
                                            <div className="file-name-and-path">
                                                <span className="file-name">{projectFile.fileName}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ paddingTop: "23px" }}>
                                        <Link
                                            style={{ color: 'black', textDecoration: 'none' }}
                                            to={`/nest/dashboard/${this.props.match.params.projectNo}/kanbanboard/${projectFile.tasklistNo}/task/${projectFile.taskNo}/file`}>
                                            <div className="file-image-location" data-tip="프로젝트로 가기" data-place="bottom">
                                                {projectFile.tasklistName} > {projectFile.taskContents}
                                            </div>
                                            <ReactTooltip />
                                        </Link>
                                    </td>
                                    <td style={{ paddingTop: "23px" }}>{moment(projectFile.fileRegdate).format("MM월 DD일 hh:mm")}</td>
                                    <td style={{ paddingTop: "17px" }}>
                                        <div className="share-person">
                                            {projectFile.userName}
                                        </div>
                                        <div className="contents-dropdown">
                                            <div className="dropdown">
                                                <button className="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">
                                                    <i className="fas fa-ellipsis-v"></i>
                                                </button>
                                                <ul className="dropdown-menu">
                                                    <li><a href="#">다운로드</a></li>
                                                    <li><a href="#">삭제</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
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