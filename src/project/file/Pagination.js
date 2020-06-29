import React from 'react';
import _ from 'lodash';

export default class Pagination extends React.Component {

    callbackFirstPage() {
        this.props.onPageChange.firstPage();
    }

    callbackPreviousPage(page) {
        this.props.onPageChange.preivousPage(page);
    }

    callbackHandlePageChange(page) {
        this.props.onPageChange.pageChange(page);
    }

    callbackNextPage(page, pageCount) {
        this.props.onPageChange.nextPage(page, pageCount);
    }

    callbackLastPage(pageCount) {
        this.props.onPageChange.lastPage(pageCount);
    }

    render() {
        const pageCount = Math.ceil(this.props.itemsCount / this.props.pageSize);
        if (pageCount === 1)
            return null;

        const pages = _.range(1, pageCount + 1);

        return (
            <div style={{textAlign: "center"}} className="paging">
                <nav className="pagination">
                    <li style={{ cursor: "pointer" }}><a className="page-link" onClick={this.callbackFirstPage.bind(this)}><i class="fas fa-angle-double-left"></i></a></li>
                    <li style={{ cursor: "pointer" }}><a className="page-link" onClick={this.callbackPreviousPage.bind(this, this.props.currentPage)}><i class="fas fa-angle-left"></i></a></li>
                    {pages.map(page => (
                        <li
                            key={page}
                            className={page === this.props.currentPage ? "page-item active" : "page-item"} // Bootstrap을 이용하여 현재 페이지를 시각적으로 표시
                            style={{ cursor: "pointer" }}
                        >
                            <a className="page-link" onClick={this.callbackHandlePageChange.bind(this, page)}>{page}</a> {/* 페이지 번호 클릭 이벤트 처리기 지정 */}
                        </li>
                    ))}
                    <li style={{ cursor: "pointer" }}><a className="page-link" onClick={this.callbackNextPage.bind(this, this.props.currentPage, Math.ceil(this.props.itemsCount / this.props.pageSize))}><i class="fas fa-angle-right"></i></a></li>
                    <li style={{ cursor: "pointer" }}><a className="page-link" onClick={this.callbackLastPage.bind(this, Math.ceil(this.props.itemsCount / this.props.pageSize))}><i class="fas fa-angle-double-right"></i></a></li>
                </nav>
            </div>
        );
    }
}
