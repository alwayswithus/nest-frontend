import React from 'react';

import ProjectMemberAdd from './ProjectMemberAdd';
import './transferText.scss';

export default class TransferText extends React.Component {

    constructor() {
        super(...arguments)

        this.state = {
            open: false
        }
    }

    onClickMemberList() {
        this.setState({
            open:!this.state.open
        })
    }

    render() {
        return (
            <div className="TransferText">
                <div className="transfer" onClick={this.onClickMemberList.bind(this)}>
                    <img src='/nest/assets/images/unnamed.jpg'></img>
                    <i class="fas fa-arrow-right"></i>
                    <img src='/nest/assets/images/unnamed.jpg'></img>
                    {this.state.open ? <ProjectMemberAdd /> : "" }
                </div>
            </div>
        )
    }
}